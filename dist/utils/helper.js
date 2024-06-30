import { parseFromString } from "dom-parser";
import { getHmacSha1 } from "../secure";
import { fetchWithTimeout } from "./utils";
import config from "../config/config";
import { VideoService } from "../types/yandex";
class VideoHelperError extends Error {
    constructor(message) {
        super(message);
        this.name = "VideoHelper";
        this.message = message;
    }
}
export class MailRuHelper {
    //
    async getVideoData(videoId) {
        try {
            const res = await fetchWithTimeout(`https://my.mail.ru/+/video/meta/${videoId}?xemail=&ajax_call=1&func_name=&mna=&mnb=&ext=1&_=${new Date().getTime()}`);
            return (await res.json());
        }
        catch (err) {
            console.error("Failed to get mail.ru video info", err.message);
            return undefined;
        }
    }
}
export class WeverseHelper {
    API_ORIGIN = "https://global.apis.naver.com/weverse/wevweb"; // find as REACT_APP_API_GW_ORIGIN in main.<hash>.js
    API_APP_ID = "be4d79eb8fc7bd008ee82c8ec4ff6fd4"; // find as REACT_APP_API_APP_ID in main.<hash>.js
    API_HMAC_KEY = "1b9cb6378d959b45714bec49971ade22e6e24e42"; // find as c.active near `createHmac('sha1'...`  in main.<hash>.js
    HEADERS = {
        Accept: "application/json, text/plain, */*",
        Origin: "https://weverse.io",
        Referer: "https://weverse.io/",
    };
    getURLData() {
        return {
            appId: this.API_APP_ID,
            language: "en",
            os: "WEB",
            platform: "WEB",
            wpf: "pc",
        };
    }
    async createHash(pathname) {
        // pathname example: /post/v1.0/post-3-142049908/preview?fieldSet=postForPreview...
        const timestamp = Date.now();
        // example salt is /video/v1.1/vod/67134/inKey?gcc=RU&appId=be4d79eb8fc7bd008ee82c8ec4ff6fd4&language=en&os=WEB&platform=WEB&wpf=pc1707527163588
        let salt = pathname.substring(0, Math.min(255, pathname.length)) + timestamp;
        const sign = await getHmacSha1(this.API_HMAC_KEY, salt);
        if (!sign) {
            throw new VideoHelperError("Failed to get weverse HMAC signature");
        }
        return {
            wmsgpad: timestamp.toString(),
            wmd: sign,
        };
    }
    async getPostPreview(postId) {
        const pathname = `/post/v1.0/post-${postId}/preview?` +
            new URLSearchParams({
                fieldSet: "postForPreview",
                ...this.getURLData(),
            }); // ! DON'T EDIT ME
        try {
            const hash = await this.createHash(pathname);
            const res = await fetchWithTimeout(this.API_ORIGIN + pathname + "&" + new URLSearchParams(hash), {
                headers: this.HEADERS,
            });
            return (await res.json());
        }
        catch (err) {
            console.error(`Failed to get weverse post preview by postId: ${postId}`, err.message);
            return false;
        }
    }
    async getVideoInKey(videoId) {
        const pathname = `/video/v1.1/vod/${videoId}/inKey?` +
            new URLSearchParams({
                gcc: "RU",
                ...this.getURLData(),
            }); // ! DON'T EDIT ME
        try {
            const hash = await this.createHash(pathname);
            const res = await fetchWithTimeout(this.API_ORIGIN + pathname + "&" + new URLSearchParams(hash), {
                method: "POST",
                headers: this.HEADERS,
            });
            return (await res.json());
        }
        catch (err) {
            console.error(`Failed to get weverse InKey by videoId: ${videoId}`, err.message);
            return false;
        }
    }
    async getVideoInfo(infraVideoId, inkey, serviceId) {
        const timestamp = Date.now();
        try {
            const res = await fetchWithTimeout(`https://global.apis.naver.com/rmcnmv/rmcnmv/vod/play/v2.0/${infraVideoId}?` +
                new URLSearchParams({
                    key: inkey,
                    sid: serviceId,
                    nonce: timestamp.toString(),
                    devt: "html5_pc",
                    prv: "N",
                    aup: "N",
                    stpb: "N",
                    cpl: "en",
                    env: "prod",
                    lc: "en",
                    adi: JSON.stringify([
                        {
                            adSystem: null,
                        },
                    ]),
                    adu: "/",
                }), {
                headers: this.HEADERS,
            });
            return (await res.json());
        }
        catch (err) {
            console.error(`Failed to get weverse video info (infraVideoId: ${infraVideoId}, inkey: ${inkey}, serviceId: ${serviceId}`, err.message);
            return false;
        }
    }
    extractVideoInfo(videoList) {
        return videoList.find((video) => video.useP2P === false && video.source.includes(".mp4"));
    }
    async getVideoData(postId) {
        const videoPreview = await this.getPostPreview(postId);
        if (!videoPreview) {
            return undefined;
        }
        const { videoId, serviceId, infraVideoId } = videoPreview.extension.video;
        if (!(videoId && serviceId && infraVideoId)) {
            return undefined;
        }
        const inkeyData = await this.getVideoInKey(videoId);
        if (!inkeyData) {
            return undefined;
        }
        const videoInfo = await this.getVideoInfo(infraVideoId, inkeyData.inKey, serviceId);
        if (!videoInfo) {
            return undefined;
        }
        const videoItem = this.extractVideoInfo(videoInfo.videos.list);
        if (!videoItem) {
            return undefined;
        }
        return {
            url: videoItem.source,
            duration: videoItem.duration,
        };
    }
}
export class KodikHelper {
    API_ORIGIN = "https://kodik.biz";
    async getSecureData(videoPath) {
        try {
            const url = this.API_ORIGIN + videoPath;
            const res = await fetchWithTimeout(url, {
                headers: {
                    "User-Agent": config.userAgent,
                    // only to mask request
                    Origin: this.API_ORIGIN,
                    Referer: this.API_ORIGIN,
                },
            });
            const content = await res.text();
            const [videoType, videoId, hash] = videoPath.split("/").filter((a) => a);
            let doc = parseFromString(content);
            const secureScript = Array.from(doc.getElementsByTagName("script")).filter((s) => s.innerHTML.includes(`videoId = "${videoId}"`));
            if (!secureScript.length) {
                throw new VideoHelperError("Failed to find secure script");
            }
            const secureContent = /'{[^']+}'/.exec(secureScript[0].textContent.trim())?.[0];
            if (!secureContent) {
                throw new VideoHelperError("Secure json wasn't found in secure script");
            }
            const secureJSON = JSON.parse(secureContent.replaceAll("'", ""));
            return {
                videoType,
                videoId,
                hash,
                ...secureJSON,
            };
        }
        catch (err) {
            console.error(`Failed to get kodik secure data by videoPath: ${videoPath}.`, err.message);
            return false;
        }
    }
    async getFtor(secureData) {
        const { videoType, videoId: id, hash, d, d_sign, pd, pd_sign, ref, ref_sign, } = secureData;
        try {
            const res = await fetchWithTimeout(this.API_ORIGIN + "/ftor", {
                method: "POST",
                headers: {
                    "User-Agent": config.userAgent,
                    // only to mask request
                    Origin: this.API_ORIGIN,
                    Referer: `${this.API_ORIGIN}/${videoType}/${id}/${hash}/360p`,
                },
                body: new URLSearchParams({
                    // only to mask request (they don't check for these fields, but validate if they exist)
                    d,
                    d_sign,
                    pd,
                    pd_sign,
                    ref: decodeURIComponent(ref),
                    ref_sign,
                    bad_user: "false",
                    cdn_is_working: "true",
                    info: "{}",
                    // required
                    type: videoType,
                    hash,
                    id,
                }),
            });
            return (await res.json());
        }
        catch (err) {
            console.error(`Failed to get kodik video data (type: ${videoType}, id: ${id}, hash: ${hash})`, err.message);
            return false;
        }
    }
    decryptUrl(encryptedUrl) {
        // app.player_single.js
        const decryptedUrl = atob(encryptedUrl.replace(/[a-zA-Z]/g, function (e) {
            const charCode = e.charCodeAt(0) + 13;
            return String.fromCharCode((e <= "Z" ? 90 : 122) >= charCode ? charCode : charCode - 26);
        }));
        return "https:" + decryptedUrl;
    }
    async getVideoData(videoPath) {
        const secureData = await this.getSecureData(videoPath);
        if (!secureData) {
            return undefined;
        }
        const videoData = await this.getFtor(secureData);
        if (!videoData) {
            return undefined;
        }
        const videoDataLinks = Object.entries(videoData.links[videoData.default.toString()]);
        // idk what other types there may be, so i will add a this check
        const videoLink = videoDataLinks.find(([_, data]) => data.type === "application/x-mpegURL")?.[1];
        if (!videoLink) {
            return undefined;
        }
        return {
            url: this.decryptUrl(videoLink.src),
        };
    }
}
export class PatreonHelper {
    async getPosts(postId) {
        try {
            const res = await fetchWithTimeout(`https://www.patreon.com/api/posts/${postId}?json-api-use-default-includes=false`);
            return (await res.json());
        }
        catch (err) {
            console.error(`Failed to get patreon posts by postId: ${postId}.`, err.message);
            return false;
        }
    }
    async getVideoData(postId) {
        const postData = await this.getPosts(postId);
        if (!postData) {
            return undefined;
        }
        const postFileUrl = postData.data.attributes.post_file.url;
        if (!postFileUrl) {
            return undefined;
        }
        return {
            url: postFileUrl,
        };
    }
}
export class RedditHelper {
    async getVideoData(videoId) {
        const res = await fetchWithTimeout(`https://www.reddit.com/r/${videoId}`);
        const content = await res.text();
        // get m3u8 from player
        const contentUrl = /https:\/\/v\.redd\.it\/([^/]+)\/HLSPlaylist\.m3u8\?([^"]+)/
            .exec(content)?.[0]
            ?.replaceAll("&amp;", "&");
        if (!contentUrl) {
            return undefined;
        }
        return {
            url: decodeURIComponent(contentUrl),
        };
    }
}
/**
 * A convenient wrapper over the rest of the helpers
 */
export default class VideoHelper {
    /** @source */
    static [VideoService.mailru] = new MailRuHelper();
    /** @source */
    static [VideoService.weverse] = new WeverseHelper();
    /** @source */
    static [VideoService.kodik] = new KodikHelper();
    /** @source */
    static [VideoService.patreon] = new PatreonHelper();
    /** @source */
    static [VideoService.reddit] = new RedditHelper();
}

import { parseFromString } from "dom-parser";
import { getHmacSha1 } from "../secure.js";
import sites from "../config/sites.js";
import { fetchWithTimeout } from "./utils.js";
import config from "../config/config.js";
import { VideoService } from "../types/yandex.js";
class VideoHelperError extends Error {
    constructor(message) {
        super(message);
        this.name = "VideoHelper";
        this.message = message;
    }
}
export class MailRuHelper {
    API_ORIGIN = "https://my.mail.ru/";
    async getVideoData(videoId) {
        try {
            const res = await fetchWithTimeout(`${this.API_ORIGIN}+/video/meta/${videoId}?xemail=&ajax_call=1&func_name=&mna=&mnb=&ext=1&_=${new Date().getTime()}`);
            return (await res.json());
        }
        catch (err) {
            console.error("Failed to get mail.ru video info", err.message);
            return undefined;
        }
    }
}
export class WeverseHelper {
    API_ORIGIN = "https://global.apis.naver.com/weverse/wevweb";
    API_APP_ID = "be4d79eb8fc7bd008ee82c8ec4ff6fd4";
    API_HMAC_KEY = "1b9cb6378d959b45714bec49971ade22e6e24e42";
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
        const timestamp = Date.now();
        const salt = pathname.substring(0, Math.min(255, pathname.length)) + timestamp;
        const sign = await getHmacSha1(this.API_HMAC_KEY, salt);
        if (!sign) {
            throw new VideoHelperError("Failed to get weverse HMAC signature");
        }
        return {
            wmsgpad: timestamp.toString(),
            wmd: sign,
        };
    }
    async getHashURLParams(pathname) {
        const hash = await this.createHash(pathname);
        return new URLSearchParams(hash).toString();
    }
    async getPostPreview(postId) {
        const pathname = `/post/v1.0/post-${postId}/preview?` +
            new URLSearchParams({
                fieldSet: "postForPreview",
                ...this.getURLData(),
            }).toString();
        try {
            const urlParams = await this.getHashURLParams(pathname);
            const res = await fetchWithTimeout(this.API_ORIGIN + pathname + "&" + urlParams, {
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
            }).toString();
        try {
            const urlParams = await this.getHashURLParams(pathname);
            const res = await fetchWithTimeout(this.API_ORIGIN + pathname + "&" + urlParams, {
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
            const urlParams = new URLSearchParams({
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
            }).toString();
            const res = await fetchWithTimeout(`https://global.apis.naver.com/rmcnmv/rmcnmv/vod/play/v2.0/${infraVideoId}?` +
                urlParams, {
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
                    Origin: this.API_ORIGIN,
                    Referer: this.API_ORIGIN,
                },
            });
            const content = await res.text();
            const [videoType, videoId, hash] = videoPath.split("/").filter((a) => a);
            const doc = parseFromString(content);
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
                videoType: videoType,
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
                    Origin: this.API_ORIGIN,
                    Referer: `${this.API_ORIGIN}/${videoType}/${id}/${hash}/360p`,
                },
                body: new URLSearchParams({
                    d,
                    d_sign,
                    pd,
                    pd_sign,
                    ref: decodeURIComponent(ref),
                    ref_sign,
                    bad_user: "false",
                    cdn_is_working: "true",
                    info: "{}",
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
export class BannedVideoHelper {
    async getVideoInfo(videoId) {
        try {
            const res = await fetchWithTimeout(`https://api.banned.video/graphql`, {
                method: "POST",
                body: JSON.stringify({
                    operationName: "GetVideo",
                    query: `query GetVideo($id: String!) {
            getVideo(id: $id) {
              title
              description: summary
              duration: videoDuration
              videoUrl: directUrl
              isStream: live
            }
          }`,
                    variables: {
                        id: videoId,
                    },
                }),
                headers: {
                    "User-Agent": "bannedVideoFrontEnd",
                    "apollographql-client-name": "banned-web",
                    "apollographql-client-version": "1.3",
                    "content-type": "application/json",
                },
            });
            return (await res.json());
        }
        catch (err) {
            console.error(`Failed to get bannedvideo video info by videoId: ${videoId}.`, err.message);
            return false;
        }
    }
    async getVideoData(videoId) {
        const videoInfo = await this.getVideoInfo(videoId);
        if (!videoInfo) {
            return false;
        }
        const { videoUrl, duration, isStream, description, title } = videoInfo.data.getVideo;
        return {
            url: videoUrl,
            duration,
            isStream,
            title,
            description,
        };
    }
}
export class KickHelper {
    async getClipInfo(clipId) {
        try {
            const res = await fetchWithTimeout(`https://kick.com/api/v2/clips/${clipId}`);
            return (await res.json());
        }
        catch (err) {
            console.error(`Failed to get kick clip info by clipId: ${clipId}.`, err.message);
            return false;
        }
    }
    async getVideoData(videoId) {
        if (!videoId.startsWith("clip_")) {
            return {
                url: sites.find((s) => s.host === VideoService.kick).url + videoId,
            };
        }
        const clipInfo = await this.getClipInfo(videoId);
        if (!clipInfo) {
            return false;
        }
        const { clip_url, duration, title } = clipInfo.clip;
        return {
            url: clip_url,
            duration,
            title,
        };
    }
}
export class AppleDeveloperHelper {
    async getVideoData(videoId) {
        const res = await fetchWithTimeout(`https://developer.apple.com/${videoId}`);
        const content = await res.text();
        const contentUrl = /https:\/\/devstreaming-cdn\.apple\.com\/videos\/([^.]+)\/(cmaf\.m3u8)/.exec(content)?.[0];
        if (!contentUrl) {
            return undefined;
        }
        return {
            url: contentUrl,
        };
    }
}
export class EpicGamesHelper {
    API_ORIGIN = "https://dev.epicgames.com/community/api/learning";
    async getPostInfo(videoId) {
        try {
            const res = await fetchWithTimeout(`${this.API_ORIGIN}/post.json?hash_id=${videoId}`);
            return (await res.json());
        }
        catch (err) {
            console.error(`Failed to get post info by videoId: ${videoId}.`, err.message);
            return false;
        }
    }
    async getVideoData(videoId) {
        const postInfo = await this.getPostInfo(videoId);
        if (!postInfo) {
            return undefined;
        }
        const playlistUrl = postInfo.blocks
            .find((block) => block.type === "video")
            ?.video_url?.replace("qsep://", "https://");
        if (!playlistUrl) {
            return undefined;
        }
        return {
            url: playlistUrl,
        };
    }
}
export class NineAnimetvHelper {
    API_ORIGIN = "https://9animetv.to/ajax/episode";
    RAPID_CLOUD_ORIGIN = "https://rapid-cloud.co/ajax/embed-6-v2";
    async getSourceId(episodeId) {
        try {
            const res = await fetchWithTimeout(`${this.API_ORIGIN}/servers?episodeId=${episodeId}`);
            const content = (await res.json());
            if (!content.html) {
                return false;
            }
            return /data-id="(\d+)"/.exec(content.html)?.[1];
        }
        catch (err) {
            console.error(`Failed to get 9animetv servers info by episodeId: ${episodeId}.`, err.message);
            return false;
        }
    }
    async getPlayerLink(sourceId) {
        try {
            const res = await fetchWithTimeout(`${this.API_ORIGIN}/sources?id=${sourceId}`);
            const content = (await res.json());
            if (!content.link.includes("rapid-cloud.co")) {
                return false;
            }
            return content.link;
        }
        catch (err) {
            console.error(`Failed to get player link by sourceId: ${sourceId}.`, err.message);
            return false;
        }
    }
    async getRapidCloudData(rapidId) {
        try {
            const res = await fetchWithTimeout(`${this.RAPID_CLOUD_ORIGIN}/getSources?id=${rapidId}`);
            const content = (await res.json());
            if (content.encrypted) {
                console.warn("Encrypted RapidCloud data found. Let us know about it", content);
                return false;
            }
            return content;
        }
        catch (err) {
            console.error(`Failed to get rapid cloud data by rapidId: ${rapidId}.`, err.message);
            return false;
        }
    }
    async getVideoData(videoId) {
        const episodeId = videoId.split("?ep=")[1];
        const sourceId = await this.getSourceId(episodeId);
        if (!sourceId) {
            return undefined;
        }
        const playerLink = await this.getPlayerLink(sourceId);
        if (!playerLink) {
            return undefined;
        }
        const rapidCloudId = /\/([^/?]+)\?/.exec(playerLink)?.[1];
        if (!rapidCloudId) {
            return undefined;
        }
        const rapidData = await this.getRapidCloudData(rapidCloudId);
        if (!rapidData) {
            return undefined;
        }
        const videoUrl = rapidData.sources.find((file) => file.type === "hls")?.file;
        if (!videoUrl) {
            return undefined;
        }
        return {
            url: videoUrl,
        };
    }
}
export default class VideoHelper {
    static [VideoService.mailru] = new MailRuHelper();
    static [VideoService.weverse] = new WeverseHelper();
    static [VideoService.kodik] = new KodikHelper();
    static [VideoService.patreon] = new PatreonHelper();
    static [VideoService.reddit] = new RedditHelper();
    static [VideoService.bannedvideo] = new BannedVideoHelper();
    static [VideoService.kick] = new KickHelper();
    static [VideoService.appledeveloper] = new AppleDeveloperHelper();
    static [VideoService.epicgames] = new EpicGamesHelper();
    static [VideoService.nineanimetv] = new NineAnimetvHelper();
}

import { parseFromString } from "dom-parser";

import { getHmacSha1 } from "../secure";
import sites from "../config/sites";
import * as MailRu from "../types/helpers/mailru";
import * as Weverse from "../types/helpers/weverse";
import * as Kodik from "../types/helpers/kodik";
import * as Patreon from "../types/helpers/patreon";
import * as BannedVideo from "../types/helpers/bannedvideo";
import * as Kick from "../types/helpers/kick";
import { fetchWithTimeout } from "./utils";
import config from "../config/config";
import { VideoService } from "../types/yandex";

class VideoHelperError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VideoHelper";
    this.message = message;
  }
}

export class MailRuHelper {
  //
  async getVideoData(videoId: string): Promise<MailRu.VideoInfo | undefined> {
    try {
      const res = await fetchWithTimeout(
        `https://my.mail.ru/+/video/meta/${videoId}?xemail=&ajax_call=1&func_name=&mna=&mnb=&ext=1&_=${new Date().getTime()}`,
      );
      return (await res.json()) as MailRu.VideoInfo;
    } catch (err: unknown) {
      console.error("Failed to get mail.ru video info", (err as Error).message);
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

  async createHash(pathname: string) {
    // pathname example: /post/v1.0/post-3-142049908/preview?fieldSet=postForPreview...
    const timestamp = Date.now();

    // example salt is /video/v1.1/vod/67134/inKey?gcc=RU&appId=be4d79eb8fc7bd008ee82c8ec4ff6fd4&language=en&os=WEB&platform=WEB&wpf=pc1707527163588
    const salt =
      pathname.substring(0, Math.min(255, pathname.length)) + timestamp;

    const sign = await getHmacSha1(this.API_HMAC_KEY, salt);
    if (!sign) {
      throw new VideoHelperError("Failed to get weverse HMAC signature");
    }

    return {
      wmsgpad: timestamp.toString(),
      wmd: sign,
    };
  }

  async getHashURLParams(pathname: string) {
    const hash = await this.createHash(pathname);
    return new URLSearchParams(hash).toString();
  }

  async getPostPreview(postId: string): Promise<Weverse.PostPreview | false> {
    const pathname =
      `/post/v1.0/post-${postId}/preview?` +
      new URLSearchParams({
        fieldSet: "postForPreview",
        ...this.getURLData(),
      }).toString(); // ! DON'T EDIT ME

    try {
      const urlParams = await this.getHashURLParams(pathname);
      const res = await fetchWithTimeout(
        this.API_ORIGIN + pathname + "&" + urlParams,
        {
          headers: this.HEADERS,
        },
      );

      return (await res.json()) as Weverse.PostPreview;
    } catch (err: unknown) {
      console.error(
        `Failed to get weverse post preview by postId: ${postId}`,
        (err as Error).message,
      );
      return false;
    }
  }

  async getVideoInKey(videoId: number) {
    const pathname =
      `/video/v1.1/vod/${videoId}/inKey?` +
      new URLSearchParams({
        gcc: "RU",
        ...this.getURLData(),
      }).toString(); // ! DON'T EDIT ME

    try {
      const urlParams = await this.getHashURLParams(pathname);
      const res = await fetchWithTimeout(
        this.API_ORIGIN + pathname + "&" + urlParams,
        {
          method: "POST",
          headers: this.HEADERS,
        },
      );

      return (await res.json()) as Weverse.InKey;
    } catch (err: unknown) {
      console.error(
        `Failed to get weverse InKey by videoId: ${videoId}`,
        (err as Error).message,
      );
      return false;
    }
  }

  async getVideoInfo(infraVideoId: string, inkey: string, serviceId: string) {
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
      const res = await fetchWithTimeout(
        `https://global.apis.naver.com/rmcnmv/rmcnmv/vod/play/v2.0/${infraVideoId}?` +
          urlParams,
        {
          headers: this.HEADERS,
        },
      );

      return (await res.json()) as Weverse.VideoInfo;
    } catch (err: unknown) {
      console.error(
        `Failed to get weverse video info (infraVideoId: ${infraVideoId}, inkey: ${inkey}, serviceId: ${serviceId}`,
        (err as Error).message,
      );
      return false;
    }
  }

  extractVideoInfo(videoList: Weverse.Video[]) {
    return videoList.find(
      (video) => video.useP2P === false && video.source.includes(".mp4"),
    );
  }

  async getVideoData(postId: string) {
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

    const videoInfo = await this.getVideoInfo(
      infraVideoId,
      inkeyData.inKey,
      serviceId,
    );
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

  async getSecureData(
    videoPath: Kodik.Path,
  ): Promise<Kodik.SecureData | false> {
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

      const doc = parseFromString(content);
      const secureScript = Array.from(
        doc.getElementsByTagName("script"),
      ).filter((s) => s.innerHTML.includes(`videoId = "${videoId}"`));
      if (!secureScript.length) {
        throw new VideoHelperError("Failed to find secure script");
      }

      const secureContent = /'{[^']+}'/.exec(
        secureScript[0].textContent.trim(),
      )?.[0];
      if (!secureContent) {
        throw new VideoHelperError("Secure json wasn't found in secure script");
      }

      const secureJSON = JSON.parse(
        secureContent.replaceAll("'", ""),
      ) as Kodik.SecureContent;
      return {
        videoType: videoType as Kodik.VideoType,
        videoId,
        hash,
        ...secureJSON,
      };
    } catch (err: unknown) {
      console.error(
        `Failed to get kodik secure data by videoPath: ${videoPath}.`,
        (err as Error).message,
      );
      return false;
    }
  }

  async getFtor(
    secureData: Kodik.SecureData,
  ): Promise<Kodik.VideoData | false> {
    const {
      videoType,
      videoId: id,
      hash,
      d,
      d_sign,
      pd,
      pd_sign,
      ref,
      ref_sign,
    } = secureData;
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

      return (await res.json()) as Kodik.VideoData;
    } catch (err: unknown) {
      console.error(
        `Failed to get kodik video data (type: ${videoType}, id: ${id}, hash: ${hash})`,
        (err as Error).message,
      );
      return false;
    }
  }

  decryptUrl(encryptedUrl: string) {
    // app.player_single.js
    const decryptedUrl = atob(
      encryptedUrl.replace(/[a-zA-Z]/g, function (e) {
        const charCode = e.charCodeAt(0) + 13;
        return String.fromCharCode(
          (e <= "Z" ? 90 : 122) >= charCode ? charCode : charCode - 26,
        );
      }),
    );

    return "https:" + decryptedUrl;
  }

  async getVideoData(videoPath: Kodik.Path) {
    const secureData = await this.getSecureData(videoPath);
    if (!secureData) {
      return undefined;
    }

    const videoData = await this.getFtor(secureData);
    if (!videoData) {
      return undefined;
    }

    const videoDataLinks = Object.entries(
      videoData.links[videoData.default.toString()],
    );
    // idk what other types there may be, so i will add a this check
    const videoLink = videoDataLinks.find(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, data]) => data.type === "application/x-mpegURL",
    )?.[1];
    if (!videoLink) {
      return undefined;
    }

    return {
      url: this.decryptUrl(videoLink.src),
    };
  }
}

export class PatreonHelper {
  async getPosts(
    postId: number | string,
  ): Promise<Patreon.PostsResponse | false> {
    try {
      const res = await fetchWithTimeout(
        `https://www.patreon.com/api/posts/${postId}?json-api-use-default-includes=false`,
      );

      return (await res.json()) as Patreon.PostsResponse;
    } catch (err: unknown) {
      console.error(
        `Failed to get patreon posts by postId: ${postId}.`,
        (err as Error).message,
      );
      return false;
    }
  }

  async getVideoData(postId: string | number) {
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
  async getVideoData(videoId: string) {
    const res = await fetchWithTimeout(`https://www.reddit.com/r/${videoId}`);
    const content = await res.text();

    // get m3u8 from player
    const contentUrl =
      /https:\/\/v\.redd\.it\/([^/]+)\/HLSPlaylist\.m3u8\?([^"]+)/
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
  async getVideoInfo(
    videoId: string,
  ): Promise<false | BannedVideo.GraphQLResponse> {
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

      return (await res.json()) as BannedVideo.GraphQLResponse;
    } catch (err: unknown) {
      console.error(
        `Failed to get bannedvideo video info by videoId: ${videoId}.`,
        (err as Error).message,
      );
      return false;
    }
  }

  async getVideoData(videoId: string) {
    const videoInfo = await this.getVideoInfo(videoId);
    if (!videoInfo) {
      return false;
    }

    const { videoUrl, duration, isStream, description, title } =
      videoInfo.data.getVideo;

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
  async getClipInfo(clipId: string): Promise<false | Kick.Response> {
    try {
      const res = await fetchWithTimeout(
        `https://kick.com/api/v2/clips/${clipId}`,
      );

      return (await res.json()) as Kick.Response;
    } catch (err: unknown) {
      console.error(
        `Failed to get kick clip info by clipId: ${clipId}.`,
        (err as Error).message,
      );
      return false;
    }
  }

  async getVideoData(videoId: string) {
    if (!videoId.startsWith("clip_")) {
      // video can be translated by api by default
      return {
        url: sites.find((s) => s.host === VideoService.kick)!.url + videoId,
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
  async getVideoData(videoId: string) {
    const res = await fetchWithTimeout(
      `https://developer.apple.com/${videoId}`,
    );
    const content = await res.text();

    // get m3u8 from schema
    const contentUrl =
      /https:\/\/devstreaming-cdn\.apple\.com\/videos\/([^.]+)\/(cmaf\.m3u8)/.exec(
        content,
      )?.[0];
    if (!contentUrl) {
      return undefined;
    }

    return {
      url: contentUrl,
    };
  }
}

export class EpicGamesHelper {
  async getVideoData(videoId: string) {
    const content = await fetchWithTimeout(
      `https://dev.epicgames.com/community/api/learning/post.json?hash_id=${videoId}`,
    ).then(res => res.json());

    return {
      // url это json с dash плейлистом в формате base64
      url: content.blocks?.[1]?.video_url?.replace('qsep://', 'https://'),
      //subtitles: content.blocks?.[1]?.video_captions?.[0]?.signed_url,
    };
  }
}

export class NineAnimetvHelper {

  async getVideoData(videoId: string) {
    const episodeId = videoId.split('?ep=')[1];

    // Получаем айди для эпизода
    // Пример: https://9animetv.to/ajax/episode/servers?episodeId=123269
    const content = await fetchWithTimeout(`https://9animetv.to/ajax/episode/servers?episodeId=${episodeId}`).then(res => res.json());

    // Получаем айди для видео из HTML
    const sourceId = content.html[0]?.exec(/data-id="(\d+)"/)?.[0];
    if (!sourceId) {
      return undefined;
    }

    // Получаем ссылку на RapidCloud
    // Пример: https://9animetv.to/ajax/episode/sources?id=1108082
    const rapidCloud = await fetchWithTimeout(`https://9animetv.to/ajax/episode/sources?id=${sourceId}`).then(res => res.json());

    // Очищаем лишнюю часть из ссылки
    const rapidCloudId = rapidCloud.link.exec(/\/([^\/?]+)\?/)?.[0];

    // Получаем прямую ссылку на видео
    // Пример: https://rapid-cloud.co/ajax/embed-6-v2/getSources?id=RdyPyRt4sK03
    const sourcesUrl = `https://rapid-cloud.co/ajax/embed-6-v2/getSources?id=${rapidCloudId}`;
    const sourcesContent = await fetchWithTimeout(sourcesUrl).then(res => res.json());

    const videoUrl = sourcesContent.sources[0]?.file;
    // WEBVTT
    // const russianSubtitles = sourcesContent.tracks?.find((track: any) => track.label === 'Russian')?.file;
    // const englishSubtitles = sourcesContent.tracks?.find((track: any) => track.label === 'English')?.file;

    return {
      url: videoUrl,
      //subtitles: russianSubtitles || englishSubtitles || null,
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

  /** @source */
  static [VideoService.bannedvideo] = new BannedVideoHelper();

  /** @source */
  static [VideoService.kick] = new KickHelper();

  /** @source */
  static [VideoService.appledeveloper] = new AppleDeveloperHelper();

  /** @source */
  static [VideoService.epicgames] = new EpicGamesHelper();

  /** @source */
  static [VideoService.nineanimetv] = new NineAnimetvHelper();
}

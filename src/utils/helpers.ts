import { getHmacSha1 } from "../secure";
import * as MailRu from "../types/helpers/mailru";
import * as Weverse from "../types/helpers/weverse";

class VideoHelperError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VideoHelper";
    this.message = message;
  }
}

export class VideoHelper {
  static mailru = new (class {
    async getVideoData(videoId: string): Promise<MailRu.VideoInfo | undefined> {
      try {
        const res = await fetch(
          `https://my.mail.ru/+/video/meta/${videoId}?xemail=&ajax_call=1&func_name=&mna=&mnb=&ext=1&_=${new Date().getTime()}`,
        );
        return (await res.json()) as MailRu.VideoInfo;
      } catch (err) {
        console.error("Failed to get mail.ru video info", err);
        return undefined;
      }
    }
  })();

  static weverse = new (class {
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
      let salt =
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

    async getPostPreview(postId: string): Promise<Weverse.PostPreview | false> {
      const pathname =
        `/post/v1.0/post-${postId}/preview?` +
        new URLSearchParams({
          fieldSet: "postForPreview",
          ...this.getURLData(),
        }); // ! DON'T EDIT ME

      const hash = await this.createHash(pathname);

      try {
        const res = await fetch(
          this.API_ORIGIN + pathname + "&" + new URLSearchParams(hash),
          {
            headers: this.HEADERS,
          },
        );

        return (await res.json()) as Weverse.PostPreview;
      } catch (err) {
        console.error(err);
        return false;
      }
    }

    async getVideoInKey(videoId: number) {
      const pathname =
        `/video/v1.1/vod/${videoId}/inKey?` +
        new URLSearchParams({
          gcc: "RU",
          ...this.getURLData(),
        }); // ! DON'T EDIT ME
      const hash = await this.createHash(pathname);

      try {
        const res = await fetch(
          this.API_ORIGIN + pathname + "&" + new URLSearchParams(hash),
          {
            method: "POST",
            headers: this.HEADERS,
          },
        );

        return (await res.json()) as Weverse.InKey;
      } catch (err) {
        console.error(err);
        return false;
      }
    }

    async getVideoInfo(infraVideoId: string, inkey: string, serviceId: string) {
      const timestamp = Date.now();
      try {
        const res = await fetch(
          `https://global.apis.naver.com/rmcnmv/rmcnmv/vod/play/v2.0/${infraVideoId}?` +
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
            }),
          {
            headers: this.HEADERS,
          },
        );

        return (await res.json()) as Weverse.VideoInfo;
      } catch (err) {
        console.error(err);
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
  })();
}

import { BaseHelper, VideoHelperError } from "./base";
import { getHmacSha1 } from "@vot.js/shared/secure";
import Logger from "@vot.js/shared/utils/logger";
export default class WeverseHelper extends BaseHelper {
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
  async getHashURLParams(pathname) {
    const hash = await this.createHash(pathname);
    return new URLSearchParams(hash).toString();
  }
  async getPostPreview(postId) {
    const pathname =
      `/post/v1.0/post-${postId}/preview?` +
      new URLSearchParams({
        fieldSet: "postForPreview",
        ...this.getURLData(),
      }).toString();
    try {
      const urlParams = await this.getHashURLParams(pathname);
      const res = await this.fetch(
        this.API_ORIGIN + pathname + "&" + urlParams,
        {
          headers: this.HEADERS,
        },
      );
      return await res.json();
    } catch (err) {
      Logger.error(
        `Failed to get weverse post preview by postId: ${postId}`,
        err.message,
      );
      return false;
    }
  }
  async getVideoInKey(videoId) {
    const pathname =
      `/video/v1.1/vod/${videoId}/inKey?` +
      new URLSearchParams({
        gcc: "RU",
        ...this.getURLData(),
      }).toString();
    try {
      const urlParams = await this.getHashURLParams(pathname);
      const res = await this.fetch(
        this.API_ORIGIN + pathname + "&" + urlParams,
        {
          method: "POST",
          headers: this.HEADERS,
        },
      );
      return await res.json();
    } catch (err) {
      Logger.error(
        `Failed to get weverse InKey by videoId: ${videoId}`,
        err.message,
      );
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
      const res = await this.fetch(
        `https://global.apis.naver.com/rmcnmv/rmcnmv/vod/play/v2.0/${infraVideoId}?` +
          urlParams,
        {
          headers: this.HEADERS,
        },
      );
      return await res.json();
    } catch (err) {
      Logger.error(
        `Failed to get weverse video info (infraVideoId: ${infraVideoId}, inkey: ${inkey}, serviceId: ${serviceId}`,
        err.message,
      );
      return false;
    }
  }
  extractVideoInfo(videoList) {
    return videoList.find(
      (video) => video.useP2P === false && video.source.includes(".mp4"),
    );
  }
  async getVideoData(videoId) {
    const videoPreview = await this.getPostPreview(videoId);
    if (!videoPreview) {
      return undefined;
    }
    const {
      videoId: internalVideoId,
      serviceId,
      infraVideoId,
    } = videoPreview.extension.video;
    if (!(internalVideoId && serviceId && infraVideoId)) {
      return undefined;
    }
    const inkeyData = await this.getVideoInKey(internalVideoId);
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
  async getVideoId(url) {
    return /([^/]+)\/(live|media)\/([^/]+)/.exec(url.pathname)?.[3];
  }
}

import { BaseHelper, VideoHelperError } from "./base";
export default class YandexDiskHelper extends BaseHelper {
  API_ORIGIN = "https://disk.yandex.ru";
  CLIENT_PREFIX = "/client/disk";
  isErrorData(data) {
    return Object.hasOwn(data, "error");
  }
  async getVideoData(videoId) {
    if (!videoId.startsWith(this.CLIENT_PREFIX)) {
      return {
        url: this.service.url + videoId,
      };
    }
    const url = new URL(window.location.href);
    const dialogId = url.searchParams.get("idDialog");
    if (!dialogId) {
      return undefined;
    }
    const preloadedScript = document.querySelector("#preloaded-data");
    if (!preloadedScript) {
      return undefined;
    }
    try {
      const preloadedData = JSON.parse(preloadedScript.innerText);
      const { idClient, sk } = preloadedData.config;
      const res = await this.fetch(this.API_ORIGIN + "/models/?_m=resource", {
        method: "POST",
        body: new URLSearchParams({
          idClient,
          sk,
          "_model.0": "resource",
          "id.0": dialogId.replaceAll(" ", "+"),
        })
          .toString()
          .replaceAll(/%2B/g, "+"),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      });
      const data = await res.json();
      if (!data.models) {
        throw new VideoHelperError("Failed to get resource info");
      }
      const model = data.models[0];
      const modelData = model.data;
      if (this.isErrorData(modelData)) {
        throw new VideoHelperError(modelData.error?.message);
      }
      const {
        meta: { short_url, video_info },
        name,
      } = modelData;
      if (!video_info) {
        throw new VideoHelperError("There's no video open right now");
      }
      if (!short_url) {
        throw new VideoHelperError("Access to the video is limited");
      }
      const title = name.replace(/(\.[^.]+)$/, "");
      return {
        url: short_url,
        title,
        duration: video_info.duration,
      };
    } catch (err) {
      console.error(
        `Failed to get yandex disk video data by video ID: ${videoId}`,
        err.message,
      );
      return undefined;
    }
  }
  async getVideoId(url) {
    const fileId = /\/i\/([^/]+)/.exec(url.pathname)?.[1];
    if (fileId) {
      return `i/${fileId}`;
    }
    return url.pathname.startsWith(this.CLIENT_PREFIX)
      ? url.pathname + url.search
      : undefined;
  }
}

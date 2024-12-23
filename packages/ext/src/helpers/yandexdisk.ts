import { BaseHelper, VideoHelperError } from "./base";

import * as YandexDisk from "@vot.js/shared/types/helpers/yandexdisk";

export default class YandexDiskHelper extends BaseHelper {
  API_ORIGIN = "https://disk.yandex.ru";
  CLIENT_PREFIX = "/client/disk";

  isErrorData(
    data: YandexDisk.ResourceModelData | YandexDisk.ResourceErrorModelData,
  ): data is YandexDisk.ResourceErrorModelData {
    return Object.hasOwn(data, "error");
  }

  async getVideoData(videoId: string) {
    if (!videoId.startsWith(this.CLIENT_PREFIX)) {
      return {
        url: this.service!.url + videoId,
      };
    }

    const url = new URL(window.location.href);
    const dialogId = url.searchParams.get("idDialog");
    if (!dialogId) {
      return undefined;
    }

    const preloadedScript = document.querySelector("#preloaded-data") as
      | HTMLScriptElement
      | undefined;
    if (!preloadedScript) {
      return undefined;
    }

    try {
      const preloadedData = JSON.parse(
        preloadedScript.innerText,
      ) as YandexDisk.PreloadedData;
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
          .replaceAll(/%2B/g, "+"), // yandex requires this
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      });

      const data = (await res.json()) as YandexDisk.ResourceModels;
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
        duration: Math.round(video_info.duration / 1000),
      };
    } catch (err) {
      console.error(
        `Failed to get yandex disk video data by video ID: ${videoId}`,
        (err as Error).message,
      );
      return undefined;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    const fileId = /\/i\/([^/]+)/.exec(url.pathname)?.[1];
    if (fileId) {
      return `i/${fileId}`;
    }

    return url.pathname.startsWith(this.CLIENT_PREFIX)
      ? url.pathname + url.search
      : undefined;
  }
}

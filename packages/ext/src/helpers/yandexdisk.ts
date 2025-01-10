import { BaseHelper, VideoHelperError } from "./base";

import * as YandexDisk from "@vot.js/shared/types/helpers/yandexdisk";
import Logger from "@vot.js/shared/utils/logger";
import { proxyMedia } from "@vot.js/shared/utils/utils";

export default class YandexDiskHelper extends BaseHelper {
  API_ORIGIN = window.location.origin;
  CLIENT_PREFIX = "/client/disk";
  INLINE_PREFIX = "/i/";
  DISK_PREFIX = "/d/";

  isErrorData(
    data: YandexDisk.ResourceModelData | YandexDisk.ResourceErrorModelData,
  ): data is YandexDisk.ResourceErrorModelData {
    return Object.hasOwn(data, "error");
  }

  async getClientVideoData(videoId: string) {
    const url = new URL(window.location.href);
    const dialogId = url.searchParams.get("idDialog");
    if (!dialogId) {
      return undefined;
    }

    const preloadedScript =
      document.querySelector<HTMLScriptElement>("#preloaded-data");
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

      const title = this.clearTitle(name);
      const duration = Math.round(video_info.duration / 1000);
      return {
        url: short_url,
        title,
        duration,
      };
    } catch (err) {
      Logger.error(
        `Failed to get yandex disk video data by video ID: ${videoId}, because ${
          (err as Error).message
        }`,
      );
      return undefined;
    }
  }

  clearTitle(title: string) {
    return title.replace(/(\.[^.]+)$/, "");
  }

  getBodyHash(fileHash: string, sk: string) {
    const data = JSON.stringify({
      hash: fileHash,
      sk,
    });

    return encodeURIComponent(data);
  }

  async fetchList(dirHash: string, sk: string) {
    const body = this.getBodyHash(dirHash, sk);
    const res = await this.fetch(this.API_ORIGIN + "/public/api/fetch-list", {
      method: "POST",
      body,
    });
    const data = (await res.json()) as YandexDisk.FetchListResponse;
    if (Object.hasOwn(data, "error")) {
      throw new VideoHelperError("Failed to fetch folder list");
    }

    return data.resources;
  }

  async getDownloadUrl(fileHash: string, sk: string) {
    const body = this.getBodyHash(fileHash, sk);
    const res = await this.fetch(this.API_ORIGIN + "/public/api/download-url", {
      method: "POST",
      body,
    });
    const data = (await res.json()) as YandexDisk.DownloadUrlResponse;
    if (data.error) {
      throw new VideoHelperError("Failed to get download url");
    }

    return data.data.url;
  }

  async getDiskVideoData(videoId: string) {
    try {
      const prefetchEl = document.getElementById("store-prefetch");
      if (!prefetchEl) {
        throw new VideoHelperError("Failed to get prefetch data");
      }

      const resourcePaths = videoId.split("/").slice(3);
      if (!resourcePaths.length) {
        throw new VideoHelperError("Failed to find video file path");
      }

      const data = JSON.parse(prefetchEl.innerText) as YandexDisk.PrefetchData;
      const {
        resources,
        rootResourceId,
        environment: { sk },
      } = data;
      const rootResource = resources[rootResourceId];
      const resourcePathsLastIdx = resourcePaths.length - 1;
      const resourcePath = resourcePaths
        .filter((_, idx) => idx !== resourcePathsLastIdx)
        .join("/");
      let resourcesList = Object.values(resources);
      if (resourcePath.includes("/")) {
        resourcesList = await this.fetchList(
          `${rootResource.hash}:/${resourcePath}`,
          sk,
        );
      }

      const resource = resourcesList.find(
        (resource) => resource.name === resourcePaths[resourcePathsLastIdx],
      );
      if (!resource) {
        throw new VideoHelperError("Failed to find resource");
      }

      if (resource && resource.type === "dir") {
        throw new VideoHelperError("Path is dir, but expected file");
      }

      const {
        meta: { short_url, mediatype, videoDuration },
        path,
        name,
      } = resource;
      if (mediatype !== "video") {
        throw new VideoHelperError("Resource isn't a video");
      }

      const title = this.clearTitle(name);
      const duration = Math.round(videoDuration / 1000);
      if (short_url) {
        return {
          url: short_url,
          duration,
          title,
        };
      }

      const downloadUrl = await this.getDownloadUrl(path, sk);
      return {
        // to set the referer and origin
        url: proxyMedia(new URL(downloadUrl)),
        duration,
        title,
      };
    } catch (err) {
      Logger.error(
        `Failed to get yandex disk video data by disk video ID: ${videoId}`,
        (err as Error).message,
      );
      return undefined;
    }
  }

  async getVideoData(videoId: string) {
    if (videoId.startsWith(this.INLINE_PREFIX)) {
      return {
        url: this.service!.url + videoId.slice(1),
      };
    }

    videoId = decodeURIComponent(videoId);
    if (videoId.startsWith(this.CLIENT_PREFIX)) {
      return await this.getClientVideoData(videoId);
    }

    return await this.getDiskVideoData(videoId);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    if (url.pathname.startsWith(this.CLIENT_PREFIX)) {
      return url.pathname + url.search;
    }

    const fileId = /\/i\/([^/]+)/.exec(url.pathname)?.[0];
    if (fileId) {
      return fileId;
    }

    // we return the pathname because the path can have a huge nesting
    return /\/d\/([^/]+)\/([^/]+)/.exec(url.pathname)
      ? url.pathname
      : undefined;
  }
}

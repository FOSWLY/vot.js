import { parseFromString } from "dom-parser";

import { BaseHelper, VideoHelperError } from "./base";

import * as YandexDisk from "@vot.js/shared/types/helpers/yandexdisk";
import Logger from "@vot.js/shared/utils/logger";
import { proxyMedia } from "@vot.js/shared/utils/utils";

export default class YandexDiskHelper extends BaseHelper {
  API_ORIGIN = this.origin ?? "https://disk.yandex.ru";
  INLINE_PREFIX = "/i/";
  DISK_PREFIX = "/d/";

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
      const res = await this.fetch(this.API_ORIGIN + videoId, {
        headers: {
          Origin: this.API_ORIGIN,
          Referer: this.API_ORIGIN + "/client/disk",
        },
      });
      if (res.status !== 200) {
        throw new VideoHelperError("Failed to fetch document");
      }

      const content = await res.text();
      const doc = parseFromString(content.replace(/<!DOCTYPE html>/i, ""));

      const prefetchEl = doc.getElementById("store-prefetch");
      if (!prefetchEl) {
        const reason = doc.getElementById("checkbox-captcha-form")
          ? "page contains Captcha"
          : "no prefetch data on page";
        throw new VideoHelperError(
          `Failed to get prefetch data. Reason: ${reason}`,
        );
      }

      const resourcePaths = videoId.split("/").slice(3);
      if (!resourcePaths.length) {
        throw new VideoHelperError("Failed to find video file path");
      }

      const data = JSON.parse(
        prefetchEl.textContent,
      ) as YandexDisk.PrefetchData;
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
      Logger.warn(
        `Failed to get yandex disk video data by disk video ID: ${videoId}, because ${
          (err as Error).message
        }. Using clear link instead...`,
      );
      // some /d/ links is valid (https://github.com/FOSWLY/vot-cli/pull/50)
      return {
        url: this.service!.url + videoId.slice(1),
      };
    }
  }

  async getVideoData(videoId: string) {
    if (
      videoId.startsWith(this.INLINE_PREFIX) ||
      /^\/d\/([^/]+)$/.exec(videoId)
    ) {
      return {
        url: this.service!.url + videoId.slice(1),
      };
    }

    videoId = decodeURIComponent(videoId);
    return await this.getDiskVideoData(videoId);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    const fileId = /\/i\/([^/]+)/.exec(url.pathname)?.[0];
    if (fileId) {
      return fileId;
    }

    // we return the pathname because the path can have a huge nesting
    return /\/d\/([^/]+)/.exec(url.pathname) ? url.pathname : undefined;
  }
}

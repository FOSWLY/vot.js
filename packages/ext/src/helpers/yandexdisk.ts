import type * as YandexDisk from "@vot.js/shared/types/helpers/yandexdisk";
import Logger from "@vot.js/shared/utils/logger";
import { proxyMedia } from "@vot.js/shared/utils/utils";
import { BaseHelper, VideoHelperError } from "./base";

export default class YandexDiskHelper extends BaseHelper {
  API_ORIGIN = window.location.origin;
  CLIENT_PREFIX = "/client/disk";
  INLINE_PREFIX = "/i/";
  DISK_PREFIX = "/d/";

  isErrorData(
    data: YandexDisk.ResourceInfo | YandexDisk.ResourceErrorModelData,
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
      const res = await this.fetch(`${this.API_ORIGIN}/models-v2?m=mpfs/info`, {
        method: "POST",
        body: JSON.stringify({
          apiMethod: "mpfs/info",
          connection_id: idClient,
          requestParams: {
            path: dialogId,
          },
          sk,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = (await res.json()) as YandexDisk.ResourceInfo;
      if (this.isErrorData(data)) {
        throw new VideoHelperError(data.error?.message ?? data.error?.code);
      }

      if (data?.type !== "file") {
        throw new VideoHelperError("Failed to get resource info");
      }

      const {
        meta: { short_url, video_info },
        name,
      } = data;
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
        videoId,
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

  async fetchList(dirHash: string, sk: string, offset = 0) {
    const data = JSON.stringify({
      hash: dirHash,
      sk,
      offset,
    });

    const body = encodeURIComponent(data);
    const res = await this.fetch(`${this.API_ORIGIN}/public/api/fetch-list`, {
      method: "POST",
      body,
    });

    const resData = (await res.json()) as YandexDisk.FetchListResponse & {
      completed?: boolean;
    };

    if (Object.hasOwn(resData, "error")) {
      throw new VideoHelperError("Failed to fetch folder list");
    }

    return resData;
  }

  async getDownloadUrl(fileHash: string, sk: string) {
    const body = this.getBodyHash(fileHash, sk);
    const res = await this.fetch(`${this.API_ORIGIN}/public/api/download-url`, {
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

      const fileName = resourcePaths[resourcePaths.length - 1];
      const dirPath = resourcePaths.slice(0, -1).join("/");
      const expectedPath = dirPath
        ? `${rootResource.hash}:/${dirPath}/${fileName}`
        : `${rootResource.hash}:/${fileName}`;

      let resource: any =
        Object.values(resources).find((r: any) => r.path === expectedPath) ||
        Object.values(resources).find(
          (r: any) => r.name === fileName && r.type === "file",
        );

      if (!resource && dirPath.length > 0) {
        const folderHash = `${rootResource.hash}:/${dirPath}`;
        let offset = 0;
        let completed = false;

        while (!completed) {
          const listData = await this.fetchList(folderHash, sk, offset);
          const fetchedResources = listData.resources || [];

          if (fetchedResources.length === 0) {
            break;
          }

          resource = fetchedResources.find((r: any) => r.name === fileName);
          if (resource) {
            break;
          }

          completed = !!listData.completed;
          offset += fetchedResources.length;
        }
      }

      if (!resource) {
        throw new VideoHelperError("Failed to find resource");
      }

      if (resource.type === "dir") {
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
      const duration = videoDuration ? Math.round(videoDuration / 1000) : 0;

      if (short_url) {
        return {
          url: short_url,
          duration,
          title,
          videoId,
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
    if (
      videoId.startsWith(this.INLINE_PREFIX) ||
      /^\/d\/([^/]+)$/.exec(videoId)
    ) {
      return {
        url: (this.service?.url || "https://disk.yandex.ru") + videoId.slice(1),
        videoId,
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
    return /\/d\/([^/]+)/.exec(url.pathname) ? url.pathname : undefined;
  }
}

import { BaseHelper, VideoHelperError } from "./base";
import type { MinimalVideoData } from "../types/client";

import Logger from "@vot.js/shared/utils/logger";

export default class RedditHelper extends BaseHelper {
  API_ORIGIN = "https://www.reddit.com";

  // eslint-disable-next-line @typescript-eslint/require-await
  async getContentUrl(videoId: string) {
    if (
      !this.service!.additionalData ||
      this.service!.additionalData !== "old"
    ) {
      // this isn't a video element, but nevertheless let it be so
      return (
        document.querySelector("shreddit-player-2") as
          | HTMLVideoElement
          | undefined
      )?.src;
    }

    const playerEl = document.querySelector("[data-hls-url]") as
      | HTMLElement
      | undefined;

    return playerEl?.dataset.hlsUrl?.replaceAll("&amp;", "&");
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      const contentUrl = await this.getContentUrl(videoId);
      if (!contentUrl) {
        throw new VideoHelperError("Failed to find content url");
      }

      return {
        url: decodeURIComponent(contentUrl),
      };
    } catch (err: unknown) {
      Logger.error(
        `Failed to get reddit video data by video ID: ${videoId}`,
        (err as Error).message,
      );
      return undefined;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/r\/(([^/]+)\/([^/]+)\/([^/]+)\/([^/]+))/.exec(url.pathname)?.[1];
  }
}

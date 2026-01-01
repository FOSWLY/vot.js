import type { MinimalVideoData } from "../types/client";
import { BaseHelper, VideoHelperError } from "./base";

import Logger from "@vot.js/shared/utils/logger";

export default class RedditHelper extends BaseHelper {
  API_ORIGIN = "https://www.reddit.com";

  // eslint-disable-next-line @typescript-eslint/require-await
  async getContentUrl(_videoId: string) {
    if (this.service?.additionalData !== "old") {
      const player = document.querySelector<HTMLElement>(
        "shreddit-player-2, shreddit-player",
      );

      const src =
        player?.getAttribute("src") ??
        player
          ?.querySelector<HTMLSourceElement>(
            'source[type="application/vnd.apple.mpegURL"]',
          )
          ?.getAttribute("src");

      return src?.replaceAll("&amp;", "&");
    }

    const playerEl = document.querySelector<HTMLElement>("[data-hls-url]");
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
    } catch (err) {
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

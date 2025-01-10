import { BaseHelper, VideoHelperError } from "./base";
import type { MinimalVideoData } from "../types/client";

import Logger from "@vot.js/shared/utils/logger";

export default class AppleDeveloperHelper extends BaseHelper {
  API_ORIGIN = "https://developer.apple.com";

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      const contentUrl = document.querySelector<HTMLMetaElement>(
        "meta[property='og:video']",
      )?.content;
      if (!contentUrl) {
        throw new VideoHelperError("Failed to find content url");
      }

      return {
        url: contentUrl,
      };
    } catch (err) {
      Logger.error(
        `Failed to get apple developer video data by video ID: ${videoId}`,
        (err as Error).message,
      );
      return undefined;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /videos\/play\/([^/]+)\/([\d]+)/.exec(url.pathname)?.[0];
  }
}

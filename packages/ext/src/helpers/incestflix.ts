import { BaseHelper, VideoHelperError } from "./base";
import type { MinimalVideoData } from "../types/client";

import { proxyMedia } from "@vot.js/shared/utils/utils";
import Logger from "@vot.js/shared/utils/logger";

export default class IncestflixHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      const sourceEl = document.querySelector(
        "#incflix-stream source:first-of-type",
      );
      if (!sourceEl) {
        throw new VideoHelperError("Failed to find source element");
      }

      const srcLink = sourceEl.getAttribute("src");
      if (!srcLink) {
        throw new VideoHelperError("Failed to find source link");
      }

      const source = new URL(
        srcLink.startsWith("//") ? `https:${srcLink}` : srcLink,
      );
      source.searchParams.append("media-proxy", "video.mp4"); // origin url doesn't have .mp4 part
      return {
        url: proxyMedia(source),
      };
    } catch (err) {
      Logger.error(
        `Failed to get Incestflix data by videoId: ${videoId}`,
        (err as Error).message,
      );
      return undefined;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/watch\/([^/]+)/.exec(url.pathname)?.[1];
  }
}

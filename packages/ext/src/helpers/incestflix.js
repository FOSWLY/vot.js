import { BaseHelper, VideoHelperError } from "./base";
import { proxyMedia } from "@vot.js/shared/utils/utils";
import Logger from "@vot.js/shared/utils/logger";
export default class IncestflixHelper extends BaseHelper {
  async getVideoData(videoId) {
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
      source.searchParams.append("media-proxy", "video.mp4");
      return {
        url: proxyMedia(source),
      };
    } catch (err) {
      Logger.error(
        `Failed to get Incestflix data by videoId: ${videoId}`,
        err.message,
      );
      return undefined;
    }
  }
  async getVideoId(url) {
    return /\/watch\/([^/]+)/.exec(url.pathname)?.[1];
  }
}

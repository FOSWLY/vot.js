import { BaseHelper, VideoHelperError } from "./base";
import Logger from "@vot.js/shared/utils/logger";
export default class RedditHelper extends BaseHelper {
  API_ORIGIN = "https://www.reddit.com";
  async getContentUrl(videoId) {
    if (!this.service.additionalData || this.service.additionalData !== "old") {
      return document.querySelector("shreddit-player-2")?.src;
    }
    const playerEl = document.querySelector("[data-hls-url]");
    return playerEl?.dataset.hlsUrl?.replaceAll("&amp;", "&");
  }
  async getVideoData(videoId) {
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
        err.message,
      );
      return undefined;
    }
  }
  async getVideoId(url) {
    return /\/r\/(([^/]+)\/([^/]+)\/([^/]+)\/([^/]+))/.exec(url.pathname)?.[1];
  }
}

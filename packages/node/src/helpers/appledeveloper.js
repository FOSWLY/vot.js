import { BaseHelper, VideoHelperError } from "./base";
import Logger from "@vot.js/shared/utils/logger";
export default class AppleDeveloperHelper extends BaseHelper {
  API_ORIGIN = "https://developer.apple.com";
  async getVideoData(videoId) {
    try {
      const res = await this.fetch(`${this.API_ORIGIN}/${videoId}`);
      const content = await res.text();
      const contentUrl =
        /https:\/\/devstreaming-cdn\.apple\.com\/videos\/([^.]+)\/(cmaf\.m3u8)/.exec(
          content,
        )?.[0];
      if (!contentUrl) {
        throw new VideoHelperError("Failed to find content url");
      }
      return {
        url: contentUrl,
      };
    } catch (err) {
      Logger.error(
        `Failed to get apple developer video data by video ID: ${videoId}`,
        err.message,
      );
      return undefined;
    }
  }
  async getVideoId(url) {
    return /videos\/play\/([^/]+)\/([\d]+)/.exec(url.pathname)?.[0];
  }
}

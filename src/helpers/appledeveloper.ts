import { MinimalVideoData } from "../types/client";
import Logger from "../utils/logger";
import { BaseHelper, VideoHelperError } from "./base";

export default class AppleDeveloperHelper extends BaseHelper {
  API_ORIGIN = "https://developer.apple.com";

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      const res = await this.fetch(`${this.API_ORIGIN}/${videoId}`);
      const content = await res.text();

      // get m3u8 from schema
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
    } catch (err: unknown) {
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

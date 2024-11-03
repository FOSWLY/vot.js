import { MinimalVideoData } from "../types/client";
import Logger from "../utils/logger";
import { BaseHelper, VideoHelperError } from "./base";

export default class RedditHelper extends BaseHelper {
  API_ORIGIN = "https://www.reddit.com";

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      const res = await this.fetch(`${this.API_ORIGIN}/r/${videoId}`);
      const content = await res.text();

      // get m3u8 from player
      const contentUrl =
        /https:\/\/v\.redd\.it\/([^/]+)\/HLSPlaylist\.m3u8\?([^"]+)/
          .exec(content)?.[0]
          ?.replaceAll("&amp;", "&");
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

import { BaseHelper } from "./base";

export default class RedditHelper extends BaseHelper {
  API_ORIGIN = "https://www.reddit.com";

  async getVideoData(videoId: string) {
    const res = await this.fetch(`${this.API_ORIGIN}/r/${videoId}`);
    const content = await res.text();

    // get m3u8 from player
    const contentUrl =
      /https:\/\/v\.redd\.it\/([^/]+)\/HLSPlaylist\.m3u8\?([^"]+)/
        .exec(content)?.[0]
        ?.replaceAll("&amp;", "&");
    if (!contentUrl) {
      return undefined;
    }

    return {
      url: decodeURIComponent(contentUrl),
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/r\/(([^/]+)\/([^/]+)\/([^/]+)\/([^/]+))/.exec(url.pathname)?.[1];
  }
}

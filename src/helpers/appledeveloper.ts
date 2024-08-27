import { MinimalVideoData } from "../types/client";
import { BaseHelper } from "./base";

export default class AppleDeveloperHelper extends BaseHelper {
  API_ORIGIN = "https://developer.apple.com";

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const res = await this.fetch(`${this.API_ORIGIN}/${videoId}`);
    const content = await res.text();

    // get m3u8 from schema
    const contentUrl =
      /https:\/\/devstreaming-cdn\.apple\.com\/videos\/([^.]+)\/(cmaf\.m3u8)/.exec(
        content,
      )?.[0];
    if (!contentUrl) {
      return undefined;
    }

    return {
      url: contentUrl,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /videos\/play\/([^/]+)\/([\d]+)/.exec(url.pathname)?.[0];
  }
}

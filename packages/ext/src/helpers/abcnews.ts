import type { MinimalVideoData } from "../types/client";
import { BaseHelper } from "./base";

export default class AbcNewsHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }

  // The player is MSE-based and reports `duration === Infinity`, so read it from the page state
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const articleId = /\/video\/(\d+)/.exec(videoId)?.[1];
    if (!articleId) {
      return { url: videoId };
    }

    try {
      const res = await this.fetch(videoId);
      const html = await res.text();
      const match = new RegExp(
        `"link":"[^"]*/video/${articleId}/?","duration":"[^"]*","durationISO":"PT(?:(\\d+)H)?(?:(\\d+)M)?(?:(\\d+)S)?"`,
      ).exec(html);
      if (!match) {
        return { url: videoId };
      }

      const [, hours = 0, minutes = 0, seconds = 0] = match;
      const duration =
        Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
      return { url: videoId, duration: duration || undefined };
    } catch {
      return { url: videoId };
    }
  }
}

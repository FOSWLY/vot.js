import type { MinimalVideoData } from "../types/client";
import { BaseHelper } from "./base";

export default class TwitterHelper extends BaseHelper {
  async getVideoId(url: URL) {
    const embedId = url.searchParams.get("id");
    if (embedId) return embedId;

    const videoId = /status\/([^/]+)/.exec(url.pathname)?.[1];
    if (videoId) {
      return videoId;
    }

    const postEl = this.video?.closest('[data-testid="tweet"]');
    const newLink = postEl?.querySelector<HTMLLinkElement>(
      'a[role="link"][aria-label]',
    )?.href;
    return newLink ? /status\/([^/]+)/.exec(newLink)?.[1] : undefined;
  }

  /**
   * Pass the post link instead of a direct media URL: the translation
   * backend resolves the media itself, and the twimg CDN can be
   * unreachable from its network.
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    return {
      url: `https://twitter.com/i/status/${videoId}`,
      videoId,
    };
  }
}

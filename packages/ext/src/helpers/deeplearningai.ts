import type { MinimalVideoData } from "../types/client";
import { BaseHelper } from "./base";

export default class DeeplearningAIHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(_videoId: string): Promise<MinimalVideoData | undefined> {
    if (!this.video) {
      return undefined;
    }

    const sourceUrl = this.video
      .querySelector<HTMLSourceElement>('source[type="application/x-mpegurl"]')
      ?.src.replace(/\.m3u8/, "_360p.mp4");
    if (!sourceUrl) {
      return undefined;
    }

    return {
      url: sourceUrl,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /courses\/(([^/]+)\/lesson\/([^/]+)\/([^/]+))/.exec(
      url.pathname,
    )?.[1];
  }
}

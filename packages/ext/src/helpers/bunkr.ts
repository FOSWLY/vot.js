import PlyrHelper from "../players/plyr";
import type { MinimalVideoData } from "../types/client";
import { BaseHelper } from "./base";

export default class BunkrHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    return new PlyrHelper().getVideoData(videoId);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/(?:f|v)\/([^/]+)/.exec(url.pathname)?.[1];
  }
}

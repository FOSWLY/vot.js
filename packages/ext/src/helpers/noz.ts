import VideoJSHelper from "../players/videojs";
import type { MinimalVideoData } from "../types/client";

export default class NOZHelper extends VideoJSHelper {
  SUBTITLE_SOURCE = "noz";

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    return this.getVideoDataByPlayer(videoId);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/video\/(\d+)/.exec(url.pathname)?.[1];
  }
}

import VideoJSHelper from "../players/videojs";
import type { MinimalVideoData } from "../types/client";

export default class NetacadHelper extends VideoJSHelper {
  SUBTITLE_SOURCE = "netacad";

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const data = this.getVideoDataByPlayer(videoId, true);
    if (!data) {
      return undefined;
    }

    return data;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return url.pathname + url.search;
  }
}

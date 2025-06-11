import type { MinimalVideoData } from "../types/client";
import VideoJSHelper from "./videojs";

import { proxyMedia } from "@vot.js/shared/utils/utils";

export default class NetacadHelper extends VideoJSHelper {
  SUBTITLE_SOURCE = "netacad";

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const data = this.getVideoDataByPlayer(videoId);
    if (!data) {
      return undefined;
    }

    const { url, duration, subtitles } = data;

    return {
      url: proxyMedia(new URL(url)),
      duration,
      subtitles,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return url.pathname + url.search;
  }
}

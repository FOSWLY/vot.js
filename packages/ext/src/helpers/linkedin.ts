import { proxyMedia } from "@vot.js/shared/utils/utils";
import VideoJSHelper from "../players/videojs";
import type { MinimalVideoData } from "../types/client";

export default class LinkedinHelper extends VideoJSHelper {
  SUBTITLE_SOURCE = "linkedin";

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const data = this.getVideoDataByPlayer(videoId);
    if (!data) {
      return undefined;
    }

    const { url, duration, subtitles } = data;

    return {
      url: proxyMedia(new URL(url), "mp4", this.mediaProxy),
      duration,
      subtitles,
    };
  }

  async getVideoId(url: URL) {
    return /\/learning\/(([^/]+)\/([^/]+))/.exec(url.pathname)?.[1];
  }
}

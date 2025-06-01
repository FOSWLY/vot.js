import VideoJSHelper from "./videojs";
import type { MinimalVideoData } from "../types/client";

import { proxyMedia } from "@vot.js/shared/utils/utils";

export default class OracleLearnHelper extends VideoJSHelper {
  SUBTITLE_SOURCE = "oraclelearn";

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const data = this.getVideoDataByPlayer(videoId);
    if (!data) {
      return undefined;
    }
    const { url, duration, subtitles } = data;
    const baseData = this.returnBaseData(videoId);
    const videoUrl = proxyMedia(new URL(url));
    if (!baseData) {
      return {
        url: videoUrl,
        duration,
        subtitles,
      };
    }

    return {
      url: baseData.url,
      duration,
      subtitles,
      translationHelp: [
        {
          target: "video_file_url",
          targetUrl: videoUrl,
        },
      ],
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/ou\/course\/(([^/]+)\/(\d+)\/(\d+))/.exec(url.pathname)?.[1];
  }
}

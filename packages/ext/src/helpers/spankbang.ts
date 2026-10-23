import { proxyMedia } from "@vot.js/shared/utils/utils";

import VideoJSHelper from "../players/videojs";
import type { MinimalVideoData } from "../types/client";

export default class SpankBangHelper extends VideoJSHelper {
  SUBTITLE_SOURCE = "spankbang";
  TECH_EL_SELECTOR =
    'video.vjs-tech, video[id$="_html5_api"], video[src]:not([id^="video_dropdown_"]), video:not([id^="video_dropdown_"])';

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const baseData = this.returnBaseData(videoId);
    if (!baseData) {
      return undefined;
    }

    const data = this.getVideoDataByPlayer(videoId);
    if (!data) {
      return baseData;
    }

    const { url, duration, subtitles } = data;
    return {
      url: baseData.url,
      duration,
      subtitles,
      translationHelp: [
        {
          target: "video_file_url",
          targetUrl: proxyMedia(new URL(url), "mp4", this.mediaProxy),
        },
      ],
    };
  }

  async getVideoId(url: URL) {
    return (
      /\/([\da-z]+\/(?:video|play|embed)(?:\/[^/]+)?)\/?$/i.exec(
        url.pathname,
      )?.[1] ??
      /\/([\da-z]+-[\da-z]+\/playlist\/[^/]+)\/?$/i.exec(url.pathname)?.[1]
    );
  }
}

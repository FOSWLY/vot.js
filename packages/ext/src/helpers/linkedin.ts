import { BaseHelper, VideoHelperError } from "./base";
import type { MinimalVideoData } from "../types/client";
import * as Linkedin from "../types/helpers/linkedin";

import type { VideoDataSubtitle } from "@vot.js/core/types/client";
// import * as Linkedin from "@vot.js/shared/types/helpers/linkedin";
import { normalizeLang, proxyMedia } from "@vot.js/shared/utils/utils";
import Logger from "@vot.js/shared/utils/logger";

export default class LinkedinHelper extends BaseHelper {
  static getPlayer() {
    const videoEl = document.querySelector<Linkedin.PlayerElement>(".video-js");
    if (!videoEl) {
      return undefined;
    }

    return videoEl.player;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      const player = LinkedinHelper.getPlayer();
      if (!player) {
        throw new Error(
          `Video player doesn't have player option, videoId ${videoId}`,
        );
      }

      const {
        cache_: { sources, duration },
        textTracks_: { tracks_ },
      } = player;
      const videoUrl = sources.find((source) => source.type === "video/mp4");
      if (!videoUrl) {
        throw new Error(`Failed to find video url for videoID ${videoId}`);
      }

      const url = new URL(videoUrl.src);
      const subtitles: VideoDataSubtitle[] = tracks_.map((track) => ({
        language: normalizeLang(track.language),
        source: "linkedin",
        format: "vtt",
        url: track.src,
      }));

      return {
        url: proxyMedia(url),
        duration,
        subtitles,
      };
    } catch (err) {
      Logger.error("Failed to get linkedin video data", (err as Error).message);
      return undefined;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/learning\/(([^/]+)\/([^/]+))/.exec(url.pathname)?.[1];
  }
}

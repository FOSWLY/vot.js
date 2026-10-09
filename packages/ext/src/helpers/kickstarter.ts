import Logger from "@vot.js/shared/utils/logger";
import { buildSubtitles, getTrackElements } from "../players/utils";
import type { MinimalVideoData } from "../types/client";
import { BaseHelper, VideoHelperError } from "./base";

export default class KickstarterHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      const videoEl = document.querySelector<HTMLVideoElement>(
        ".ksr-video-player > video",
      );
      const url = videoEl?.querySelector<HTMLSourceElement>(
        "source[type^='video/mp4']",
      )?.src;
      if (!url) {
        throw new VideoHelperError("Failed to find video URL");
      }

      // <track> parsing is shared with the generic HTML5 player helpers
      return {
        url,
        subtitles: buildSubtitles(getTrackElements(videoEl), "kickstarter"),
      };
    } catch (err) {
      Logger.error(
        `Failed to get Kickstarter data by videoId: ${videoId}`,
        (err as Error).message,
      );
      return undefined;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return url.pathname.slice(1);
  }
}

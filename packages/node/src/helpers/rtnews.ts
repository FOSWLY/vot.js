import { parseFromString } from "dom-parser";

import { BaseHelper } from "./base";
import { MinimalVideoData } from "../types/client";

import Logger from "@vot.js/shared/utils/logger";
import { proxyMedia } from "@vot.js/shared/utils/utils";

export default class RtNewsHelper extends BaseHelper {
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      const res = await this.fetch(this.service?.url + videoId);
      const content = await res.text();

      const doc = parseFromString(content.replace(/<!DOCTYPE html>/i, ""));
      const videoEl = doc.getElementsByClassName("media__video_noscript")?.[0];
      if (!videoEl) {
        return undefined;
      }

      let videoSrc = videoEl.getAttribute("src");
      if (!videoSrc) {
        return undefined;
      }

      // yandex has case sensitive check of video format
      if (videoSrc.endsWith(".MP4")) {
        videoSrc = proxyMedia(videoSrc);
      }

      return {
        videoId,
        url: videoSrc,
      };
    } catch (err) {
      Logger.error(
        `Failed to get rt news video data by video ID: ${videoId}, because: ${
          (err as Error).message
        }`,
      );
      return undefined;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return url.pathname.slice(1);
  }
}

import { proxyMedia } from "@vot.js/shared/utils/utils";
import type { MinimalVideoData } from "../types/client";
import { BaseHelper } from "./base";

export default class RtNewsHelper extends BaseHelper {
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const videoEl = document.querySelector(".jw-video, .media__video_noscript");
    if (!videoEl) {
      return undefined;
    }

    let videoSrc = videoEl.getAttribute("src");
    if (!videoSrc) {
      return undefined;
    }

    // yandex has case sensitive check of video format
    if (videoSrc.endsWith(".MP4")) {
      videoSrc = proxyMedia(videoSrc, "mp4", this.mediaProxy);
    }

    return {
      videoId,
      url: videoSrc,
    };
  }

  async getVideoId(url: URL) {
    return url.pathname.slice(1);
  }
}

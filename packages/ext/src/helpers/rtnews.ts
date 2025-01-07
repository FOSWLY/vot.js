import { BaseHelper } from "./base";
import { MinimalVideoData } from "../types/client";

import { proxyMedia } from "@vot.js/shared/utils/utils";

export default class RtNewsHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
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
      videoSrc = proxyMedia(videoSrc);
    }

    return {
      videoId,
      url: videoSrc,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return url.pathname.slice(1);
  }
}

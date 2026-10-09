import type { MinimalVideoData } from "../types/client";
import { getVideoSrc } from "../utils/dom";
import { BaseHelper } from "./base";

export default class MediafileHelper extends BaseHelper {
  DEFAULT_SITE_ORIGIN = "https://mediafile.cc";
  SITE_ORIGIN = this.service?.url?.slice(0, -1) ?? this.DEFAULT_SITE_ORIGIN;

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const videoEl =
      this.video instanceof HTMLVideoElement
        ? this.video
        : document.querySelector<HTMLVideoElement>("video");
    const videoSource = getVideoSrc(videoEl);
    if (!videoSource) {
      return undefined;
    }

    const data: MinimalVideoData & {
      video_url: string;
    } = {
      url: `${this.SITE_ORIGIN}/${videoId}`,
      video_url: videoSource,
      translationHelp: [
        {
          target: "video_file_url",
          targetUrl: videoSource,
        },
      ],
    };

    return data;
  }

  async getVideoId(url: URL) {
    return url.pathname.replace(/^\/+/, "") || undefined;
  }
}

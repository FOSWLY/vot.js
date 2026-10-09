import {
  findMediaElement,
  getMediaElementSources,
  selectSourceUrl,
} from "../players/utils";
import type { MinimalVideoData } from "../types/client";
import { BaseHelper } from "./base";

export default class MediafileHelper extends BaseHelper {
  DEFAULT_SITE_ORIGIN = "https://mediafile.cc";
  SITE_ORIGIN = this.service?.url?.slice(0, -1) ?? this.DEFAULT_SITE_ORIGIN;

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const video = findMediaElement(this.video ?? document, "video");
    const videoSource = selectSourceUrl(getMediaElementSources(video));
    if (!videoSource) {
      return undefined;
    }

    return {
      url: `${this.SITE_ORIGIN}/${videoId}`,
      video_url: videoSource,
      translationHelp: [{ target: "video_file_url", targetUrl: videoSource }],
    } as MinimalVideoData & { video_url: string };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return url.pathname.replace(/^\/+/, "") || undefined;
  }
}

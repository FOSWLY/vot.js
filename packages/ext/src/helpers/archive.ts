import { proxyMedia } from "@vot.js/shared/utils/utils";

import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";

export default class ArchiveHelper extends BaseHelper {
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const baseData: MinimalVideoData | undefined = this.returnBaseData(videoId);
    if (!baseData) {
      return undefined;
    }

    const transformedPath = videoId
      .replace(/\+/g, "%20")
      .replace(/\.[^.]+$/, ".mp4");

    const downloadUrl = `https://archive.org/download/${transformedPath}`;
    baseData.translationHelp = [
      {
        target: "video_file_url",
        targetUrl: proxyMedia(downloadUrl, "mp4", this.mediaProxy),
      },
    ];

    return baseData;
  }

  async getVideoId(url: URL) {
    return (
      /(?:details|embed)\/(.+)/.exec(url.pathname)?.[1]?.replace(/\/$/, "") ||
      undefined
    );
  }
}

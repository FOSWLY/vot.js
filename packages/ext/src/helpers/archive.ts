import type { MinimalVideoData } from "../types/client";
import { BaseHelper } from "./base";

export default class ArchiveHelper extends BaseHelper {
  async getVideoId(url: URL) {
    const videoId = /(details|embed)\/(.+)/.exec(url.pathname)?.[2];
    if (!videoId) return undefined;

    return videoId.replace(/\/$/, "") || undefined;
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    if (!videoId) return undefined;

    const transformedPath = videoId
      .replace(/\+/g, "%20")
      .replace(/\.[^.]+$/, ".mp4");

    const downloadUrl = `https://archive.org/download/${transformedPath}`;

    const VideoData: MinimalVideoData & {
      video_url: string;
    } = {
      url: videoId,
      video_url: downloadUrl,
      translationHelp: [
        {
          target: "video_file_url",
          targetUrl: downloadUrl,
        },
      ],
    };

    return VideoData;
  }
}

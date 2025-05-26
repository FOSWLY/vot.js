import type { MinimalVideoData } from "../types/client";
import { BaseHelper } from "./base";

export default class NineGAGHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const data = this.returnBaseData(videoId);
    if (!data) {
      return data;
    }

    try {
      if (!this.video) {
        throw new Error("Video element not found");
      }

      const videoUrl = this.video.querySelector<HTMLSourceElement>(
        'source[type^="video/mp4"], source[type^="video/webm"]',
      )?.src;
      if (!videoUrl || !/^https?:\/\//.test(videoUrl)) {
        throw new Error("Video source not found");
      }

      return {
        ...data,
        translationHelp: [
          {
            target: "video_file_url",
            targetUrl: videoUrl,
          },
        ],
      };
    } catch {
      return data;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /gag\/([^/]+)/.exec(url.pathname)?.[1];
  }
}

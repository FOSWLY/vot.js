import { MinimalVideoData } from "../types/client";
import { BaseHelper, VideoHelperError } from "./base";
import Logger from "@vot.js/shared/utils/logger";

export default class BitviewHelper extends BaseHelper {
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      const res = await this.fetch(this.service?.url + videoId);
      const content = await res.text();
      const videoUrl = /src:\s?"([^"]+\.mp4)"/.exec(content)?.[1];
      if (!videoUrl) {
        throw new VideoHelperError("Failed to find video URL");
      }

      return {
        url: videoUrl,
      };
    } catch (err) {
      Logger.error(
        `Failed to get Bitview data by videoId: ${videoId}`,
        (err as Error).message,
      );
      return undefined;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return url.searchParams.get("v") as string | undefined;
  }
}

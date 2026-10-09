import Logger from "@vot.js/shared/utils/logger";
import type { MinimalVideoData } from "../types/client";
import { BaseHelper, VideoHelperError } from "./base";
import { getVideoSrc } from "../utils/dom";

export default class PreserveTubeHelper extends BaseHelper {
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      const videoEl =
        document.querySelector<HTMLVideoElement>("#video-player") ?? this.video;
      const videoUrl = getVideoSrc(videoEl);
      if (
        !videoUrl ||
        videoUrl.startsWith("blob:") ||
        (!videoUrl.includes(".mp4") && !videoUrl.includes(".webm"))
      ) {
        throw new VideoHelperError("Failed to find PreserveTube video url");
      }

      return {
        url: videoUrl,
      };
    } catch (err) {
      Logger.error(
        `Failed to get PreserveTube data by videoId: ${videoId}`,
        (err as Error).message,
      );
      return undefined;
    }
  }

  async getVideoId(url: URL) {
    return url.searchParams.get("v") ?? undefined;
  }
}

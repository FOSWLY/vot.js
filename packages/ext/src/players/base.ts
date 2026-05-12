import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import type { MinimalVideoData } from "../types/client";

export interface BasePlayer {
  getPlayer(): unknown | undefined;
  getVideoData(
    videoId: string,
  ): Promise<MinimalVideoData | undefined> | MinimalVideoData | undefined;
  getSubtitles?(): VideoDataSubtitle[];
}

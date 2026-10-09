import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import type { MinimalVideoData } from "../types/client";
import type { BasePlayer } from "./base";
import {
  buildVideoData,
  buildSubtitles,
  findMediaElement,
  getFiniteDuration,
  getMediaElementSources,
  getTrackElements,
  selectSourceUrl,
} from "./utils";

/**
 * Fluid Player (https://www.fluidplayer.com/)
 *
 * Fluid Player keeps original `<source>`/`<track>` elements inside the wrapped video
 */
export default class FluidPlayerHelper implements BasePlayer {
  SUBTITLE_SOURCE = "fluidplayer";
  static SELECTOR = ".fluid_video_wrapper";

  getPlayer(): HTMLMediaElement | undefined {
    return findMediaElement(document, ".fluid_video_wrapper video");
  }

  getVideoData(videoId: string): MinimalVideoData | undefined {
    try {
      const media = this.getPlayer();
      if (!media) {
        throw new Error("Fluid Player not found");
      }

      const fileUrl = selectSourceUrl(getMediaElementSources(media));
      return buildVideoData(
        videoId,
        fileUrl,
        getFiniteDuration(media.duration),
        this.getSubtitles(),
      );
    } catch (err) {
      console.error("[VOT] FluidPlayerHelper error:", (err as Error).message);
      return undefined;
    }
  }

  getSubtitles(): VideoDataSubtitle[] {
    return buildSubtitles(getTrackElements(this.getPlayer()), this.SUBTITLE_SOURCE);
  }
}

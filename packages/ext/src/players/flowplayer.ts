import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import type { MinimalVideoData } from "../types/client";
import type { BasePlayer } from "./base";
import {
  buildSubtitles,
  buildVideoData,
  findMediaElement,
  getFiniteDuration,
  getMediaElementSources,
  getTrackElements,
  selectSourceUrl,
} from "./utils";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flowplayer: any;
}

/**
 * Flowplayer (https://flowplayer.com/)
 */
export default class FlowplayerHelper implements BasePlayer {
  SUBTITLE_SOURCE = "flowplayer";
  static SELECTOR = ".flowplayer";

  getPlayer() {
    return typeof flowplayer === "undefined" ? undefined : flowplayer;
  }

  getMediaElement() {
    return findMediaElement(document, ".flowplayer video, video.fp-engine");
  }

  getVideoData(videoId: string): MinimalVideoData | undefined {
    try {
      const media = this.getMediaElement();
      if (!this.getPlayer() || !media) {
        throw new Error("Flowplayer not found");
      }

      return buildVideoData(
        videoId,
        selectSourceUrl(getMediaElementSources(media)),
        getFiniteDuration(media.duration),
        this.getSubtitles(),
      );
    } catch (err) {
      console.error("[VOT] FlowplayerHelper error:", (err as Error).message);
      return undefined;
    }
  }

  getSubtitles(): VideoDataSubtitle[] {
    return buildSubtitles(
      getTrackElements(this.getMediaElement()),
      this.SUBTITLE_SOURCE,
    );
  }
}

import type { MinimalVideoData } from "../types/client";
import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import type { BasePlayer } from "./base";
import { extractDOMSubtitles } from "./utils";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flowplayer: any;
}

export default class FlowplayerHelper implements BasePlayer {
  SUBTITLE_SOURCE = "flowplayer";
  SUBTITLE_FORMAT: VideoDataSubtitle["format"] = "vtt";

  getPlayer() {
    if (typeof flowplayer === "undefined") return undefined;
    return flowplayer;
  }

  getVideoData(): MinimalVideoData | undefined {
    try {
      const player = this.getPlayer();
      if (!player) {
        throw new Error("Flowplayer not found on page");
      }

      const videoEl = document.querySelector<HTMLVideoElement>(
        ".flowplayer video, video.fp-engine",
      );
      if (!videoEl) {
        throw new Error("Flowplayer video element not found");
      }

      const url = videoEl.src || videoEl.currentSrc;
      if (!url) {
        throw new Error("Failed to find video url");
      }

      return {
        url,
        duration: videoEl.duration,
        subtitles: this.getSubtitles(),
      };
    } catch (err) {
      console.error(
        "[VOT] FlowplayerHelper error:",
        err instanceof Error ? err.message : String(err),
      );
      return undefined;
    }
  }

  getSubtitles(): VideoDataSubtitle[] {
    const videoEl = document.querySelector<HTMLVideoElement>(
      ".flowplayer video, video.fp-engine",
    );
    return extractDOMSubtitles(
      videoEl,
      this.SUBTITLE_SOURCE,
      this.SUBTITLE_FORMAT,
    );
  }
}

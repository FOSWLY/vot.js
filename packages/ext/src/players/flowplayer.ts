import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import Logger from "@vot.js/shared/utils/logger";

import type { MinimalVideoData } from "../types/client";
import type { BasePlayer } from "./base";
import type * as Flowplayer from "../types/helpers/flowplayer";
import { getVideoSrc } from "../utils/dom";

declare global {
  const flowplayer: () => Flowplayer.Player;
}

export default class FlowplayerHelper implements BasePlayer {
  SUBTITLE_SOURCE = "flowplayer";
  SUBTITLE_FORMAT: VideoDataSubtitle["format"] = "vtt";

  private getPlayerExports() {
    if (typeof flowplayer === "undefined") {
      return undefined;
    }

    return flowplayer;
  }

  getPlayer() {
    return this.getPlayerExports()?.call(undefined);
  }

  getVideoDataByPlayer(): MinimalVideoData | undefined {
    const player = this.getPlayer();
    const videoData = player?.video;
    if (!videoData) {
      return undefined;
    }

    return {
      url: videoData.src,
      duration: videoData.duration,
      subtitles: this.getSubtitles(),
    };
  }

  getVideoDataByVideoEl(): MinimalVideoData | undefined {
    const videoEl = document.querySelector<HTMLVideoElement>(
      ".flowplayer video, video.fp-engine",
    );
    if (!videoEl) {
      throw new Error("Flowplayer video element not found");
    }

    const url = getVideoSrc(videoEl);
    if (!url) {
      throw new Error("Failed to find video url");
    }

    return {
      url,
      duration: videoEl.duration,
      subtitles: this.getSubtitles(),
    };
  }

  getVideoData(): MinimalVideoData | undefined {
    try {
      return this.getVideoDataByPlayer() ?? this.getVideoDataByVideoEl();
    } catch (err) {
      Logger.error(
        "[VOT] FlowplayerHelper error:",
        err instanceof Error ? err.message : String(err),
      );
      return undefined;
    }
  }

  getSubtitles(): VideoDataSubtitle[] {
    return [];
  }
}

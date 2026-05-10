import type { MinimalVideoData } from "../types/client";
import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import type { BasePlayer } from "./base";
import { normalizeLang } from "@vot.js/shared/utils/utils";
import { extractDOMSubtitles } from "./utils";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Playerjs: any;
}

export default class PlayerJSHelper implements BasePlayer {
  SUBTITLE_SOURCE = "playerjs";
  SUBTITLE_FORMAT: VideoDataSubtitle["format"] = "vtt";

  getPlayer() {
    if (typeof Playerjs !== "undefined") {
      return Playerjs;
    }
    return undefined;
  }

  getVideoData(): MinimalVideoData | undefined {
    try {
      const videoEl = document.querySelector<HTMLVideoElement>("video");
      if (!videoEl) {
        throw new Error("Video element not found");
      }

      const url = videoEl.src || videoEl.currentSrc;
      if (!url) {
        throw new Error("No video url found");
      }

      return {
        url,
        duration: videoEl.duration,
        subtitles: this.getSubtitles(),
      };
    } catch (err) {
      console.error(
        "[VOT] PlayerJSHelper error:",
        err instanceof Error ? err.message : String(err),
      );
      return undefined;
    }
  }

  getSubtitles(): VideoDataSubtitle[] {
    const subtitles: VideoDataSubtitle[] = [];
    try {
      const player = this.getPlayer();
      // PlayerJS API: player.api("subtitles") returns list of subtitle objects
      if (player && typeof player.api === "function") {
        const subs = player.api("subtitles");
        if (Array.isArray(subs)) {
          for (const sub of subs) {
            // PlayerJS sub format: { title, url } or similar
            if (sub?.url) {
              subtitles.push({
                source: this.SUBTITLE_SOURCE,
                format: this.SUBTITLE_FORMAT,
                language: normalizeLang(sub.title || sub.lang || "en"),
                url: new URL(sub.url, window.location.href).toString(),
              });
            }
          }
        }
      }
    } catch (err) {
      console.error("[VOT] PlayerJSHelper getSubtitles error:", err);
    }

    if (subtitles.length === 0) {
      const videoEl = document.querySelector<HTMLVideoElement>("video");
      subtitles.push(
        ...extractDOMSubtitles(
          videoEl,
          this.SUBTITLE_SOURCE,
          this.SUBTITLE_FORMAT,
        ),
      );
    }

    return subtitles;
  }
}

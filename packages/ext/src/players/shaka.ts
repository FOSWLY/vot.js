import type { MinimalVideoData } from "../types/client";
import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import type { BasePlayer } from "./base";
import { extractDOMSubtitles } from "./utils";
import { normalizeLang } from "@vot.js/shared/utils/utils";

export default class ShakaPlayerHelper implements BasePlayer {
  SUBTITLE_SOURCE = "shakaplayer";
  SUBTITLE_FORMAT: VideoDataSubtitle["format"] = "vtt";

  getPlayer(): any | undefined {
    // Custom logic to fetch Shaka player instance if exposed on window
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
        "[VOT] ShakaPlayerHelper error:",
        err instanceof Error ? err.message : String(err),
      );
      return undefined;
    }
  }

  getSubtitles(): VideoDataSubtitle[] {
    const subtitles: VideoDataSubtitle[] = [];
    try {
      const player = this.getPlayer();
      if (player && player.getTextTracks) {
        const textTracks = player.getTextTracks() || [];
        for (const track of textTracks) {
          // Shaka exposes originalUris, but it could be null or empty depending on manifest type
          if (track.type === "text" && Array.isArray(track.originalUris) && track.originalUris.length > 0) {
            subtitles.push({
              source: this.SUBTITLE_SOURCE,
              format: this.SUBTITLE_FORMAT,
              language: normalizeLang(track.language || "en"),
              url: new URL(track.originalUris[0], window.location.href).toString(),
            });
          }
        }
      }
    } catch (err) {
      console.error("[VOT] ShakaPlayerHelper getSubtitles error:", err);
    }

    if (subtitles.length === 0) {
      const videoEl = document.querySelector<HTMLVideoElement>("video");
      subtitles.push(...extractDOMSubtitles(videoEl, this.SUBTITLE_SOURCE, this.SUBTITLE_FORMAT));
    }

    return subtitles;
  }
}


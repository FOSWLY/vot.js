import type { MinimalVideoData } from "../types/client";
import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import type { BasePlayer } from "./base";
import { normalizeLang } from "@vot.js/shared/utils/utils";
import { extractDOMSubtitles } from "./utils";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jwplayer: () => any;
}

interface JWPlayerSource {
  type: string;
  file: string;
  height?: number;
  width?: number;
  label?: string;
  bitrate?: number;
  default?: boolean;
  mimeType?: string;
}

interface JWPlayerTrack {
  file?: string;
  kind?: string;
  label?: string;
  default?: boolean;
}

interface JWPlayerPlaylistItem {
  mediaid?: string;
  duration?: number;
  allSources?: JWPlayerSource[];
  tracks?: JWPlayerTrack[];
}

export default class JWPlayerHelper implements BasePlayer {
  SUBTITLE_SOURCE = "jwplayer";
  SUBTITLE_FORMAT: VideoDataSubtitle["format"] = "vtt";

  getPlayer() {
    if (typeof jwplayer === "undefined") {
      return undefined;
    }
    return jwplayer();
  }

  getVideoData(videoId: string): MinimalVideoData | undefined {
    try {
      const player = this.getPlayer();
      if (!player || typeof player.getDuration !== "function") {
        throw new Error("JW Player instance not ready");
      }

      const item = player.getPlaylistItem
        ? (player.getPlaylistItem() as JWPlayerPlaylistItem | null)
        : null;

      if (!item) {
        throw new Error("No playlist item found");
      }

      const duration = player.getDuration
        ? player.getDuration()
        : (item.duration ?? 0);

      const sources = item.allSources ?? [];
      const validSources = sources.filter(
        (s) => typeof s.height === "number" && s.height > 0,
      );

      if (validSources.length === 0) {
        throw new Error("No sources with height > 0 found");
      }

      validSources.sort((a, b) => (a.height ?? 0) - (b.height ?? 0));
      const lowestQuality = validSources[0];

      return {
        url: videoId,
        duration,
        translationHelp: [
          { target: "video_file_url", targetUrl: lowestQuality.file },
        ],
        subtitles: this.getSubtitles(),
      };
    } catch (err) {
      console.error(
        "[VOT] JWPlayerHelper error:",
        err instanceof Error ? err.message : String(err),
      );
      return undefined;
    }
  }

  getSubtitles(): VideoDataSubtitle[] {
    const subtitles: VideoDataSubtitle[] = [];
    try {
      const player = this.getPlayer();
      if (player && player.getPlaylistItem) {
        const item = player.getPlaylistItem() as JWPlayerPlaylistItem | null;
        if (item?.tracks) {
          for (const track of item.tracks) {
            if (track.kind === "captions" || track.kind === "subtitles") {
              if (track.file) {
                subtitles.push({
                  source: this.SUBTITLE_SOURCE,
                  format: this.SUBTITLE_FORMAT,
                  language: normalizeLang(track.label || "en"),
                  url: new URL(track.file, window.location.href).toString(),
                });
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("[VOT] JWPlayerHelper getSubtitles error:", err);
    }

    if (subtitles.length === 0) {
      const videoEl = document.querySelector<HTMLVideoElement>(".jw-video");
      subtitles.push(...extractDOMSubtitles(videoEl, this.SUBTITLE_SOURCE, this.SUBTITLE_FORMAT));
    }

    return subtitles;
  }
}

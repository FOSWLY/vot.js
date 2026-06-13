import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import { normalizeLang } from "@vot.js/shared/utils/utils";
import type { MinimalVideoData } from "../types/client";
import type { BasePlayer } from "./base";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jwplayer: (id?: string | number | HTMLElement) => any;
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
  file?: string;
  sources?: JWPlayerSource[];
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

    const playerEl = document.querySelector(".jwplayer");
    if (playerEl?.id) {
      try {
        const player = jwplayer(playerEl.id);
        if (player && typeof player.getPlaylistItem === "function") {
          return player;
        }
      } catch (_e) {}
    }

    try {
      return jwplayer();
    } catch (_e) {
      return undefined;
    }
  }

  getVideoData(videoId: string): MinimalVideoData | undefined {
    try {
      const player = this.getPlayer();
      if (!player) {
        throw new Error("JW Player instance not ready or not found");
      }

      let item = player.getPlaylistItem
        ? (player.getPlaylistItem() as JWPlayerPlaylistItem | null)
        : null;

      if (!item && typeof player.getPlaylist === "function") {
        const playlist = player.getPlaylist();
        const index =
          typeof player.getPlaylistIndex === "function"
            ? player.getPlaylistIndex()
            : 0;
        if (Array.isArray(playlist) && playlist[index]) {
          item = playlist[index];
        }
      }

      if (!item) {
        throw new Error("No playlist item found");
      }

      let duration = 0;
      if (typeof player.getDuration === "function") {
        duration = player.getDuration();
      }
      if (
        (typeof duration !== "number" || duration <= 0) &&
        typeof item.duration === "number"
      ) {
        duration = item.duration;
      }

      const sources: JWPlayerSource[] = [];
      if (Array.isArray(item.allSources)) {
        sources.push(...item.allSources);
      }
      if (Array.isArray(item.sources)) {
        for (const s of item.sources) {
          if (
            s?.file &&
            !sources.some((existing) => existing.file === s.file)
          ) {
            sources.push(s);
          }
        }
      }

      const validSources = sources.filter(
        (s) => s && typeof s.file === "string" && s.file.length > 0,
      );

      if (validSources.length === 0) {
        if (typeof item.file === "string" && item.file.length > 0) {
          validSources.push({
            file: item.file,
            type: "",
            label: "default",
          });
        } else {
          throw new Error("No valid sources found");
        }
      }

      const getHeight = (s: JWPlayerSource): number => {
        if (typeof s.height === "number" && s.height > 0) {
          return s.height;
        }
        if (s.label) {
          const match = s.label.match(/^(\d+)/);
          if (match) {
            return parseInt(match[1], 10);
          }
        }
        return 0;
      };

      validSources.sort((a, b) => {
        const heightA = getHeight(a);
        const heightB = getHeight(b);
        if (heightA === 0 && heightB > 0) return 1;
        if (heightB === 0 && heightA > 0) return -1;
        return heightA - heightB;
      });

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
      if (!player) {
        return subtitles;
      }

      let item = player.getPlaylistItem
        ? (player.getPlaylistItem() as JWPlayerPlaylistItem | null)
        : null;
      if (!item && typeof player.getPlaylist === "function") {
        const playlist = player.getPlaylist();
        const index =
          typeof player.getPlaylistIndex === "function"
            ? player.getPlaylistIndex()
            : 0;
        if (Array.isArray(playlist) && playlist[index]) {
          item = playlist[index];
        }
      }

      const tracks = item?.tracks ?? [];
      const captionsList =
        typeof player.getCaptionsList === "function"
          ? player.getCaptionsList()
          : [];

      const seenUrls = new Set<string>();

      const addSubtitle = (label: string, file: string) => {
        if (!file) return;
        try {
          const absoluteUrl = new URL(file, window.location.href).toString();
          if (!seenUrls.has(absoluteUrl)) {
            seenUrls.add(absoluteUrl);
            subtitles.push({
              source: this.SUBTITLE_SOURCE,
              format: this.SUBTITLE_FORMAT,
              language: normalizeLang(label || "en"),
              url: absoluteUrl,
            });
          }
        } catch (_e) {}
      };

      if (Array.isArray(tracks)) {
        for (const track of tracks) {
          if (
            track &&
            (track.kind === "captions" || track.kind === "subtitles") &&
            track.file
          ) {
            addSubtitle(track.label || "en", track.file);
          }
        }
      }

      if (Array.isArray(captionsList)) {
        for (const track of captionsList) {
          if (track && typeof track === "object" && track.file) {
            addSubtitle(track.label || "en", track.file);
          }
        }
      }
    } catch (err) {
      console.error("[VOT] JWPlayerHelper getSubtitles error:", err);
    }

    return subtitles;
  }
}

import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import { normalizeLang } from "@vot.js/shared/utils/utils";
import type { MinimalVideoData } from "../types/client";
import type { BasePlayer } from "./base";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jwplayer: (id?: string | number | HTMLElement) => any;
}

interface JWPlayerSource {
  type?: string;
  file: string;
  height?: number;
  width?: number;
  label?: string;
  bitrate?: number;
  default?: boolean;
  mimeType?: string;
  drm?: Record<string, unknown>;
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
  drm?: Record<string, unknown>;
  tracks?: JWPlayerTrack[];
}

function isVideoFile(source: JWPlayerSource): boolean {
  const mimeType = source.mimeType || source.type;
  const type =
    typeof mimeType === "string"
      ? mimeType.toLowerCase().split(";")[0].trim()
      : "";
  return (
    type === "mp4" ||
    type === "video/mp4" ||
    type === "webm" ||
    type === "video/webm" ||
    /\.(?:mp4|webm)$/i.test(new URL(source.file).pathname)
  );
}

export default class JWPlayerHelper implements BasePlayer {
  SUBTITLE_SOURCE = "jwplayer";
  SUBTITLE_FORMAT: VideoDataSubtitle["format"] = "vtt";

  getHeight(source: JWPlayerSource): number {
    if (
      typeof source.height === "number" &&
      Number.isFinite(source.height) &&
      source.height > 0
    ) {
      return source.height;
    }
    const label = typeof source.label === "string" ? source.label : "";
    const match =
      label.match(/\d+\s*x\s*(\d+)/i) ??
      label.match(/(\d+)p\b/i) ??
      label.match(/^(\d+)/);
    return match ? Number.parseInt(match[1], 10) : 0;
  }

  getPlayer() {
    if (typeof jwplayer !== "function") {
      return undefined;
    }

    const playerEl = document.querySelector(".jwplayer");
    if (playerEl?.id) {
      try {
        const player = jwplayer(playerEl.id);
        if (
          player &&
          (typeof player.getPlaylistItem === "function" ||
            typeof player.getPlaylist === "function")
        ) {
          return player;
        }
      } catch {}
    }

    try {
      const player = jwplayer();
      return player &&
        (typeof player.getPlaylistItem === "function" ||
          typeof player.getPlaylist === "function")
        ? player
        : undefined;
    } catch {
      return undefined;
    }
  }

  getVideoData(videoId: string): MinimalVideoData | undefined {
    try {
      const player = this.getPlayer();
      if (!player) {
        throw new Error("JW Player instance not ready or not found");
      }

      let item =
        typeof player.getPlaylistItem === "function"
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
      if (item.drm && Object.keys(item.drm).length > 0) {
        throw new Error("DRM-protected playlist item");
      }

      let duration = 0;
      if (typeof player.getDuration === "function") {
        duration = player.getDuration();
      }
      if (
        (!Number.isFinite(duration) || duration <= 0) &&
        typeof item.duration === "number"
      ) {
        duration = item.duration;
      }
      if (!Number.isFinite(duration) || duration <= 0) {
        duration = 0;
      }

      const sources: JWPlayerSource[] = [
        ...(Array.isArray(item.allSources) ? item.allSources : []),
        ...(Array.isArray(item.sources) ? item.sources : []),
        ...(typeof item.file === "string" ? [{ file: item.file }] : []),
      ];
      const seenUrls = new Set<string>();
      const protectedUrls = new Set<string>();
      let validSources: JWPlayerSource[] = [];
      for (const source of sources) {
        if (!source || typeof source.file !== "string" || !source.file.trim()) {
          continue;
        }
        try {
          const url = new URL(source.file, window.location.href);
          if (source.drm && Object.keys(source.drm).length > 0) {
            protectedUrls.add(url.href);
            continue;
          }
          if (
            (url.protocol !== "http:" && url.protocol !== "https:") ||
            seenUrls.has(url.href)
          ) {
            continue;
          }
          seenUrls.add(url.href);
          validSources.push({ ...source, file: url.href });
        } catch {}
      }

      validSources = validSources.filter(
        (source) => !protectedUrls.has(source.file),
      );
      if (validSources.length === 0) {
        throw new Error("No valid sources found");
      }

      validSources.sort((a, b) => {
        const filePreference = Number(isVideoFile(b)) - Number(isVideoFile(a));
        if (filePreference) return filePreference;
        const heightA = this.getHeight(a);
        const heightB = this.getHeight(b);
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
    } catch {
      console.error("[VOT] JWPlayerHelper error: Failed to read player data");
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

      let item =
        typeof player.getPlaylistItem === "function"
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
        } catch {}
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
    } catch {
      console.error(
        "[VOT] JWPlayerHelper getSubtitles error: Failed to read tracks",
      );
    }

    return subtitles;
  }
}

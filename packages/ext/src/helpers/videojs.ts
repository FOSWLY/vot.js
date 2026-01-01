import type * as VideoJS from "../types/helpers/videojs";
import { BaseHelper } from "./base";

import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import Logger from "@vot.js/shared/utils/logger";
import { normalizeLang } from "@vot.js/shared/utils/utils";

/**
 * Shared class for all videojs players
 */
export default class VideoJSHelper extends BaseHelper {
  SUBTITLE_SOURCE = "videojs";
  SUBTITLE_FORMAT = "vtt";

  static getPlayer<T extends VideoJS.PlayerOptions = VideoJS.PlayerOptions>() {
    const vjs = (window as any).videojs;

    const techEl = document.querySelector<HTMLVideoElement>(
      "video.vjs-tech[id], video[id$='_html5_api']",
    );

    const derivedPlayerId =
      techEl?.id && techEl.id.endsWith("_html5_api")
        ? techEl.id.slice(0, -"_html5_api".length)
        : undefined;

    if (vjs?.getPlayer) {
      if (derivedPlayerId) {
        const p = vjs.getPlayer(derivedPlayerId);
        if (p) return p as VideoJS.Player<T>;
      }

      if (techEl) {
        const p = vjs.getPlayer(techEl);
        if (p) return p as VideoJS.Player<T>;
      }
    }

    const players: Record<string, unknown> =
      (typeof vjs?.getPlayers === "function" ? vjs.getPlayers() : vjs?.players) ??
      {};

    for (const p of Object.values(players)) {
      const player = p as any;
      const el = player?.el?.();
      const innerVideo: HTMLVideoElement | null =
        el?.querySelector?.("video.vjs-tech, video") ?? null;

      if (innerVideo && techEl && innerVideo === techEl) {
        return player as VideoJS.Player<T>;
      }
      if (derivedPlayerId && player?.id?.() === derivedPlayerId) {
        return player as VideoJS.Player<T>;
      }
    }

    return undefined;
  }

  getVideoDataByPlayer(videoId: string) {
    try {
      const player = VideoJSHelper.getPlayer();

const techEl = document.querySelector<HTMLVideoElement>(
  "video.vjs-tech, video[id$='_html5_api'], video[src]",
);

if (!player && !techEl) {
  throw new Error(`Video player/video element not found, videoId ${videoId}`);
}

// duration
const duration =
  (player && typeof (player as any).duration === "function"
    ? (player as any).duration()
    : undefined) ?? techEl?.duration;

// url
let url: string | undefined;
if (player) {
  const sources =
    typeof (player as any).currentSources === "function"
      ? (player as any).currentSources()
      : (player as any).getCache?.()?.sources;

  const videoUrl = Array.isArray(sources)
    ? sources.find(
        (source: any) =>
          source?.type === "video/mp4" || source?.type === "video/webm" || source?.src,
      )
    : undefined;

  url = videoUrl?.src;
}

url ??= techEl?.currentSrc || techEl?.src || techEl?.getAttribute?.("src") || undefined;

if (!url) {
  throw new Error(`Failed to find video url for videoID ${videoId}`);
}

const trackEls = techEl
  ? Array.from(techEl.querySelectorAll<HTMLTrackElement>("track[src]"))
  : [];

const subtitles: VideoDataSubtitle[] = trackEls
  .filter((t) => t.kind !== "metadata" && !!t.getAttribute("src"))
  .map((t) => {
    const src = t.getAttribute("src")!;
    const absUrl = new URL(src, window.location.href).toString();
    return {
      language: normalizeLang(t.srclang || ""),
      source: this.SUBTITLE_SOURCE,
      format: this.SUBTITLE_FORMAT,
      url: absUrl,
    } as VideoDataSubtitle;
  });

      return {
        url,
        duration,
        subtitles,
      };
    } catch (err) {
      Logger.error("Failed to get videojs video data", (err as Error).message);
      return undefined;
    }
  }
}

import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import Logger from "@vot.js/shared/utils/logger";
import { normalizeLang } from "@vot.js/shared/utils/utils";
import { BaseHelper } from "../helpers/base";
import type * as VideoJS from "../types/helpers/videojs";
import { querySelectorDeep } from "../utils/dom";

type VideoJSImport = {
  getPlayer?: (idOrEl: string | Element) => unknown;
  getPlayers?: () => Record<string, unknown>;
  players?: Record<string, unknown>;
};

type VideoJSWindow = Window & {
  videojs?: VideoJSImport;
};

type PlayerCandidate = {
  el?: () => Element | null;
  id?: () => string;
};

type SourceLike = {
  src?: string | null;
  type?: string | null;
};

function isPreferredMedia(source: SourceLike) {
  const type = source.type?.toLowerCase().split(";")[0].trim();
  if (type === "video/mp4" || type === "video/webm") {
    return true;
  }

  const path = source.src?.split(/[?#]/)[0].toLowerCase();
  return Boolean(path?.endsWith(".mp4") || path?.endsWith(".webm"));
}

function selectVideoUrl(candidates: SourceLike[]): string | undefined {
  const available = candidates.filter(
    (source): source is SourceLike & { src: string } => Boolean(source.src),
  );

  return (available.find(isPreferredMedia) ?? available[0])?.src;
}

/**
 * Shared class for all videojs players
 */
export default class VideoJSHelper extends BaseHelper {
  SUBTITLE_SOURCE = "videojs";
  SUBTITLE_FORMAT: VideoDataSubtitle["format"] = "vtt";
  static VIDEOJS_SELECTOR =
    "video.vjs-tech, video[id$='_html5_api'], video[src], video";

  static getTechEl(isShadowRoot = false) {
    return isShadowRoot
      ? querySelectorDeep<HTMLVideoElement>(VideoJSHelper.VIDEOJS_SELECTOR)
      : document.querySelector<HTMLVideoElement>(
          VideoJSHelper.VIDEOJS_SELECTOR,
        );
  }

  static getPlayer<T extends VideoJS.PlayerOptions = VideoJS.PlayerOptions>(
    isShadowRoot = false,
  ): VideoJS.Player<T> | undefined {
    const vjs = (window as VideoJSWindow).videojs;
    const techEl = VideoJSHelper.getTechEl(isShadowRoot);

    const derivedPlayerId = techEl?.id?.endsWith("_html5_api")
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
      (typeof vjs?.getPlayers === "function"
        ? vjs.getPlayers()
        : vjs?.players) ?? {};

    for (const p of Object.values(players)) {
      const player = p as PlayerCandidate;
      const el = typeof player.el === "function" ? player.el() : null;
      const innerVideo: HTMLVideoElement | null =
        el?.querySelector?.("video.vjs-tech, video") ?? null;

      if (innerVideo && techEl && innerVideo === techEl) {
        return p as VideoJS.Player<T>;
      }
      if (
        derivedPlayerId &&
        typeof player.id === "function" &&
        player.id() === derivedPlayerId
      ) {
        return p as VideoJS.Player<T>;
      }
    }

    return undefined;
  }

  getVideoDataByPlayer(videoId: string, isShadowRoot = false) {
    try {
      const player = VideoJSHelper.getPlayer(isShadowRoot);
      const techEl = VideoJSHelper.getTechEl(isShadowRoot);
      if (!player && !techEl) {
        throw new Error(
          `Video player/video element not found, videoId ${videoId}`,
        );
      }

      const duration = player?.duration?.() ?? techEl?.duration;

      const candidates: SourceLike[] = [];
      if (player) {
        const sources =
          typeof player.currentSources === "function"
            ? player.currentSources()
            : player.getCache?.()?.sources;

        if (Array.isArray(sources)) {
          candidates.push(...sources);
        }
      }

      if (techEl) {
        candidates.push(
          { src: techEl.currentSrc },
          { src: techEl.src },
          ...Array.from(
            techEl.querySelectorAll<HTMLSourceElement>("source"),
          ).map((source) => ({
            src: source.src,
            type: source.getAttribute("type"),
          })),
          { src: techEl.getAttribute?.("src") },
        );
      }

      const url = selectVideoUrl(candidates);
      if (!url) {
        throw new Error(`Failed to find video url for videoID ${videoId}`);
      }

      return {
        url,
        duration,
        subtitles: this.getSubtitles(),
      };
    } catch (err) {
      Logger.error("Failed to get videojs video data", (err as Error).message);
      return undefined;
    }
  }

  getSubtitles(): VideoDataSubtitle[] {
    const techEl = VideoJSHelper.getTechEl();
    const trackEls = techEl
      ? Array.from(techEl.querySelectorAll<HTMLTrackElement>("track[src]"))
      : [];

    return trackEls
      .filter((t) => t.kind !== "metadata")
      .flatMap((t) => {
        const src = t.getAttribute("src");
        if (!src) {
          return [];
        }

        const absUrl = new URL(src, window.location.href).toString();
        return [
          {
            language: normalizeLang(t.srclang || ""),
            source: this.SUBTITLE_SOURCE,
            format: this.SUBTITLE_FORMAT,
            url: absUrl,
          } satisfies VideoDataSubtitle,
        ];
      });
  }
}

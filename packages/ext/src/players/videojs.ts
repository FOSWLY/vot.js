import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import Logger from "@vot.js/shared/utils/logger";
import { normalizeLang } from "@vot.js/shared/utils/utils";
import { BaseHelper } from "../helpers/base";
import type * as VideoJS from "../types/helpers/videojs";

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

/**
 * Shared class for all videojs players
 */
export default class VideoJSHelper extends BaseHelper {
  SUBTITLE_SOURCE = "videojs";
  SUBTITLE_FORMAT: VideoDataSubtitle["format"] = "vtt";

  static getPlayer<T extends VideoJS.PlayerOptions = VideoJS.PlayerOptions>() {
    const vjs = (window as VideoJSWindow).videojs;

    const techEl = document.querySelector<HTMLVideoElement>(
      "video.vjs-tech[id], video[id$='_html5_api']",
    );

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

  getVideoDataByPlayer(videoId: string) {
    try {
      const player = VideoJSHelper.getPlayer();

      const techEl = document.querySelector<HTMLVideoElement>(
        "video.vjs-tech, video[id$='_html5_api'], video[src]",
      );

      if (!player && !techEl) {
        throw new Error(
          `Video player/video element not found, videoId ${videoId}`,
        );
      }

      // duration
      const duration = player?.duration?.() ?? techEl?.duration;

      // url
      let url: string | undefined;
      if (player) {
        const sources =
          typeof player.currentSources === "function"
            ? player.currentSources()
            : player.getCache?.()?.sources;

        const videoUrl = Array.isArray(sources)
          ? sources.find(
              (source) =>
                source?.type === "video/mp4" ||
                source?.type === "video/webm" ||
                source?.src,
            )
          : undefined;

        url = videoUrl?.src;
      }

      url ??=
        techEl?.currentSrc ||
        techEl?.src ||
        techEl?.getAttribute?.("src") ||
        undefined;

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
    const techEl = document.querySelector<HTMLVideoElement>(
      "video.vjs-tech, video[id$='_html5_api'], video[src]",
    );

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

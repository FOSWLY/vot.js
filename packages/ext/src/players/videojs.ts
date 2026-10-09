import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import Logger from "@vot.js/shared/utils/logger";
import { BaseHelper } from "../helpers/base";
import type * as VideoJS from "../types/helpers/videojs";
import { querySelectorDeep } from "../utils/dom";
import {
  buildSubtitles,
  getFiniteDuration,
  getMediaElementSources,
  getTrackElements,
  safeCall,
  selectSourceUrl,
} from "./utils";

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

      const playerSources = safeCall(
        () => player?.currentSources?.() ?? player?.getCache?.()?.sources,
      );
      const url = selectSourceUrl([
        ...(Array.isArray(playerSources) ? playerSources : []),
        ...getMediaElementSources(techEl),
      ]);
      if (!url) {
        throw new Error(`Failed to find video url for videoID ${videoId}`);
      }

      return {
        url,
        duration: getFiniteDuration(
          safeCall(() => player?.duration?.()),
          techEl?.duration,
        ),
        subtitles: this.getSubtitles(isShadowRoot),
      };
    } catch (err) {
      Logger.error("Failed to get videojs video data", (err as Error).message);
      return undefined;
    }
  }

  /**
   * Text tracks can be passed as <track> elements or as player options
   * (emulated text tracks aren't added to the tech element)
   */
  getSubtitles(isShadowRoot = false): VideoDataSubtitle[] {
    const player = safeCall(() => VideoJSHelper.getPlayer(isShadowRoot));
    return buildSubtitles(
      [
        ...getTrackElements(VideoJSHelper.getTechEl(isShadowRoot)),
        ...(player?.options_?.tracks ?? []).map((track) => ({
          src: track?.src,
          lang: track?.srclang,
          kind: track?.kind,
        })),
      ],
      this.SUBTITLE_SOURCE,
    );
  }
}

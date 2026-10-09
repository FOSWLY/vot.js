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
  type PlayerTrackSource,
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
    // Prefer a Video.js tech element over an unrelated video earlier in the DOM.
    for (const selector of [
      "video.vjs-tech, video[id$='_html5_api']",
      "video[src], video",
    ]) {
      const video = isShadowRoot
        ? querySelectorDeep<HTMLVideoElement>(selector)
        : document.querySelector<HTMLVideoElement>(selector);
      if (video) return video;
    }
    return null;
  }

  static getPlayer<T extends VideoJS.PlayerOptions = VideoJS.PlayerOptions>(
    isShadowRoot = false,
  ): VideoJS.Player<T> | undefined {
    const vjs = (window as VideoJSWindow).videojs;
    const techEl = VideoJSHelper.getTechEl(isShadowRoot);

    // Bundled players may not expose window.videojs, but keep the instance on
    // their element. Reading it never creates a second player instance.
    const localPlayer = safeCall(
      () =>
        techEl?.closest<VideoJS.PlayerElement<T>>(".video-js, video-js")
          ?.player,
    );
    if (
      localPlayer &&
      !localPlayer.isDisposed_ &&
      (typeof localPlayer.currentSources === "function" ||
        typeof localPlayer.getCache === "function")
    ) {
      return localPlayer;
    }

    const derivedPlayerId = techEl?.id?.endsWith("_html5_api")
      ? techEl.id.slice(0, -"_html5_api".length)
      : undefined;

    if (vjs?.getPlayer) {
      if (derivedPlayerId) {
        const p = safeCall(() => vjs.getPlayer?.(derivedPlayerId));
        if (p && !(p as VideoJS.Player<T>).isDisposed_)
          return p as VideoJS.Player<T>;
      }

      if (techEl) {
        const p = safeCall(() => vjs.getPlayer?.(techEl));
        if (p && !(p as VideoJS.Player<T>).isDisposed_)
          return p as VideoJS.Player<T>;
      }
    }

    const players: Record<string, unknown> =
      safeCall(() =>
        typeof vjs?.getPlayers === "function" ? vjs.getPlayers() : vjs?.players,
      ) ?? {};

    for (const p of Object.values(players)) {
      if (!p || (p as VideoJS.Player<T>).isDisposed_) continue;
      const player = p as PlayerCandidate;
      const el = safeCall(() =>
        typeof player.el === "function" ? player.el() : null,
      );
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

      const currentSources = safeCall(() => player?.currentSources?.());
      const playerSources = currentSources?.length
        ? currentSources
        : safeCall(() => player?.getCache?.()?.sources);
      const currentSource = safeCall(() => player?.currentSource?.());
      const url = selectSourceUrl([
        ...(Array.isArray(playerSources) ? playerSources : []),
        ...(currentSource ? [currentSource] : []),
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
    const runtimeTracks: PlayerTrackSource[] = [
      ...Array.from(safeCall(() => player?.remoteTextTracks?.()) ?? []),
      ...Array.from(safeCall(() => player?.textTracks?.()) ?? []),
    ].map((track) => ({
      src: track.src,
      lang: track.language,
      kind: track.kind,
    }));
    const remoteElements = Array.from(
      safeCall(() => player?.remoteTextTrackEls?.()) ?? [],
    ).map((track) => ({
      src: track.src,
      lang: track.srclang || track.track?.language,
      kind: track.kind,
    }));
    return buildSubtitles(
      [
        ...getTrackElements(VideoJSHelper.getTechEl(isShadowRoot)),
        ...remoteElements,
        ...runtimeTracks,
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

import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import type { MinimalVideoData } from "../types/client";
import type { BasePlayer } from "./base";
import {
  buildSubtitles,
  buildVideoData,
  getFiniteDuration,
  safeCall,
  selectSourceUrl,
} from "./utils";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jwplayer: (id?: string | number | HTMLElement) => any;
}

interface JWPlayerSource {
  file?: string;
  type?: string;
  height?: number;
  label?: string;
  drm?: unknown;
  keySystems?: unknown;
  key_systems?: unknown;
}

interface JWPlayerTrack {
  file?: string;
  kind?: string;
  label?: string;
  language?: string;
  srclang?: string;
}

export interface JWPlayerPlaylistItem {
  mediaid?: string;
  title?: string;
  duration?: number;
  file?: string;
  sources?: JWPlayerSource[];
  allSources?: JWPlayerSource[];
  tracks?: JWPlayerTrack[];
}

/**
 * JW Player (https://jwplayer.com/)
 */
export default class JWPlayerHelper implements BasePlayer {
  SUBTITLE_SOURCE = "jwplayer";
  static SELECTOR = ".jwplayer, div[aria-label='Video Player']";

  getPlayer() {
    if (typeof jwplayer === "undefined") {
      return undefined;
    }

    // jwplayer() without an id returns a stub (without API methods) if setup wasn't called
    const queries = Array.from(
      document.querySelectorAll<HTMLElement>(JWPlayerHelper.SELECTOR),
    ).map((element) => element.id || element);
    for (const query of [...queries, undefined]) {
      const player = safeCall(() => jwplayer(query));
      if (
        typeof player?.getPlaylistItem === "function" ||
        typeof player?.getPlaylist === "function"
      ) {
        return player;
      }
    }

    return undefined;
  }

  getPlaylistItem(player = this.getPlayer()): JWPlayerPlaylistItem | undefined {
    return (
      safeCall(() => player?.getPlaylistItem()) ??
      safeCall(
        () =>
          player?.getPlaylist?.()?.[
            safeCall(() => player.getPlaylistIndex?.()) ?? 0
          ],
      ) ??
      undefined
    );
  }

  getVideoData(videoId: string): MinimalVideoData | undefined {
    try {
      const player = this.getPlayer();
      const item = this.getPlaylistItem(player);
      if (!item) {
        throw new Error("JW Player playlist item not found");
      }

      return this.getVideoDataByPlaylistItem(
        videoId,
        item,
        safeCall(() => player.getDuration?.()),
        this.getSubtitles(),
      );
    } catch (err) {
      console.error("[VOT] JWPlayerHelper error:", (err as Error).message);
      return undefined;
    }
  }

  /** Also accepts the JW playlist JSON returned by public site APIs. */
  getVideoDataByPlaylistItem(
    pageUrl: string,
    item: JWPlayerPlaylistItem,
    duration?: unknown,
    subtitles = buildSubtitles(
      (item.tracks ?? []).map(({ file, label, language, srclang, kind }) => ({
        src: file,
        lang: srclang ?? language ?? label,
        kind,
      })),
      this.SUBTITLE_SOURCE,
    ),
  ): MinimalVideoData {
    const sources = [
      ...(item.allSources ?? []),
      ...(item.sources ?? []),
      { file: item.file },
    ];
    return {
      ...buildVideoData(
        pageUrl,
        selectSourceUrl(
          sources.map(
            ({ file, type, height, label, drm, keySystems, key_systems }) => ({
              src: file,
              type,
              height,
              label,
              drm,
              keySystems,
              key_systems,
            }),
          ),
        ),
        getFiniteDuration(duration, item.duration),
        subtitles,
      ),
      title: item.title,
    };
  }

  getSubtitles(): VideoDataSubtitle[] {
    const player = this.getPlayer();
    const captions = safeCall(() => player?.getCaptionsList?.());
    const tracks: JWPlayerTrack[] = [
      ...(this.getPlaylistItem(player)?.tracks ?? []),
      ...(Array.isArray(captions) ? captions : []),
    ];

    return buildSubtitles(
      tracks.map(({ file, label, language, srclang, kind }) => ({
        src: file,
        lang: srclang ?? language ?? label,
        kind,
      })),
      this.SUBTITLE_SOURCE,
    );
  }
}

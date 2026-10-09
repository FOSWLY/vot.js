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
}

interface JWPlayerTrack {
  file?: string;
  kind?: string;
  label?: string;
}

interface JWPlayerPlaylistItem {
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
  static SELECTOR = ".jwplayer";

  getPlayer() {
    if (typeof jwplayer === "undefined") {
      return undefined;
    }

    // jwplayer() without an id returns a stub (without API methods) if setup wasn't called
    const id = document.querySelector(JWPlayerHelper.SELECTOR)?.id;
    for (const query of id ? [id, undefined] : [undefined]) {
      const player = safeCall(() => jwplayer(query));
      if (typeof player?.getPlaylistItem === "function") {
        return player;
      }
    }

    return undefined;
  }

  getPlaylistItem(player = this.getPlayer()): JWPlayerPlaylistItem | undefined {
    return (
      safeCall(() => player?.getPlaylistItem()) ??
      safeCall(() => player?.getPlaylist?.()?.[player.getPlaylistIndex?.() ?? 0]) ??
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

      const sources = [
        ...(item.allSources ?? []),
        ...(item.sources ?? []),
        { file: item.file },
      ];
      return buildVideoData(
        videoId,
        selectSourceUrl(
          sources.map(({ file, type, height, label }) => ({
            src: file,
            type,
            height,
            label,
          })),
        ),
        getFiniteDuration(safeCall(() => player.getDuration?.()), item.duration),
        this.getSubtitles(),
      );
    } catch (err) {
      console.error("[VOT] JWPlayerHelper error:", (err as Error).message);
      return undefined;
    }
  }

  getSubtitles(): VideoDataSubtitle[] {
    const player = this.getPlayer();
    const captions = safeCall(() => player?.getCaptionsList?.());
    const tracks: JWPlayerTrack[] = [
      ...(this.getPlaylistItem(player)?.tracks ?? []),
      ...(Array.isArray(captions) ? captions : []),
    ];

    return buildSubtitles(
      tracks.map(({ file, label, kind }) => ({ src: file, lang: label, kind })),
      this.SUBTITLE_SOURCE,
    );
  }
}

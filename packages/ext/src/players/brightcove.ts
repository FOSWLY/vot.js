import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import type { MinimalVideoData } from "../types/client";
import type { BasePlayer } from "./base";
import VideoJSHelper from "./videojs";
import {
  buildVideoData,
  buildSubtitles,
  getFiniteDuration,
  type PlayerMediaSource,
  safeCall,
  selectSourceUrl,
} from "./utils";

type BrightcoveTrack = {
  src?: string;
  srclang?: string;
  language?: string;
  kind?: string;
  sources?: { src?: string }[];
};

type BrightcoveMediaInfo = {
  id?: string;
  name?: string;
  duration?: number;
  sources?: (PlayerMediaSource & { container?: string })[];
  // Brightcove exposes camelCase in current players and snake_case in older ones.
  textTracks?: BrightcoveTrack[];
  text_tracks?: BrightcoveTrack[];
};

type BrightcovePlayer = {
  mediainfo?: BrightcoveMediaInfo;
  duration?: () => number;
  currentSources?: () => PlayerMediaSource[];
};

/**
 * Brightcove Player (video.js based, https://players.brightcove.net/)
 */
export default class BrightcovePlayerHelper implements BasePlayer {
  SUBTITLE_SOURCE = "brightcove";
  static SELECTOR =
    ".video-js[data-account], video-js[data-account], .bc-player-default_default";

  getPlayer(): BrightcovePlayer | undefined {
    const player = safeCall(
      () => VideoJSHelper.getPlayer() as BrightcovePlayer | undefined,
    );
    return player?.mediainfo ? player : undefined;
  }

  getVideoData(videoId: string): MinimalVideoData | undefined {
    try {
      const player = this.getPlayer();
      const mediainfo = player?.mediainfo;
      if (!mediainfo) {
        throw new Error("Brightcove player mediainfo not found");
      }

      const fileUrl = selectSourceUrl([
        ...(mediainfo.sources ?? []).map(
          ({
            src,
            type,
            container,
            height,
            label,
            drm,
            keySystems,
            key_systems,
          }) => ({
            src,
            type: type ?? (container === "MP4" ? "video/mp4" : undefined),
            height,
            label,
            drm,
            keySystems,
            key_systems,
          }),
        ),
        ...(safeCall(() => player.currentSources?.()) ?? []),
      ]);
      return {
        ...buildVideoData(
          videoId,
          fileUrl,
          getFiniteDuration(
            mediainfo.duration,
            safeCall(() => player.duration?.()),
          ),
          this.getSubtitles(),
        ),
        title: mediainfo.name,
      };
    } catch (err) {
      console.error(
        "[VOT] BrightcovePlayerHelper error:",
        (err as Error).message,
      );
      return undefined;
    }
  }

  getSubtitles(): VideoDataSubtitle[] {
    const info = this.getPlayer()?.mediainfo;
    const tracks = [...(info?.textTracks ?? []), ...(info?.text_tracks ?? [])];
    return buildSubtitles(
      tracks.flatMap((t) =>
        [t.src, ...(t.sources ?? []).map((s) => s.src)].map((src) => ({
          src,
          lang: t.srclang ?? t.language,
          kind: t.kind,
        })),
      ),
      this.SUBTITLE_SOURCE,
    );
  }
}

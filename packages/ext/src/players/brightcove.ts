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

type BrightcoveMediaInfo = {
  id?: string;
  name?: string;
  duration?: number;
  sources?: (PlayerMediaSource & { container?: string })[];
  text_tracks?: {
    src?: string;
    srclang?: string;
    kind?: string;
    sources?: { src?: string }[];
  }[];
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
  static SELECTOR = ".video-js[data-account], video-js[data-account], .bc-player-default_default";

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
        ...(mediainfo.sources ?? []).map((s) => ({
          ...s,
          type: s.type ?? (s.container === "MP4" ? "video/mp4" : undefined),
        })),
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
      console.error("[VOT] BrightcovePlayerHelper error:", (err as Error).message);
      return undefined;
    }
  }

  getSubtitles(): VideoDataSubtitle[] {
    const tracks = this.getPlayer()?.mediainfo?.text_tracks ?? [];
    return buildSubtitles(
      tracks.map((t) => ({
        src: t.src ?? t.sources?.[0]?.src,
        lang: t.srclang,
        kind: t.kind,
      })),
      this.SUBTITLE_SOURCE,
    );
  }
}

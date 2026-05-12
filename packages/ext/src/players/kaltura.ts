import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import { normalizeLang } from "@vot.js/shared/utils/utils";
import type { MinimalVideoData } from "../types/client";
import type { BasePlayer } from "./base";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const KalturaPlayer: any;
}

export default class KalturaPlayerHelper implements BasePlayer {
  SUBTITLE_SOURCE = "kaltura";
  SUBTITLE_FORMAT: VideoDataSubtitle["format"] = "vtt";

  getPlayer() {
    if (typeof KalturaPlayer === "undefined") {
      return undefined;
    }
    const players = KalturaPlayer.getPlayers();
    if (players && Object.keys(players).length > 0) {
      return players[Object.keys(players)[0]];
    }
    return undefined;
  }

  getVideoData(): MinimalVideoData | undefined {
    try {
      const player = this.getPlayer();
      if (!player) {
        throw new Error("Kaltura Player not found on page");
      }

      const duration = player.duration ?? undefined;

      // Extract url
      const _sources =
        player.sources?.poster ||
        player.sources?.hls ||
        player.sources?.dash ||
        [];
      let url: string | undefined;

      // Look for a direct mp4 or m3u8 source URL on the player object if available
      // Kaltura v7 might expose the loaded source differently
      if (player.provider?.env?.src) {
        url = player.provider.env.src;
      }

      const videoEl = document.querySelector<HTMLVideoElement>(
        ".kaltura-player-container video, video",
      );

      url ??=
        videoEl?.currentSrc ||
        videoEl?.src ||
        videoEl?.getAttribute("src") ||
        undefined;

      if (!url) {
        throw new Error("Failed to find video url");
      }

      return {
        url,
        duration,
        subtitles: this.getSubtitles(),
      };
    } catch (err) {
      console.error(
        "[VOT] KalturaPlayerHelper error:",
        err instanceof Error ? err.message : String(err),
      );
      return undefined;
    }
  }

  getSubtitles(): VideoDataSubtitle[] {
    const subtitles: VideoDataSubtitle[] = [];
    try {
      const player = this.getPlayer();
      if (player?.Track && player.getTracks) {
        const textTracks = player.getTracks(player.Track.TEXT) || [];
        for (const track of textTracks) {
          // Track API doesn't always expose URL. If it does:
          if (track.url) {
            subtitles.push({
              source: this.SUBTITLE_SOURCE,
              format: this.SUBTITLE_FORMAT,
              language: normalizeLang(track.language || ""),
              url: new URL(track.url, window.location.href).toString(),
            });
          }
        }
      }
    } catch (err) {
      console.error("[VOT] KalturaPlayerHelper getSubtitles error:", err);
    }

    return subtitles;
  }
}

import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import { normalizeLang } from "@vot.js/shared/utils/utils";
import type { MinimalVideoData } from "../types/client";
import type { BasePlayer } from "./base";

export default class PlyrHelper implements BasePlayer {
  SUBTITLE_SOURCE = "plyr";
  SUBTITLE_FORMAT: VideoDataSubtitle["format"] = "vtt";

  getPlayer() {
    const customWindow = window as any;
    if (customWindow.player?.media) {
      return customWindow.player;
    }

    const videoEl = document.querySelector<any>("video, audio, .plyr video");
    return videoEl?.plyr || undefined;
  }

  getVideoData(videoId: string): MinimalVideoData | undefined {
    try {
      const player = this.getPlayer();
      const videoEl = document.querySelector<HTMLVideoElement>(
        "video, audio, .plyr video",
      );

      if (!player && !videoEl) {
        throw new Error("Plyr player or media element not found");
      }

      const duration = player?.duration ?? videoEl?.duration ?? 0;

      const fileUrl =
        player?.source ||
        videoEl?.currentSrc ||
        videoEl?.src ||
        videoEl?.querySelector("source")?.getAttribute("src");

      if (!fileUrl) {
        throw new Error("Failed to find video url");
      }

      return {
        url: videoId,
        duration,
        translationHelp: [{ target: "video_file_url", targetUrl: fileUrl }],
      };
    } catch (err) {
      console.error(
        "[VOT] PlyrHelper error:",
        err instanceof Error ? err.message : String(err),
      );
      return undefined;
    }
  }

  getSubtitles(): VideoDataSubtitle[] {
    const subtitles: VideoDataSubtitle[] = [];
    try {
      const player = this.getPlayer();
      const videoEl = document.querySelector<HTMLVideoElement>(
        "video, audio, .plyr video",
      );

      const rawTracks: Array<{ src: string; lang: string }> = [];

      const searchTargets: Element[] = [];
      if (videoEl) searchTargets.push(videoEl);
      if (player?.elements?.container) {
        searchTargets.push(player.elements.container as Element);
      }

      for (const target of searchTargets) {
        const tracks = Array.from(
          target.querySelectorAll("track[src]"),
        ) as HTMLTrackElement[];

        for (const track of tracks) {
          const src = track.getAttribute("src");
          if (src && track.kind !== "metadata") {
            rawTracks.push({ src, lang: track.srclang || "" });
          }
        }
      }

      if (player?.config?.tracks && Array.isArray(player.config.tracks)) {
        const configTracks = player.config.tracks as any[];
        for (const track of configTracks) {
          if (track?.src && track.kind !== "metadata") {
            rawTracks.push({
              src: track.src,
              lang: track.srclang || track.lang || "",
            });
          }
        }
      }

      const seenUrls = new Set<string>();
      for (const { src, lang } of rawTracks) {
        try {
          const absUrl = new URL(src, window.location.href).toString();
          if (!seenUrls.has(absUrl)) {
            seenUrls.add(absUrl);
            subtitles.push({
              source: this.SUBTITLE_SOURCE,
              format: this.SUBTITLE_FORMAT,
              language: normalizeLang(lang),
              url: absUrl,
            });
          }
        } catch {}
      }
    } catch (err) {
      console.error("[VOT] PlyrHelper getSubtitles error:", err);
    }

    return subtitles;
  }
}

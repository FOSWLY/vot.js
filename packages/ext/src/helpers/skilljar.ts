import type { MinimalVideoData } from "../types/client";
import { BaseHelper } from "./base";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jwplayer: () => any;
}

interface JWPlayerSource {
  type: string;
  file: string;
  height?: number;
  width?: number;
  label?: string;
  bitrate?: number;
  default?: boolean;
  mimeType?: string;
}

interface JWPlayerPlaylistItem {
  mediaid?: string;
  duration?: number;
  allSources?: JWPlayerSource[];
}

export default class SkilljarHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL): Promise<string | undefined> {
    return url.pathname.slice(1);
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      if (typeof jwplayer === "undefined") {
        throw new Error("JW Player not found on page");
      }
      const player = jwplayer();
      if (!player || typeof player.getDuration !== "function") {
        throw new Error("JW Player instance not ready");
      }
      const item = player.getPlaylistItem
        ? (player.getPlaylistItem() as JWPlayerPlaylistItem | null)
        : null;
      if (!item) {
        throw new Error("No playlist item found");
      }
      const duration = player.getDuration
        ? player.getDuration()
        : (item.duration ?? 0);

      const sources = item.allSources ?? [];

      const validSources = sources.filter(
        (s) => typeof s.height === "number" && s.height > 0,
      );

      if (validSources.length === 0) {
        throw new Error("No sources with height > 0 found");
      }

      validSources.sort((a, b) => (a.height ?? 0) - (b.height ?? 0));
      const lowestQuality = validSources[0];

      return {
        url: videoId,
        duration,
        translationHelp: [
          { target: "video_file_url", targetUrl: lowestQuality.file },
        ],
        subtitles: [],
      };
    } catch (err) {
      console.error(
        "[VOT] SkilljarHelper error:",
        err instanceof Error ? err.message : String(err),
      );
      return undefined;
    }
  }
}

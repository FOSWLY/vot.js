import type { MinimalVideoData } from "../types/client";
import HivePlayerHelper from "../players/hive";
import {
  buildVideoData,
  getFiniteDuration,
  selectSourceUrl,
  type PlayerMediaSource,
} from "../players/utils";
import { BaseHelper } from "./base";

/** Public clip metadata only; no Watch/ESPN+ authentication. */
export default class ESPNHelper extends BaseHelper {
  private hivePlayer = new HivePlayerHelper();

  async getVideoId(url: URL): Promise<string | undefined> {
    const pathId =
      /^\/video\/(?:clip|iframe\/twitter)\/_\/id\/(\d+)(?:\/[^/]+)?\/?$/.exec(
        url.pathname,
      )?.[1] ?? /^\/[^/]+\/video\/(\d+)(?:\/[^/]+)?\/?$/.exec(url.pathname)?.[1];
    if (pathId) return pathId;
    if (!/^\/video\/(?:clip|iframe\/twitter)\/?$/.test(url.pathname))
      return undefined;
    const id = url.searchParams.get("id");
    return id && /^\d+$/.test(id) ? id : undefined;
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const pageUrl = new URL(window.location.href);
    pageUrl.hash = "";
    return (
      (await this.getApiVideoData(videoId)) ??
      this.hivePlayer.getVideoData(pageUrl.href)
    );
  }

  private async getApiVideoData(
    videoId: string,
  ): Promise<MinimalVideoData | undefined> {
    if (!/^\d+$/.test(videoId)) return undefined;
    try {
      const response = await this.fetch(
        `https://api-app.espn.com/v1/video/clips/${videoId}`,
      );
      if (!response.ok) return undefined;
      const data = (await response.json()) as {
        videos?: {
          id?: number | string;
          headline?: string;
          duration?: unknown;
          links?: { source?: unknown; mobile?: unknown };
        }[];
      };
      const clip = data.videos?.find((item) => String(item.id) === videoId);
      if (!clip) return undefined;
      const sources: PlayerMediaSource[] = [];
      const collect = (
        value: unknown,
        depth = 0,
        protectedSource = false,
      ): void => {
        if (depth > 12) return;
        if (typeof value === "string") {
          // Skip auth endpoints, artwork, SMIL and legacy F4M; no URL guessing.
          if (/\.(?:mp4|webm|m3u8|mpd)(?:$|[?#])/i.test(value))
            sources.push({
              src: value,
              drm: protectedSource,
              height: Number(/(\d{3,4})p\d*_/.exec(value)?.[1]) || undefined,
            });
        } else if (value && typeof value === "object") {
          const record = value as Record<string, unknown>;
          const protectedChild =
            protectedSource ||
            [record.drm, record.keySystems, record.key_systems].some(
              (marker) =>
                Boolean(marker) &&
                (typeof marker !== "object" ||
                  Object.keys(marker as object).length > 0),
            );
          for (const [key, child] of Object.entries(record))
            if (key !== "alert") collect(child, depth + 1, protectedChild);
        }
      };
      collect(clip.links?.source);
      collect(clip.links?.mobile);
      return {
        ...buildVideoData(
          new URL(window.location.href).toString(),
          selectSourceUrl(sources),
          getFiniteDuration(clip.duration),
          [],
        ),
        title: clip.headline,
      };
    } catch {
      return undefined;
    }
  }
}

import config from "@vot.js/shared/config";
import Logger from "@vot.js/shared/utils/logger";

import type { MinimalVideoData } from "../types/client";
import { BaseHelper } from "./base";

export default class JOIDatabaseHelper extends BaseHelper {
  API_ORIGIN = "https://www.the-joi-database.com/";

  async sumPlaylistDuration(
    playlistUrl: string,
    depth = 0,
  ): Promise<number | undefined> {
    const res = await this.fetch(playlistUrl, {
      headers: {
        "User-Agent": config.userAgent,
        Referer: "https://www.the-joi-database.com/",
      },
    });
    const body = await res.text();
    if (!body.startsWith("#EXTM3U")) {
      return undefined;
    }

    // master playlist -> первый вариант, длительность считаем в нём
    if (body.includes("#EXT-X-STREAM-INF") && depth < 1) {
      const variantUrl = body
        .split("\n")
        .map((line) => line.trim())
        .find((line) => line && !line.startsWith("#"));
      if (!variantUrl) {
        return undefined;
      }

      return this.sumPlaylistDuration(
        new URL(variantUrl, playlistUrl).href,
        depth + 1,
      );
    }

    let duration = 0;
    for (const match of body.matchAll(/#EXTINF:([\d.]+)/g)) {
      duration += Number.parseFloat(match[1]);
    }

    return duration > 0 ? duration : undefined;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/(?:watch|embed)\/([0-9a-f]+)\/?$/.exec(url.pathname)?.[1];
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const baseData = this.returnBaseData(videoId);
    if (!baseData) {
      return undefined;
    }

    const result: MinimalVideoData = { ...baseData };

    try {
      result.duration = await this.sumPlaylistDuration(
        `${this.API_ORIGIN}api/stream/${videoId}`,
      );
    } catch (err) {
      Logger.error(
        `Failed to get joidatabase playlist duration by videoId: ${videoId}`,
        (err as Error).message,
      );
    }

    if (!this.extraInfo) {
      return result;
    }

    try {
      const res = await this.fetch(`${this.API_ORIGIN}watch/${videoId}`, {
        headers: {
          "User-Agent": config.userAgent,
          Referer: this.API_ORIGIN,
        },
      });
      const html = await res.text();
      const title =
        /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/.exec(
          html,
        )?.[1];
      if (title) {
        result.title = title;
      }
    } catch (err) {
      Logger.error(
        `Failed to get joidatabase title by videoId: ${videoId}`,
        (err as Error).message,
      );
    }

    return result;
  }
}

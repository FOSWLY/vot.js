import type { MinimalVideoData } from "../types/client";
import type { BasePlayer } from "./base";
import {
  buildVideoData,
  getFiniteDuration,
  isMediaElement,
  safeCall,
  toAbsoluteUrl,
} from "./utils";

type VideoObjectMeta = {
  "@type"?: string | string[];
  contentUrl?: string;
  duration?: string;
};

/**
 * ESPN Hive player (https://www.espn.com) renders a plain
 * `<video id="hivePlayer*">` element fed by the BAMTech playback service
 * through MSE, so the media element only exposes a blob URL. The direct
 * progressive MP4 is published in the page JSON-LD `VideoObject.contentUrl`.
 */
export default class HivePlayerHelper implements BasePlayer {
  SUBTITLE_SOURCE = "hive";
  static SELECTOR = "video[id^='hivePlayer']";

  getPlayer(): HTMLVideoElement | undefined {
    const video = document.querySelector<HTMLVideoElement>(
      HivePlayerHelper.SELECTOR,
    );
    return isMediaElement(video) ? video : undefined;
  }

  findVideoObject(): VideoObjectMeta | undefined {
    const scripts = document.querySelectorAll<HTMLScriptElement>(
      'script[type="application/ld+json"]',
    );
    for (const script of scripts) {
      const data = safeCall(() => JSON.parse(script.textContent ?? "")) as
        | VideoObjectMeta
        | VideoObjectMeta[]
        | undefined;
      const items = Array.isArray(data) ? data : [data];
      const object = items.find(
        (item) =>
          item?.contentUrl &&
          (!item["@type"] || [item["@type"]].flat().includes("VideoObject")),
      );
      if (object) return object;
    }
    return undefined;
  }

  getVideoData(_videoId: string): MinimalVideoData | undefined {
    const video = this.getPlayer();
    const object = this.findVideoObject();
    if (!video && !object) return undefined;
    return buildVideoData(
      _videoId,
      toAbsoluteUrl(object?.contentUrl),
      getFiniteDuration(video?.duration, parseIsoDuration(object?.duration)),
      [],
    );
  }
}

/** Parse an ISO 8601 duration (`PT1M17S`) into seconds. */
function parseIsoDuration(value?: string): number | undefined {
  if (!value) return undefined;
  const match =
    /^P(?:\d+D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/i.exec(value);
  if (!match) return undefined;
  const [, hours, minutes, seconds] = match;
  const total =
    Number(hours ?? 0) * 3600 +
    Number(minutes ?? 0) * 60 +
    Number(seconds ?? 0);
  return total > 0 ? total : undefined;
}

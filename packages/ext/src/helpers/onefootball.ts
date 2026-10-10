import { JWPlatformSiteHelper } from "./jwplatformSite";
import type { BaseHelperOpts } from "@vot.js/core/types/helpers/base";
import type { ServiceConf } from "../types/service";

const jwMediaIdRe =
  /^https?:\/\/cdn\.jwplayer\.com\/(?:videos|manifests|previews)\/([A-Za-z0-9]{8})(?:-[A-Za-z0-9]+)?\.(?:mp4|m3u8)/;
const jwPosterRe = /cdn\.jwplayer\.com\/v2\/media\/([A-Za-z0-9]{8})\//;

function collectJwMediaId(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  return (jwMediaIdRe.exec(value) ?? jwPosterRe.exec(value))?.[1];
}

export default class OneFootballHelper extends JWPlatformSiteHelper {
  constructor(opts?: BaseHelperOpts<ServiceConf>) {
    super(opts);
    this.player.SUBTITLE_SOURCE = "onefootball";
  }

  async getVideoId(url: URL): Promise<string | undefined> {
    return /^\/[a-z]{2}\/video\/[^/]+-(\d+)\/?$/.exec(url.pathname)?.[1];
  }

  /** The CMS video ID and the JW media ID are different. */
  protected getMediaId(_videoId: string): string | undefined {
    const ids = new Set<string>();

    // The JSON-LD VideoObject points at the canonical JW media file.
    for (const node of document.querySelectorAll<HTMLScriptElement>(
      'script[type="application/ld+json"]',
    )) {
      try {
        const data = JSON.parse(node.textContent ?? "null");
        const graph = Array.isArray(data?.["@graph"]) ? data["@graph"] : [data];
        for (const entry of graph) {
          const mediaId = collectJwMediaId(entry?.contentUrl);
          if (mediaId) ids.add(mediaId);
        }
      } catch {
        /* An unready/invalid JSON-LD is not a video. */
      }
    }

    // Fall back to the current video sources inside the player container.
    const container = document.querySelector('div[aria-label="Video Player"]');
    for (const media of container?.querySelectorAll<HTMLVideoElement>(
      "video",
    ) ?? []) {
      const mediaId = collectJwMediaId(
        media.currentSrc || media.getAttribute("src"),
      );
      if (mediaId) ids.add(mediaId);
    }
    for (const poster of container?.querySelectorAll<HTMLImageElement>(
      'img[src*="cdn.jwplayer.com/v2/media/"]',
    ) ?? []) {
      const mediaId = collectJwMediaId(poster.getAttribute("src"));
      if (mediaId) ids.add(mediaId);
    }

    // Do not guess among unrelated inline/recommendation videos.
    return ids.size === 1 ? ids.values().next().value : undefined;
  }
}

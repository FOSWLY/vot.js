import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import type { MinimalVideoData } from "../types/client";
import type { BasePlayer } from "./base";
import {
  buildVideoData,
  buildSubtitles,
  findMediaElement,
  getFiniteDuration,
  getMediaElementSources,
  getTrackElements,
  type PlayerMediaSource,
  safeCall,
  selectSourceUrl,
} from "./utils";

type VidstackSrc =
  | string
  | { src?: unknown; type?: string; height?: number }
  | VidstackSrc[];

type VidstackTextTrack = {
  src?: string;
  language?: string;
  kind?: string;
  type?: string;
};

type VidstackPlayerElement = HTMLElement & {
  src?: VidstackSrc;
  duration?: number;
  title?: string;
  state?: {
    source?: { src?: unknown; type?: string };
    sources?: VidstackSrc[];
    duration?: number;
    title?: string;
  };
  textTracks?: { toArray?: () => VidstackTextTrack[] };
};

function toSources(src: unknown): PlayerMediaSource[] {
  if (typeof src === "string") {
    return [{ src }];
  }

  if (Array.isArray(src)) {
    return src.flatMap(toSources);
  }

  if (src && typeof src === "object" && "src" in src) {
    const { src: url, type, height } = src as Exclude<VidstackSrc, string | VidstackSrc[]>;
    return typeof url === "string" ? [{ src: url, type, height }] : [];
  }

  return [];
}

/**
 * Vidstack Player (https://vidstack.io/) and its predecessor Vime (`vm-player`)
 */
export default class VidstackPlayerHelper implements BasePlayer {
  SUBTITLE_SOURCE = "vidstack";
  static SELECTOR = "media-player, vm-player";

  getPlayer(): VidstackPlayerElement | undefined {
    return (
      document.querySelector<VidstackPlayerElement>(
        VidstackPlayerHelper.SELECTOR,
      ) ?? undefined
    );
  }

  getVideoData(videoId: string): MinimalVideoData | undefined {
    try {
      const player = this.getPlayer();
      if (!player) {
        throw new Error("Vidstack player not found");
      }

      const media = findMediaElement(player);
      const fileUrl = selectSourceUrl([
        ...toSources(safeCall(() => player.state?.source)),
        ...toSources(safeCall(() => player.state?.sources)),
        ...toSources(safeCall(() => player.src)),
        ...toSources(player.getAttribute("src")),
        ...getMediaElementSources(media),
      ]);
      const title =
        safeCall(() => player.state?.title) || player.getAttribute("title");
      return {
        ...buildVideoData(
          videoId,
          fileUrl,
          getFiniteDuration(
            safeCall(() => player.state?.duration),
            safeCall(() => player.duration),
            media?.duration,
          ),
          this.getSubtitles(),
        ),
        ...(title ? { title } : {}),
      };
    } catch (err) {
      console.error("[VOT] VidstackPlayerHelper error:", (err as Error).message);
      return undefined;
    }
  }

  getSubtitles(): VideoDataSubtitle[] {
    const player = this.getPlayer();
    const textTracks = safeCall(() => player?.textTracks?.toArray?.()) ?? [];
    return buildSubtitles(
      [
        ...textTracks.map((t) => ({
          src: t.src,
          lang: t.language,
          kind: t.kind,
          format: t.type,
        })),
        ...getTrackElements(player),
      ],
      this.SUBTITLE_SOURCE,
    );
  }
}

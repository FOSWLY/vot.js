import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import type { MinimalVideoData } from "../types/client";
import type { BasePlayer } from "./base";
import {
  buildVideoData,
  buildSubtitles,
  findGlobalInstance,
  findMediaElement,
  getFiniteDuration,
  getMediaElementSources,
  getTrackElements,
  isMediaElement,
  type PlayerMediaSource,
  safeCall,
  selectSourceUrl,
} from "./utils";

type ClapprSource = string | { source?: string; mimeType?: string };

type ClapprPlayer = {
  options: {
    source?: ClapprSource;
    sources?: ClapprSource[];
    mimeType?: string;
    playback?: {
      externalTracks?: { src?: string; lang?: string; kind?: string }[];
    };
  };
  core?: { activePlayback?: { el?: unknown } };
  getDuration?: () => number;
};

function isClapprPlayer(value: unknown): value is ClapprPlayer {
  const player = value as Partial<ClapprPlayer>;
  return (
    typeof player.getDuration === "function" &&
    typeof player.core === "object" &&
    typeof player.options === "object" &&
    player.options !== null &&
    ("source" in player.options || "sources" in player.options)
  );
}

function toSource(source: ClapprSource, mimeType?: string): PlayerMediaSource {
  return typeof source === "string"
    ? { src: source, type: mimeType }
    : { src: source?.source, type: source?.mimeType ?? mimeType };
}

/**
 * Clappr (https://github.com/clappr/clappr)
 *
 * Clappr doesn't have an instance registry, so we search for the player in globals
 */
export default class ClapprPlayerHelper implements BasePlayer {
  SUBTITLE_SOURCE = "clappr";
  static SELECTOR = "[data-player]";

  getPlayer(): ClapprPlayer | undefined {
    return findGlobalInstance(isClapprPlayer, ["player", "clappr", "clapprPlayer"]);
  }

  getMediaElement(player = this.getPlayer()) {
    const el = player?.core?.activePlayback?.el;
    return isMediaElement(el)
      ? el
      : findMediaElement(document, "[data-player] video, [data-player] audio");
  }

  getVideoData(videoId: string): MinimalVideoData | undefined {
    try {
      const player = this.getPlayer();
      const media = this.getMediaElement(player);
      if (!player && !media) {
        throw new Error("Clappr player not found");
      }

      const { source, sources = [], mimeType } = player?.options ?? {};
      const fileUrl = selectSourceUrl([
        ...(source ? [toSource(source, mimeType)] : []),
        ...(Array.isArray(sources) ? sources : []).map((s) => toSource(s, mimeType)),
        ...getMediaElementSources(media),
      ]);
      return buildVideoData(
        videoId,
        fileUrl,
        getFiniteDuration(
          safeCall(() => player?.getDuration?.()),
          media?.duration,
        ),
        this.getSubtitles(),
      );
    } catch (err) {
      console.error("[VOT] ClapprPlayerHelper error:", (err as Error).message);
      return undefined;
    }
  }

  getSubtitles(): VideoDataSubtitle[] {
    const player = this.getPlayer();
    const tracks = player?.options?.playback?.externalTracks;
    return buildSubtitles(
      [
        ...(Array.isArray(tracks) ? tracks : []),
        ...getTrackElements(this.getMediaElement(player)),
      ],
      this.SUBTITLE_SOURCE,
    );
  }
}

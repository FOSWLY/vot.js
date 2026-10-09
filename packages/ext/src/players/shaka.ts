import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import type { MinimalVideoData } from "../types/client";
import type { BasePlayer } from "./base";
import {
  buildSubtitles,
  buildVideoData,
  findGlobalInstance,
  findMediaElement,
  getFiniteDuration,
  getMediaElementSources,
  getTrackElements,
  safeCall,
  selectSourceUrl,
} from "./utils";

type ShakaTextTrack = {
  language?: string;
  kind?: string;
  originalUris?: string[];
};

type ShakaPlayer = {
  getAssetUri?: () => string | null;
  getManifestUri?: () => string | null;
  getMediaElement?: () => HTMLMediaElement | null;
  getTextTracks: () => ShakaTextTrack[];
};

function isShakaPlayer(value: unknown): value is ShakaPlayer {
  const player = value as ShakaPlayer;
  return (
    typeof player.getTextTracks === "function" &&
    typeof (player.getAssetUri ?? player.getManifestUri) === "function"
  );
}

/**
 * Shaka Player (https://github.com/shaka-project/shaka-player)
 */
export default class ShakaPlayerHelper implements BasePlayer {
  SUBTITLE_SOURCE = "shakaplayer";

  getPlayer(): ShakaPlayer | undefined {
    // shaka doesn't keep an instance registry
    return findGlobalInstance(isShakaPlayer, ["player", "shakaPlayer"]);
  }

  getMediaElement(player = this.getPlayer()) {
    return (
      safeCall(() => player?.getMediaElement?.()) ??
      findMediaElement(document, "video")
    );
  }

  getVideoData(videoId: string): MinimalVideoData | undefined {
    try {
      const player = this.getPlayer();
      const media = this.getMediaElement(player);
      if (!media) {
        throw new Error("Video element not found");
      }

      return buildVideoData(
        videoId,
        selectSourceUrl([
          ...getMediaElementSources(media),
          {
            src: safeCall(
              () => player?.getAssetUri?.() ?? player?.getManifestUri?.(),
            ),
          },
        ]),
        getFiniteDuration(media.duration),
        this.getSubtitles(),
      );
    } catch (err) {
      console.error("[VOT] ShakaPlayerHelper error:", (err as Error).message);
      return undefined;
    }
  }

  getSubtitles(): VideoDataSubtitle[] {
    const player = this.getPlayer();
    const tracks = safeCall(() => player?.getTextTracks()) ?? [];
    return buildSubtitles(
      [
        // originalUris can be empty, depending on the manifest type
        ...tracks.map((track) => ({
          src: track.originalUris?.[0],
          lang: track.language,
          kind: track.kind,
        })),
        ...getTrackElements(this.getMediaElement(player)),
      ],
      this.SUBTITLE_SOURCE,
    );
  }
}

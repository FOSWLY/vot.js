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
  safeCall,
  selectSourceUrl,
} from "./utils";

type MediaElementTrack = {
  src?: string;
  srclang?: string;
  kind?: string;
};

type MediaElementPlayer = {
  id?: string;
  node?: HTMLMediaElement;
  domNode?: HTMLMediaElement;
  container?: HTMLElement;
  media?: {
    originalNode?: HTMLMediaElement;
    duration?: number;
    getSrc?: () => string;
  };
  tracks?: MediaElementTrack[];
  getSrc?: () => string;
  getDuration?: () => number;
};

type MediaElementWindow = Window & {
  mejs?: { players?: Record<string, MediaElementPlayer> };
};

/**
 * MediaElement.js (https://www.mediaelementjs.com/)
 */
export default class MediaElementPlayerHelper implements BasePlayer {
  SUBTITLE_SOURCE = "mediaelement";
  static SELECTOR = ".mejs__container, .mejs-container";

  getPlayer(): MediaElementPlayer | undefined {
    const players = Object.values(
      (window as MediaElementWindow).mejs?.players ?? {},
    );
    return (
      players.find((p) => p?.container?.isConnected ?? p?.node?.isConnected) ??
      players[0]
    );
  }

  getMediaElement(player = this.getPlayer()) {
    return (
      player?.node ??
      player?.domNode ??
      player?.media?.originalNode ??
      findMediaElement(
        document,
        ".mejs__container video, .mejs-container video, .mejs__container audio, .mejs-container audio",
      )
    );
  }

  getVideoData(videoId: string): MinimalVideoData | undefined {
    try {
      const player = this.getPlayer();
      const media = this.getMediaElement(player);
      if (!player && !media) {
        throw new Error("MediaElement.js player not found");
      }

      const fileUrl = selectSourceUrl([
        ...getMediaElementSources(media),
        { src: safeCall(() => player?.getSrc?.()) },
        { src: safeCall(() => player?.media?.getSrc?.()) },
      ]);
      return buildVideoData(
        videoId,
        fileUrl,
        getFiniteDuration(
          safeCall(() => player?.getDuration?.()),
          player?.media?.duration,
          media?.duration,
        ),
        this.getSubtitles(),
      );
    } catch (err) {
      console.error(
        "[VOT] MediaElementPlayerHelper error:",
        (err as Error).message,
      );
      return undefined;
    }
  }

  getSubtitles(): VideoDataSubtitle[] {
    const player = this.getPlayer();
    const tracks = Array.isArray(player?.tracks) ? player.tracks : [];
    return buildSubtitles(
      [
        ...getTrackElements(this.getMediaElement(player)),
        ...tracks.map((t) => ({ src: t.src, lang: t.srclang, kind: t.kind })),
      ],
      this.SUBTITLE_SOURCE,
    );
  }
}

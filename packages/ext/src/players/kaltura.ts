import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import type { MinimalVideoData } from "../types/client";
import type { BasePlayer } from "./base";
import {
  buildSubtitles,
  buildVideoData,
  findMediaElement,
  getFiniteDuration,
  getMediaElementSources,
  getTrackElements,
  safeCall,
  selectSourceUrl,
} from "./utils";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const KalturaPlayer: any;
}

type KalturaTrack = {
  url?: string;
  language?: string;
};

type KalturaPlayerInstance = {
  duration?: number;
  provider?: { env?: { src?: string } };
  Track?: { TEXT: string };
  getTracks?: (type: string) => KalturaTrack[];
};

/**
 * Kaltura Player v7 (https://github.com/kaltura/kaltura-player-js)
 */
export default class KalturaPlayerHelper implements BasePlayer {
  SUBTITLE_SOURCE = "kaltura";
  static SELECTOR = ".kaltura-player-container";

  getPlayer(): KalturaPlayerInstance | undefined {
    if (typeof KalturaPlayer === "undefined") {
      return undefined;
    }

    const players: Record<string, KalturaPlayerInstance> | undefined =
      safeCall(() => KalturaPlayer.getPlayers());
    return players ? Object.values(players)[0] : undefined;
  }

  getMediaElement() {
    return (
      findMediaElement(document, `${KalturaPlayerHelper.SELECTOR} video`) ??
      findMediaElement(document, "video")
    );
  }

  getVideoData(videoId: string): MinimalVideoData | undefined {
    try {
      const player = this.getPlayer();
      if (!player) {
        throw new Error("Kaltura Player not found");
      }

      const media = this.getMediaElement();
      return buildVideoData(
        videoId,
        selectSourceUrl([
          { src: player.provider?.env?.src },
          ...getMediaElementSources(media),
        ]),
        getFiniteDuration(player.duration, media?.duration),
        this.getSubtitles(),
      );
    } catch (err) {
      console.error("[VOT] KalturaPlayerHelper error:", (err as Error).message);
      return undefined;
    }
  }

  getSubtitles(): VideoDataSubtitle[] {
    const player = this.getPlayer();
    const textType = player?.Track?.TEXT;
    const tracks = textType
      ? safeCall(() => player?.getTracks?.(textType))
      : undefined;

    return buildSubtitles(
      [
        ...(Array.isArray(tracks) ? tracks : []).map(
          (track) => ({ src: track?.url, lang: track?.language }),
        ),
        ...getTrackElements(this.getMediaElement()),
      ],
      this.SUBTITLE_SOURCE,
    );
  }
}

import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import type { MinimalVideoData } from "../types/client";
import type * as Plyr from "../types/helpers/plyr";
import type { BasePlayer } from "./base";
import {
  buildSubtitles,
  buildVideoData,
  findMediaElement,
  getFiniteDuration,
  getMediaElementSources,
  getTrackElements,
  isMediaElement,
  safeCall,
  selectSourceUrl,
} from "./utils";

type PlyrWindow = Window & {
  player?: Plyr.Player;
};

/**
 * Plyr (https://plyr.io/)
 */
export default class PlyrHelper implements BasePlayer {
  SUBTITLE_SOURCE = "plyr";
  static SELECTOR = ".plyr";

  getPlayer(): Plyr.Player | undefined {
    const { player } = window as PlyrWindow;
    if (isMediaElement(player?.media)) {
      return player;
    }

    // Plyr stores its instance on the media element
    return (this.getMediaElement() as Plyr.PlayerElement | undefined)?.plyr;
  }

  getMediaElement(player?: Plyr.Player) {
    return (
      player?.media ??
      findMediaElement(document, ".plyr video, .plyr audio") ??
      findMediaElement(document)
    );
  }

  getVideoData(videoId: string): MinimalVideoData | undefined {
    try {
      const player = this.getPlayer();
      const media = this.getMediaElement(player);
      if (!player && !media) {
        throw new Error("Plyr player or media element not found");
      }

      return buildVideoData(
        videoId,
        selectSourceUrl([
          { src: safeCall(() => player?.source) },
          ...getMediaElementSources(media),
        ]),
        getFiniteDuration(player?.duration, media?.duration),
        this.getSubtitles(),
      );
    } catch (err) {
      console.error("[VOT] PlyrHelper error:", (err as Error).message);
      return undefined;
    }
  }

  getSubtitles(): VideoDataSubtitle[] {
    const player = this.getPlayer();
    return buildSubtitles(
      [
        ...getTrackElements(
          this.getMediaElement(player),
          player?.elements?.container,
        ),
        ...(player?.config?.tracks ?? []).map((track) => ({
          src: track?.src,
          lang: track?.srclang || track?.lang,
          kind: track?.kind,
        })),
      ],
      this.SUBTITLE_SOURCE,
    );
  }
}

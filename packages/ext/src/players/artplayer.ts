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
  isMediaElement,
  selectSourceUrl,
} from "./utils";

type ArtplayerSubtitle = {
  url?: string;
  type?: string;
  name?: string;
  lang?: string;
};

type ArtplayerInstance = {
  isDestroy?: boolean;
  url?: string;
  duration?: number;
  video?: HTMLVideoElement;
  template?: { $video?: HTMLVideoElement; $container?: HTMLElement };
  option?: {
    url?: string;
    type?: string;
    quality?: { url?: string; html?: string }[];
    subtitle?: ArtplayerSubtitle;
  };
};

type ArtplayerWindow = Window & {
  Artplayer?: { instances?: ArtplayerInstance[] };
};

/**
 * ArtPlayer (https://artplayer.org/)
 */
export default class ArtplayerHelper implements BasePlayer {
  SUBTITLE_SOURCE = "artplayer";
  static SELECTOR = ".art-video-player";

  getPlayer(): ArtplayerInstance | undefined {
    const instances = (window as ArtplayerWindow).Artplayer?.instances;
    if (!Array.isArray(instances)) {
      return undefined;
    }

    const alive = instances.filter((art) => art && !art.isDestroy);
    return alive.find((art) => this.getMediaElement(art)?.isConnected) ?? alive[0];
  }

  getMediaElement(player = this.getPlayer()) {
    const video = player?.video ?? player?.template?.$video;
    return isMediaElement(video)
      ? video
      : findMediaElement(document, ".art-video-player video");
  }

  getVideoData(videoId: string): MinimalVideoData | undefined {
    try {
      const player = this.getPlayer();
      const media = this.getMediaElement(player);
      if (!player && !media) {
        throw new Error("ArtPlayer not found");
      }

      const { option } = player ?? {};
      const fileUrl = selectSourceUrl([
        ...(option?.quality ?? []).map((q) => ({ src: q?.url, label: q?.html })),
        { src: option?.url, type: option?.type },
        { src: player?.url, type: option?.type },
        ...getMediaElementSources(media),
      ]);
      return buildVideoData(
        videoId,
        fileUrl,
        getFiniteDuration(player?.duration, media?.duration),
        this.getSubtitles(),
      );
    } catch (err) {
      console.error("[VOT] ArtplayerHelper error:", (err as Error).message);
      return undefined;
    }
  }

  getSubtitles(): VideoDataSubtitle[] {
    const player = this.getPlayer();
    const subtitle = player?.option?.subtitle;
    return buildSubtitles(
      [
        ...(subtitle?.url
          ? [{ src: subtitle.url, lang: subtitle.lang ?? "", format: subtitle.type }]
          : []),
        ...getTrackElements(this.getMediaElement(player)),
      ],
      this.SUBTITLE_SOURCE,
    );
  }
}

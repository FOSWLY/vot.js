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
  type PlayerTrackSource,
  selectSourceUrl,
} from "./utils";

type DPlayerSubtitleUrl = { url?: string; lang?: string; name?: string };

type DPlayerInstance = {
  video: HTMLVideoElement;
  container?: HTMLElement;
  quality?: { url?: string };
  options: {
    video?: {
      url?: string;
      type?: string;
      quality?: { name?: string; url?: string; type?: string }[];
    };
    subtitle?: { url?: string | DPlayerSubtitleUrl[]; type?: string };
  };
};

function isDPlayer(value: unknown): value is DPlayerInstance {
  const player = value as Partial<DPlayerInstance>;
  return (
    isMediaElement(player.video) &&
    typeof player.options?.video === "object" &&
    Boolean(player.container?.classList?.contains("dplayer"))
  );
}

/**
 * DPlayer (https://dplayer.diygod.dev/)
 *
 * DPlayer doesn't have an instance registry, so we search for the player in globals
 */
export default class DPlayerHelper implements BasePlayer {
  SUBTITLE_SOURCE = "dplayer";
  static SELECTOR = ".dplayer";

  getPlayer(): DPlayerInstance | undefined {
    return findGlobalInstance(isDPlayer, ["dp", "player", "dplayer"]);
  }

  getMediaElement(player = this.getPlayer()) {
    return player?.video ?? findMediaElement(document, ".dplayer video");
  }

  getVideoData(videoId: string): MinimalVideoData | undefined {
    try {
      const player = this.getPlayer();
      const media = this.getMediaElement(player);
      if (!player && !media) {
        throw new Error("DPlayer not found");
      }

      const video = player?.options?.video;
      const fileUrl = selectSourceUrl([
        ...(video?.quality ?? []).map((q) => ({
          src: q?.url,
          type: q?.type,
          label: q?.name,
        })),
        { src: video?.url, type: video?.type },
        { src: player?.quality?.url, type: video?.type },
        ...getMediaElementSources(media),
      ]);
      return buildVideoData(
        videoId,
        fileUrl,
        getFiniteDuration(media?.duration),
        this.getSubtitles(),
      );
    } catch (err) {
      console.error("[VOT] DPlayerHelper error:", (err as Error).message);
      return undefined;
    }
  }

  getSubtitles(): VideoDataSubtitle[] {
    const player = this.getPlayer();
    const subtitle = player?.options?.subtitle;
    const tracks: PlayerTrackSource[] = [];
    if (typeof subtitle?.url === "string") {
      tracks.push({
        src: subtitle.url,
        format: subtitle.type === "webvtt" ? "vtt" : subtitle.type,
      });
    } else if (Array.isArray(subtitle?.url)) {
      tracks.push(...subtitle.url.map((s) => ({ src: s?.url, lang: s?.lang })));
    }

    return buildSubtitles(
      [...tracks, ...getTrackElements(this.getMediaElement(player))],
      this.SUBTITLE_SOURCE,
    );
  }
}

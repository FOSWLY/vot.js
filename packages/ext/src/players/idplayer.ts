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
  const Playerjs: any;
}

type PlayerJSSubtitle = {
  url?: string;
  title?: string;
  lang?: string;
};

/**
 * PlayerJS (https://playerjs.com/)
 */
export default class PlayerJSHelper implements BasePlayer {
  SUBTITLE_SOURCE = "playerjs";

  getPlayer() {
    return typeof Playerjs === "undefined" ? undefined : Playerjs;
  }

  getVideoData(videoId: string): MinimalVideoData | undefined {
    try {
      const media = findMediaElement(document, "video");
      if (!media) {
        throw new Error("Video element not found");
      }

      return buildVideoData(
        videoId,
        selectSourceUrl(getMediaElementSources(media)),
        getFiniteDuration(media.duration),
        this.getSubtitles(),
      );
    } catch (err) {
      console.error("[VOT] PlayerJSHelper error:", (err as Error).message);
      return undefined;
    }
  }

  getSubtitles(): VideoDataSubtitle[] {
    // PlayerJS API: player.api("subtitles") returns a list of { title, url }
    const subs = safeCall(() => this.getPlayer()?.api?.("subtitles"));
    return buildSubtitles(
      [
        ...(Array.isArray(subs) ? (subs as PlayerJSSubtitle[]) : []).map(
          (sub) => ({ src: sub?.url, lang: sub?.title || sub?.lang }),
        ),
        ...getTrackElements(findMediaElement(document, "video")),
      ],
      this.SUBTITLE_SOURCE,
    );
  }
}

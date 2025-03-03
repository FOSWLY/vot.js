import { VideoDataSubtitle } from "@vot.js/core/types/client";
import { MinimalVideoData } from "../types/client";
import { BaseHelper, VideoHelperError } from "./base";
import Logger from "@vot.js/shared/utils/logger";
import { normalizeLang } from "@vot.js/shared/utils/utils";

export default class KickstarterHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      const videoEl = document.querySelector<HTMLVideoElement>(
        ".ksr-video-player > video",
      );
      const url = videoEl?.querySelector<HTMLSourceElement>(
        "source[type^='video/mp4']",
      )?.src;
      if (!url) {
        throw new VideoHelperError("Failed to find video URL");
      }

      const subtitles = videoEl?.querySelectorAll("track") ?? [];

      return {
        url,
        subtitles: Array.from(subtitles).reduce<VideoDataSubtitle[]>(
          (result, sub) => {
            const lang = sub.getAttribute("srclang");
            const url = sub.getAttribute("src");
            if (!lang || !url) {
              return result;
            }

            result.push({
              language: normalizeLang(lang),
              url,
              format: "vtt",
              source: "kickstarter",
            });
            return result;
          },
          [],
        ),
      };
    } catch (err) {
      Logger.error(
        `Failed to get Kickstarter data by videoId: ${videoId}`,
        (err as Error).message,
      );
      return undefined;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return url.pathname.slice(1);
  }
}

import { BaseHelper, VideoHelperError } from "./base";
import type { MinimalVideoData } from "../types/client";

import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import * as Linkedin from "@vot.js/shared/types/helpers/linkedin";
import { proxyMedia } from "@vot.js/shared/utils/utils";
import Logger from "@vot.js/shared/utils/logger";

export default class LinkedinHelper extends BaseHelper {
  API_ORIGIN = "https://www.linkedin.com/learning";

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      const videoEl = document.querySelector(".video-js");
      if (!videoEl) {
        throw new VideoHelperError(
          `Failed to find video element for videoID ${videoId}`,
        );
      }

      const dataSource = (videoEl.getAttribute("data-sources") ?? "[]")
        .replaceAll("&quot;", '"')
        .replaceAll("&amp;", "&");
      const sources = JSON.parse(dataSource) as Linkedin.Source[];
      const videoUrl = sources.find((source) => source.src.includes(".mp4"));
      if (!videoUrl) {
        throw new Error(`Failed to find video url for videoID ${videoId}`);
      }

      const url = new URL(videoUrl.src);
      const captionUrl = videoEl.getAttribute("data-captions-url");
      const subtitles = captionUrl
        ? ([
            {
              language: "en",
              source: "linkedin",
              format: "vtt",
              url: captionUrl,
            },
          ] as VideoDataSubtitle[])
        : undefined;

      return {
        url: proxyMedia(url),
        subtitles,
      };
    } catch (err: unknown) {
      Logger.error("Failed to get linkedin video data", (err as Error).message);
      return undefined;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/learning\/(([^/]+)\/([^/]+))/.exec(url.pathname)?.[1];
  }
}

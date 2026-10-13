import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import Logger from "@vot.js/shared/utils/logger";
import { proxyMedia } from "@vot.js/shared/utils/utils";
import { parseFromString } from "dom-parser";
import type { MinimalVideoData } from "../types/client";
import type * as Linkedin from "../types/helpers/linkedin";
import { BaseHelper, VideoHelperError } from "./base";

export default class LinkedinHelper extends BaseHelper {
  API_ORIGIN = "https://www.linkedin.com/learning";

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      const res = await this.fetch(`${this.API_ORIGIN}/${videoId}`);
      const content = await res.text();
      const doc = parseFromString(content.replace(/<!DOCTYPE html>/i, ""));
      const videoEl = doc.getElementsByClassName("video-js")?.[0];
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
        url: proxyMedia(url, "mp4", this.mediaProxy),
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

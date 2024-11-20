import { BaseHelper, VideoHelperError } from "./base";
import { proxyMedia } from "@vot.js/shared/utils/utils";
import Logger from "@vot.js/shared/utils/logger";
export default class LinkedinHelper extends BaseHelper {
  API_ORIGIN = "https://www.linkedin.com/learning";
  async getVideoData(videoId) {
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
      const sources = JSON.parse(dataSource);
      const videoUrl = sources.find((source) => source.src.includes(".mp4"));
      if (!videoUrl) {
        throw new Error(`Failed to find video url for videoID ${videoId}`);
      }
      const url = new URL(videoUrl.src);
      const captionUrl = videoEl.getAttribute("data-captions-url");
      const subtitles = captionUrl
        ? [
            {
              language: "en",
              format: "vtt",
              url: captionUrl,
            },
          ]
        : undefined;
      return {
        url: proxyMedia(url),
        subtitles,
      };
    } catch (err) {
      Logger.error("Failed to get linkedin video data", err.message);
      return undefined;
    }
  }
  async getVideoId(url) {
    return /\/learning\/(([^/]+)\/([^/]+))/.exec(url.pathname)?.[1];
  }
}

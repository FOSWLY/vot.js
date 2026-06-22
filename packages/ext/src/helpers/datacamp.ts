import Logger from "@vot.js/shared/utils/logger";
import VideoJSHelper from "../players/videojs";
import type { MinimalVideoData } from "../types/client";

export default class DataCampHelper extends VideoJSHelper {
  SUBTITLE_SOURCE = "datacamp";

  getVideoUrlFromInput(input: Element): string | null {
    try {
      const isInputElement =
        input instanceof HTMLInputElement ||
        input instanceof HTMLTextAreaElement ||
        input.tagName === "INPUT" ||
        input.tagName === "TEXTAREA";

      if (!isInputElement) {
        return null;
      }

      const value = (input as HTMLInputElement | HTMLTextAreaElement).value;
      if (!value) {
        return null;
      }

      const meta = JSON.parse(value);
      const videoUrl =
        meta?.video_url ??
        meta?.plain_video_mp4_link ??
        meta?.plain_video_hls_link ??
        meta?.video_mp4_link ??
        meta?.video_hls_link;

      return typeof videoUrl === "string" ? videoUrl : null;
    } catch {
      return null;
    }
  }

  getVideoUrlFromDocument(doc: Document | Element = document): string | null {
    const videoDataInput = doc.querySelector("#videoData");
    if (videoDataInput) {
      const url = this.getVideoUrlFromInput(videoDataInput);
      if (url) {
        return url;
      }
    }

    const slideDeckInput = doc.querySelector("#slideDeckData");
    if (slideDeckInput) {
      const url = this.getVideoUrlFromInput(slideDeckInput);
      if (url) {
        return url;
      }
    }

    return null;
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const cleanUrl = videoId.split("||")[0];

    let videoUrl = this.getVideoUrlFromDocument(document);

    if (!videoUrl) {
      try {
        const response = await fetch(cleanUrl);
        if (response.ok) {
          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          videoUrl = this.getVideoUrlFromDocument(doc);
        }
      } catch (err) {
        Logger.error(
          "Failed to fetch DataCamp page for DOMParser",
          err instanceof Error ? err.message : String(err),
        );
      }
    }

    if (!videoUrl) {
      return undefined;
    }

    const VideoData: MinimalVideoData & {
      video_url: string;
    } = {
      url: videoId,
      video_url: videoUrl,
      translationHelp: [
        {
          target: "video_file_url",
          targetUrl: videoUrl,
        },
      ],
    };

    return VideoData;
  }

  async getVideoId(url: URL): Promise<string | undefined> {
    return url.href;
  }
}

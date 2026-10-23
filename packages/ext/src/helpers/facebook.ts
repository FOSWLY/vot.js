import { proxyMedia } from "@vot.js/shared/utils/utils";

import { BaseHelper } from "./base";
import { MinimalVideoData } from "../types/client";

function extractAudioUrl(text: string) {
  const stack = [];
  const tokens = /"(?:\\.|[^"\\])*"|\{|\}/g;

  for (const match of text.matchAll(tokens)) {
    if (match[0] === "{") {
      stack.push(match.index);
    } else if (match[0] === "}") {
      const start = stack.pop();
      if (start === undefined) continue;

      try {
        const obj = JSON.parse(text.slice(start, match.index + 1));

        if (obj.mime_type === "audio/mp4" && typeof obj.base_url === "string") {
          return obj.base_url;
        }
      } catch {}
    }
  }
}

export default class FacebookHelper extends BaseHelper {
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const baseData: MinimalVideoData | undefined = this.returnBaseData(videoId);
    if (!baseData) {
      return undefined;
    }

    // prevent set invalid media to reels
    // this check isn't necessary, but let it be
    if (videoId.startsWith("reel/")) {
      return baseData;
    }

    const audioUrl = Array.from(document.querySelectorAll("script[data-sjs]"))
      .filter((s) => s.textContent.match(/({.*?ScheduledServerJS.*?})/g))
      .map((s) => extractAudioUrl(s.textContent))
      .find(Boolean);
    if (audioUrl) {
      baseData.translationHelp = [
        {
          target: "video_file_url",
          targetUrl: proxyMedia(audioUrl, "mp4", this.mediaProxy),
        },
      ];
    }

    return baseData;
  }

  async getVideoId(url: URL) {
    return url.pathname.slice(1);
  }
}

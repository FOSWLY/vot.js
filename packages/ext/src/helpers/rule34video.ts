import { proxyMedia } from "@vot.js/shared/utils/utils";

import { BaseHelper } from "./base";
import { MinimalVideoData } from "../types/client";
import FlowplayerHelper from "../players/flowplayer";

export default class Rule34VideoHelper extends BaseHelper {
  resolveVideoIdViaPostMessage(url: string): Promise<string | undefined> {
    return new Promise((resolve) => {
      const iframe = document.createElement("iframe");
      iframe.src = url;
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      const timeout = setTimeout(() => {
        window.removeEventListener("message", onMessage);
        document.body.removeChild(iframe);
        resolve(undefined);
      }, 3000);

      const onMessage = (e: MessageEvent) => {
        if (
          e.source !== iframe.contentWindow ||
          !(typeof e.data === "string" && e.data.startsWith("getVideoId:"))
        ) {
          return;
        }

        clearTimeout(timeout);
        window.removeEventListener("message", onMessage);
        document.body.removeChild(iframe);
        resolve(e.data.replace("getVideoId:", ""));
      };

      window.addEventListener("message", onMessage);
    });
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const baseData: MinimalVideoData | undefined = this.returnBaseData(videoId);
    if (!baseData) {
      return undefined;
    }

    const fpHelper = new FlowplayerHelper();
    try {
      const videoData = fpHelper.getVideoData();
      if (!videoData) {
        return baseData;
      }

      const redirectedUrl = await this.resolveVideoIdViaPostMessage(
        videoData.url,
      );

      if (redirectedUrl) {
        baseData.translationHelp = [
          {
            target: "video_file_url",
            targetUrl: proxyMedia(redirectedUrl, "mp4", this.mediaProxy),
          },
        ];
      }

      baseData.duration = videoData.duration;
      baseData.subtitles = videoData.subtitles;

      return baseData;
    } catch {
      return baseData;
    }
  }

  async getVideoId(url: URL) {
    const parts = /\/videos?\/(\d+)(?:\/(.+))?\/?$/.exec(url.pathname);
    if (!parts) {
      return undefined;
    }

    const [, id, tail] = parts;
    return tail ? `${id}/${tail.replace(/\/+$/, "")}/` : id;
  }
}

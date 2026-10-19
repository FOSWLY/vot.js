import Logger from "@vot.js/shared/utils/logger";
import { proxyMedia } from "@vot.js/shared/utils/utils";

import { BaseHelper } from "./base";
import { MinimalVideoData } from "../types/client";
import type * as Eporner from "../types/helpers/eporner";

declare global {
  const EP: Eporner.Player;
}

const getPlayerHash = () => {
  if (typeof EP === "undefined") {
    return undefined;
  }

  return EP?.video?.player?.hash;
};

export const encodeHash = (hash: string) => {
  if (!hash || hash.length !== 32) {
    return false;
  }

  return [0, 8, 16, 24]
    .map((i) => parseInt(hash.substring(i, i + 8), 16).toString(36))
    .join("");
};

export default class EpornerHelper extends BaseHelper {
  private async fetchVideoData(videoId: string): Promise<
    | {
        videoUrl: string;
        duration: number;
      }
    | undefined
  > {
    try {
      const hash = getPlayerHash();
      if (!hash) {
        return undefined;
      }

      const encodedHash = encodeHash(hash);
      if (!encodedHash) {
        return undefined;
      }
      const search = new URLSearchParams({
        hash: encodedHash,
        fallback: "false",
        embed: "true",
        supportedFormats: "hls,dash,h265,vp9,av1,mp4",
        _: Date.now().toString(),
      }).toString();
      const res = await this.fetch(
        `https://www.eporner.com/xhr/video/${videoId}?${search}`,
      );

      const data = (await res.json()) as Eporner.VideoData;
      if (data.code !== 0) {
        throw new Error(`Failed to get video data: ${data.message}`);
      }

      if (data.vid !== videoId) {
        throw new Error(
          `Fetched data video ID mismatch: expected ${videoId}, got ${data.vid}`,
        );
      }

      const {
        duration,
        sources: { mp4: urls },
      } = data;

      const videoUrlItem =
        "360p" in urls ? urls["360p"] : urls[Object.keys(urls)[0]];
      const videoUrl = videoUrlItem?.src;
      if (!videoUrl) {
        throw new Error("Failed to find video URL in fetched video data");
      }

      return {
        duration,
        videoUrl,
      };
    } catch (err) {
      Logger.error(
        `Failed to get eporner video URL for videoId: ${videoId}`,
        err,
      );
      return undefined;
    }
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const baseData: MinimalVideoData | undefined = this.returnBaseData(videoId);
    if (!baseData) {
      return undefined;
    }

    const videoData = await this.fetchVideoData(videoId);
    if (!videoData) {
      return baseData;
    }
    baseData.translationHelp = [
      {
        target: "video_file_url",
        targetUrl: proxyMedia(videoData.videoUrl, "mp4", this.mediaProxy),
      },
    ];
    baseData.duration = videoData.duration;

    return baseData;
  }

  async getVideoId(url: URL) {
    return /\/(?:video-|embed\/)([a-zA-Z0-9]+)/.exec(url.pathname)?.[1];
  }
}

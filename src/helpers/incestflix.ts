import { parseFromString } from "dom-parser";
import { MinimalVideoData } from "../types/client";
import { BaseHelper, VideoHelperError } from "./base";
import { proxyMedia } from "../utils/utils";

export default class IncestflixHelper extends BaseHelper {
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      const res = await this.fetch(this.service?.url + videoId);
      const content = await res.text();
      const doc = parseFromString(content.replace("<!DOCTYPE html>", ""));
      const videoEl = doc.getElementById("incflix-stream");
      if (!videoEl) {
        throw new VideoHelperError(
          `Failed to find video element for videoID ${videoId}`,
        );
      }

      const sourceEl = videoEl.getElementsByTagName("source")?.[0];
      if (!sourceEl) {
        throw new VideoHelperError("Failed to find source element");
      }

      const srcLink = sourceEl.getAttribute("src");
      const source = new URL(
        srcLink.startsWith("//") ? `https:${srcLink}` : srcLink,
      ) as URL;
      source.searchParams.append("media-proxy", "video.mp4"); // origin url doesn't have .mp4 part
      return {
        url: proxyMedia(source),
      };
    } catch (err) {
      console.error(
        `Failed to get Incestflix data by videoId: ${videoId}`,
        (err as Error).message,
      );
      return undefined;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/watch\/([^/]+)/.exec(url.pathname)?.[1];
  }
}

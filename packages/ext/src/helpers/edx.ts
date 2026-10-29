import Logger from "@vot.js/shared/utils/logger";
import { proxyMedia } from "@vot.js/shared/utils/utils";
import type { MinimalVideoData } from "../types/client";
import type * as Edx from "../types/helpers/edx";
import { BaseHelper, VideoHelperError } from "./base";

const VIDEO_BLOCK_SELECTOR = '.xblock[data-block-type="video"]';

function parseMp4Url(source: string) {
  try {
    const url = new URL(source);
    return url.pathname.toLowerCase().endsWith(".mp4") ? url : undefined;
  } catch {
    return undefined;
  }
}

export default class EdxHelper extends BaseHelper {
  private getSourceUrl(sources: string[] = []) {
    const url = sources.map(parseMp4Url).find(Boolean);
    if (url) {
      return proxyMedia(url, "mp4", this.mediaProxy);
    }

    throw new VideoHelperError("Failed to find video source");
  }

  private getVideoBlock() {
    if (this.video) {
      return this.video.closest<HTMLElement>(VIDEO_BLOCK_SELECTOR) ?? undefined;
    }

    return Array.from(
      document.querySelectorAll<HTMLElement>(VIDEO_BLOCK_SELECTOR),
    ).find((block) => block.querySelector("video"));
  }

  private getBlockId(block: HTMLElement) {
    const usageId = block.getAttribute("data-usage-id");
    if (usageId) {
      return usageId;
    }

    const player = block.querySelector<HTMLElement>("div.video");
    const blockId = player?.getAttribute("data-block-id");
    if (blockId) {
      return blockId;
    }

    const courseId = player?.getAttribute("data-course-id");
    const playerId = player?.id.replace(/^video_/, "");
    return courseId && playerId ? `${courseId}:${playerId}` : undefined;
  }

  async getVideoId(_url: URL) {
    const block = this.getVideoBlock();
    return block ? this.getBlockId(block) : undefined;
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const block = Array.from(
      document.querySelectorAll<HTMLElement>(VIDEO_BLOCK_SELECTOR),
    ).find((item) => this.getBlockId(item) === videoId);
    const rawMetadata = block
      ?.querySelector("div.video[data-metadata]")
      ?.getAttribute("data-metadata");
    if (!rawMetadata) {
      return undefined;
    }

    let metadata: Edx.VideoMetadata;
    try {
      metadata = JSON.parse(rawMetadata) as Edx.VideoMetadata;
    } catch (err) {
      Logger.error(
        `Failed to parse edX video metadata: ${videoId}`,
        (err as Error).message,
      );
      return undefined;
    }

    const url = this.getSourceUrl(metadata.sources);
    const { duration } = metadata;
    return typeof duration === "number" &&
      Number.isFinite(duration) &&
      duration > 0
      ? { url, duration }
      : { url };
  }
}

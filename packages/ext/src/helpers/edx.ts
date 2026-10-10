import Logger from "@vot.js/shared/utils/logger";
import { proxyMedia } from "@vot.js/shared/utils/utils";
import type { MinimalVideoData } from "../types/client";
import type * as Edx from "../types/helpers/edx";
import { BaseHelper, VideoHelperError } from "./base";

const VIDEO_BLOCK_SELECTOR = '.xblock[data-block-type="video"]';
const DIRECT_HOST = "edx-video.net";

function getPathname(url: string) {
  try {
    return new URL(url).pathname.toLowerCase();
  } catch {
    return undefined;
  }
}

function hasExtension(url: string, extension: string) {
  return Boolean(getPathname(url)?.endsWith(extension));
}

function getYoutubeId(streams?: string) {
  for (const pair of String(streams ?? "").split(",")) {
    const [speed, id] = pair.trim().split(":");
    if (id && Number.parseFloat(speed) === 1) {
      return id;
    }
  }

  return undefined;
}

function getSourceUrl(metadata: Edx.VideoMetadata) {
  const sources = (metadata.sources ?? []).filter(
    (source) => getPathname(source) !== undefined,
  );
  const playable = sources.filter((source) => !hasExtension(source, ".m3u8"));
  const source =
    playable.find((item) => hasExtension(item, ".mp4")) ??
    playable.find((item) => hasExtension(item, ".webm")) ??
    playable[0];
  if (source) {
    const url = new URL(source);
    if (url.hostname === DIRECT_HOST) {
      return source;
    }

    return hasExtension(source, ".webm")
      ? proxyMedia(url, "webm")
      : proxyMedia(url);
  }

  const youtubeId = getYoutubeId(metadata.streams);
  if (youtubeId) {
    return `https://youtu.be/${youtubeId}`;
  }

  if (sources.length) {
    throw new VideoHelperError("HLS-only edX videos are not supported");
  }

  throw new VideoHelperError("Failed to find video source");
}

export default class EdxHelper extends BaseHelper {
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

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(_url: URL) {
    const block = this.getVideoBlock();
    return block ? this.getBlockId(block) : undefined;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
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

    const url = getSourceUrl(metadata);
    const { duration } = metadata;
    return typeof duration === "number" &&
      Number.isFinite(duration) &&
      duration > 0
      ? { url, duration }
      : { url };
  }
}

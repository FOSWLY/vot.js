import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import Logger from "@vot.js/shared/utils/logger";
import { normalizeLang, proxyMedia } from "@vot.js/shared/utils/utils";
import type { MinimalVideoData } from "../types/client";
import type {
  LessonVideo,
  NextData,
  SubtitlesRecord,
} from "../types/helpers/deeplearningai";
import { BaseHelper } from "./base";

const NEXT_DATA_RE =
  /<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/;

export default class DeeplearningAIHelper extends BaseHelper {
  /**
   * Extract `course.getLessonVideo` result from Next.js dehydrated tRPC state
   */
  findLessonVideo(nextData: NextData | undefined): LessonVideo | undefined {
    const queries = nextData?.props?.pageProps?.trpcState?.json?.queries;
    if (!Array.isArray(queries)) {
      return undefined;
    }

    for (const query of queries) {
      const video = query?.state?.data?.video;
      const key = JSON.stringify(query?.queryKey ?? "");
      if (video && (key.includes("getLessonVideo") || video.mp4360pUrl)) {
        return video;
      }
    }

    return undefined;
  }

  parseNextData(raw: string | null | undefined): NextData | undefined {
    if (!raw) {
      return undefined;
    }

    try {
      return JSON.parse(raw) as NextData;
    } catch {
      return undefined;
    }
  }

  /**
   * `__NEXT_DATA__` of the current document is stale after client-side navigation,
   * so the lesson page is re-fetched to get up-to-date lesson data
   */
  async getLessonVideo(videoId: string): Promise<LessonVideo | undefined> {
    const pageUrl = `${window.location.origin}/courses/${videoId}`;
    try {
      const res = await this.fetch(pageUrl);
      const html = await res.text();
      const video = this.findLessonVideo(
        this.parseNextData(NEXT_DATA_RE.exec(html)?.[1]),
      );
      if (video) {
        return video;
      }
    } catch (err) {
      Logger.warn(
        `Failed to fetch DeepLearning.AI lesson page ${pageUrl}`,
        (err as Error).message,
      );
    }

    // fallback: current document data (valid on initial page load)
    if (!window.location.pathname.includes(videoId)) {
      return undefined;
    }

    return this.findLessonVideo(
      this.parseNextData(document.getElementById("__NEXT_DATA__")?.textContent),
    );
  }

  getSubtitles(video: LessonVideo): VideoDataSubtitle[] {
    if (!video.subtitle) {
      return [];
    }

    try {
      const subtitles = JSON.parse(video.subtitle) as SubtitlesRecord;
      return Object.entries(subtitles)
        .filter(([, sub]) => typeof sub?.URI === "string")
        .map(([lang, sub]) => ({
          language: normalizeLang(lang),
          source: "deeplearningai",
          format: "vtt",
          url: sub.URI,
        }));
    } catch {
      return [];
    }
  }

  isMp4Url(url: string | null | undefined): url is string {
    if (!url) {
      return false;
    }

    try {
      return new URL(url).pathname.endsWith(".mp4");
    } catch {
      return false;
    }
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const video = await this.getLessonVideo(videoId);
    if (!video) {
      Logger.warn(`Failed to get DeepLearning.AI lesson video for ${videoId}`);
      return undefined;
    }

    // Only use a real MP4 provided by the site. Don't build it from the .m3u8 url
    // (e.g. `master.m3u8` -> `master_360p.mp4` returns 403 AccessDenied).
    const url = [video.mp4360pUrl, video.mp4Url, video.webmUrl].find((u) =>
      this.isMp4Url(u),
    );
    if (!url) {
      Logger.warn(
        `DeepLearning.AI lesson ${videoId} doesn't contain a direct mp4 source`,
      );
      return undefined;
    }

    // CDN rejects direct requests from Yandex servers, so the mp4 is passed
    // through the media proxy (same as LinkedIn / Oracle Learn)
    return {
      url: proxyMedia(new URL(url)),
      title: video.name,
      subtitles: this.getSubtitles(video),
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /courses\/(([^/]+)\/lesson\/([^/]+)\/([^/]+))/.exec(
      url.pathname,
    )?.[1];
  }
}

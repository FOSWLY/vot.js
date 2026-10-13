import { availableLangs } from "@vot.js/shared/consts";
import type { RequestLang } from "@vot.js/shared/types/data";
import type * as Udemy from "@vot.js/shared/types/helpers/udemy";
import Logger from "@vot.js/shared/utils/logger";
import { normalizeLang } from "@vot.js/shared/utils/utils";
import type { MinimalVideoData } from "../types/client.js";
import { BaseHelper, VideoHelperError } from "./base.js";

type UrlCandidate = {
  file?: string;
  src?: string;
  type?: string;
  label?: string | number;
  quality?: string | number;
  height?: string | number;
};

type UrlCandidatesRecord = {
  Video?: UrlCandidate[];
  video?: UrlCandidate[];
};

type CaptionWithDownloadUrl = Udemy.Caption & {
  download_url?: string;
  locale?: {
    locale?: string;
  };
};

type AssetOutput = {
  url?: string;
  type?: string;
  height?: number | string;
};

type AssetData = {
  outputs?: Record<string, AssetOutput>;
};

type AssetWithExtraUrls = Udemy.Asset & {
  stream_urls?: unknown;
  download_urls?: unknown;
  stream_url?: string;
  streamUrl?: string;
  external_url?: string;
  data?: AssetData;
};

type LectureWithViewHtml = Udemy.Lecture & {
  view_html?: string;
};

type ModuleDataWithExtraFields = Udemy.ModuleData & {
  course_id?: number | string;
  course?: {
    id?: number | string;
  };
};

type ParsedUrlCandidate = {
  url: string;
  type: string;
  quality: number;
  isYouTubeWatch: boolean;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isUrlCandidate(value: unknown): value is UrlCandidate {
  return typeof value === "object" && value !== null;
}

function getUrlCandidates(data: unknown): UrlCandidate[] {
  if (Array.isArray(data)) {
    return data.filter(isUrlCandidate);
  }

  if (typeof data !== "object" || data === null) {
    return [];
  }

  const source = data as UrlCandidatesRecord;
  const values = Array.isArray(source.Video)
    ? source.Video
    : Array.isArray(source.video)
      ? source.video
      : [];
  return values.filter(isUrlCandidate);
}

function getOutputCandidates(data: unknown): UrlCandidate[] {
  if (!isObject(data)) {
    return [];
  }

  const result: UrlCandidate[] = [];
  for (const [fallbackLabel, value] of Object.entries(data)) {
    if (!isObject(value) || typeof value.url !== "string") {
      continue;
    }

    result.push({
      src: value.url,
      type: typeof value.type === "string" ? value.type : undefined,
      label:
        typeof value.height === "number" || typeof value.height === "string"
          ? value.height
          : fallbackLabel,
    });
  }

  return result;
}

function getQualityValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const match = String(value ?? "").match(/(\d{3,4})/);
  return Number(match?.[1] ?? 0);
}

function getCandidateUrl(candidate: UrlCandidate) {
  if (typeof candidate.file === "string") {
    return candidate.file;
  }
  if (typeof candidate.src === "string") {
    return candidate.src;
  }
  return undefined;
}

function isM3U8(type: string, url: string) {
  return type.includes("mpegurl") || /\.m3u8(?:$|[?#])/i.test(url);
}

function isDash(type: string, url: string) {
  return type.includes("dash") || /\.mpd(?:$|[?#])/i.test(url);
}

export default class UdemyHelper extends BaseHelper {
  API_ORIGIN = `${window.location.origin}/api-2.0`;

  getModuleData() {
    const appLoaderEl =
      document.querySelector<HTMLElement>(
        ".ud-app-loader[data-module-id='course-taking']",
      ) ??
      document.querySelector<HTMLElement>("[data-module-id='course-taking']");
    const moduleData = appLoaderEl?.dataset?.moduleArgs;
    if (!moduleData) {
      return undefined;
    }

    try {
      return JSON.parse(moduleData) as Udemy.ModuleData;
    } catch {
      return undefined;
    }
  }

  getLectureId(videoId?: string) {
    const lectureIdRe =
      /(?:\/learn\/(?:v4\/t\/)?lecture\/|#\/?lecture\/)(\d+)/i;
    const lectureViewIdRe = /\/lecture\/view\/\?/i;
    const href = window.location.href;
    const lectureViewSearchParams = lectureViewIdRe.test(href)
      ? new URL(href).searchParams
      : undefined;
    const lectureViewId = lectureViewSearchParams
      ? (() => {
          for (const [key, value] of lectureViewSearchParams) {
            const normalizedKey = key.toLowerCase();
            if (
              normalizedKey === "lectureid" ||
              normalizedKey === "lecture_id"
            ) {
              return value;
            }
          }
          return undefined;
        })()
      : undefined;

    return (
      lectureIdRe.exec(href)?.[1] ??
      lectureViewId ??
      (videoId ? lectureIdRe.exec(`/${videoId}`)?.[1] : undefined)
    );
  }

  getCourseId(moduleData?: Udemy.ModuleData) {
    const moduleDataWithExtra = moduleData as
      | ModuleDataWithExtraFields
      | undefined;
    const moduleCourseId = this.normalizeId(
      moduleDataWithExtra?.courseId ??
        moduleDataWithExtra?.course_id ??
        moduleDataWithExtra?.course?.id,
    );
    if (moduleCourseId) {
      return moduleCourseId;
    }

    const attrCourseId = this.normalizeId(
      document
        .querySelector<HTMLElement>("[data-course-id]")
        ?.getAttribute("data-course-id"),
    );
    if (attrCourseId) {
      return attrCourseId;
    }

    const pageHtml = document.documentElement?.innerHTML ?? "";
    return (
      /data-course-id=["'](\d+)/i.exec(pageHtml)?.[1] ??
      /&quot;courseId&quot;\s*:\s*(\d+)/i.exec(pageHtml)?.[1] ??
      /"courseId"\s*:\s*(\d+)/i.exec(pageHtml)?.[1]
    );
  }

  normalizeId(value: unknown) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
    if (typeof value === "string") {
      return /^\d+$/.test(value) ? value : undefined;
    }
    return undefined;
  }

  parseJson<T>(value: string) {
    try {
      return JSON.parse(value) as T;
    } catch {
      const normalized = value
        .replaceAll("&quot;", '"')
        .replaceAll("&#34;", '"')
        .replaceAll("&apos;", "'")
        .replaceAll("&#39;", "'");

      try {
        return JSON.parse(normalized) as T;
      } catch {
        return undefined;
      }
    }
  }

  getViewHtmlCandidates(viewHtml?: string) {
    if (typeof viewHtml !== "string" || !viewHtml.trim()) {
      return [];
    }

    const doc = new DOMParser().parseFromString(viewHtml, "text/html");
    const candidates: UrlCandidate[] = [];

    for (const sourceEl of Array.from(doc.querySelectorAll("source"))) {
      const src = sourceEl.getAttribute("src");
      if (!src) {
        continue;
      }

      candidates.push({
        src,
        type: sourceEl.getAttribute("type") ?? undefined,
        label: sourceEl.getAttribute("data-res") ?? undefined,
      });
    }

    for (const setupDataEl of Array.from(
      doc.querySelectorAll<HTMLElement>("[videojs-setup-data]"),
    )) {
      const setupDataRaw = setupDataEl.getAttribute("videojs-setup-data");
      if (!setupDataRaw) {
        continue;
      }

      const setupData = this.parseJson<{ sources?: unknown }>(setupDataRaw);
      if (setupData) {
        candidates.push(...getUrlCandidates(setupData.sources));
      }
    }

    return candidates;
  }

  isErrorData<T extends object>(
    data: T | Udemy.ErrorData,
  ): data is Udemy.ErrorData {
    return (
      Object.hasOwn(data, "error") ||
      (Object.hasOwn(data, "detail") && !Object.hasOwn(data, "_class"))
    );
  }

  async getLectureData(courseId: number | string, lectureId: number | string) {
    try {
      const res = await this.fetch(
        `${this.API_ORIGIN}/users/me/subscribed-courses/${courseId}/lectures/${lectureId}/?` +
          new URLSearchParams({
            "fields[lecture]":
              "title,description,view_html,asset,download_url,is_free,last_watched_second",
            "fields[asset]":
              "asset_type,length,stream_url,media_sources,stream_urls,download_urls,external_url,captions,data,thumbnail_sprite,slides,slide_urls,course_is_drmed,media_license_token",
          }).toString(),
      );

      const data = (await res.json()) as LectureWithViewHtml | Udemy.ErrorData;
      if (this.isErrorData(data)) {
        throw new VideoHelperError(data.detail ?? "unknown error");
      }

      return data;
    } catch (err) {
      Logger.error(
        `Failed to get lecture data by courseId: ${courseId} and lectureId: ${lectureId}`,
        (err as Error).message,
      );
      return undefined;
    }
  }

  async getCourseLang(courseId: number | string) {
    try {
      const res = await this.fetch(
        `${this.API_ORIGIN}/users/me/subscribed-courses/${courseId}?` +
          new URLSearchParams({
            "fields[course]": "locale",
          }).toString(),
      );

      const data = (await res.json()) as Udemy.Course | Udemy.ErrorData;
      if (!this.isErrorData(data)) {
        return data;
      }

      const res2 = await this.fetch(
        `${this.API_ORIGIN}/courses/${courseId}/?` +
          new URLSearchParams({
            "fields[course]": "locale",
          }).toString(),
      );

      const data2 = (await res2.json()) as Udemy.Course | Udemy.ErrorData;
      if (this.isErrorData(data2)) {
        throw new VideoHelperError(data2.detail ?? "unknown error");
      }

      return data2;
    } catch (err) {
      Logger.error(
        `Failed to get course lang by courseId: ${courseId}`,
        (err as Error).message,
      );
      return undefined;
    }
  }

  findVideoUrl(
    sources: Udemy.MediaSource[] | undefined,
    streamUrls?: unknown,
    downloadUrls?: unknown,
    streamUrl?: unknown,
    externalUrl?: unknown,
    outputs?: unknown,
    viewHtml?: unknown,
  ) {
    const allCandidates: UrlCandidate[] = [];
    const mediaSources = Array.isArray(sources) ? sources : [];
    for (const source of mediaSources) {
      allCandidates.push({
        src: source.src,
        type: source.type,
        label: source.label,
      });
    }

    allCandidates.push(...getUrlCandidates(streamUrls));
    allCandidates.push(...getUrlCandidates(downloadUrls));
    allCandidates.push(...getOutputCandidates(outputs));

    if (typeof viewHtml === "string") {
      allCandidates.push(...this.getViewHtmlCandidates(viewHtml));
    }

    if (typeof streamUrl === "string") {
      allCandidates.push({ src: streamUrl });
    }

    if (typeof externalUrl === "string") {
      allCandidates.push({ src: externalUrl });
    }

    const playerSrc = this.video?.currentSrc || this.video?.src;
    if (typeof playerSrc === "string" && playerSrc) {
      allCandidates.push({ src: playerSrc });
    }

    const dedupCandidates = new Map<string, ParsedUrlCandidate>();
    for (const candidate of allCandidates) {
      const url = getCandidateUrl(candidate);
      if (!url || /^javascript:/i.test(url)) {
        continue;
      }

      const quality = getQualityValue(
        candidate.label ?? candidate.quality ?? candidate.height,
      );
      const type = String(candidate.type ?? "").toLowerCase();
      const prev = dedupCandidates.get(url);
      if (!prev || quality > prev.quality) {
        dedupCandidates.set(url, {
          url,
          type,
          quality,
          isYouTubeWatch: /:\/\/(?:www\.)?youtube\.com\/watch\?/i.test(url),
        });
      }
    }

    const candidates = Array.from(dedupCandidates.values());
    if (!candidates.length) {
      return undefined;
    }

    const mp4Candidates = candidates.filter(
      (item) => item.type.includes("mp4") || /\.mp4(?:$|[?#])/i.test(item.url),
    );
    if (mp4Candidates.length) {
      mp4Candidates.sort((a, b) => b.quality - a.quality);
      return mp4Candidates[0]?.url;
    }

    const hlsUrl = candidates.find((item) => isM3U8(item.type, item.url))?.url;
    if (hlsUrl) {
      return hlsUrl;
    }

    const dashUrl = candidates.find((item) => isDash(item.type, item.url))?.url;
    if (dashUrl) {
      return dashUrl;
    }

    const nonYoutube = candidates.find((item) => !item.isYouTubeWatch)?.url;
    if (nonYoutube) {
      return nonYoutube;
    }

    return candidates[0]?.url;
  }

  getCaptionLocale(caption: CaptionWithDownloadUrl) {
    const localeId =
      typeof caption.locale_id === "string"
        ? caption.locale_id
        : typeof caption.locale?.locale === "string"
          ? caption.locale.locale
          : undefined;
    return localeId ? normalizeLang(localeId) : undefined;
  }

  findSubtitleUrl(captions: unknown, detectedLanguage: string) {
    if (!Array.isArray(captions)) {
      return undefined;
    }

    const captionsWithDownload = captions.filter(
      (caption) =>
        isObject(caption) &&
        (typeof caption.url === "string" ||
          typeof caption.download_url === "string"),
    ) as CaptionWithDownloadUrl[];

    const subtitle =
      captionsWithDownload.find(
        (caption) => this.getCaptionLocale(caption) === detectedLanguage,
      ) ??
      captionsWithDownload.find(
        (caption) => this.getCaptionLocale(caption) === "en",
      ) ??
      captionsWithDownload[0];

    return subtitle?.url ?? subtitle?.download_url;
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const moduleData = this.getModuleData();
    const courseId = this.getCourseId(moduleData);
    const lectureId = this.getLectureId(videoId);
    Logger.log(`[Udemy] courseId: ${courseId}, lectureId: ${lectureId}`);
    if (!lectureId || !courseId) {
      return undefined;
    }

    const lectureData = await this.getLectureData(courseId, lectureId);
    if (!lectureData) {
      return undefined;
    }

    const { title, description, asset, view_html } = lectureData;
    const { length: duration, media_sources, captions } = asset;

    const assetWithExtraUrls = asset as AssetWithExtraUrls;
    const streamUrls = assetWithExtraUrls.stream_urls;
    const downloadUrls = assetWithExtraUrls.download_urls;
    const videoUrl = this.findVideoUrl(
      media_sources,
      streamUrls,
      downloadUrls,
      assetWithExtraUrls.stream_url ?? assetWithExtraUrls.streamUrl,
      assetWithExtraUrls.external_url,
      assetWithExtraUrls.data?.outputs,
      view_html,
    );
    if (!videoUrl) {
      Logger.log("Failed to find video file in asset sources", asset);
      return undefined;
    }

    let courseLang = "en";
    const courseLangData = await this.getCourseLang(courseId);
    const courseLocale = courseLangData?.locale?.locale;
    if (typeof courseLocale === "string") {
      courseLang = normalizeLang(courseLocale);
    }
    if (!availableLangs.includes(courseLang as RequestLang)) {
      courseLang = "en";
    }

    const subtitleUrl = this.findSubtitleUrl(captions, courseLang);
    if (!subtitleUrl) {
      Logger.log("Failed to find subtitle file in captions", captions);
    }

    return {
      ...(subtitleUrl
        ? {
            url: this.service?.url + videoId,
            translationHelp: [
              {
                target: "subtitles_file_url",
                targetUrl: subtitleUrl,
              },
              {
                target: "video_file_url",
                targetUrl: videoUrl,
              },
            ],
            detectedLanguage: courseLang as RequestLang,
          }
        : {
            url: videoUrl,
            translationHelp: null,
          }),
      duration,
      title,
      description,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return url.pathname.slice(1);
  }
}

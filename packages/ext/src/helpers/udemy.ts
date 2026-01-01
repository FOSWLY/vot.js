import { MinimalVideoData } from "../types/client.js";
import { BaseHelper, VideoHelperError } from "./base.js";

import { availableLangs } from "@vot.js/shared/consts";
import { RequestLang } from "@vot.js/shared/types/data";
import * as Udemy from "@vot.js/shared/types/helpers/udemy";
import Logger from "@vot.js/shared/utils/logger";
import { normalizeLang } from "@vot.js/shared/utils/utils";

export default class UdemyHelper extends BaseHelper {
  API_ORIGIN = `${window.location.origin}/api-2.0`;

  getModuleData() {
    const appLoaderEl =
      document.querySelector<HTMLElement>(
        ".ud-app-loader[data-module-id='course-taking']",
      ) ?? document.querySelector<HTMLElement>("[data-module-id='course-taking']");
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

  getLectureId() {
    return /learn\/lecture\/([^/]+)/.exec(window.location.pathname)?.[1];
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
              "title,description,asset,download_url,is_free,last_watched_second",
            "fields[asset]":
              "asset_type,length,media_sources,stream_urls,download_urls,external_url,captions,thumbnail_sprite,slides,slide_urls,course_is_drmed,media_license_token",
          }).toString(),
      );

      const data = (await res.json()) as Udemy.Lecture | Udemy.ErrorData;
      if (this.isErrorData(data)) {
        throw new VideoHelperError((data as any).detail ?? "unknown error");
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
        throw new VideoHelperError((data2 as any).detail ?? "unknown error");
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
    sources: Udemy.MediaSource[],
    streamUrls?: unknown,
    downloadUrls?: unknown,
  ) {
    const mp4Sources = (sources ?? []).filter(
      (src) => src?.type === "video/mp4" && typeof (src as any).src === "string",
    ) as Array<Udemy.MediaSource & { label?: string; quality?: string }>;

    if (mp4Sources.length) {
      const getQ = (v?: string) => Number(String(v ?? "").match(/(\d{3,4})/)?.[1] ?? 0);
      mp4Sources.sort(
        (a, b) => getQ((b as any).label ?? (b as any).quality) - getQ((a as any).label ?? (a as any).quality),
      );
      return (mp4Sources[0] as any).src as string | undefined;
    }

    const su = streamUrls as any;
    const streamCandidates = (
      Array.isArray(su)
        ? su
        : Array.isArray(su?.Video)
          ? su.Video
          : Array.isArray(su?.video)
            ? su.video
            : []
    ) as any[];

    const streamUrl =
      streamCandidates.find(
        (x) => typeof x?.src === "string" && x?.type === "video/mp4",
      )?.src ??
      streamCandidates.find(
        (x) =>
          typeof x?.src === "string" &&
          (String(x?.type).toLowerCase().includes("mpegurl") ||
            String(x?.src).toLowerCase().includes(".m3u8")),
      )?.src ??
      streamCandidates.find(
        (x) =>
          typeof x?.src === "string" &&
          (String(x?.type).toLowerCase().includes("dash") ||
            String(x?.src).toLowerCase().includes(".mpd")),
      )?.src;

    if (typeof streamUrl === "string") {
      return streamUrl;
    }

    const du = downloadUrls as any;
    const downloadCandidates = (
      Array.isArray(du)
        ? du
        : Array.isArray(du?.Video)
          ? du.Video
          : Array.isArray(du?.video)
            ? du.video
            : []
    ) as any[];

    const downloadUrl =
      downloadCandidates.find(
        (x) => typeof x?.file === "string" && x?.type === "video/mp4",
      )?.file ??
      downloadCandidates.find((x) => typeof x?.file === "string")?.file ??
      downloadCandidates.find((x) => typeof x?.src === "string")?.src;

    return typeof downloadUrl === "string" ? downloadUrl : undefined;
  }

  findSubtitleUrl(captions: Udemy.Caption[], detectedLanguage: string) {
    const subtitle =
      captions?.find(
        (caption) => normalizeLang((caption as any).locale_id) === detectedLanguage,
      ) ??
      captions?.find(
        (caption) => normalizeLang((caption as any).locale_id) === "en",
      ) ??
      captions?.[0];

    return (subtitle as any)?.url ?? (subtitle as any)?.download_url;
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const moduleData = this.getModuleData();
    if (!moduleData) {
      return undefined;
    }

    const { courseId } = moduleData as any;
    const lectureId = this.getLectureId();
    Logger.log(`[Udemy] courseId: ${courseId}, lectureId: ${lectureId}`);
    if (!lectureId) {
      return undefined;
    }

    const lectureData = await this.getLectureData(courseId, lectureId);
    if (!lectureData) {
      return undefined;
    }

    const { title, description, asset } = lectureData as any;
    const { length: duration, media_sources, captions } = asset as any;

    const streamUrls = (asset as any).stream_urls;
    const downloadUrls = (asset as any).download_urls;

    const videoUrl = this.findVideoUrl(media_sources, streamUrls, downloadUrls);
    if (!videoUrl) {
      Logger.log(
        "Failed to find video file in asset sources",
        asset,
      );
      return undefined;
    }

    let courseLang = "en";
    const courseLangData = await this.getCourseLang(courseId);
    if (courseLangData) {
      const {
        locale: { locale: courseLocale },
      } = courseLangData as any;
      courseLang = courseLocale ? normalizeLang(courseLocale) : courseLang;
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

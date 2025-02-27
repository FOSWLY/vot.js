import { BaseHelper, VideoHelperError } from "./base.js";
import { MinimalVideoData } from "../types/client.js";

import * as Udemy from "@vot.js/shared/types/helpers/udemy";
import { normalizeLang } from "@vot.js/shared/utils/utils";
import { availableLangs } from "@vot.js/shared/consts";
import { RequestLang } from "@vot.js/shared/types/data";
import Logger from "@vot.js/shared/utils/logger";

export default class UdemyHelper extends BaseHelper {
  API_ORIGIN = "https://www.udemy.com/api-2.0";

  getModuleData() {
    const appLoaderEl = document.querySelector<HTMLElement>(
      ".ud-app-loader[data-module-id='course-taking']",
    );
    const moduleData = appLoaderEl?.dataset?.moduleArgs;
    if (!moduleData) {
      return undefined;
    }

    return JSON.parse(moduleData) as Udemy.ModuleData;
  }

  getLectureId() {
    return /learn\/lecture\/([^/]+)/.exec(window.location.pathname)?.[1];
  }

  isErrorData<T extends object>(
    data: T | Udemy.ErrorData,
  ): data is Udemy.ErrorData {
    return !Object.hasOwn(data, "error");
  }

  async getLectureData(courseId: number | string, lectureId: number | string) {
    try {
      const res = await this.fetch(
        `${this.API_ORIGIN}/users/me/subscribed-courses/${courseId}/lectures/${lectureId}/?` +
          new URLSearchParams({
            "fields[lecture]": "title,description,asset",
            "fields[asset]": "length,media_sources,captions",
          }).toString(),
      );

      const data = (await res.json()) as Udemy.Lecture | Udemy.ErrorData;
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
      if (this.isErrorData(data)) {
        throw new VideoHelperError(data.detail ?? "unknown error");
      }

      return data;
    } catch (err) {
      Logger.error(
        `Failed to get course lang by courseId: ${courseId}`,
        (err as Error).message,
      );
      return undefined;
    }
  }

  findVideoUrl(sources: Udemy.MediaSource[]) {
    return sources?.find((src) => src.type === "video/mp4")?.src;
  }

  findSubtitleUrl(captions: Udemy.Caption[], detectedLanguage: string) {
    let subtitle = captions?.find(
      (caption) => normalizeLang(caption.locale_id) === detectedLanguage,
    );

    if (!subtitle) {
      subtitle =
        captions?.find(
          (caption) => normalizeLang(caption.locale_id) === "en",
        ) ?? captions?.[0];
    }

    return subtitle?.url;
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const moduleData = this.getModuleData();
    if (!moduleData) {
      return undefined;
    }

    const { courseId } = moduleData;
    const lectureId = this.getLectureId();
    Logger.log(`[Udemy] courseId: ${courseId}, lectureId: ${lectureId}`);
    if (!lectureId) {
      return undefined;
    }

    const lectureData = await this.getLectureData(courseId, lectureId);
    if (!lectureData) {
      return undefined;
    }

    const { title, description, asset } = lectureData;
    const { length: duration, media_sources, captions } = asset;

    const videoUrl = this.findVideoUrl(media_sources);
    if (!videoUrl) {
      Logger.log(
        "Failed to find .mp4 video file in media_sources",
        media_sources,
      );
      return undefined;
    }

    let courseLang = "en";
    const courseLangData = await this.getCourseLang(courseId);
    if (courseLangData) {
      const {
        locale: { locale: courseLocale },
      } = courseLangData;
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

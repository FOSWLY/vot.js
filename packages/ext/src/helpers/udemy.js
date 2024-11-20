import { BaseHelper } from "./base.js";
import { normalizeLang } from "@vot.js/shared/utils/utils";
import { availableLangs } from "@vot.js/shared/consts";
import Logger from "@vot.js/shared/utils/logger";
export default class UdemyHelper extends BaseHelper {
  API_ORIGIN = "https://www.udemy.com/api-2.0";
  getModuleData() {
    const appLoaderEl = document.querySelector(
      ".ud-app-loader[data-module-id='course-taking']",
    );
    const moduleData = appLoaderEl?.dataset?.moduleArgs;
    if (!moduleData) {
      return undefined;
    }
    return JSON.parse(moduleData);
  }
  getLectureId() {
    return /learn\/lecture\/([^/]+)/.exec(window.location.pathname)?.[1];
  }
  async getLectureData(courseId, lectureId) {
    try {
      const res = await this.fetch(
        `${this.API_ORIGIN}/users/me/subscribed-courses/${courseId}/lectures/${lectureId}/?` +
          new URLSearchParams({
            "fields[lecture]": "title,description,asset",
            "fields[asset]": "length,media_sources,captions",
          }).toString(),
      );
      return await res.json();
    } catch (err) {
      Logger.error(
        `Failed to get lecture data by courseId: ${courseId} and lectureId: ${lectureId}`,
        err.message,
      );
      return undefined;
    }
  }
  async getCourseLang(courseId) {
    try {
      const res = await this.fetch(
        `${this.API_ORIGIN}/users/me/subscribed-courses/${courseId}?` +
          new URLSearchParams({
            "fields[course]": "locale",
          }).toString(),
      );
      return await res.json();
    } catch (err) {
      Logger.error(
        `Failed to get course lang by courseId: ${courseId}`,
        err.message,
      );
      return undefined;
    }
  }
  findVideoUrl(sources) {
    return sources?.find((src) => src.type === "video/mp4")?.src;
  }
  findSubtitleUrl(captions, detectedLanguage) {
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
  async getVideoData(videoId) {
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
    if (!availableLangs.includes(courseLang)) {
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
            detectedLanguage: courseLang,
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
  async getVideoId(url) {
    return url.pathname.slice(1);
  }
}

import { MinimalVideoData } from "../types/client";
import VideoJSHelper from "./videojs";
import * as CourseraPlayer from "../types/helpers/coursera";
import * as VideoJS from "../types/helpers/videojs";

import * as Coursera from "@vot.js/shared/types/helpers/coursera";
import { normalizeLang } from "@vot.js/shared/utils/utils";
import { availableLangs } from "@vot.js/shared/consts";
import { RequestLang } from "@vot.js/shared/types/data";
import Logger from "@vot.js/shared/utils/logger";
import { VideoDataSubtitle } from "@vot.js/core/types/client";

export default class CourseraHelper extends VideoJSHelper {
  API_ORIGIN = "https://www.coursera.org/api";
  SUBTITLE_SOURCE = "coursera";

  async getCourseData(courseId: string | number) {
    try {
      const response = await this.fetch(
        `${this.API_ORIGIN}/onDemandCourses.v1/${courseId}`,
      );

      const resJSON = (await response.json()) as Coursera.CourseData;
      return resJSON?.elements?.[0] as Coursera.Course;
    } catch (err) {
      Logger.error(
        `Failed to get course data by courseId: ${courseId}`,
        (err as Error).message,
      );
      return undefined;
    }
  }

  static getPlayer<
    T extends VideoJS.PlayerOptions = CourseraPlayer.PlayerOptions,
  >() {
    return super.getPlayer<T>();
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const data = this.getVideoDataByPlayer(videoId);
    if (!data) {
      return undefined;
    }

    const { options_: options } = CourseraHelper.getPlayer() ?? {};
    if (!data.subtitles?.length && options) {
      data.subtitles = options.tracks.map(
        (track) =>
          ({
            url: track.src,
            language: normalizeLang(track.srclang),
            source: this.SUBTITLE_SOURCE,
            format: this.SUBTITLE_FORMAT,
          }) as VideoDataSubtitle,
      );
    }

    const courseId = options?.courseId;
    if (!courseId) {
      return data;
    }

    let courseLang: RequestLang = "en";
    const courseData = await this.getCourseData(courseId);
    if (courseData) {
      const {
        primaryLanguageCodes: [primaryLangauge],
      } = courseData;
      courseLang = primaryLangauge
        ? (normalizeLang(primaryLangauge) as RequestLang)
        : "en";
    }

    if (!availableLangs.includes(courseLang)) {
      courseLang = "en";
    }

    const subtitleItem =
      data.subtitles.find((subtitle) => subtitle.language === courseLang) ??
      data.subtitles?.[0];
    const subtitleUrl = subtitleItem?.url;
    if (!subtitleUrl) {
      Logger.warn("Failed to find any subtitle file");
    }

    const { url, duration } = data;
    const translationHelp = subtitleUrl
      ? [
          {
            target: "subtitles_file_url" as const,
            targetUrl: subtitleUrl,
          },
          {
            target: "video_file_url" as const,
            targetUrl: url,
          },
        ]
      : null;
    return {
      ...(subtitleUrl
        ? {
            url: this.service?.url + videoId,
            translationHelp,
          }
        : {
            url,
            translationHelp,
          }),
      detectedLanguage: courseLang,
      duration,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    const matched =
      /learn\/([^/]+)\/lecture\/([^/]+)/.exec(url.pathname) ??
      /lecture\/([^/]+)\/([^/]+)/.exec(url.pathname);
    return matched?.[0];
  }
}

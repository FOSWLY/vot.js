import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import { availableLangs } from "@vot.js/shared/consts";
import type { RequestLang } from "@vot.js/shared/types/data";
import type * as Coursera from "@vot.js/shared/types/helpers/coursera";
import Logger from "@vot.js/shared/utils/logger";
import { normalizeLang } from "@vot.js/shared/utils/utils";
import VideoJSHelper from "../players/videojs";
import type { MinimalVideoData } from "../types/client";
import type * as CourseraPlayer from "../types/helpers/coursera";
import type * as VideoJS from "../types/helpers/videojs";

export default class CourseraHelper extends VideoJSHelper {
  API_ORIGIN = "https://www.coursera.org/api";
  SUBTITLE_SOURCE = "coursera";

  async getCourseData(courseIdOrSlug: string | number) {
    try {
      const isSlug =
        typeof courseIdOrSlug === "string" && courseIdOrSlug.includes("-");
      const url = isSlug
        ? `${this.API_ORIGIN}/onDemandCourses.v1?q=slug&slug=${courseIdOrSlug}`
        : `${this.API_ORIGIN}/onDemandCourses.v1/${courseIdOrSlug}`;

      const response = await this.fetch(url);
      const resJSON = (await response.json()) as Coursera.CourseData;
      return resJSON?.elements?.[0] as Coursera.Course;
    } catch (err) {
      Logger.error(
        `Failed to get course data: ${courseIdOrSlug}`,
        (err as Error).message,
      );
      return undefined;
    }
  }

  getCourseSlug(): string | undefined {
    const matched =
      /learn\/([^/]+)\/lecture/.exec(window.location.pathname) ??
      /lecture\/([^/]+)\//.exec(window.location.pathname);
    return matched?.[1];
  }

  getCourseId(): string | undefined {
    const player = CourseraHelper.getPlayer();
    if (player?.options_?.courseId) {
      return player.options_.courseId;
    }

    const courseraObj = (window as any).coursera;
    if (typeof courseraObj?.courseId === "string") {
      return courseraObj.courseId;
    } else if (typeof courseraObj?.courseId === "function") {
      try {
        return courseraObj.courseId();
      } catch {}
    }

    return (window as any).App?.context?.dispatcher?.stores?.CourseStore
      ?.courseId;
  }

  static getPlayer<
    T extends VideoJS.PlayerOptions = CourseraPlayer.PlayerOptions,
  >(): VideoJS.Player<T> | undefined {
    return VideoJSHelper.getPlayer<T>();
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const data = this.getVideoDataByPlayer(videoId);
    if (!data) {
      return undefined;
    }

    const player = CourseraHelper.getPlayer();
    const options = player?.options_;

    if (!data.subtitles?.length && options?.tracks) {
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

    const courseIdOrSlug =
      options?.courseId ?? this.getCourseId() ?? this.getCourseSlug();
    let courseLang: RequestLang = "en";
    let courseData: Coursera.Course | undefined;

    if (courseIdOrSlug) {
      courseData = await this.getCourseData(courseIdOrSlug);
    }

    if (courseData?.primaryLanguageCodes?.[0]) {
      courseLang = normalizeLang(
        courseData.primaryLanguageCodes[0],
      ) as RequestLang;
    } else {
      courseLang = normalizeLang(
        document.documentElement.lang || "en",
      ) as RequestLang;
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
      url: subtitleUrl ? this.service?.url + videoId : url,
      translationHelp,
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

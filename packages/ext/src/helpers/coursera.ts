import { BaseHelper } from "./base.js";

import * as Coursera from "@vot.js/shared/types/helpers/coursera";
import { normalizeLang } from "@vot.js/shared/utils/utils";
import { availableLangs } from "@vot.js/shared/consts";
import { RequestLang } from "@vot.js/shared/types/data";
import Logger from "@vot.js/shared/utils/logger";
import { MinimalVideoData } from "../types/client.js";

export default class CourseraHelper extends BaseHelper {
  API_ORIGIN = "https://www.coursera.org/api";

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

  getPlayer() {
    return document.querySelector(".vjs-v8") as HTMLElement | undefined;
  }

  getPlayerData() {
    return (this.getPlayer() as any)?.player as Coursera.PlayerData;
  }

  findVideoUrl(sources: Coursera.Source[]) {
    return sources?.find((src) => src.type === "video/mp4")?.src;
  }

  findSubtitleUrl(captions: Coursera.Track[], detectedLanguage: string) {
    let subtitle = captions?.find(
      (caption) => normalizeLang(caption.srclang) === detectedLanguage,
    );

    if (!subtitle) {
      subtitle =
        captions?.find((caption) => normalizeLang(caption.srclang) === "en") ||
        captions?.[0];
    }

    return subtitle?.src;
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const playerData = this.getPlayerData();
    if (!playerData) {
      Logger.error("Failed to find player data");
      return undefined;
    }

    const {
      cache_: { duration },
      options_: { courseId, tracks, sources },
    } = playerData;

    const videoUrl = this.findVideoUrl(sources);
    if (!videoUrl) {
      Logger.error("Failed to find .mp4 video file in sources", sources);
      return undefined;
    }

    let courseLang = "en";
    const courseData = await this.getCourseData(courseId);
    if (courseData) {
      const {
        primaryLanguageCodes: [primaryLangauge],
      } = courseData;
      courseLang = primaryLangauge ? normalizeLang(primaryLangauge) : "en";
    }

    if (!availableLangs.includes(courseLang as RequestLang)) {
      courseLang = "en";
    }

    const subtitleUrl = this.findSubtitleUrl(tracks, courseLang);
    if (!subtitleUrl) {
      Logger.warn("Failed to find subtitle file in tracks", tracks);
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
          }
        : {
            url: videoUrl,
            translationHelp: null,
          }),
      detectedLanguage: courseLang as RequestLang,
      duration,
    };
  }

  async getVideoId(url: URL) {
    return /learn\/([^/]+)\/lecture\/([^/]+)/.exec(url.pathname)?.[0]; // <-- COURSE PASSING (IF YOU LOGINED TO COURSERA)
  }
}

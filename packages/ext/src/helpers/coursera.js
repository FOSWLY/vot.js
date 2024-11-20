import { BaseHelper } from "./base.js";
import { normalizeLang } from "@vot.js/shared/utils/utils";
import { availableLangs } from "@vot.js/shared/consts";
import Logger from "@vot.js/shared/utils/logger";
export default class CourseraHelper extends BaseHelper {
  API_ORIGIN = "https://www.coursera.org/api";
  async getCourseData(courseId) {
    try {
      const response = await this.fetch(
        `${this.API_ORIGIN}/onDemandCourses.v1/${courseId}`,
      );
      const resJSON = await response.json();
      return resJSON?.elements?.[0];
    } catch (err) {
      Logger.error(
        `Failed to get course data by courseId: ${courseId}`,
        err.message,
      );
      return undefined;
    }
  }
  getPlayer() {
    return document.querySelector(".vjs-v8");
  }
  getPlayerData() {
    return this.getPlayer()?.player;
  }
  findVideoUrl(sources) {
    return sources?.find((src) => src.type === "video/mp4")?.src;
  }
  findSubtitleUrl(captions, detectedLanguage) {
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
  async getVideoData(videoId) {
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
    if (!availableLangs.includes(courseLang)) {
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
      detectedLanguage: courseLang,
      duration,
    };
  }
  async getVideoId(url) {
    return /learn\/([^/]+)\/lecture\/([^/]+)/.exec(url.pathname)?.[0];
  }
}

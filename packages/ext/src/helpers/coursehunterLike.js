import { BaseHelper } from "./base";
import Logger from "@vot.js/shared/utils/logger";
export default class CoursehunterLikeHelper extends BaseHelper {
  API_ORIGIN = this.origin ?? "https://coursehunter.net";
  async getCourseId() {
    const courseId = window.course_id;
    if (courseId !== undefined) {
      return String(courseId);
    }
    const inputEl = document.querySelector('input[name="course_id"]');
    return inputEl ? inputEl.value : undefined;
  }
  async getLessonsData(courseId) {
    const lessons = window.lessons;
    if (lessons?.length) {
      return lessons;
    }
    try {
      const res = await this.fetch(
        `${this.API_ORIGIN}/api/v1/course/${courseId}/lessons`,
      );
      return await res.json();
    } catch (err) {
      Logger.error(
        `Failed to get CoursehunterLike lessons data by courseId: ${courseId}, because ${err.message}`,
      );
      return undefined;
    }
  }
  getLessondId(videoId) {
    let lessondId = videoId.split("?lesson=")?.[1];
    if (lessondId) {
      return +lessondId;
    }
    const activeLessondEl = document.querySelector(".lessons-item_active");
    lessondId = activeLessondEl?.dataset?.index;
    if (lessondId) {
      return +lessondId;
    }
    return 1;
  }
  async getVideoData(videoId) {
    const courseId = await this.getCourseId();
    if (!courseId) {
      return undefined;
    }
    const lessonsData = await this.getLessonsData(courseId);
    if (!lessonsData) {
      return undefined;
    }
    const lessonId = this.getLessondId(videoId);
    const currentLesson = lessonsData?.[lessonId - 1];
    const { file: videoUrl, duration, title } = currentLesson;
    if (!videoUrl) {
      return undefined;
    }
    return {
      url: videoUrl,
      duration,
      title,
    };
  }
  async getVideoId(url) {
    const courseId = /course\/([^/]+)/.exec(url.pathname)?.[0];
    return courseId ? courseId + url.search : undefined;
  }
}

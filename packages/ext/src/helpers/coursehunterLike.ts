import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";

import type { Lesson } from "@vot.js/shared/types/helpers/coursehunterLike";
import Logger from "@vot.js/shared/utils/logger";

export default class CoursehunterLikeHelper extends BaseHelper {
  API_ORIGIN = this.origin ?? "https://coursehunter.net";

  // eslint-disable-next-line @typescript-eslint/require-await
  async getCourseId() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const courseId = (window as any).course_id as number | undefined;
    if (courseId !== undefined) {
      return String(courseId);
    }

    const inputEl = document.querySelector('input[name="course_id"]') as
      | HTMLInputElement
      | undefined;

    return inputEl ? inputEl.value : undefined;
  }

  async getLessonsData(courseId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const lessons = (window as any).lessons as Lesson[] | undefined;
    if (lessons?.length) {
      return lessons;
    }

    try {
      const res = await this.fetch(
        `${this.API_ORIGIN}/api/v1/course/${courseId}/lessons`,
      );
      return (await res.json()) as Lesson[];
    } catch (err) {
      Logger.error(
        `Failed to get CoursehunterLike lessons data by courseId: ${courseId}, because ${
          (err as Error).message
        }`,
      );
      return undefined;
    }
  }

  getLessondId(videoId: string) {
    let lessondId: string | undefined = videoId.split("?lesson=")?.[1];
    if (lessondId) {
      return +lessondId;
    }

    const activeLessondEl = document.querySelector(".lessons-item_active") as
      | HTMLElement
      | undefined;
    lessondId = activeLessondEl?.dataset?.index;
    if (lessondId) {
      return +lessondId;
    }

    return 1;
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
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

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    const courseId = /course\/([^/]+)/.exec(url.pathname)?.[0];
    return courseId ? courseId + url.search : undefined;
  }
}

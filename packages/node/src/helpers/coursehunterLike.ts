import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";

import type { Lesson } from "@vot.js/shared/types/helpers/coursehunterLike";
import Logger from "@vot.js/shared/utils/logger";

export default class CoursehunterLikeHelper extends BaseHelper {
  API_ORIGIN = this.origin ?? "https://coursehunter.net";

  async getCourseId(videoId: string) {
    try {
      const res = await this.fetch(`${this.API_ORIGIN}/${videoId}`);
      const content = await res.text();
      return /course_id(\s)?=(\s)?([\d]+)/.exec(content)?.[3];
    } catch (err) {
      Logger.error(
        `Failed to get CoursehunterLike courseId by videoId: ${videoId}, because ${
          (err as Error).message
        }`,
      );
      return undefined;
    }
  }

  async getLessonsData(courseId: string) {
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
    return +(videoId.split("?lesson=")?.[1] ?? 1);
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const courseId = await this.getCourseId(videoId);
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
import { MinimalVideoData } from "../types/client";
import { Lesson } from "../types/helpers/coursehunter";
import { BaseHelper } from "./base";

export default class CoursehunterHelper extends BaseHelper {
  API_ORIGIN = "https://coursehunter.net";

  async getCourseId(videoId: string) {
    try {
      const res = await this.fetch(`${this.API_ORIGIN}/course/${videoId}`);
      const content = await res.text();
      return /course_id(\s)?=(\s)?([\d]+)/.exec(content)?.[3];
    } catch (err: unknown) {
      console.error(
        `Failed to get Coursehunter courseId by videoId: ${videoId}`,
        (err as Error).message,
      );
      return false;
    }
  }

  async getLessonsData(courseId: string) {
    try {
      const res = await this.fetch(
        `${this.API_ORIGIN}/api/v1/course/${courseId}/lessons`,
      );
      return (await res.json()) as Lesson[];
    } catch (err: unknown) {
      console.error(
        `Failed to get Coursehunter lessons data by courseId: ${courseId}`,
        (err as Error).message,
      );
      return false;
    }
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

    const lessonId = +(videoId.split("?lesson=")?.[1] ?? 1);
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
    const courseId = /\/course\/([^/]+)/.exec(url.pathname)?.[1];
    return courseId ? courseId + url.search : undefined;
  }
}

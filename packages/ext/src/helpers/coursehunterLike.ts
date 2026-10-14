import type { Lesson } from "@vot.js/shared/types/helpers/coursehunterLike";
import Logger from "@vot.js/shared/utils/logger";
import { proxyMedia } from "@vot.js/shared/utils/utils";
import type { MinimalVideoData } from "../types/client";
import { BaseHelper } from "./base";

type CoursehunterLikeWindow = Window & {
  course_id?: number;
  lessons?: Lesson[];
};

export default class CoursehunterLikeHelper extends BaseHelper {
  API_ORIGIN = this.origin ?? "https://coursehunter.net";

  // eslint-disable-next-line @typescript-eslint/require-await
  async getCourseId() {
    const courseId = (window as CoursehunterLikeWindow).course_id;
    if (courseId !== undefined) {
      return String(courseId);
    }

    return document.querySelector<HTMLInputElement>('input[name="course_id"]')
      ?.value;
  }

  async getLessonsData(courseId: string) {
    const lessons = (window as CoursehunterLikeWindow).lessons;
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

    const activeLessondEl = document.querySelector<HTMLElement>(
      ".lessons-item_active",
    );
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

    const VideoData: MinimalVideoData & {
      video_url: string;
    } = {
      url: videoId,
      video_url: videoUrl,
      translationHelp: [
        {
          target: "video_file_url",
          targetUrl: proxyMedia(videoUrl, "mp4", this.mediaProxy),
        },
      ],
      duration,
      title,
    };

    return VideoData;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return url.href;
  }
}

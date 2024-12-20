import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";
import * as Artstation from "../types/helpers/artstation";

import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import { normalizeLang } from "@vot.js/shared/utils/utils";
import Logger from "@vot.js/shared/utils/logger";

export default class ArtstationHelper extends BaseHelper {
  API_ORIGIN = "https://www.artstation.com/api/v2/learning";

  async getCourseInfo(courseId: string) {
    try {
      const res = await this.fetch(
        `${this.API_ORIGIN}/courses/${courseId}/autoplay.json`,
      );

      return (await res.json()) as Artstation.Course;
    } catch (err) {
      Logger.error(
        `Failed to get artstation course info by courseId: ${courseId}.`,
        (err as Error).message,
      );
      return false;
    }
  }

  async getVideoUrl(chapterId: number) {
    try {
      const res = await this.fetch(
        `${this.API_ORIGIN}/quicksilver/video_url.json?chapter_id=${chapterId}`,
      );

      const data = (await res.json()) as Artstation.VideoUrlData;
      return data.url.replace("qsep://", "https://");
    } catch (err) {
      Logger.error(
        `Failed to get artstation video url by chapterId: ${chapterId}.`,
        (err as Error).message,
      );
      return false;
    }
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const [, courseId, , , chapterId] = videoId.split("/")?.[1];
    const courseInfo = await this.getCourseInfo(courseId);
    if (!courseInfo) {
      return undefined;
    }

    const chapter = courseInfo.chapters.find(
      (chapter) => chapter.hash_id === chapterId,
    );
    if (!chapter) {
      return undefined;
    }

    const videoUrl = await this.getVideoUrl(chapter.id);
    if (!videoUrl) {
      return undefined;
    }

    const { title, duration, subtitles: videoSubtitles } = chapter;
    const subtitles: VideoDataSubtitle[] = videoSubtitles
      .filter((subtitle) => subtitle.format === "vtt")
      .map((subtitle) => ({
        language: normalizeLang(subtitle.locale),
        source: "artstation",
        format: "vtt",
        url: subtitle.file_url,
      }));

    // url returns a json containing a dash playlist (in base64) in the playlist field
    return {
      url: videoUrl,
      title,
      duration,
      subtitles,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL): Promise<string | undefined> {
    return /courses\/(\w{3,5})\/([^/]+)\/chapters\/(\w{3,5})/.exec(
      url.pathname,
    )?.[0];
  }
}

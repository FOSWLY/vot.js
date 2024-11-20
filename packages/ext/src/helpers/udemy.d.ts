import { BaseHelper } from "./base.js";
import { MinimalVideoData } from "../types/client.js";
import * as Udemy from "@vot.js/shared/types/helpers/udemy";
export default class UdemyHelper extends BaseHelper {
  API_ORIGIN: string;
  getModuleData(): any;
  getLectureId(): string | undefined;
  getLectureData(
    courseId: number | string,
    lectureId: number | string,
  ): Promise<any>;
  getCourseLang(courseId: number | string): Promise<any>;
  findVideoUrl(sources: Udemy.MediaSource[]): any;
  findSubtitleUrl(captions: Udemy.Caption[], detectedLanguage: string): any;
  getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
  getVideoId(url: URL): Promise<string>;
}
//# sourceMappingURL=udemy.d.ts.map

import { BaseHelper } from "./base.js";
import * as Coursera from "@vot.js/shared/types/helpers/coursera";
import { MinimalVideoData } from "../types/client.js";
export default class CourseraHelper extends BaseHelper {
  API_ORIGIN: string;
  getCourseData(courseId: string | number): Promise<any>;
  getPlayer(): HTMLElement | undefined;
  getPlayerData(): Coursera.PlayerData;
  findVideoUrl(sources: Coursera.Source[]): any;
  findSubtitleUrl(captions: Coursera.Track[], detectedLanguage: string): any;
  getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
  getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=coursera.d.ts.map

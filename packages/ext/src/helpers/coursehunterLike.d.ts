import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";
export default class CoursehunterLikeHelper extends BaseHelper {
  API_ORIGIN: string;
  getCourseId(): Promise<string | undefined>;
  getLessonsData(courseId: string): Promise<Lesson[] | undefined>;
  getLessondId(videoId: string): number;
  getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
  getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=coursehunterLike.d.ts.map

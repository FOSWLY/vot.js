import { MinimalVideoData } from "../types/client.js";
import { Lesson } from "../types/helpers/coursehunter.js";
import { BaseHelper } from "./base.js";
export default class CoursetrainHelper extends BaseHelper {
    API_ORIGIN: string;
    getCourseId(videoId: string): Promise<string | false | undefined>;
    getLessonsData(courseId: string): Promise<false | Lesson[]>;
    getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
    getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=coursetrain.d.ts.map
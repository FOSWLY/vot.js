import { BaseHelper } from "./base.js";
import * as Kick from "../types/helpers/kick.js";
export default class KickHelper extends BaseHelper {
    API_ORIGIN: string;
    getClipInfo(clipId: string): Promise<false | Kick.Response>;
    getVideoData(videoId: string): Promise<{
        url: string;
        duration?: undefined;
        title?: undefined;
    } | {
        url: string;
        duration: number;
        title: string;
    } | undefined>;
    getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=kick.d.ts.map
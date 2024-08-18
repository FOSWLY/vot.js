import { BaseHelper } from "./base.js";
import * as NineAnimeTV from "../types/helpers/nineanimetv.js";
export default class NineAnimeTVHelper extends BaseHelper {
    API_ORIGIN: string;
    RAPID_CLOUD_ORIGIN: string;
    getSourceId(episodeId: string | number): Promise<string | false | undefined>;
    getPlayerLink(sourceId: string | number): Promise<string | false>;
    getRapidCloudData(rapidId: string): Promise<false | NineAnimeTV.RapidData>;
    getVideoData(videoId: string): Promise<{
        url: string;
    } | undefined>;
    getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=nineanimetv.d.ts.map
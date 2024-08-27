import { BaseHelper } from "./base.js";
import * as BannedVideo from "../types/helpers/bannedvideo.js";
import { MinimalVideoData } from "../types/client.js";
export default class BannedVideoHelper extends BaseHelper {
    API_ORIGIN: string;
    getVideoInfo(videoId: string): Promise<false | BannedVideo.GraphQLResponse>;
    getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
    getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=bannedvideo.d.ts.map
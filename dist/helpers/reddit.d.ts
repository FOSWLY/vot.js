import { MinimalVideoData } from "../types/client.js";
import { BaseHelper } from "./base.js";
export default class RedditHelper extends BaseHelper {
    API_ORIGIN: string;
    getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
    getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=reddit.d.ts.map
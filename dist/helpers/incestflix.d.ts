import { MinimalVideoData } from "../types/client.js";
import { BaseHelper } from "./base.js";
export default class IncestflixHelper extends BaseHelper {
    getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
    getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=incestflix.d.ts.map
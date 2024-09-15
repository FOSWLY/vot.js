import { MinimalVideoData } from "../types/client.js";
import { BaseHelper } from "./base.js";
export default class LinkedinHelper extends BaseHelper {
    API_ORIGIN: string;
    getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
    getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=linkedin.d.ts.map
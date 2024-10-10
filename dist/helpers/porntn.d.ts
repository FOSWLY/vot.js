import { MinimalVideoData } from "../types/client.js";
import { BaseHelper } from "./base.js";
export default class PornTNHelper extends BaseHelper {
    getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
    getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=porntn.d.ts.map
import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";
export default class PornTNHelper extends BaseHelper {
  getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
  getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=porntn.d.ts.map

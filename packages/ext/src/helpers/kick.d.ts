import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";
export default class KickHelper extends BaseHelper {
  API_ORIGIN: string;
  getClipInfo(clipId: string): Promise<MinimalVideoData | undefined>;
  getVideoInfo(videoId: string): Promise<MinimalVideoData | undefined>;
  getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
  getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=kick.d.ts.map

import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";
export default class RedditHelper extends BaseHelper {
  API_ORIGIN: string;
  getContentUrl(videoId: string): Promise<string | undefined>;
  getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
  getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=reddit.d.ts.map

import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";
export default class LinkedinHelper extends BaseHelper {
  API_ORIGIN: string;
  getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
  getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=linkedin.d.ts.map

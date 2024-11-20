import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";
export default class AppleDeveloperHelper extends BaseHelper {
  API_ORIGIN: string;
  getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
  getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=appledeveloper.d.ts.map

import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";
export default class IncestflixHelper extends BaseHelper {
  getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
  getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=incestflix.d.ts.map

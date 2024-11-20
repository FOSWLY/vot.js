import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";
export default class EpicGamesHelper extends BaseHelper {
  API_ORIGIN: string;
  getPostInfo(videoId: string): Promise<any>;
  getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
  getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=epicgames.d.ts.map

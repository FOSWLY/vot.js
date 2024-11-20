import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";
export default class NineAnimeTVHelper extends BaseHelper {
  API_ORIGIN: string;
  RAPID_CLOUD_ORIGIN: string;
  getSourceId(episodeId: string | number): Promise<string | false | undefined>;
  getPlayerLink(sourceId: string | number): Promise<any>;
  getRapidCloudData(rapidId: string): Promise<any>;
  getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
  getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=nineanimetv.d.ts.map

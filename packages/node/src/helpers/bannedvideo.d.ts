import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";
import * as BannedVideo from "@vot.js/shared/types/helpers/bannedvideo";
export default class BannedVideoHelper extends BaseHelper {
  API_ORIGIN: string;
  getVideoInfo(videoId: string): Promise<false | BannedVideo.GraphQLResponse>;
  getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
  getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=bannedvideo.d.ts.map

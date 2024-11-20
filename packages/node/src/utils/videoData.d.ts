import type { GetVideoDataOpts, VideoData } from "@vot.js/core/types/client";
import { type ServiceConf, VideoService } from "../types/service";
export declare function getService(
  videoUrl: string,
): false | ServiceConf | undefined;
export declare function getVideoID(
  service: ServiceConf,
  videoURL: string,
  opts?: GetVideoDataOpts,
): Promise<string | undefined>;
export declare function getVideoData(
  url: string,
  opts?: GetVideoDataOpts,
): Promise<VideoData<VideoService>>;
//# sourceMappingURL=videoData.d.ts.map

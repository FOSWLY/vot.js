import type { GetVideoDataOpts, VideoData } from "@vot.js/core/types/client";
import { type ServiceConf, VideoService } from "../types/service";
export declare function getService(): ServiceConf[];
export declare function getVideoID(
  service: ServiceConf,
  video: HTMLVideoElement,
  opts?: GetVideoDataOpts,
): Promise<any>;
export declare function getVideoData(
  service: ServiceConf,
  video: HTMLVideoElement,
  opts?: GetVideoDataOpts,
): Promise<VideoData<VideoService>>;
//# sourceMappingURL=videoData.d.ts.map

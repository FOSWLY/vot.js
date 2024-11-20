import { FetchFunction } from "@vot.js/core/types/client";
import { BaseHelperOpts } from "@vot.js/core/types/helpers/base";
import type { MinimalVideoData } from "../types/client";
import { ServiceConf } from "../types/service";
export declare class VideoHelperError extends Error {
  constructor(message: string);
}
export declare class BaseHelper {
  API_ORIGIN: string;
  fetch: FetchFunction;
  extraInfo: boolean;
  referer: string;
  origin: string;
  service: ServiceConf | undefined;
  constructor({
    fetchFn,
    extraInfo,
    referer,
    origin,
    service,
  }?: BaseHelperOpts<ServiceConf>);
  getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
  getVideoId(url: URL): Promise<string | undefined>;
  returnBaseData(videoId: string):
    | {
        url: string;
        videoId: string;
        host: import("../types/service").VideoService;
        duration: undefined;
      }
    | undefined;
}
//# sourceMappingURL=base.d.ts.map

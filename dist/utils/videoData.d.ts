import { ServiceConf } from "../types/yandex.js";
import { GetVideoDataOpts, VideoData } from "../types/client.js";
export declare function getService(videoUrl: string): false | ServiceConf | undefined;
export declare function getVideoID(service: ServiceConf, videoURL: string, opts?: GetVideoDataOpts): Promise<string | undefined>;
export declare function getVideoData(url: string, opts?: GetVideoDataOpts): Promise<VideoData>;
//# sourceMappingURL=videoData.d.ts.map
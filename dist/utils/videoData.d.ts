import { ServiceConf } from "../types/yandex";
import { VideoData } from "../types/client";
export declare function getService(videoUrl: string): false | ServiceConf | undefined;
export declare function getVideoID(service: ServiceConf, videoURL: string): Promise<string | null | undefined>;
export declare function getVideoData(url: string): Promise<VideoData>;
//# sourceMappingURL=videoData.d.ts.map
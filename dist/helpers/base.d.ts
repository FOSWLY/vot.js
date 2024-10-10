import { FetchFunction, MinimalVideoData } from "../types/client.js";
import { BaseHelperOpts } from "../types/helpers/base.js";
import { ServiceConf } from "../types/yandex.js";
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
    constructor({ fetchFn, extraInfo, referer, origin, service, }?: BaseHelperOpts);
    getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
    getVideoId(url: URL): Promise<string | undefined>;
    returnBaseData(videoId: string): {
        url: string;
        videoId: string;
        host: import("../types/yandex.js").VideoService;
        duration: undefined;
    } | undefined;
}
//# sourceMappingURL=base.d.ts.map
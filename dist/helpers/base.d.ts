import { FetchFunction, MinimalVideoData } from "../types/client.js";
import { BaseHelperOpts } from "../types/helpers/base.js";
export declare class VideoHelperError extends Error {
    constructor(message: string);
}
export declare class BaseHelper {
    API_ORIGIN: string;
    fetch: FetchFunction;
    constructor({ fetchFn }?: BaseHelperOpts);
    getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
    getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=base.d.ts.map
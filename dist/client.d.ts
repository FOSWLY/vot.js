import type { VOTOpts, FetchFunction, NormalizeFunction } from "./types/client";
import type { VideoTranslationOpts, VideoTranslationResponse, RequestLang, ResponseLang, VideoSubtitlesOpts, StreamPingOptions, StreamTranslationOpts, StreamTranslationResponse } from "./types/yandex";
export default class VOTClient {
    host: string;
    fetch: FetchFunction;
    fetchOpts: Record<string, unknown>;
    normalize: NormalizeFunction;
    requestLang: RequestLang;
    responseLang: ResponseLang;
    userAgent: string;
    headers: Record<string, string>;
    constructor({ host, fetchFn, fetchOpts, normalizeFn, requestLang, responseLang, }?: VOTOpts);
    request(path: string, body: Uint8Array, headers?: Record<string, string>): Promise<{
        success: boolean;
        data: ArrayBuffer;
    } | {
        success: boolean;
        data: null;
    }>;
    translateVideo({ url, duration, requestLang, responseLang, translationHelp, headers, }: VideoTranslationOpts): Promise<VideoTranslationResponse>;
    getSubtitles({ url, requestLang, headers, }: VideoSubtitlesOpts): Promise<import("./protos/yandex").SubtitlesResponse>;
    pingStream({ pingId, headers }: StreamPingOptions): Promise<boolean>;
    translateStream({ url, requestLang, responseLang, headers, }: StreamTranslationOpts): Promise<StreamTranslationResponse>;
}
export declare class VOTWorkerClient extends VOTClient {
    request(path: string, body: Uint8Array, headers?: Record<string, string>): Promise<{
        success: boolean;
        data: ArrayBuffer;
    } | {
        success: boolean;
        data: null;
    }>;
}
//# sourceMappingURL=client.d.ts.map
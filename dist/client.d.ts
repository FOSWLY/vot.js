import type { VOTOpts, FetchFunction, GetVideoDataFunction } from "./types/client";
import type { VideoTranslationOpts, VideoTranslationResponse, RequestLang, ResponseLang, VideoSubtitlesOpts, StreamPingOptions, StreamTranslationOpts, StreamTranslationResponse, SessionModule } from "./types/yandex";
export default class VOTClient {
    host: string;
    /**
     * If you don't want to use the classic fetch
     * @includeExample examples/with_ofetch.ts:1-13
     */
    fetch: FetchFunction;
    fetchOpts: Record<string, unknown>;
    getVideoDataFn: GetVideoDataFunction;
    requestLang: RequestLang;
    responseLang: ResponseLang;
    userAgent: string;
    componentVersion: string;
    headers: Record<string, string>;
    constructor({ host, fetchFn, fetchOpts, getVideoDataFn, requestLang, responseLang, }?: VOTOpts);
    /**
     * The standard method for requesting the Yandex API, if necessary, you can override how it is done in the example
     * @includeExample examples/with_axios.ts:4-41
     */
    request(path: string, body: Uint8Array, headers?: Record<string, string>): Promise<{
        success: boolean;
        data: ArrayBuffer;
    } | {
        success: boolean;
        data: null;
    }>;
    /**
     * @includeExample examples/basic.ts:4-11,21-37,55-65
     */
    translateVideo({ url, duration, requestLang, responseLang, translationHelp, headers, }: VideoTranslationOpts): Promise<VideoTranslationResponse>;
    /**
     * @includeExample examples/basic.ts:4-5,48-54
     */
    getSubtitles({ url, requestLang, headers, }: VideoSubtitlesOpts): Promise<import("./protos/yandex").SubtitlesResponse>;
    /**
     * @includeExample examples/stream.ts:7-44
     */
    pingStream({ pingId, headers }: StreamPingOptions): Promise<boolean>;
    /**
     * @includeExample examples/stream.ts:7-44
     */
    translateStream({ url, requestLang, responseLang, headers, }: StreamTranslationOpts): Promise<StreamTranslationResponse>;
    createSession(module: SessionModule): Promise<{
        uuid: string;
        secretKey: string;
        expires: number;
    }>;
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
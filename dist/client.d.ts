import type { VOTOpts, FetchFunction, GetVideoDataFunction, ClientSession, VOTSessions, URLSchema, ClientResponse } from "./types/client";
import type { VideoTranslationOpts, VideoTranslationResponse, RequestLang, ResponseLang, VideoSubtitlesOpts, StreamPingOptions, StreamTranslationOpts, StreamTranslationResponse, SessionModule } from "./types/yandex";
import { VideoTranslationVOTOpts } from "./types/vot";
export default class VOTClient {
    host: string;
    hostVOT: string;
    schema: URLSchema;
    schemaVOT: URLSchema;
    /**
     * If you don't want to use the classic fetch
     * @includeExample examples/with_ofetch.ts:1-13
     */
    fetch: FetchFunction;
    fetchOpts: Record<string, unknown>;
    getVideoDataFn: GetVideoDataFunction;
    sessions: VOTSessions;
    requestLang: RequestLang;
    responseLang: ResponseLang;
    userAgent: string;
    componentVersion: string;
    paths: {
        videoTranslation: string;
    };
    /**
     * Media with this format use VOT Backend API
     * Not all video files in .mpd format are currently supported!
     *
     * @source
     */
    customFormatRE: RegExp;
    /**
     * Headers for interacting with Yandex API
     */
    headers: Record<string, string>;
    /**
     * Headers for interacting with VOT Backend API
     */
    headersVOT: Record<string, string>;
    constructor({ host, hostVOT, fetchFn, fetchOpts, getVideoDataFn, requestLang, responseLang, }?: VOTOpts);
    getOpts(body: any, headers?: Record<string, string>): {
        method: string;
        headers: {
            [x: string]: string;
        };
        body: any;
    };
    /**
     * The standard method for requesting the Yandex API, if necessary, you can override how it is done in the example
     * @includeExample examples/with_axios.ts:4-41
     */
    request(path: string, body: Uint8Array, headers?: Record<string, string>): Promise<ClientResponse>;
    /**
     * The standard method for requesting the VOT Backend API
     */
    requestVOT<T = any>(path: string, body: NonNullable<any>, headers?: Record<string, string>): Promise<ClientResponse<T>>;
    getSession(module: SessionModule): Promise<ClientSession>;
    protected translateVideoYAImpl({ url, duration, requestLang, responseLang, translationHelp, headers, }: VideoTranslationOpts): Promise<VideoTranslationResponse>;
    protected translateVideoVOTImpl({ url, videoId, service, requestLang, responseLang, headers, }: VideoTranslationVOTOpts): Promise<VideoTranslationResponse>;
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
    request(path: string, body: Uint8Array, headers?: Record<string, string>): Promise<ClientResponse>;
}
//# sourceMappingURL=client.d.ts.map
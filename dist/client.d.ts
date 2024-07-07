import type { VOTOpts, FetchFunction, GetVideoDataFunction, ClientSession, VOTSessions, URLSchema, ClientResponse } from "./types/client.js";
import type { VideoTranslationOpts, VideoTranslationResponse, RequestLang, ResponseLang, VideoSubtitlesOpts, StreamPingOptions, StreamTranslationOpts, StreamTranslationResponse, SessionModule } from "./types/yandex.js";
import { VideoTranslationVOTOpts } from "./types/vot.js";
export default class VOTClient {
    host: string;
    hostVOT: string;
    schema: URLSchema;
    schemaVOT: URLSchema;
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
    isCustomFormat(url: string): RegExpExecArray | null;
    headers: Record<string, string>;
    headersVOT: Record<string, string>;
    constructor({ host, hostVOT, fetchFn, fetchOpts, getVideoDataFn, requestLang, responseLang, headers, }?: VOTOpts);
    getOpts(body: any, headers?: Record<string, string>): {
        method: string;
        headers: {
            [x: string]: string;
        };
        body: any;
    };
    request(path: string, body: Uint8Array, headers?: Record<string, string>): Promise<ClientResponse>;
    requestVOT<T = any>(path: string, body: NonNullable<any>, headers?: Record<string, string>): Promise<ClientResponse<T>>;
    getSession(module: SessionModule): Promise<ClientSession>;
    protected translateVideoYAImpl({ url, duration, requestLang, responseLang, translationHelp, headers, }: VideoTranslationOpts): Promise<VideoTranslationResponse>;
    protected translateVideoVOTImpl({ url, videoId, service, requestLang, responseLang, headers, }: VideoTranslationVOTOpts): Promise<VideoTranslationResponse>;
    translateVideo({ url, duration, requestLang, responseLang, translationHelp, headers, }: VideoTranslationOpts): Promise<VideoTranslationResponse>;
    getSubtitles({ url, requestLang, headers, }: VideoSubtitlesOpts): Promise<import("./protos/yandex.js").SubtitlesResponse>;
    pingStream({ pingId, headers }: StreamPingOptions): Promise<boolean>;
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
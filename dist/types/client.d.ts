import { RequestLang, ResponseLang, SessionModule, VideoService } from "./yandex.js";
export type FetchFunction = (input: string | URL | Request, init?: any) => Promise<Response>;
export type URLSchema = "http" | "https";
export type VideoData = {
    url: string;
    videoId: string;
    host: VideoService;
    duration: number | null | undefined;
};
export type GetVideoDataFunction = (url: string) => Promise<VideoData>;
export type VOTOpts = {
    host?: string;
    hostVOT?: string;
    fetchFn?: FetchFunction;
    fetchOpts?: Record<string, unknown>;
    getVideoDataFn?: GetVideoDataFunction;
    requestLang?: RequestLang;
    responseLang?: ResponseLang;
    headers?: Record<string, string>;
};
export type ClientSession = {
    expires: number;
    timestamp: number;
    uuid: string;
    secretKey: string;
};
export type ClientResponse<T = any> = {
    success: boolean;
    data: null | T;
};
export type VOTSessions = {
    [K in SessionModule]?: ClientSession;
};
//# sourceMappingURL=client.d.ts.map
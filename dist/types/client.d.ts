import { BaseHelperOpts } from "./helpers/base.js";
import { SubtitleFormat } from "./subs.js";
import { AtLeast } from "./utils.js";
import { RequestLang, ResponseLang, SessionModule, TranslationHelp, VideoService } from "./yandex.js";
export type FetchFunction = (input: string | URL | Request, init?: any) => Promise<Response>;
export type URLSchema = "http" | "https";
export type VideoDataSubtitle = {
    language: string;
    format: SubtitleFormat;
    url: string;
    isAutoGenerated?: boolean;
};
export type VideoData = {
    url: string;
    videoId: string;
    host: VideoService;
    duration?: number;
    isStream?: boolean;
    title?: string;
    description?: string;
    subtitles?: VideoDataSubtitle[];
    translationHelp?: TranslationHelp[] | null;
};
export type MinimalVideoData = AtLeast<VideoData, "url">;
export type GetVideoDataOpts = Omit<BaseHelperOpts, "service">;
export type GetVideoDataFunction = (url: string, opts?: GetVideoDataOpts) => Promise<VideoData>;
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
export type ClientSuccessResponse<T = unknown> = {
    success: boolean;
    data: T;
};
export type ClientFailedResponse = {
    success: false;
    data: string | null;
};
export type ClientResponse<T = unknown> = ClientFailedResponse | ClientSuccessResponse<T>;
export type VOTSessions = {
    [K in SessionModule]?: ClientSession;
};
//# sourceMappingURL=client.d.ts.map
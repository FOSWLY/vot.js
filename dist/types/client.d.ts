import { RequestLang, ResponseLang } from "./yandex";
export type FetchFunction = (input: string | URL | Request, init?: any) => Promise<Response>;
export type VideoData = {
    url: string;
    videoId: string;
    duration: number | null | undefined;
};
export type GetVideoDataFunction = (url: string) => Promise<VideoData>;
export type VOTOpts = {
    host?: string;
    fetchFn?: FetchFunction;
    fetchOpts?: Record<string, unknown>;
    getVideoDataFn?: GetVideoDataFunction;
    requestLang?: RequestLang;
    responseLang?: ResponseLang;
};
//# sourceMappingURL=client.d.ts.map
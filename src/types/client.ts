import { RequestLang, ResponseLang } from "./yandex";

export type FetchFunction = (
  input: string | URL | Request,
  init?: any,
) => Promise<Response>;

export type VideoData = {
  url: string;
  videoId: string;
  duration: number | null | undefined;
};

export type GetVideoDataFunction = (url: string) => Promise<VideoData>;

export type VOTOpts = {
  host?: string;
  fetchFn?: FetchFunction; // e.g. GM_fetch, ofetch.native and etc
  fetchOpts?: Record<string, unknown>; // e.g. { dispatcher: ... }
  getVideoDataFn?: GetVideoDataFunction;
  requestLang?: RequestLang;
  responseLang?: ResponseLang;
};

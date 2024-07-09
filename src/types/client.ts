import {
  RequestLang,
  ResponseLang,
  SessionModule,
  VideoService,
} from "./yandex";

export type FetchFunction = (
  input: string | URL | Request,
  init?: any,
) => Promise<Response>;

export type URLSchema = "http" | "https";

export type VideoData = {
  url: string;
  videoId: string;
  host: VideoService;
  duration: number | null | undefined;
  // for compatibility with extension / your own detect request lang logic
  isStream?: boolean;
  title?: string;
  description?: string;
};

export type GetVideoDataFunction = (url: string) => Promise<VideoData>;

export type VOTOpts = {
  host?: string;
  hostVOT?: string;
  fetchFn?: FetchFunction; // e.g. GM_fetch, ofetch.native and etc
  fetchOpts?: Record<string, unknown>; // e.g. { dispatcher: ... }
  getVideoDataFn?: GetVideoDataFunction;
  requestLang?: RequestLang;
  responseLang?: ResponseLang;
  headers?: Record<string, string>;
};

export type ClientSession = {
  expires: number; // seconds lifetime from response (e.g. 3600)
  timestamp: number; // received in time (unix seconds)
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

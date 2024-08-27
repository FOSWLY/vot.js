import { SubtitleFormat } from "./subs";
import { AtLeast } from "./utils";
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

export type VideoDataSubtitle = {
  language: string;
  format: SubtitleFormat;
  url: string;
};

export type VideoData = {
  url: string;
  videoId: string;
  host: VideoService;
  duration?: number;
  // for compatibility with extension / your own detect request lang logic
  isStream?: boolean;
  title?: string;
  description?: string;
  subtitles?: VideoDataSubtitle[];
};

export type MinimalVideoData = AtLeast<VideoData, "url">;

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

export type ClientSuccessResponse<T = unknown> = {
  success: boolean;
  data: T;
};

export type ClientFailedResponse = {
  success: false;
  data: string | null;
};

export type ClientResponse<T = unknown> =
  | ClientFailedResponse
  | ClientSuccessResponse<T>;

export type VOTSessions = {
  [K in SessionModule]?: ClientSession;
};

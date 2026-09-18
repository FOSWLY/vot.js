import {
  RequestHeaders,
  RequestLang,
  ResponseLang,
} from "@vot.js/shared/types/data";
import { VideoService } from "../service";
import { VideoData } from "../client";

export type FetchFunction = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export type BaseProviderOpts = {
  host?: string;
  fetchFn?: FetchFunction; // e.g. GM_fetch, ofetch.native and etc
  fetchOpts?: Record<string, unknown>; // e.g. { dispatcher: ... }
  headers?: Record<string, string>;
  requestLang?: RequestLang;
  responseLang?: ResponseLang;
};

export type BaseVideoTranslationOpts<T extends string = VideoService> = {
  videoData: VideoData<T>;
  requestLang?: RequestLang;
  responseLang?: ResponseLang;
  headers?: RequestHeaders;
  fetchOpts?: Record<string, unknown>;
};

export type BaseVideoSubtitlesOpts<T extends string = VideoService> = {
  videoData: VideoData<T>;
  requestLang?: RequestLang;
  headers?: RequestHeaders;
  fetchOpts?: Record<string, unknown>;
};

export type BaseStreamTranslationOpts<T extends string = VideoService> =
  BaseVideoTranslationOpts<T>;

export type GetSubtitleItem = {
  language: string;
  url: string;
  translatedLanguage: string;
  translatedUrl: string;
};

export type BaseGetSubtitlesResponse<T = GetSubtitleItem> = {
  waiting: boolean;
  subtitles: T[];
};

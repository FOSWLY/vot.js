import type { ClientSession, SessionModule } from "@vot.js/shared/types/secure";
import type { SubtitleFormat } from "@vot.js/shared/types/subs";
import type { RequestLang, ResponseLang } from "@vot.js/shared/types/data";
import type { AtLeast } from "@vot.js/shared/types/utils";

import type { BaseHelperOpts } from "./helpers/base";
import type { TranslationHelp } from "./yandex";
import type { VideoService } from "./service";

export type FetchFunction = (
  input: string | URL | Request,
  init?: any,
) => Promise<Response>;

export type URLSchema = "http" | "https";

export type VideoDataSubtitle = {
  language: string;
  format: SubtitleFormat;
  url: string;
  source: string; // e.g. yandex, youtube and etc...
  isAutoGenerated?: boolean;
  translatedFromLanguage?: string;
};

export type VideoData<T = VideoService> = {
  url: string;
  videoId: string;
  host: T;
  duration?: number;
  // for compatibility with extension / your own detect request lang logic
  isStream?: boolean;
  title?: string;
  localizedTitle?: string;
  description?: string;
  subtitles?: VideoDataSubtitle[];
  detectedLanguage?: RequestLang;
  translationHelp?: TranslationHelp[] | null;
};

export type MinimalVideoData<T = VideoService> = AtLeast<VideoData<T>, "url">;

export type GetVideoDataOpts = Omit<BaseHelperOpts, "service">;

export type MinimalClientOpts = {
  host?: string;
  fetchFn?: FetchFunction; // e.g. GM_fetch, ofetch.native and etc
  fetchOpts?: Record<string, unknown>; // e.g. { dispatcher: ... }
  headers?: Record<string, string>;
};

export type VOTOpts = MinimalClientOpts & {
  hostVOT?: string;
  requestLang?: RequestLang;
  responseLang?: ResponseLang;
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

export type VOTSessions = Partial<Record<SessionModule, ClientSession>>;

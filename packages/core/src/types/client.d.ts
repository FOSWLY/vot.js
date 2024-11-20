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
  isAutoGenerated?: boolean;
};
export type VideoData<T = VideoService> = {
  url: string;
  videoId: string;
  host: T;
  duration?: number;
  isStream?: boolean;
  title?: string;
  description?: string;
  subtitles?: VideoDataSubtitle[];
  detectedLanguage?: RequestLang;
  translationHelp?: TranslationHelp[] | null;
};
export type MinimalVideoData<T = VideoService> = AtLeast<VideoData<T>, "url">;
export type GetVideoDataOpts = Omit<BaseHelperOpts, "service">;
export type VOTOpts = {
  host?: string;
  hostVOT?: string;
  fetchFn?: FetchFunction;
  fetchOpts?: Record<string, unknown>;
  requestLang?: RequestLang;
  responseLang?: ResponseLang;
  headers?: Record<string, string>;
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
//# sourceMappingURL=client.d.ts.map

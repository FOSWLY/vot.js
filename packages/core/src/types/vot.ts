import type {
  RequestLang,
  ResponseLang,
  RequestHeaders,
} from "@vot.js/shared/types/data";

import { VideoService } from "./service";

export type TranslationStatus = "success" | "waiting" | "parted" | "failed";
export type TranslationProvider = "yandex";

export type VideoTranslationVOTOpts<T = VideoService> = {
  url: string; // video url
  videoId: string;
  service: T;
  requestLang?: RequestLang;
  responseLang?: ResponseLang;
  headers?: RequestHeaders;
};

export type TranslationWaitingResponse = {
  status: "waiting";
  remaining_time: number;
  message: string;
};

export type TranslationSuccessResponse = {
  id: number;
  status: "success";
  provider: TranslationProvider;
  translated_url: string;
  message: string;
  created_at: string;
};

export type TranslationFailedResponse = {
  id: number;
  status: "failed";
  provider: TranslationProvider;
  translated_url: null;
  message: string;
  created_at: string;
};

export type GetSubtitlesVOTOpts<T = VideoService> = {
  url: string; // video url
  videoId: string;
  service: T;
  headers?: RequestHeaders;
};

export type TranslationResponse =
  | TranslationWaitingResponse
  | TranslationSuccessResponse
  | TranslationFailedResponse;

export type SubtitleItem = {
  id: number;
  service: string;
  video_id: string;
  provider: TranslationProvider;
  lang: string;
  lang_from: string | null;
  subtitle_url: string;
  created_at: string;
};

export type SubtitlesResponse = {
  waiting: boolean;
  subtitles: SubtitleItem[];
};

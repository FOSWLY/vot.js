import type {
  RequestLang,
  ResponseLang,
  RequestHeaders,
} from "@vot.js/shared/types/data";
import { VideoService } from "./service";
export type TranslationStatus = "success" | "waiting" | "parted" | "failed";
export type TranslationProvider = "yandex";
export type VideoTranslationVOTOpts<T = VideoService> = {
  url: string;
  videoId: string;
  service: T;
  requestLang?: RequestLang;
  responseLang?: ResponseLang;
  headers?: RequestHeaders;
};
export type TranslationWaitingResponse = {
  status: "waiting";
  remainingTime: number;
  message: string;
};
export type TranslationSuccessResponse = {
  id: number;
  status: "success";
  provider: TranslationProvider;
  translatedUrl: string;
  message: string;
  createdAt: string;
};
export type TranslationFailedResponse = {
  id: number;
  status: "failed";
  provider: TranslationProvider;
  translatedUrl: null;
  message: string;
  createdAt: string;
};
export type TranslationResponse =
  | TranslationWaitingResponse
  | TranslationSuccessResponse
  | TranslationFailedResponse;
//# sourceMappingURL=vot.d.ts.map

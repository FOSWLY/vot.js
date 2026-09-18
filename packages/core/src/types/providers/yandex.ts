import { ClientSession } from "@vot.js/shared/types/secure";
import {
  RequestHeaders,
  RequestLang,
  ResponseLang,
} from "@vot.js/shared/types/data";

import { VideoService } from "../service";
import { BaseProviderOpts, BaseVideoTranslationOpts } from "./base";
import { VideoData } from "../client";

export type {
  AudioBufferObject,
  PartialAudioBufferObject,
  StreamInterval,
  VideoTranslationAudioResponse,
} from "@vot.js/shared/protos";

export type YandexProviderOpts = BaseProviderOpts & {
  apiToken?: string;
};

export type RawClientSession = Omit<ClientSession, "timestamp">;

/**
 * I guess in 2025 only video_file_url works
 */
export type VideoTranslationHelpTarget =
  | "video_file_url"
  | "subtitles_file_url";

export type VideoTranslationHelp = {
  target: VideoTranslationHelpTarget;
  targetUrl: string;
};

/**
 * Read description about options in src/protos/yandex.(proto|ts) -> VideoTranslationRequest
 */
export type VideoTranslationExtraOpts = {
  firstRequest?: boolean;
  forceSourceLang?: boolean;
  wasStream?: boolean;
  bypassCache?: boolean;
  useLivelyVoice?: boolean;
  videoTitle?: string;
};

export type VideoTranslationOpts<T extends string = VideoService> =
  BaseVideoTranslationOpts<T> & {
    translationHelp?: VideoTranslationHelp[] | null;
    /**
     * extra translation options (doesn't work with VOT Backend API)
     */
    extraOpts?: VideoTranslationExtraOpts;
    /**
     * for bypass youtube long waiting (doesn't work with VOT Backend API)
     */
    shouldSendFailedAudio?: boolean;
  };

/**
 * @deprecated use `VideoTranslationOpts` from `types/providers/yandex` instead
 */
export type YandexVideoTranslationOpts<T extends string = VideoService> =
  VideoTranslationOpts<T>;

export type StreamPingOpts = {
  pingId: number;
  headers?: RequestHeaders;
  fetchOpts?: Record<string, unknown>;
};

export type VideoTranslationCacheOpts<T extends string = VideoService> = {
  videoData: VideoData<T>;
  requestLang?: RequestLang;
  responseLang?: ResponseLang;
  headers?: RequestHeaders;
  fetchOpts?: Record<string, unknown>;
};

export type VideoTranslationCacheItem = {
  status: VideoTranslationStatus;
  remainingTime?: number;
};

export type VideoTranslationCacheResponse = {
  default?: VideoTranslationCacheItem;
  cloning?: VideoTranslationCacheItem;
};

export type TranslatedVideoTranslationResponse = {
  translationId: string;
  translated: true;
  url: string;
  remainingTime: number;
  status: VideoTranslationStatus;
  message?: string;
};

export type WaitingVideoTranslationResponse = {
  translationId: string;
  translated: false;
  remainingTime: number;
  status: VideoTranslationStatus;
  message?: string;
};

export type VideoTranslationResponse =
  | TranslatedVideoTranslationResponse
  | WaitingVideoTranslationResponse;

export type StreamTranslationObject = {
  url: string;
  timestamp: string;
};

export type TranslatedStreamTranslationResponse = {
  translated: true;
  interval: number;
  result: StreamTranslationObject;
  pingId: number;
};

export type WaitingStreamTranslationResponse = {
  translated: false;
  interval: number;
  message: string;
};

export type StreamTranslationResponse =
  | TranslatedStreamTranslationResponse
  | WaitingStreamTranslationResponse;

export type VideoTranslationFailAudioResponse = {
  // 1 - success (maybe it's tinyint)
  status: number;
};

export type PartialAudioObject = {
  audioPartsLength: number;
  fileId: string;
  version: 1;
};

export enum VideoTranslationStatus {
  FAILED = 0,
  FINISHED = 1,
  WAITING = 2,
  // also named as NEED_CLIENT_UPDATE
  LONG_WAITING = 3,
  PART_CONTENT = 5,
  AUDIO_REQUESTED = 6,
  /**
   * requires login to yandex account
   */
  SESSION_REQUIRED = 7,
}

export enum AudioDownloadType {
  WEB_API_VIDEO_SRC_FROM_IFRAME = "web_api_video_src_from_iframe",
  WEB_API_VIDEO_SRC = "web_api_video_src",
  WEB_API_GET_ALL_GENERATING_URLS_DATA_FROM_IFRAME = "web_api_get_all_generating_urls_data_from_iframe",
  WEB_API_GET_ALL_GENERATING_URLS_DATA_FROM_IFRAME_TMP_EXP = "web_api_get_all_generating_urls_data_from_iframe_tmp_exp",
  WEB_API_REPLACED_FETCH_INSIDE_IFRAME = "web_api_replaced_fetch_inside_iframe",
  ANDROID_API = "android_api",
  WEB_API_SLOW = "web_api_slow",
  WEB_API_STEAL_SIG_AND_N = "web_api_steal_sig_and_n",
  WEB_API_COMBINED = "web_api_get_all_generating_urls_data_from_iframe,web_api_steal_sig_and_n",
  WEB_ABR = "web_abr",
  WEB_SABR = "web_sabr",
  WEB_MSE_PROXY = "web_mse_proxy",
  EMPTY_PLUG = "empty_plug",
}

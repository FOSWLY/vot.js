import {
  AudioBufferObject as AudioBufferObjectProto,
  PartialAudioBufferObject as PartialAudioBufferObjectProto,
} from "@vot.js/shared/protos";
import type {
  RequestHeaders,
  RequestLang,
  ResponseLang,
} from "@vot.js/shared/types/data";

import type { VideoData } from "./client";
import type { VideoService } from "./service";

/**
 * I guess in 2025 only video_file_url works
 */
export type TranslationHelpTarget = "video_file_url" | "subtitles_file_url";

export type TranslationHelp = {
  target: TranslationHelpTarget;
  targetUrl: string;
};

/**
 * Read description about options in src/protos/yandex.(proto|ts) -> VideoTranslationRequest
 */
export type TranslationExtraOpts = {
  firstRequest?: boolean;
  forceSourceLang?: boolean;
  wasStream?: boolean;
  bypassCache?: boolean;
  useLivelyVoice?: boolean;
  videoTitle?: string;
};

export type AudioBufferObject = AudioBufferObjectProto;
export type PartialAudioBufferObject = PartialAudioBufferObjectProto;

export type PartialAudioObject = {
  audioPartsLength: number;
  fileId: string;
  version: 1;
};

// convert this object using JSON.stringify
export type FileIdObject = {
  downloadType: AudioDownloadType;
  itag: number;
  minChunkSize: number;
  fileSize: string;
};

export enum VideoTranslationStatus {
  FAILED = 0,
  FINISHED = 1,
  WAITING = 2,
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
}

export type VideoTranslationCacheOpts<T extends string = VideoService> = {
  videoData: VideoData<T>;
  requestLang?: RequestLang;
  responseLang?: ResponseLang;
  headers?: RequestHeaders;
};

export type VideoTranslationCacheItem = {
  status: VideoTranslationStatus;
  remainingTime?: number;
};

export type VideoTranslationCacheResponse = {
  default?: VideoTranslationCacheItem;
  cloning?: VideoTranslationCacheItem;
};

export type VideoTranslationOpts<T extends string = VideoService> = {
  videoData: VideoData<T>;
  requestLang?: RequestLang;
  responseLang?: ResponseLang;
  translationHelp?: TranslationHelp[] | null;
  headers?: RequestHeaders;
  /**
   * extra translation options (doesn't work with VOT Backend API)
   */
  extraOpts?: TranslationExtraOpts;
  /**
   * for bypass youtube long waiting (doesn't work with VOT Backend API)
   */
  shouldSendFailedAudio?: boolean;
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

export type VideoSubtitlesOpts<T extends string = VideoService> = {
  videoData: VideoData<T>;
  requestLang?: RequestLang;
  headers?: RequestHeaders;
};

export type StreamPingOptions = {
  pingId: number;
  headers?: RequestHeaders;
};

export type StreamTranslationOpts<T extends string = VideoService> = {
  videoData: VideoData<T>;
  requestLang?: RequestLang;
  responseLang?: ResponseLang;
  headers?: RequestHeaders;
};

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
  status: number; // 1 - success (maybe it's tinyint)
};

export type SubtitleItem = {
  language: string;
  url: string;
  translatedLanguage: string;
  translatedUrl: string;
};

export type GetSubtitlesResponse = {
  waiting: boolean;
  subtitles: SubtitleItem[];
};

import type {
  RequestLang,
  ResponseLang,
  RequestHeaders,
} from "@vot.js/shared/types/data";
import type { VideoData } from "./client";

export type TranslationHelpTarget = "video_file_url" | "subtitles_file_url";

export type TranslationHelp = {
  target: TranslationHelpTarget;
  targetUrl: string;
};

/**
 * Read description about options in src/protos/yandex.(proto|ts) -> VideoTranslationRequest
 */
export type TranslationExtraOpts = {
  forceSourceLang?: boolean;
  wasStream?: boolean;
  bypassCache?: boolean;
  useNewModel?: boolean;
  videoTitle?: string;
};

export type AudioBufferObject = {
  audioFile: Uint8Array;
  fileId: string;
};

export type PartialAudioObject = {
  audioPartsLength: number;
  fileId: string;
  unknown0: 1;
};

// convert this object using JSON.stringify
export type FileIdObject = {
  downloadType: AudioDownloadType;
  itag: number;
  /** in their code its minChunkSize, but it seems to me that in fact its maxChunkSize */
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
}

export enum AudioDownloadType {
  WEB_API_GET_ALL_GENERATING_URLS_DATA_FROM_IFRAME = "web_api_get_all_generating_urls_data_from_iframe",
  WEB_API_REPLACED_FETCH_INSIDE_IFRAME = "web_api_replaced_fetch_inside_iframe",
  WEB_API_REPLACED_FETCH_FORCE_REQUEST_WITH_SEEK = "web_api_replaced_fetch_force_request_with_seek",
  WEB_API_REPLACED_FETCH = "web_api_replaced_fetch",
  ANDROID_API = "android_api",
  WEB_API_SLOW = "web_api_slow",
}

export type VideoTranslationOpts = {
  videoData: VideoData;
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

export type VideoSubtitlesOpts = {
  videoData: VideoData;
  requestLang?: RequestLang;
  headers?: RequestHeaders;
};

export type StreamPingOptions = {
  pingId: number;
  headers?: RequestHeaders;
};

export type StreamTranslationOpts = {
  videoData: VideoData;
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

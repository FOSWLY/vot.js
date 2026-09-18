export type {
  /**
   * @deprecated use `PartialAudioBufferObject` from `/types/providers/yandex` or from `@vot.js/shared/protos` instead
   */
  AudioBufferObject,
  /**
   * @deprecated use `PartialAudioBufferObject` from `/types/providers/yandex` or from `@vot.js/shared/protos` instead
   */
  PartialAudioBufferObject,
} from "@vot.js/shared/protos";

import { AudioDownloadType } from "./providers/yandex";
/**
 * for future convert this object using JSON.stringify
 *
 * @deprecated now unused in any modern strategy
 */
export type FileIdObject = {
  downloadType: AudioDownloadType;
  itag: number;
  minChunkSize: number;
  fileSize: string;
};

export {
  /**
   * @deprecated use `VideoTranslationHelpTarget` from `/types/providers/yandex`
   */
  VideoTranslationHelpTarget as TranslationHelpTarget,
  /**
   * @deprecated use `VideoTranslationHelp` from `/types/providers/yandex`
   */
  VideoTranslationHelp as TranslationHelp,
  /**
   * @deprecated use `VideoTranslationExtraOpts` from `/types/providers/yandex`
   */
  VideoTranslationExtraOpts as TranslationExtraOpts,
  /**
   * @deprecated use `PartialAudioObject` from `/types/providers/yandex`
   */
  PartialAudioObject,
  /**
   * @deprecated use `VideoTranslationStatus` from `/types/providers/yandex`
   */
  VideoTranslationStatus,
  /**
   * @deprecated use `VideoTranslationCacheOpts` from `types/providers/yandex` instead
   */
  VideoTranslationCacheOpts,
  /**
   * @deprecated use `VideoTranslationCacheItem` from `types/providers/yandex` instead
   */
  VideoTranslationCacheItem,
  /**
   * @deprecated use `VideoTranslationCacheResponse` from `types/providers/yandex` instead
   */
  VideoTranslationCacheResponse,
  /**
   * @deprecated use `VideoTranslationOpts` from `types/providers/yandex` instead
   */
  VideoTranslationOpts,
  /**
   * @deprecated use `TranslatedVideoTranslationResponse` from `types/providers/yandex` instead
   */
  TranslatedVideoTranslationResponse,
  /**
   * @deprecated use `WaitingVideoTranslationResponse` from `types/providers/yandex` instead
   */
  WaitingVideoTranslationResponse,
  /**
   * @deprecated use `VideoTranslationResponse` from `types/providers/yandex` instead
   */
  VideoTranslationResponse,
  /**
   * @deprecated use `StreamPingOpts` from `types/providers/yandex` instead
   */
  StreamPingOpts as StreamPingOptions,
  /**
   * @deprecated use `StreamTranslationObject` from `types/providers/yandex` instead
   */
  StreamTranslationObject,
  /**
   * @deprecated use `TranslatedStreamTranslationResponse` from `types/providers/yandex` instead
   */
  TranslatedStreamTranslationResponse,
  /**
   * @deprecated use `WaitingStreamTranslationResponse` from `types/providers/yandex` instead
   */
  WaitingStreamTranslationResponse,
  /**
   * @deprecated use `StreamTranslationResponse` from `types/providers/yandex` instead
   */
  StreamTranslationResponse,
  /**
   * @deprecated use `VideoTranslationFailAudioResponse` from `types/providers/yandex` instead
   */
  VideoTranslationFailAudioResponse,
  /**
   * @deprecated use `AudioDownloadType` from `types/providers/yandex` instead
   */
  AudioDownloadType,
} from "./providers/yandex";

export type {

  /**
   * @deprecated use `BaseStreamTranslationOpts` from `types/providers/base` instead
   */
  BaseStreamTranslationOpts as StreamTranslationOpts,
  /**
   * @deprecated use `BaseVideoSubtitlesOpts` from `types/providers/base` instead
   */
  BaseVideoSubtitlesOpts as VideoSubtitlesOpts,
  /**
   * @deprecated use `GetSubtitleItem` from `types/providers/base` instead
   */
  GetSubtitleItem as SubtitleItem,
  /**
   * @deprecated use `BaseGetSubtitlesResponse` from `types/providers/base` instead
   */
  BaseGetSubtitlesResponse as GetSubtitlesResponse,
} from "./providers/base";

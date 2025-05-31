import {
  StreamPingRequest,
  StreamTranslationRequest,
  StreamTranslationResponse,
  SubtitlesRequest,
  SubtitlesResponse,
  VideoTranslationCacheResponse,
  VideoTranslationCacheRequest,
  VideoTranslationAudioRequest,
  VideoTranslationAudioResponse,
  VideoTranslationRequest,
  VideoTranslationResponse,
  YandexSessionRequest,
  YandexSessionResponse,
} from "@vot.js/shared/protos";

import type { SessionModule } from "@vot.js/shared/types/secure";
import type {
  AudioBufferObject,
  PartialAudioObject,
  PartialAudioBufferObject,
  TranslationExtraOpts,
  TranslationHelp,
} from "./types/yandex";

export abstract class YandexVOTProtobuf {
  static encodeTranslationRequest(
    url: string,
    duration: number,
    requestLang: string,
    responseLang: string,
    translationHelp: TranslationHelp[] | null,
    {
      forceSourceLang = false,
      wasStream = false,
      videoTitle = "",
      bypassCache = false,
      useLivelyVoice = false,
    }: TranslationExtraOpts = {},
  ) {
    return VideoTranslationRequest.encode({
      url,
      firstRequest: true,
      duration,
      unknown0: 1,
      language: requestLang,
      forceSourceLang,
      unknown1: 0,
      translationHelp: translationHelp ?? [],
      responseLanguage: responseLang,
      wasStream,
      unknown2: 1,
      unknown3: 2,
      bypassCache,
      useLivelyVoice,
      videoTitle,
    }).finish();
  }

  static decodeTranslationResponse(response: ArrayBuffer) {
    return VideoTranslationResponse.decode(new Uint8Array(response));
  }

  static encodeTranslationCacheRequest(
    url: string,
    duration: number,
    requestLang: string,
    responseLang: string,
  ) {
    return VideoTranslationCacheRequest.encode({
      url,
      duration,
      language: requestLang,
      responseLanguage: responseLang,
    }).finish();
  }

  static decodeTranslationCacheResponse(response: ArrayBuffer) {
    return VideoTranslationCacheResponse.decode(new Uint8Array(response));
  }

  static isPartialAudioBuffer(
    audioBuffer: PartialAudioBufferObject | AudioBufferObject,
  ): audioBuffer is PartialAudioBufferObject {
    return "chunkId" in audioBuffer;
  }

  static encodeTranslationAudioRequest(
    url: string,
    translationId: string,
    audioBuffer: AudioBufferObject,
    partialAudio?: never,
  ): Uint8Array;
  static encodeTranslationAudioRequest(
    url: string,
    translationId: string,
    audioBuffer: PartialAudioBufferObject,
    partialAudio: PartialAudioObject,
  ): Uint8Array;
  static encodeTranslationAudioRequest(
    url: string,
    translationId: string,
    audioBuffer: PartialAudioBufferObject | AudioBufferObject,
    partialAudio?: PartialAudioObject,
  ): Uint8Array {
    if (partialAudio && YandexVOTProtobuf.isPartialAudioBuffer(audioBuffer)) {
      return VideoTranslationAudioRequest.encode({
        url,
        translationId,
        partialAudioInfo: {
          ...partialAudio,
          audioBuffer,
        },
      }).finish();
    }

    return VideoTranslationAudioRequest.encode({
      url,
      translationId,
      audioInfo: audioBuffer as AudioBufferObject,
    }).finish();
  }

  static decodeTranslationAudioResponse(response: ArrayBuffer) {
    return VideoTranslationAudioResponse.decode(new Uint8Array(response));
  }

  static encodeSubtitlesRequest(url: string, requestLang: string) {
    return SubtitlesRequest.encode({
      url,
      language: requestLang,
    }).finish();
  }

  static decodeSubtitlesResponse(response: ArrayBuffer) {
    return SubtitlesResponse.decode(new Uint8Array(response));
  }

  static encodeStreamPingRequest(pingId: number) {
    return StreamPingRequest.encode({
      pingId,
    }).finish();
  }

  static encodeStreamRequest(
    url: string,
    requestLang: string,
    responseLang: string,
  ) {
    return StreamTranslationRequest.encode({
      url,
      language: requestLang,
      responseLanguage: responseLang,
      unknown0: 1,
      unknown1: 0,
    }).finish();
  }

  static decodeStreamResponse(response: ArrayBuffer) {
    return StreamTranslationResponse.decode(new Uint8Array(response));
  }
}

export abstract class YandexSessionProtobuf {
  static encodeSessionRequest(uuid: string, module: SessionModule) {
    return YandexSessionRequest.encode({
      uuid,
      module,
    }).finish();
  }

  static decodeSessionResponse(response: ArrayBuffer) {
    return YandexSessionResponse.decode(new Uint8Array(response));
  }
}

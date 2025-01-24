import {
  StreamPingRequest,
  StreamTranslationRequest,
  StreamTranslationResponse,
  SubtitlesRequest,
  SubtitlesResponse,
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
      useNewModel = true,
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
      translationHelp: translationHelp ? translationHelp : [],
      responseLanguage: responseLang,
      wasStream,
      unknown2: 1,
      unknown3: 1,
      bypassCache,
      useNewModel,
      videoTitle,
    }).finish();
  }

  static decodeTranslationResponse(response: ArrayBuffer) {
    return VideoTranslationResponse.decode(new Uint8Array(response));
  }

  static encodeTranslationAudioRequest(
    url: string,
    translationId: string,
    audioBuffer: AudioBufferObject,
    partialAudio?: PartialAudioObject,
  ) {
    return VideoTranslationAudioRequest.encode({
      url,
      translationId,
      ...(partialAudio
        ? {
            partialAudioInfo: {
              ...partialAudio,
              audioBuffer,
            },
          }
        : {
            audioInfo: audioBuffer,
          }),
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

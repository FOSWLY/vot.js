import {
  StreamPingRequest,
  StreamTranslationRequest,
  StreamTranslationResponse,
  SubtitlesRequest,
  SubtitlesResponse,
  VideoLangCacheRequest,
  VideoLangCacheResponse,
  VideoTranslationAudioRequest,
  VideoTranslationAudioResponse,
  VideoTranslationCacheRequest,
  VideoTranslationCacheResponse,
  VideoTranslationRequest,
  VideoTranslationResponse,
  YandexSessionRequest,
  YandexSessionResponse,
} from "@vot.js/shared/protos";

import type { SessionModule } from "@vot.js/shared/types/secure";
import type {
  AudioBufferObject,
  PartialAudioBufferObject,
  PartialAudioObject,
  TranslationExtraOpts,
  TranslationHelp,
} from "./types/yandex";

function encodeTranslationRequest(
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
    firstRequest = true,
  }: TranslationExtraOpts = {},
) {
  return VideoTranslationRequest.encode({
    url,
    firstRequest,
    duration,
    unknown0: true,
    language: requestLang,
    forceSourceLang,
    unknown1: false,
    translationHelp: translationHelp ?? [],
    responseLanguage: responseLang,
    wasStream,
    unknown2: true,
    unknown3: 2,
    bypassCache,
    useLivelyVoice,
    videoTitle,
  }).finish();
}

function decodeTranslationResponse(response: ArrayBuffer) {
  return VideoTranslationResponse.decode(new Uint8Array(response));
}

function encodeTranslationCacheRequest(
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

function decodeTranslationCacheResponse(response: ArrayBuffer) {
  return VideoTranslationCacheResponse.decode(new Uint8Array(response));
}

function isPartialAudioBuffer(
  audioBuffer: PartialAudioBufferObject | AudioBufferObject,
): audioBuffer is PartialAudioBufferObject {
  return "chunkId" in audioBuffer;
}

function encodeTranslationAudioRequest(
  url: string,
  translationId: string,
  audioBuffer: AudioBufferObject,
  partialAudio?: never,
): Uint8Array;
function encodeTranslationAudioRequest(
  url: string,
  translationId: string,
  audioBuffer: PartialAudioBufferObject,
  partialAudio: PartialAudioObject,
): Uint8Array;
function encodeTranslationAudioRequest(
  url: string,
  translationId: string,
  audioBuffer: PartialAudioBufferObject | AudioBufferObject,
  partialAudio?: PartialAudioObject,
): Uint8Array {
  if (partialAudio && isPartialAudioBuffer(audioBuffer)) {
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

function decodeTranslationAudioResponse(response: ArrayBuffer) {
  return VideoTranslationAudioResponse.decode(new Uint8Array(response));
}

function encodeSubtitlesRequest(url: string, requestLang: string) {
  return SubtitlesRequest.encode({
    url,
    language: requestLang,
  }).finish();
}

function decodeSubtitlesResponse(response: ArrayBuffer) {
  return SubtitlesResponse.decode(new Uint8Array(response));
}

function encodeStreamPingRequest(pingId: number) {
  return StreamPingRequest.encode({
    pingId,
  }).finish();
}

function encodeStreamRequest(
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

function decodeStreamResponse(response: ArrayBuffer) {
  return StreamTranslationResponse.decode(new Uint8Array(response));
}

function encodeVideoLangCacheRequest(url: string, title: string) {
  return VideoLangCacheRequest.encode({
    url,
    title,
  }).finish();
}

function decodeVideoLangCacheResponse(response: ArrayBuffer) {
  return VideoLangCacheResponse.decode(new Uint8Array(response));
}

export const YandexVOTProtobuf = {
  encodeTranslationRequest,
  decodeTranslationResponse,
  encodeTranslationCacheRequest,
  decodeTranslationCacheResponse,
  isPartialAudioBuffer,
  encodeTranslationAudioRequest,
  decodeTranslationAudioResponse,
  encodeSubtitlesRequest,
  decodeSubtitlesResponse,
  encodeStreamPingRequest,
  encodeStreamRequest,
  decodeStreamResponse,
  encodeVideoLangCacheRequest,
  decodeVideoLangCacheResponse,
} as const;

function encodeSessionRequest(uuid: string, module: SessionModule) {
  return YandexSessionRequest.encode({
    uuid,
    module,
  }).finish();
}

function decodeSessionResponse(response: ArrayBuffer) {
  return YandexSessionResponse.decode(new Uint8Array(response));
}

export const YandexSessionProtobuf = {
  encodeSessionRequest,
  decodeSessionResponse,
} as const;

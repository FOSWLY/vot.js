import {
  StreamPingRequest,
  StreamTranslationRequest,
  StreamTranslationResponse,
  SubtitlesRequest,
  SubtitlesResponse,
  VideoTranslationRequest,
  VideoTranslationResponse,
  YandexSessionRequest,
  YandexSessionResponse,
} from "./protos/yandex";
import type { TranslationHelp } from "./types/yandex";

// Export the encoding and decoding functions
export const yandexProtobuf = {
  encodeTranslationRequest(
    url: string,
    duration: number,
    requestLang: string,
    responseLang: string,
    translationHelp: TranslationHelp[] | null,
  ) {
    return VideoTranslationRequest.encode({
      url,
      firstRequest: true,
      duration,
      unknown0: 1,
      language: requestLang,
      forceSourceLang: false,
      unknown1: 0,
      translationHelp: translationHelp ? translationHelp : [],
      responseLanguage: responseLang,
      unknown2: 0,
      unknown3: 1,
      bypassCache: true,
    }).finish();
  },
  decodeTranslationResponse(response: ArrayBuffer) {
    return VideoTranslationResponse.decode(new Uint8Array(response));
  },
  encodeSubtitlesRequest(url: string, requestLang: string) {
    return SubtitlesRequest.encode({
      url,
      language: requestLang,
    }).finish();
  },
  decodeSubtitlesResponse(response: ArrayBuffer) {
    return SubtitlesResponse.decode(new Uint8Array(response));
  },
  encodeStreamPingRequest(pingId: number) {
    return StreamPingRequest.encode({
      pingId,
    }).finish();
  },
  encodeStreamRequest(url: string, requestLang: string, responseLang: string) {
    return StreamTranslationRequest.encode({
      url,
      language: requestLang,
      responseLanguage: responseLang,
    }).finish();
  },
  decodeStreamResponse(response: ArrayBuffer) {
    return StreamTranslationResponse.decode(new Uint8Array(response));
  },
  encodeYandexSessionRequest(uuid: string, module: string) {
    return YandexSessionRequest.encode({
      uuid,
      module,
    }).finish();
  },
  decodeYandexSessionResponse(response: ArrayBuffer) {
    return YandexSessionResponse.decode(new Uint8Array(response));
  },
};

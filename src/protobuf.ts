import {
  StreamPingRequest,
  StreamTranslationRequest,
  StreamTranslationResponse,
  SubtitlesRequest,
  SubtitlesResponse,
  VideoTranslationAudioRequest,
  VideoTranslationRequest,
  VideoTranslationResponse,
  YandexSessionRequest,
  YandexSessionResponse,
} from "./protos/yandex";
import {
  AudioInfoMessage,
  TranslationExtraOpts,
  type SessionModule,
  type TranslationHelp,
} from "./types/yandex";

// Export the encoding and decoding functions
export const yandexProtobuf = {
  encodeTranslationRequest(
    url: string,
    duration: number,
    requestLang: string,
    responseLang: string,
    translationHelp: TranslationHelp[] | null,
    {
      forceSourceLang = false,
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
      unknown2: 1,
      unknown3: 1,
      bypassCache,
      useNewModel,
    }).finish();
  },
  decodeTranslationResponse(response: ArrayBuffer) {
    return VideoTranslationResponse.decode(new Uint8Array(response));
  },
  encodeTranslationAudioRequest(url: string, translationId: string) {
    return VideoTranslationAudioRequest.encode({
      url,
      translationId,
      audioInfo: {
        audioFile: new Uint8Array(0),
        // message: "{AudioInfoMessage.WEB_API_GET_ALL_GENERATING_URLS_DATA_FROM_IFRAME}_itag_{d.itag}", // for real audio file
        message:
          AudioInfoMessage.WEB_API_GET_ALL_GENERATING_URLS_DATA_FROM_IFRAME,
      },
    }).finish();
  },
  decodeTranslationAudioResponse(response: ArrayBuffer) {
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
  encodeYandexSessionRequest(uuid: string, module: SessionModule) {
    return YandexSessionRequest.encode({
      uuid,
      module,
    }).finish();
  },
  decodeYandexSessionResponse(response: ArrayBuffer) {
    return YandexSessionResponse.decode(new Uint8Array(response));
  },
};

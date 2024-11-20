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
export const yandexProtobuf = {
  encodeTranslationRequest(
    url,
    duration,
    requestLang,
    responseLang,
    translationHelp,
    { forceSourceLang = false, bypassCache = false, useNewModel = true } = {},
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
  decodeTranslationResponse(response) {
    return VideoTranslationResponse.decode(new Uint8Array(response));
  },
  encodeTranslationAudioRequest(url, translationId, audioBuffer, partialAudio) {
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
  },
  decodeTranslationAudioResponse(response) {
    return VideoTranslationAudioResponse.decode(new Uint8Array(response));
  },
  encodeSubtitlesRequest(url, requestLang) {
    return SubtitlesRequest.encode({
      url,
      language: requestLang,
    }).finish();
  },
  decodeSubtitlesResponse(response) {
    return SubtitlesResponse.decode(new Uint8Array(response));
  },
  encodeStreamPingRequest(pingId) {
    return StreamPingRequest.encode({
      pingId,
    }).finish();
  },
  encodeStreamRequest(url, requestLang, responseLang) {
    return StreamTranslationRequest.encode({
      url,
      language: requestLang,
      responseLanguage: responseLang,
    }).finish();
  },
  decodeStreamResponse(response) {
    return StreamTranslationResponse.decode(new Uint8Array(response));
  },
  encodeYandexSessionRequest(uuid, module) {
    return YandexSessionRequest.encode({
      uuid,
      module,
    }).finish();
  },
  decodeYandexSessionResponse(response) {
    return YandexSessionResponse.decode(new Uint8Array(response));
  },
};

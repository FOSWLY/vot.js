import { StreamPingRequest, StreamTranslationRequest, StreamTranslationResponse, SubtitlesRequest, SubtitlesResponse, VideoTranslationRequest, VideoTranslationResponse, YandexSessionRequest, YandexSessionResponse, } from "./protos/yandex.js";
export const yandexProtobuf = {
    encodeTranslationRequest(url, duration, requestLang, responseLang, translationHelp) {
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
            bypassCache: false,
        }).finish();
    },
    decodeTranslationResponse(response) {
        return VideoTranslationResponse.decode(new Uint8Array(response));
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

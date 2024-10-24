import { StreamTranslationResponse, SubtitlesResponse, VideoTranslationResponse, YandexSessionResponse } from "./protos/yandex.js";
import { type SessionModule, type TranslationHelp } from "./types/yandex.js";
export declare const yandexProtobuf: {
    encodeTranslationRequest(url: string, duration: number, requestLang: string, responseLang: string, translationHelp: TranslationHelp[] | null): Uint8Array;
    decodeTranslationResponse(response: ArrayBuffer): VideoTranslationResponse;
    encodeTranslationAudioRequest(url: string, translationId: string): Uint8Array;
    decodeTranslationAudioResponse(response: ArrayBuffer): VideoTranslationResponse;
    encodeSubtitlesRequest(url: string, requestLang: string): Uint8Array;
    decodeSubtitlesResponse(response: ArrayBuffer): SubtitlesResponse;
    encodeStreamPingRequest(pingId: number): Uint8Array;
    encodeStreamRequest(url: string, requestLang: string, responseLang: string): Uint8Array;
    decodeStreamResponse(response: ArrayBuffer): StreamTranslationResponse;
    encodeYandexSessionRequest(uuid: string, module: SessionModule): Uint8Array;
    decodeYandexSessionResponse(response: ArrayBuffer): YandexSessionResponse;
};
//# sourceMappingURL=protobuf.d.ts.map
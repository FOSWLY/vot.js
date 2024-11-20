import type { SessionModule } from "@vot.js/shared/types/secure";
import type {
  AudioBufferObject,
  PartialAudioObject,
  TranslationExtraOpts,
  TranslationHelp,
} from "./types/yandex";
export declare const yandexProtobuf: {
  encodeTranslationRequest(
    url: string,
    duration: number,
    requestLang: string,
    responseLang: string,
    translationHelp: TranslationHelp[] | null,
    { forceSourceLang, bypassCache, useNewModel }?: TranslationExtraOpts,
  ): any;
  decodeTranslationResponse(response: ArrayBuffer): any;
  encodeTranslationAudioRequest(
    url: string,
    translationId: string,
    audioBuffer: AudioBufferObject,
    partialAudio?: PartialAudioObject,
  ): any;
  decodeTranslationAudioResponse(response: ArrayBuffer): any;
  encodeSubtitlesRequest(url: string, requestLang: string): any;
  decodeSubtitlesResponse(response: ArrayBuffer): any;
  encodeStreamPingRequest(pingId: number): any;
  encodeStreamRequest(
    url: string,
    requestLang: string,
    responseLang: string,
  ): any;
  decodeStreamResponse(response: ArrayBuffer): any;
  encodeYandexSessionRequest(uuid: string, module: SessionModule): any;
  decodeYandexSessionResponse(response: ArrayBuffer): any;
};
//# sourceMappingURL=protobuf.d.ts.map

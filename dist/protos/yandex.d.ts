import _m0 from "protobufjs/minimal.js";
export declare const protobufPackage = "";
export declare enum StreamInterval {
    NO_CONNECTION = 0,
    TRANSLATING = 10,
    STREAMING = 20,
    UNRECOGNIZED = -1
}
export declare function streamIntervalFromJSON(object: any): StreamInterval;
export declare function streamIntervalToJSON(object: StreamInterval): string;
export interface VideoTranslationHelpObject {
    target: string;
    targetUrl: string;
}
export interface VideoTranslationRequest {
    url: string;
    deviceId?: string | undefined;
    firstRequest: boolean;
    duration: number;
    unknown0: number;
    language: string;
    forceSourceLang: boolean;
    unknown1: number;
    translationHelp: VideoTranslationHelpObject[];
    responseLanguage: string;
    unknown2: number;
    unknown3: number;
    bypassCache: boolean;
    useNewModel: boolean;
}
export interface VideoTranslationResponse {
    url?: string | undefined;
    duration?: number | undefined;
    status: number;
    remainingTime?: number | undefined;
    unknown0?: number | undefined;
    translationId: string;
    language?: string | undefined;
    message?: string | undefined;
}
export interface AudioBufferObject {
    audioFile: Uint8Array;
    fileId: string;
}
export interface ChunkAudioObject {
    audioPartsLength: number;
    audioBuffer: AudioBufferObject | undefined;
    fileId: string;
    unknown0: number;
}
export interface VideoTranslationAudioRequest {
    translationId: string;
    url: string;
    partialAudioInfo?: ChunkAudioObject | undefined;
    audioInfo?: AudioBufferObject | undefined;
}
export interface VideoTranslationAudioResponse {
    status: number;
    remainingChunks: string[];
}
export interface SubtitlesObject {
    language: string;
    url: string;
    unknown0: number;
    translatedLanguage: string;
    translatedUrl: string;
    unknown1: number;
    unknown2: number;
}
export interface SubtitlesRequest {
    url: string;
    language: string;
}
export interface SubtitlesResponse {
    waiting: boolean;
    subtitles: SubtitlesObject[];
}
export interface StreamTranslationObject {
    url: string;
    timestamp: string;
}
export interface StreamTranslationRequest {
    url: string;
    language: string;
    responseLanguage: string;
}
export interface StreamTranslationResponse {
    interval: StreamInterval;
    translatedInfo?: StreamTranslationObject | undefined;
    pingId?: number | undefined;
}
export interface StreamPingRequest {
    pingId: number;
}
export interface YandexSessionRequest {
    uuid: string;
    module: string;
}
export interface YandexSessionResponse {
    secretKey: string;
    expires: number;
}
export declare const VideoTranslationHelpObject: {
    encode(message: VideoTranslationHelpObject, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): VideoTranslationHelpObject;
    fromJSON(object: any): VideoTranslationHelpObject;
    toJSON(message: VideoTranslationHelpObject): unknown;
    create<I extends Exact<DeepPartial<VideoTranslationHelpObject>, I>>(base?: I): VideoTranslationHelpObject;
    fromPartial<I extends Exact<DeepPartial<VideoTranslationHelpObject>, I>>(object: I): VideoTranslationHelpObject;
};
export declare const VideoTranslationRequest: {
    encode(message: VideoTranslationRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): VideoTranslationRequest;
    fromJSON(object: any): VideoTranslationRequest;
    toJSON(message: VideoTranslationRequest): unknown;
    create<I extends Exact<DeepPartial<VideoTranslationRequest>, I>>(base?: I): VideoTranslationRequest;
    fromPartial<I extends Exact<DeepPartial<VideoTranslationRequest>, I>>(object: I): VideoTranslationRequest;
};
export declare const VideoTranslationResponse: {
    encode(message: VideoTranslationResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): VideoTranslationResponse;
    fromJSON(object: any): VideoTranslationResponse;
    toJSON(message: VideoTranslationResponse): unknown;
    create<I extends Exact<DeepPartial<VideoTranslationResponse>, I>>(base?: I): VideoTranslationResponse;
    fromPartial<I extends Exact<DeepPartial<VideoTranslationResponse>, I>>(object: I): VideoTranslationResponse;
};
export declare const AudioBufferObject: {
    encode(message: AudioBufferObject, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): AudioBufferObject;
    fromJSON(object: any): AudioBufferObject;
    toJSON(message: AudioBufferObject): unknown;
    create<I extends Exact<DeepPartial<AudioBufferObject>, I>>(base?: I): AudioBufferObject;
    fromPartial<I extends Exact<DeepPartial<AudioBufferObject>, I>>(object: I): AudioBufferObject;
};
export declare const ChunkAudioObject: {
    encode(message: ChunkAudioObject, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ChunkAudioObject;
    fromJSON(object: any): ChunkAudioObject;
    toJSON(message: ChunkAudioObject): unknown;
    create<I extends Exact<DeepPartial<ChunkAudioObject>, I>>(base?: I): ChunkAudioObject;
    fromPartial<I extends Exact<DeepPartial<ChunkAudioObject>, I>>(object: I): ChunkAudioObject;
};
export declare const VideoTranslationAudioRequest: {
    encode(message: VideoTranslationAudioRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): VideoTranslationAudioRequest;
    fromJSON(object: any): VideoTranslationAudioRequest;
    toJSON(message: VideoTranslationAudioRequest): unknown;
    create<I extends Exact<DeepPartial<VideoTranslationAudioRequest>, I>>(base?: I): VideoTranslationAudioRequest;
    fromPartial<I extends Exact<DeepPartial<VideoTranslationAudioRequest>, I>>(object: I): VideoTranslationAudioRequest;
};
export declare const VideoTranslationAudioResponse: {
    encode(message: VideoTranslationAudioResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): VideoTranslationAudioResponse;
    fromJSON(object: any): VideoTranslationAudioResponse;
    toJSON(message: VideoTranslationAudioResponse): unknown;
    create<I extends Exact<DeepPartial<VideoTranslationAudioResponse>, I>>(base?: I): VideoTranslationAudioResponse;
    fromPartial<I extends Exact<DeepPartial<VideoTranslationAudioResponse>, I>>(object: I): VideoTranslationAudioResponse;
};
export declare const SubtitlesObject: {
    encode(message: SubtitlesObject, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): SubtitlesObject;
    fromJSON(object: any): SubtitlesObject;
    toJSON(message: SubtitlesObject): unknown;
    create<I extends Exact<DeepPartial<SubtitlesObject>, I>>(base?: I): SubtitlesObject;
    fromPartial<I extends Exact<DeepPartial<SubtitlesObject>, I>>(object: I): SubtitlesObject;
};
export declare const SubtitlesRequest: {
    encode(message: SubtitlesRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): SubtitlesRequest;
    fromJSON(object: any): SubtitlesRequest;
    toJSON(message: SubtitlesRequest): unknown;
    create<I extends Exact<DeepPartial<SubtitlesRequest>, I>>(base?: I): SubtitlesRequest;
    fromPartial<I extends Exact<DeepPartial<SubtitlesRequest>, I>>(object: I): SubtitlesRequest;
};
export declare const SubtitlesResponse: {
    encode(message: SubtitlesResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): SubtitlesResponse;
    fromJSON(object: any): SubtitlesResponse;
    toJSON(message: SubtitlesResponse): unknown;
    create<I extends Exact<DeepPartial<SubtitlesResponse>, I>>(base?: I): SubtitlesResponse;
    fromPartial<I extends Exact<DeepPartial<SubtitlesResponse>, I>>(object: I): SubtitlesResponse;
};
export declare const StreamTranslationObject: {
    encode(message: StreamTranslationObject, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StreamTranslationObject;
    fromJSON(object: any): StreamTranslationObject;
    toJSON(message: StreamTranslationObject): unknown;
    create<I extends Exact<DeepPartial<StreamTranslationObject>, I>>(base?: I): StreamTranslationObject;
    fromPartial<I extends Exact<DeepPartial<StreamTranslationObject>, I>>(object: I): StreamTranslationObject;
};
export declare const StreamTranslationRequest: {
    encode(message: StreamTranslationRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StreamTranslationRequest;
    fromJSON(object: any): StreamTranslationRequest;
    toJSON(message: StreamTranslationRequest): unknown;
    create<I extends Exact<DeepPartial<StreamTranslationRequest>, I>>(base?: I): StreamTranslationRequest;
    fromPartial<I extends Exact<DeepPartial<StreamTranslationRequest>, I>>(object: I): StreamTranslationRequest;
};
export declare const StreamTranslationResponse: {
    encode(message: StreamTranslationResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StreamTranslationResponse;
    fromJSON(object: any): StreamTranslationResponse;
    toJSON(message: StreamTranslationResponse): unknown;
    create<I extends Exact<DeepPartial<StreamTranslationResponse>, I>>(base?: I): StreamTranslationResponse;
    fromPartial<I extends Exact<DeepPartial<StreamTranslationResponse>, I>>(object: I): StreamTranslationResponse;
};
export declare const StreamPingRequest: {
    encode(message: StreamPingRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StreamPingRequest;
    fromJSON(object: any): StreamPingRequest;
    toJSON(message: StreamPingRequest): unknown;
    create<I extends Exact<DeepPartial<StreamPingRequest>, I>>(base?: I): StreamPingRequest;
    fromPartial<I extends Exact<DeepPartial<StreamPingRequest>, I>>(object: I): StreamPingRequest;
};
export declare const YandexSessionRequest: {
    encode(message: YandexSessionRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): YandexSessionRequest;
    fromJSON(object: any): YandexSessionRequest;
    toJSON(message: YandexSessionRequest): unknown;
    create<I extends Exact<DeepPartial<YandexSessionRequest>, I>>(base?: I): YandexSessionRequest;
    fromPartial<I extends Exact<DeepPartial<YandexSessionRequest>, I>>(object: I): YandexSessionRequest;
};
export declare const YandexSessionResponse: {
    encode(message: YandexSessionResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): YandexSessionResponse;
    fromJSON(object: any): YandexSessionResponse;
    toJSON(message: YandexSessionResponse): unknown;
    create<I extends Exact<DeepPartial<YandexSessionResponse>, I>>(base?: I): YandexSessionResponse;
    fromPartial<I extends Exact<DeepPartial<YandexSessionResponse>, I>>(object: I): YandexSessionResponse;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export {};
//# sourceMappingURL=yandex.d.ts.map
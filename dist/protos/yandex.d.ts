import _m0 from "protobufjs/minimal";
export declare const protobufPackage = "";
export declare enum StreamInterval {
    NO_CONNECTION = 0,
    TRANSLATING = 10,
    STREAMING = 20,
    UNRECOGNIZED = -1
}
export declare function streamIntervalFromJSON(object: any): StreamInterval;
export declare function streamIntervalToJSON(object: StreamInterval): string;
/** VIDEO TRANSLATION */
export interface VideoTranslationHelpObject {
    /** video_file_url or subtitles_file_url */
    target: string;
    /** raw url to video file or subs */
    targetUrl: string;
}
export interface VideoTranslationRequest {
    url: string;
    /** used in mobile version */
    deviceId?: string | undefined;
    /** true for the first request, false for subsequent ones */
    firstRequest: boolean;
    duration: number;
    /** 1 1 */
    unknown0: number;
    /** source language code */
    language: string;
    /** 0 - auto detected by yabrowser, 1 - user set his own lang by dropdown */
    forceSourceLang: boolean;
    /** 0 0 */
    unknown1: number;
    /** array for translation assistance ([0] -> {2: link to video, 1: "video_file_url"}, [1] -> {2: link to subtitles, 1: "subtitles_file_url"}) */
    translationHelp: VideoTranslationHelpObject[];
    responseLanguage: string;
    /** 0 */
    unknown2: number;
    /** 1 */
    unknown3: number;
    /** ? maybe they have some kind of bypass limiter from one IP, because after one such request it stopped working */
    bypassCache: boolean;
}
export interface VideoTranslationResponse {
    /** if status is translated */
    url?: string | undefined;
    duration?: number | undefined;
    status: number;
    /** secs until translation is completed */
    remainingTime?: number | undefined;
    /** unknown 0 (1st request) -> 10 (2nd, 3th and etc requests). (if status is 0) */
    unknown0?: number | undefined;
    /** it's not a type mistake */
    translationId: string;
    /** detected language (if the wrong one is set) */
    language?: string | undefined;
    message?: string | undefined;
}
/** SUBTITLES */
export interface SubtitlesObject {
    language: string;
    url: string;
    unknown0: number;
    translatedLanguages: string;
    translatedUrl: string;
    unknown1: number;
    unknown2: number;
}
export interface SubtitlesRequest {
    url: string;
    /** source language code */
    language: string;
}
export interface SubtitlesResponse {
    /** 0 - finished/failed, 1 - waiting result (1 - ~10min, maybe more) */
    waiting: boolean;
    subtitles: SubtitlesObject[];
}
/** STREAM TRANSLATION */
export interface StreamTranslationObject {
    url: string;
    /** timestamp in ms (timing of m3u8) */
    timestamp: number;
}
export interface StreamTranslationRequest {
    url: string;
    language: string;
    responseLanguage: string;
}
export interface StreamTranslationResponse {
    /** 20s - streaming, 10s - translating, 0s - there is no connection with the server (the broadcast is finished or deleted) */
    interval: StreamInterval;
    translatedInfo?: StreamTranslationObject | undefined;
    pingId?: number | undefined;
}
/** doesn't have response proto */
export interface StreamPingRequest {
    pingId: number;
}
/** SESSIONS */
export interface YandexSessionRequest {
    uuid: string;
    /** e.g. video_translation */
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
    create<I extends {
        target?: string | undefined;
        targetUrl?: string | undefined;
    } & {
        target?: string | undefined;
        targetUrl?: string | undefined;
    } & { [K in Exclude<keyof I, keyof VideoTranslationHelpObject>]: never; }>(base?: I): VideoTranslationHelpObject;
    fromPartial<I_1 extends {
        target?: string | undefined;
        targetUrl?: string | undefined;
    } & {
        target?: string | undefined;
        targetUrl?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof VideoTranslationHelpObject>]: never; }>(object: I_1): VideoTranslationHelpObject;
};
export declare const VideoTranslationRequest: {
    encode(message: VideoTranslationRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): VideoTranslationRequest;
    fromJSON(object: any): VideoTranslationRequest;
    toJSON(message: VideoTranslationRequest): unknown;
    create<I extends {
        url?: string | undefined;
        deviceId?: string | undefined;
        firstRequest?: boolean | undefined;
        duration?: number | undefined;
        unknown0?: number | undefined;
        language?: string | undefined;
        forceSourceLang?: boolean | undefined;
        unknown1?: number | undefined;
        translationHelp?: {
            target?: string | undefined;
            targetUrl?: string | undefined;
        }[] | undefined;
        responseLanguage?: string | undefined;
        unknown2?: number | undefined;
        unknown3?: number | undefined;
        bypassCache?: boolean | undefined;
    } & {
        url?: string | undefined;
        deviceId?: string | undefined;
        firstRequest?: boolean | undefined;
        duration?: number | undefined;
        unknown0?: number | undefined;
        language?: string | undefined;
        forceSourceLang?: boolean | undefined;
        unknown1?: number | undefined;
        translationHelp?: ({
            target?: string | undefined;
            targetUrl?: string | undefined;
        }[] & ({
            target?: string | undefined;
            targetUrl?: string | undefined;
        } & {
            target?: string | undefined;
            targetUrl?: string | undefined;
        } & { [K in Exclude<keyof I["translationHelp"][number], keyof VideoTranslationHelpObject>]: never; })[] & { [K_1 in Exclude<keyof I["translationHelp"], keyof {
            target?: string | undefined;
            targetUrl?: string | undefined;
        }[]>]: never; }) | undefined;
        responseLanguage?: string | undefined;
        unknown2?: number | undefined;
        unknown3?: number | undefined;
        bypassCache?: boolean | undefined;
    } & { [K_2 in Exclude<keyof I, keyof VideoTranslationRequest>]: never; }>(base?: I): VideoTranslationRequest;
    fromPartial<I_1 extends {
        url?: string | undefined;
        deviceId?: string | undefined;
        firstRequest?: boolean | undefined;
        duration?: number | undefined;
        unknown0?: number | undefined;
        language?: string | undefined;
        forceSourceLang?: boolean | undefined;
        unknown1?: number | undefined;
        translationHelp?: {
            target?: string | undefined;
            targetUrl?: string | undefined;
        }[] | undefined;
        responseLanguage?: string | undefined;
        unknown2?: number | undefined;
        unknown3?: number | undefined;
        bypassCache?: boolean | undefined;
    } & {
        url?: string | undefined;
        deviceId?: string | undefined;
        firstRequest?: boolean | undefined;
        duration?: number | undefined;
        unknown0?: number | undefined;
        language?: string | undefined;
        forceSourceLang?: boolean | undefined;
        unknown1?: number | undefined;
        translationHelp?: ({
            target?: string | undefined;
            targetUrl?: string | undefined;
        }[] & ({
            target?: string | undefined;
            targetUrl?: string | undefined;
        } & {
            target?: string | undefined;
            targetUrl?: string | undefined;
        } & { [K_3 in Exclude<keyof I_1["translationHelp"][number], keyof VideoTranslationHelpObject>]: never; })[] & { [K_4 in Exclude<keyof I_1["translationHelp"], keyof {
            target?: string | undefined;
            targetUrl?: string | undefined;
        }[]>]: never; }) | undefined;
        responseLanguage?: string | undefined;
        unknown2?: number | undefined;
        unknown3?: number | undefined;
        bypassCache?: boolean | undefined;
    } & { [K_5 in Exclude<keyof I_1, keyof VideoTranslationRequest>]: never; }>(object: I_1): VideoTranslationRequest;
};
export declare const VideoTranslationResponse: {
    encode(message: VideoTranslationResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): VideoTranslationResponse;
    fromJSON(object: any): VideoTranslationResponse;
    toJSON(message: VideoTranslationResponse): unknown;
    create<I extends {
        url?: string | undefined;
        duration?: number | undefined;
        status?: number | undefined;
        remainingTime?: number | undefined;
        unknown0?: number | undefined;
        translationId?: string | undefined;
        language?: string | undefined;
        message?: string | undefined;
    } & {
        url?: string | undefined;
        duration?: number | undefined;
        status?: number | undefined;
        remainingTime?: number | undefined;
        unknown0?: number | undefined;
        translationId?: string | undefined;
        language?: string | undefined;
        message?: string | undefined;
    } & { [K in Exclude<keyof I, keyof VideoTranslationResponse>]: never; }>(base?: I): VideoTranslationResponse;
    fromPartial<I_1 extends {
        url?: string | undefined;
        duration?: number | undefined;
        status?: number | undefined;
        remainingTime?: number | undefined;
        unknown0?: number | undefined;
        translationId?: string | undefined;
        language?: string | undefined;
        message?: string | undefined;
    } & {
        url?: string | undefined;
        duration?: number | undefined;
        status?: number | undefined;
        remainingTime?: number | undefined;
        unknown0?: number | undefined;
        translationId?: string | undefined;
        language?: string | undefined;
        message?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof VideoTranslationResponse>]: never; }>(object: I_1): VideoTranslationResponse;
};
export declare const SubtitlesObject: {
    encode(message: SubtitlesObject, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): SubtitlesObject;
    fromJSON(object: any): SubtitlesObject;
    toJSON(message: SubtitlesObject): unknown;
    create<I extends {
        language?: string | undefined;
        url?: string | undefined;
        unknown0?: number | undefined;
        translatedLanguages?: string | undefined;
        translatedUrl?: string | undefined;
        unknown1?: number | undefined;
        unknown2?: number | undefined;
    } & {
        language?: string | undefined;
        url?: string | undefined;
        unknown0?: number | undefined;
        translatedLanguages?: string | undefined;
        translatedUrl?: string | undefined;
        unknown1?: number | undefined;
        unknown2?: number | undefined;
    } & { [K in Exclude<keyof I, keyof SubtitlesObject>]: never; }>(base?: I): SubtitlesObject;
    fromPartial<I_1 extends {
        language?: string | undefined;
        url?: string | undefined;
        unknown0?: number | undefined;
        translatedLanguages?: string | undefined;
        translatedUrl?: string | undefined;
        unknown1?: number | undefined;
        unknown2?: number | undefined;
    } & {
        language?: string | undefined;
        url?: string | undefined;
        unknown0?: number | undefined;
        translatedLanguages?: string | undefined;
        translatedUrl?: string | undefined;
        unknown1?: number | undefined;
        unknown2?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof SubtitlesObject>]: never; }>(object: I_1): SubtitlesObject;
};
export declare const SubtitlesRequest: {
    encode(message: SubtitlesRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): SubtitlesRequest;
    fromJSON(object: any): SubtitlesRequest;
    toJSON(message: SubtitlesRequest): unknown;
    create<I extends {
        url?: string | undefined;
        language?: string | undefined;
    } & {
        url?: string | undefined;
        language?: string | undefined;
    } & { [K in Exclude<keyof I, keyof SubtitlesRequest>]: never; }>(base?: I): SubtitlesRequest;
    fromPartial<I_1 extends {
        url?: string | undefined;
        language?: string | undefined;
    } & {
        url?: string | undefined;
        language?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof SubtitlesRequest>]: never; }>(object: I_1): SubtitlesRequest;
};
export declare const SubtitlesResponse: {
    encode(message: SubtitlesResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): SubtitlesResponse;
    fromJSON(object: any): SubtitlesResponse;
    toJSON(message: SubtitlesResponse): unknown;
    create<I extends {
        waiting?: boolean | undefined;
        subtitles?: {
            language?: string | undefined;
            url?: string | undefined;
            unknown0?: number | undefined;
            translatedLanguages?: string | undefined;
            translatedUrl?: string | undefined;
            unknown1?: number | undefined;
            unknown2?: number | undefined;
        }[] | undefined;
    } & {
        waiting?: boolean | undefined;
        subtitles?: ({
            language?: string | undefined;
            url?: string | undefined;
            unknown0?: number | undefined;
            translatedLanguages?: string | undefined;
            translatedUrl?: string | undefined;
            unknown1?: number | undefined;
            unknown2?: number | undefined;
        }[] & ({
            language?: string | undefined;
            url?: string | undefined;
            unknown0?: number | undefined;
            translatedLanguages?: string | undefined;
            translatedUrl?: string | undefined;
            unknown1?: number | undefined;
            unknown2?: number | undefined;
        } & {
            language?: string | undefined;
            url?: string | undefined;
            unknown0?: number | undefined;
            translatedLanguages?: string | undefined;
            translatedUrl?: string | undefined;
            unknown1?: number | undefined;
            unknown2?: number | undefined;
        } & { [K in Exclude<keyof I["subtitles"][number], keyof SubtitlesObject>]: never; })[] & { [K_1 in Exclude<keyof I["subtitles"], keyof {
            language?: string | undefined;
            url?: string | undefined;
            unknown0?: number | undefined;
            translatedLanguages?: string | undefined;
            translatedUrl?: string | undefined;
            unknown1?: number | undefined;
            unknown2?: number | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_2 in Exclude<keyof I, keyof SubtitlesResponse>]: never; }>(base?: I): SubtitlesResponse;
    fromPartial<I_1 extends {
        waiting?: boolean | undefined;
        subtitles?: {
            language?: string | undefined;
            url?: string | undefined;
            unknown0?: number | undefined;
            translatedLanguages?: string | undefined;
            translatedUrl?: string | undefined;
            unknown1?: number | undefined;
            unknown2?: number | undefined;
        }[] | undefined;
    } & {
        waiting?: boolean | undefined;
        subtitles?: ({
            language?: string | undefined;
            url?: string | undefined;
            unknown0?: number | undefined;
            translatedLanguages?: string | undefined;
            translatedUrl?: string | undefined;
            unknown1?: number | undefined;
            unknown2?: number | undefined;
        }[] & ({
            language?: string | undefined;
            url?: string | undefined;
            unknown0?: number | undefined;
            translatedLanguages?: string | undefined;
            translatedUrl?: string | undefined;
            unknown1?: number | undefined;
            unknown2?: number | undefined;
        } & {
            language?: string | undefined;
            url?: string | undefined;
            unknown0?: number | undefined;
            translatedLanguages?: string | undefined;
            translatedUrl?: string | undefined;
            unknown1?: number | undefined;
            unknown2?: number | undefined;
        } & { [K_3 in Exclude<keyof I_1["subtitles"][number], keyof SubtitlesObject>]: never; })[] & { [K_4 in Exclude<keyof I_1["subtitles"], keyof {
            language?: string | undefined;
            url?: string | undefined;
            unknown0?: number | undefined;
            translatedLanguages?: string | undefined;
            translatedUrl?: string | undefined;
            unknown1?: number | undefined;
            unknown2?: number | undefined;
        }[]>]: never; }) | undefined;
    } & { [K_5 in Exclude<keyof I_1, keyof SubtitlesResponse>]: never; }>(object: I_1): SubtitlesResponse;
};
export declare const StreamTranslationObject: {
    encode(message: StreamTranslationObject, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StreamTranslationObject;
    fromJSON(object: any): StreamTranslationObject;
    toJSON(message: StreamTranslationObject): unknown;
    create<I extends {
        url?: string | undefined;
        timestamp?: number | undefined;
    } & {
        url?: string | undefined;
        timestamp?: number | undefined;
    } & { [K in Exclude<keyof I, keyof StreamTranslationObject>]: never; }>(base?: I): StreamTranslationObject;
    fromPartial<I_1 extends {
        url?: string | undefined;
        timestamp?: number | undefined;
    } & {
        url?: string | undefined;
        timestamp?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof StreamTranslationObject>]: never; }>(object: I_1): StreamTranslationObject;
};
export declare const StreamTranslationRequest: {
    encode(message: StreamTranslationRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StreamTranslationRequest;
    fromJSON(object: any): StreamTranslationRequest;
    toJSON(message: StreamTranslationRequest): unknown;
    create<I extends {
        url?: string | undefined;
        language?: string | undefined;
        responseLanguage?: string | undefined;
    } & {
        url?: string | undefined;
        language?: string | undefined;
        responseLanguage?: string | undefined;
    } & { [K in Exclude<keyof I, keyof StreamTranslationRequest>]: never; }>(base?: I): StreamTranslationRequest;
    fromPartial<I_1 extends {
        url?: string | undefined;
        language?: string | undefined;
        responseLanguage?: string | undefined;
    } & {
        url?: string | undefined;
        language?: string | undefined;
        responseLanguage?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof StreamTranslationRequest>]: never; }>(object: I_1): StreamTranslationRequest;
};
export declare const StreamTranslationResponse: {
    encode(message: StreamTranslationResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StreamTranslationResponse;
    fromJSON(object: any): StreamTranslationResponse;
    toJSON(message: StreamTranslationResponse): unknown;
    create<I extends {
        interval?: StreamInterval | undefined;
        translatedInfo?: {
            url?: string | undefined;
            timestamp?: number | undefined;
        } | undefined;
        pingId?: number | undefined;
    } & {
        interval?: StreamInterval | undefined;
        translatedInfo?: ({
            url?: string | undefined;
            timestamp?: number | undefined;
        } & {
            url?: string | undefined;
            timestamp?: number | undefined;
        } & { [K in Exclude<keyof I["translatedInfo"], keyof StreamTranslationObject>]: never; }) | undefined;
        pingId?: number | undefined;
    } & { [K_1 in Exclude<keyof I, keyof StreamTranslationResponse>]: never; }>(base?: I): StreamTranslationResponse;
    fromPartial<I_1 extends {
        interval?: StreamInterval | undefined;
        translatedInfo?: {
            url?: string | undefined;
            timestamp?: number | undefined;
        } | undefined;
        pingId?: number | undefined;
    } & {
        interval?: StreamInterval | undefined;
        translatedInfo?: ({
            url?: string | undefined;
            timestamp?: number | undefined;
        } & {
            url?: string | undefined;
            timestamp?: number | undefined;
        } & { [K_2 in Exclude<keyof I_1["translatedInfo"], keyof StreamTranslationObject>]: never; }) | undefined;
        pingId?: number | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof StreamTranslationResponse>]: never; }>(object: I_1): StreamTranslationResponse;
};
export declare const StreamPingRequest: {
    encode(message: StreamPingRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): StreamPingRequest;
    fromJSON(object: any): StreamPingRequest;
    toJSON(message: StreamPingRequest): unknown;
    create<I extends {
        pingId?: number | undefined;
    } & {
        pingId?: number | undefined;
    } & { [K in Exclude<keyof I, "pingId">]: never; }>(base?: I): StreamPingRequest;
    fromPartial<I_1 extends {
        pingId?: number | undefined;
    } & {
        pingId?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, "pingId">]: never; }>(object: I_1): StreamPingRequest;
};
export declare const YandexSessionRequest: {
    encode(message: YandexSessionRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): YandexSessionRequest;
    fromJSON(object: any): YandexSessionRequest;
    toJSON(message: YandexSessionRequest): unknown;
    create<I extends {
        uuid?: string | undefined;
        module?: string | undefined;
    } & {
        uuid?: string | undefined;
        module?: string | undefined;
    } & { [K in Exclude<keyof I, keyof YandexSessionRequest>]: never; }>(base?: I): YandexSessionRequest;
    fromPartial<I_1 extends {
        uuid?: string | undefined;
        module?: string | undefined;
    } & {
        uuid?: string | undefined;
        module?: string | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof YandexSessionRequest>]: never; }>(object: I_1): YandexSessionRequest;
};
export declare const YandexSessionResponse: {
    encode(message: YandexSessionResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): YandexSessionResponse;
    fromJSON(object: any): YandexSessionResponse;
    toJSON(message: YandexSessionResponse): unknown;
    create<I extends {
        secretKey?: string | undefined;
        expires?: number | undefined;
    } & {
        secretKey?: string | undefined;
        expires?: number | undefined;
    } & { [K in Exclude<keyof I, keyof YandexSessionResponse>]: never; }>(base?: I): YandexSessionResponse;
    fromPartial<I_1 extends {
        secretKey?: string | undefined;
        expires?: number | undefined;
    } & {
        secretKey?: string | undefined;
        expires?: number | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof YandexSessionResponse>]: never; }>(object: I_1): YandexSessionResponse;
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
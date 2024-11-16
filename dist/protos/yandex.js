import _m0 from "protobufjs/minimal.js";
export const protobufPackage = "";
export var StreamInterval;
(function (StreamInterval) {
    StreamInterval[StreamInterval["NO_CONNECTION"] = 0] = "NO_CONNECTION";
    StreamInterval[StreamInterval["TRANSLATING"] = 10] = "TRANSLATING";
    StreamInterval[StreamInterval["STREAMING"] = 20] = "STREAMING";
    StreamInterval[StreamInterval["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(StreamInterval || (StreamInterval = {}));
export function streamIntervalFromJSON(object) {
    switch (object) {
        case 0:
        case "NO_CONNECTION":
            return StreamInterval.NO_CONNECTION;
        case 10:
        case "TRANSLATING":
            return StreamInterval.TRANSLATING;
        case 20:
        case "STREAMING":
            return StreamInterval.STREAMING;
        case -1:
        case "UNRECOGNIZED":
        default:
            return StreamInterval.UNRECOGNIZED;
    }
}
export function streamIntervalToJSON(object) {
    switch (object) {
        case StreamInterval.NO_CONNECTION:
            return "NO_CONNECTION";
        case StreamInterval.TRANSLATING:
            return "TRANSLATING";
        case StreamInterval.STREAMING:
            return "STREAMING";
        case StreamInterval.UNRECOGNIZED:
        default:
            return "UNRECOGNIZED";
    }
}
function createBaseVideoTranslationHelpObject() {
    return { target: "", targetUrl: "" };
}
export const VideoTranslationHelpObject = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.target !== "") {
            writer.uint32(10).string(message.target);
        }
        if (message.targetUrl !== "") {
            writer.uint32(18).string(message.targetUrl);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseVideoTranslationHelpObject();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.target = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.targetUrl = reader.string();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            target: isSet(object.target) ? globalThis.String(object.target) : "",
            targetUrl: isSet(object.targetUrl) ? globalThis.String(object.targetUrl) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.target !== "") {
            obj.target = message.target;
        }
        if (message.targetUrl !== "") {
            obj.targetUrl = message.targetUrl;
        }
        return obj;
    },
    create(base) {
        return VideoTranslationHelpObject.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseVideoTranslationHelpObject();
        message.target = object.target ?? "";
        message.targetUrl = object.targetUrl ?? "";
        return message;
    },
};
function createBaseVideoTranslationRequest() {
    return {
        url: "",
        deviceId: undefined,
        firstRequest: false,
        duration: 0,
        unknown0: 0,
        language: "",
        forceSourceLang: false,
        unknown1: 0,
        translationHelp: [],
        responseLanguage: "",
        unknown2: 0,
        unknown3: 0,
        bypassCache: false,
        useNewModel: false,
    };
}
export const VideoTranslationRequest = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.url !== "") {
            writer.uint32(26).string(message.url);
        }
        if (message.deviceId !== undefined) {
            writer.uint32(34).string(message.deviceId);
        }
        if (message.firstRequest !== false) {
            writer.uint32(40).bool(message.firstRequest);
        }
        if (message.duration !== 0) {
            writer.uint32(49).double(message.duration);
        }
        if (message.unknown0 !== 0) {
            writer.uint32(56).int32(message.unknown0);
        }
        if (message.language !== "") {
            writer.uint32(66).string(message.language);
        }
        if (message.forceSourceLang !== false) {
            writer.uint32(72).bool(message.forceSourceLang);
        }
        if (message.unknown1 !== 0) {
            writer.uint32(80).int32(message.unknown1);
        }
        for (const v of message.translationHelp) {
            VideoTranslationHelpObject.encode(v, writer.uint32(90).fork()).ldelim();
        }
        if (message.responseLanguage !== "") {
            writer.uint32(114).string(message.responseLanguage);
        }
        if (message.unknown2 !== 0) {
            writer.uint32(120).int32(message.unknown2);
        }
        if (message.unknown3 !== 0) {
            writer.uint32(128).int32(message.unknown3);
        }
        if (message.bypassCache !== false) {
            writer.uint32(136).bool(message.bypassCache);
        }
        if (message.useNewModel !== false) {
            writer.uint32(144).bool(message.useNewModel);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseVideoTranslationRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.url = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.deviceId = reader.string();
                    continue;
                case 5:
                    if (tag !== 40) {
                        break;
                    }
                    message.firstRequest = reader.bool();
                    continue;
                case 6:
                    if (tag !== 49) {
                        break;
                    }
                    message.duration = reader.double();
                    continue;
                case 7:
                    if (tag !== 56) {
                        break;
                    }
                    message.unknown0 = reader.int32();
                    continue;
                case 8:
                    if (tag !== 66) {
                        break;
                    }
                    message.language = reader.string();
                    continue;
                case 9:
                    if (tag !== 72) {
                        break;
                    }
                    message.forceSourceLang = reader.bool();
                    continue;
                case 10:
                    if (tag !== 80) {
                        break;
                    }
                    message.unknown1 = reader.int32();
                    continue;
                case 11:
                    if (tag !== 90) {
                        break;
                    }
                    message.translationHelp.push(VideoTranslationHelpObject.decode(reader, reader.uint32()));
                    continue;
                case 14:
                    if (tag !== 114) {
                        break;
                    }
                    message.responseLanguage = reader.string();
                    continue;
                case 15:
                    if (tag !== 120) {
                        break;
                    }
                    message.unknown2 = reader.int32();
                    continue;
                case 16:
                    if (tag !== 128) {
                        break;
                    }
                    message.unknown3 = reader.int32();
                    continue;
                case 17:
                    if (tag !== 136) {
                        break;
                    }
                    message.bypassCache = reader.bool();
                    continue;
                case 18:
                    if (tag !== 144) {
                        break;
                    }
                    message.useNewModel = reader.bool();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            url: isSet(object.url) ? globalThis.String(object.url) : "",
            deviceId: isSet(object.deviceId) ? globalThis.String(object.deviceId) : undefined,
            firstRequest: isSet(object.firstRequest) ? globalThis.Boolean(object.firstRequest) : false,
            duration: isSet(object.duration) ? globalThis.Number(object.duration) : 0,
            unknown0: isSet(object.unknown0) ? globalThis.Number(object.unknown0) : 0,
            language: isSet(object.language) ? globalThis.String(object.language) : "",
            forceSourceLang: isSet(object.forceSourceLang) ? globalThis.Boolean(object.forceSourceLang) : false,
            unknown1: isSet(object.unknown1) ? globalThis.Number(object.unknown1) : 0,
            translationHelp: globalThis.Array.isArray(object?.translationHelp)
                ? object.translationHelp.map((e) => VideoTranslationHelpObject.fromJSON(e))
                : [],
            responseLanguage: isSet(object.responseLanguage) ? globalThis.String(object.responseLanguage) : "",
            unknown2: isSet(object.unknown2) ? globalThis.Number(object.unknown2) : 0,
            unknown3: isSet(object.unknown3) ? globalThis.Number(object.unknown3) : 0,
            bypassCache: isSet(object.bypassCache) ? globalThis.Boolean(object.bypassCache) : false,
            useNewModel: isSet(object.useNewModel) ? globalThis.Boolean(object.useNewModel) : false,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.url !== "") {
            obj.url = message.url;
        }
        if (message.deviceId !== undefined) {
            obj.deviceId = message.deviceId;
        }
        if (message.firstRequest !== false) {
            obj.firstRequest = message.firstRequest;
        }
        if (message.duration !== 0) {
            obj.duration = message.duration;
        }
        if (message.unknown0 !== 0) {
            obj.unknown0 = Math.round(message.unknown0);
        }
        if (message.language !== "") {
            obj.language = message.language;
        }
        if (message.forceSourceLang !== false) {
            obj.forceSourceLang = message.forceSourceLang;
        }
        if (message.unknown1 !== 0) {
            obj.unknown1 = Math.round(message.unknown1);
        }
        if (message.translationHelp?.length) {
            obj.translationHelp = message.translationHelp.map((e) => VideoTranslationHelpObject.toJSON(e));
        }
        if (message.responseLanguage !== "") {
            obj.responseLanguage = message.responseLanguage;
        }
        if (message.unknown2 !== 0) {
            obj.unknown2 = Math.round(message.unknown2);
        }
        if (message.unknown3 !== 0) {
            obj.unknown3 = Math.round(message.unknown3);
        }
        if (message.bypassCache !== false) {
            obj.bypassCache = message.bypassCache;
        }
        if (message.useNewModel !== false) {
            obj.useNewModel = message.useNewModel;
        }
        return obj;
    },
    create(base) {
        return VideoTranslationRequest.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseVideoTranslationRequest();
        message.url = object.url ?? "";
        message.deviceId = object.deviceId ?? undefined;
        message.firstRequest = object.firstRequest ?? false;
        message.duration = object.duration ?? 0;
        message.unknown0 = object.unknown0 ?? 0;
        message.language = object.language ?? "";
        message.forceSourceLang = object.forceSourceLang ?? false;
        message.unknown1 = object.unknown1 ?? 0;
        message.translationHelp = object.translationHelp?.map((e) => VideoTranslationHelpObject.fromPartial(e)) || [];
        message.responseLanguage = object.responseLanguage ?? "";
        message.unknown2 = object.unknown2 ?? 0;
        message.unknown3 = object.unknown3 ?? 0;
        message.bypassCache = object.bypassCache ?? false;
        message.useNewModel = object.useNewModel ?? false;
        return message;
    },
};
function createBaseVideoTranslationResponse() {
    return {
        url: undefined,
        duration: undefined,
        status: 0,
        remainingTime: undefined,
        unknown0: undefined,
        translationId: "",
        language: undefined,
        message: undefined,
    };
}
export const VideoTranslationResponse = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.url !== undefined) {
            writer.uint32(10).string(message.url);
        }
        if (message.duration !== undefined) {
            writer.uint32(17).double(message.duration);
        }
        if (message.status !== 0) {
            writer.uint32(32).int32(message.status);
        }
        if (message.remainingTime !== undefined) {
            writer.uint32(40).int32(message.remainingTime);
        }
        if (message.unknown0 !== undefined) {
            writer.uint32(48).int32(message.unknown0);
        }
        if (message.translationId !== "") {
            writer.uint32(58).string(message.translationId);
        }
        if (message.language !== undefined) {
            writer.uint32(66).string(message.language);
        }
        if (message.message !== undefined) {
            writer.uint32(74).string(message.message);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseVideoTranslationResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.url = reader.string();
                    continue;
                case 2:
                    if (tag !== 17) {
                        break;
                    }
                    message.duration = reader.double();
                    continue;
                case 4:
                    if (tag !== 32) {
                        break;
                    }
                    message.status = reader.int32();
                    continue;
                case 5:
                    if (tag !== 40) {
                        break;
                    }
                    message.remainingTime = reader.int32();
                    continue;
                case 6:
                    if (tag !== 48) {
                        break;
                    }
                    message.unknown0 = reader.int32();
                    continue;
                case 7:
                    if (tag !== 58) {
                        break;
                    }
                    message.translationId = reader.string();
                    continue;
                case 8:
                    if (tag !== 66) {
                        break;
                    }
                    message.language = reader.string();
                    continue;
                case 9:
                    if (tag !== 74) {
                        break;
                    }
                    message.message = reader.string();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            url: isSet(object.url) ? globalThis.String(object.url) : undefined,
            duration: isSet(object.duration) ? globalThis.Number(object.duration) : undefined,
            status: isSet(object.status) ? globalThis.Number(object.status) : 0,
            remainingTime: isSet(object.remainingTime) ? globalThis.Number(object.remainingTime) : undefined,
            unknown0: isSet(object.unknown0) ? globalThis.Number(object.unknown0) : undefined,
            translationId: isSet(object.translationId) ? globalThis.String(object.translationId) : "",
            language: isSet(object.language) ? globalThis.String(object.language) : undefined,
            message: isSet(object.message) ? globalThis.String(object.message) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.url !== undefined) {
            obj.url = message.url;
        }
        if (message.duration !== undefined) {
            obj.duration = message.duration;
        }
        if (message.status !== 0) {
            obj.status = Math.round(message.status);
        }
        if (message.remainingTime !== undefined) {
            obj.remainingTime = Math.round(message.remainingTime);
        }
        if (message.unknown0 !== undefined) {
            obj.unknown0 = Math.round(message.unknown0);
        }
        if (message.translationId !== "") {
            obj.translationId = message.translationId;
        }
        if (message.language !== undefined) {
            obj.language = message.language;
        }
        if (message.message !== undefined) {
            obj.message = message.message;
        }
        return obj;
    },
    create(base) {
        return VideoTranslationResponse.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseVideoTranslationResponse();
        message.url = object.url ?? undefined;
        message.duration = object.duration ?? undefined;
        message.status = object.status ?? 0;
        message.remainingTime = object.remainingTime ?? undefined;
        message.unknown0 = object.unknown0 ?? undefined;
        message.translationId = object.translationId ?? "";
        message.language = object.language ?? undefined;
        message.message = object.message ?? undefined;
        return message;
    },
};
function createBaseAudioBufferObject() {
    return { audioFile: new Uint8Array(0), fileId: "" };
}
export const AudioBufferObject = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.audioFile.length !== 0) {
            writer.uint32(18).bytes(message.audioFile);
        }
        if (message.fileId !== "") {
            writer.uint32(10).string(message.fileId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseAudioBufferObject();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.audioFile = reader.bytes();
                    continue;
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.fileId = reader.string();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            audioFile: isSet(object.audioFile) ? bytesFromBase64(object.audioFile) : new Uint8Array(0),
            fileId: isSet(object.fileId) ? globalThis.String(object.fileId) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.audioFile.length !== 0) {
            obj.audioFile = base64FromBytes(message.audioFile);
        }
        if (message.fileId !== "") {
            obj.fileId = message.fileId;
        }
        return obj;
    },
    create(base) {
        return AudioBufferObject.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseAudioBufferObject();
        message.audioFile = object.audioFile ?? new Uint8Array(0);
        message.fileId = object.fileId ?? "";
        return message;
    },
};
function createBaseChunkAudioObject() {
    return { audioPartsLength: 0, audioBuffer: undefined, fileId: "", unknown0: 0 };
}
export const ChunkAudioObject = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.audioPartsLength !== 0) {
            writer.uint32(16).int32(message.audioPartsLength);
        }
        if (message.audioBuffer !== undefined) {
            AudioBufferObject.encode(message.audioBuffer, writer.uint32(10).fork()).ldelim();
        }
        if (message.fileId !== "") {
            writer.uint32(26).string(message.fileId);
        }
        if (message.unknown0 !== 0) {
            writer.uint32(32).int32(message.unknown0);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseChunkAudioObject();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.audioPartsLength = reader.int32();
                    continue;
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.audioBuffer = AudioBufferObject.decode(reader, reader.uint32());
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.fileId = reader.string();
                    continue;
                case 4:
                    if (tag !== 32) {
                        break;
                    }
                    message.unknown0 = reader.int32();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            audioPartsLength: isSet(object.audioPartsLength) ? globalThis.Number(object.audioPartsLength) : 0,
            audioBuffer: isSet(object.audioBuffer) ? AudioBufferObject.fromJSON(object.audioBuffer) : undefined,
            fileId: isSet(object.fileId) ? globalThis.String(object.fileId) : "",
            unknown0: isSet(object.unknown0) ? globalThis.Number(object.unknown0) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.audioPartsLength !== 0) {
            obj.audioPartsLength = Math.round(message.audioPartsLength);
        }
        if (message.audioBuffer !== undefined) {
            obj.audioBuffer = AudioBufferObject.toJSON(message.audioBuffer);
        }
        if (message.fileId !== "") {
            obj.fileId = message.fileId;
        }
        if (message.unknown0 !== 0) {
            obj.unknown0 = Math.round(message.unknown0);
        }
        return obj;
    },
    create(base) {
        return ChunkAudioObject.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseChunkAudioObject();
        message.audioPartsLength = object.audioPartsLength ?? 0;
        message.audioBuffer = (object.audioBuffer !== undefined && object.audioBuffer !== null)
            ? AudioBufferObject.fromPartial(object.audioBuffer)
            : undefined;
        message.fileId = object.fileId ?? "";
        message.unknown0 = object.unknown0 ?? 0;
        return message;
    },
};
function createBaseVideoTranslationAudioRequest() {
    return { translationId: "", url: "", partialAudioInfo: undefined, audioInfo: undefined };
}
export const VideoTranslationAudioRequest = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.translationId !== "") {
            writer.uint32(10).string(message.translationId);
        }
        if (message.url !== "") {
            writer.uint32(18).string(message.url);
        }
        if (message.partialAudioInfo !== undefined) {
            ChunkAudioObject.encode(message.partialAudioInfo, writer.uint32(34).fork()).ldelim();
        }
        if (message.audioInfo !== undefined) {
            AudioBufferObject.encode(message.audioInfo, writer.uint32(50).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseVideoTranslationAudioRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.translationId = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.url = reader.string();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.partialAudioInfo = ChunkAudioObject.decode(reader, reader.uint32());
                    continue;
                case 6:
                    if (tag !== 50) {
                        break;
                    }
                    message.audioInfo = AudioBufferObject.decode(reader, reader.uint32());
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            translationId: isSet(object.translationId) ? globalThis.String(object.translationId) : "",
            url: isSet(object.url) ? globalThis.String(object.url) : "",
            partialAudioInfo: isSet(object.partialAudioInfo) ? ChunkAudioObject.fromJSON(object.partialAudioInfo) : undefined,
            audioInfo: isSet(object.audioInfo) ? AudioBufferObject.fromJSON(object.audioInfo) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.translationId !== "") {
            obj.translationId = message.translationId;
        }
        if (message.url !== "") {
            obj.url = message.url;
        }
        if (message.partialAudioInfo !== undefined) {
            obj.partialAudioInfo = ChunkAudioObject.toJSON(message.partialAudioInfo);
        }
        if (message.audioInfo !== undefined) {
            obj.audioInfo = AudioBufferObject.toJSON(message.audioInfo);
        }
        return obj;
    },
    create(base) {
        return VideoTranslationAudioRequest.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseVideoTranslationAudioRequest();
        message.translationId = object.translationId ?? "";
        message.url = object.url ?? "";
        message.partialAudioInfo = (object.partialAudioInfo !== undefined && object.partialAudioInfo !== null)
            ? ChunkAudioObject.fromPartial(object.partialAudioInfo)
            : undefined;
        message.audioInfo = (object.audioInfo !== undefined && object.audioInfo !== null)
            ? AudioBufferObject.fromPartial(object.audioInfo)
            : undefined;
        return message;
    },
};
function createBaseVideoTranslationAudioResponse() {
    return { status: 0, remainingChunks: [] };
}
export const VideoTranslationAudioResponse = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.status !== 0) {
            writer.uint32(8).int32(message.status);
        }
        for (const v of message.remainingChunks) {
            writer.uint32(18).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseVideoTranslationAudioResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.status = reader.int32();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.remainingChunks.push(reader.string());
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            status: isSet(object.status) ? globalThis.Number(object.status) : 0,
            remainingChunks: globalThis.Array.isArray(object?.remainingChunks)
                ? object.remainingChunks.map((e) => globalThis.String(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.status !== 0) {
            obj.status = Math.round(message.status);
        }
        if (message.remainingChunks?.length) {
            obj.remainingChunks = message.remainingChunks;
        }
        return obj;
    },
    create(base) {
        return VideoTranslationAudioResponse.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseVideoTranslationAudioResponse();
        message.status = object.status ?? 0;
        message.remainingChunks = object.remainingChunks?.map((e) => e) || [];
        return message;
    },
};
function createBaseSubtitlesObject() {
    return { language: "", url: "", unknown0: 0, translatedLanguage: "", translatedUrl: "", unknown1: 0, unknown2: 0 };
}
export const SubtitlesObject = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.language !== "") {
            writer.uint32(10).string(message.language);
        }
        if (message.url !== "") {
            writer.uint32(18).string(message.url);
        }
        if (message.unknown0 !== 0) {
            writer.uint32(24).int32(message.unknown0);
        }
        if (message.translatedLanguage !== "") {
            writer.uint32(34).string(message.translatedLanguage);
        }
        if (message.translatedUrl !== "") {
            writer.uint32(42).string(message.translatedUrl);
        }
        if (message.unknown1 !== 0) {
            writer.uint32(48).int32(message.unknown1);
        }
        if (message.unknown2 !== 0) {
            writer.uint32(56).int32(message.unknown2);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSubtitlesObject();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.language = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.url = reader.string();
                    continue;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.unknown0 = reader.int32();
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.translatedLanguage = reader.string();
                    continue;
                case 5:
                    if (tag !== 42) {
                        break;
                    }
                    message.translatedUrl = reader.string();
                    continue;
                case 6:
                    if (tag !== 48) {
                        break;
                    }
                    message.unknown1 = reader.int32();
                    continue;
                case 7:
                    if (tag !== 56) {
                        break;
                    }
                    message.unknown2 = reader.int32();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            language: isSet(object.language) ? globalThis.String(object.language) : "",
            url: isSet(object.url) ? globalThis.String(object.url) : "",
            unknown0: isSet(object.unknown0) ? globalThis.Number(object.unknown0) : 0,
            translatedLanguage: isSet(object.translatedLanguage) ? globalThis.String(object.translatedLanguage) : "",
            translatedUrl: isSet(object.translatedUrl) ? globalThis.String(object.translatedUrl) : "",
            unknown1: isSet(object.unknown1) ? globalThis.Number(object.unknown1) : 0,
            unknown2: isSet(object.unknown2) ? globalThis.Number(object.unknown2) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.language !== "") {
            obj.language = message.language;
        }
        if (message.url !== "") {
            obj.url = message.url;
        }
        if (message.unknown0 !== 0) {
            obj.unknown0 = Math.round(message.unknown0);
        }
        if (message.translatedLanguage !== "") {
            obj.translatedLanguage = message.translatedLanguage;
        }
        if (message.translatedUrl !== "") {
            obj.translatedUrl = message.translatedUrl;
        }
        if (message.unknown1 !== 0) {
            obj.unknown1 = Math.round(message.unknown1);
        }
        if (message.unknown2 !== 0) {
            obj.unknown2 = Math.round(message.unknown2);
        }
        return obj;
    },
    create(base) {
        return SubtitlesObject.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseSubtitlesObject();
        message.language = object.language ?? "";
        message.url = object.url ?? "";
        message.unknown0 = object.unknown0 ?? 0;
        message.translatedLanguage = object.translatedLanguage ?? "";
        message.translatedUrl = object.translatedUrl ?? "";
        message.unknown1 = object.unknown1 ?? 0;
        message.unknown2 = object.unknown2 ?? 0;
        return message;
    },
};
function createBaseSubtitlesRequest() {
    return { url: "", language: "" };
}
export const SubtitlesRequest = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.url !== "") {
            writer.uint32(10).string(message.url);
        }
        if (message.language !== "") {
            writer.uint32(18).string(message.language);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSubtitlesRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.url = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.language = reader.string();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            url: isSet(object.url) ? globalThis.String(object.url) : "",
            language: isSet(object.language) ? globalThis.String(object.language) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.url !== "") {
            obj.url = message.url;
        }
        if (message.language !== "") {
            obj.language = message.language;
        }
        return obj;
    },
    create(base) {
        return SubtitlesRequest.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseSubtitlesRequest();
        message.url = object.url ?? "";
        message.language = object.language ?? "";
        return message;
    },
};
function createBaseSubtitlesResponse() {
    return { waiting: false, subtitles: [] };
}
export const SubtitlesResponse = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.waiting !== false) {
            writer.uint32(8).bool(message.waiting);
        }
        for (const v of message.subtitles) {
            SubtitlesObject.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseSubtitlesResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.waiting = reader.bool();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.subtitles.push(SubtitlesObject.decode(reader, reader.uint32()));
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            waiting: isSet(object.waiting) ? globalThis.Boolean(object.waiting) : false,
            subtitles: globalThis.Array.isArray(object?.subtitles)
                ? object.subtitles.map((e) => SubtitlesObject.fromJSON(e))
                : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.waiting !== false) {
            obj.waiting = message.waiting;
        }
        if (message.subtitles?.length) {
            obj.subtitles = message.subtitles.map((e) => SubtitlesObject.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return SubtitlesResponse.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseSubtitlesResponse();
        message.waiting = object.waiting ?? false;
        message.subtitles = object.subtitles?.map((e) => SubtitlesObject.fromPartial(e)) || [];
        return message;
    },
};
function createBaseStreamTranslationObject() {
    return { url: "", timestamp: "" };
}
export const StreamTranslationObject = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.url !== "") {
            writer.uint32(10).string(message.url);
        }
        if (message.timestamp !== "") {
            writer.uint32(18).string(message.timestamp);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStreamTranslationObject();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.url = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.timestamp = reader.string();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            url: isSet(object.url) ? globalThis.String(object.url) : "",
            timestamp: isSet(object.timestamp) ? globalThis.String(object.timestamp) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.url !== "") {
            obj.url = message.url;
        }
        if (message.timestamp !== "") {
            obj.timestamp = message.timestamp;
        }
        return obj;
    },
    create(base) {
        return StreamTranslationObject.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseStreamTranslationObject();
        message.url = object.url ?? "";
        message.timestamp = object.timestamp ?? "";
        return message;
    },
};
function createBaseStreamTranslationRequest() {
    return { url: "", language: "", responseLanguage: "" };
}
export const StreamTranslationRequest = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.url !== "") {
            writer.uint32(10).string(message.url);
        }
        if (message.language !== "") {
            writer.uint32(18).string(message.language);
        }
        if (message.responseLanguage !== "") {
            writer.uint32(26).string(message.responseLanguage);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStreamTranslationRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.url = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.language = reader.string();
                    continue;
                case 3:
                    if (tag !== 26) {
                        break;
                    }
                    message.responseLanguage = reader.string();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            url: isSet(object.url) ? globalThis.String(object.url) : "",
            language: isSet(object.language) ? globalThis.String(object.language) : "",
            responseLanguage: isSet(object.responseLanguage) ? globalThis.String(object.responseLanguage) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.url !== "") {
            obj.url = message.url;
        }
        if (message.language !== "") {
            obj.language = message.language;
        }
        if (message.responseLanguage !== "") {
            obj.responseLanguage = message.responseLanguage;
        }
        return obj;
    },
    create(base) {
        return StreamTranslationRequest.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseStreamTranslationRequest();
        message.url = object.url ?? "";
        message.language = object.language ?? "";
        message.responseLanguage = object.responseLanguage ?? "";
        return message;
    },
};
function createBaseStreamTranslationResponse() {
    return { interval: 0, translatedInfo: undefined, pingId: undefined };
}
export const StreamTranslationResponse = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.interval !== 0) {
            writer.uint32(8).int32(message.interval);
        }
        if (message.translatedInfo !== undefined) {
            StreamTranslationObject.encode(message.translatedInfo, writer.uint32(18).fork()).ldelim();
        }
        if (message.pingId !== undefined) {
            writer.uint32(24).int32(message.pingId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStreamTranslationResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.interval = reader.int32();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.translatedInfo = StreamTranslationObject.decode(reader, reader.uint32());
                    continue;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.pingId = reader.int32();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            interval: isSet(object.interval) ? streamIntervalFromJSON(object.interval) : 0,
            translatedInfo: isSet(object.translatedInfo)
                ? StreamTranslationObject.fromJSON(object.translatedInfo)
                : undefined,
            pingId: isSet(object.pingId) ? globalThis.Number(object.pingId) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.interval !== 0) {
            obj.interval = streamIntervalToJSON(message.interval);
        }
        if (message.translatedInfo !== undefined) {
            obj.translatedInfo = StreamTranslationObject.toJSON(message.translatedInfo);
        }
        if (message.pingId !== undefined) {
            obj.pingId = Math.round(message.pingId);
        }
        return obj;
    },
    create(base) {
        return StreamTranslationResponse.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseStreamTranslationResponse();
        message.interval = object.interval ?? 0;
        message.translatedInfo = (object.translatedInfo !== undefined && object.translatedInfo !== null)
            ? StreamTranslationObject.fromPartial(object.translatedInfo)
            : undefined;
        message.pingId = object.pingId ?? undefined;
        return message;
    },
};
function createBaseStreamPingRequest() {
    return { pingId: 0 };
}
export const StreamPingRequest = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.pingId !== 0) {
            writer.uint32(8).int32(message.pingId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseStreamPingRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 8) {
                        break;
                    }
                    message.pingId = reader.int32();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return { pingId: isSet(object.pingId) ? globalThis.Number(object.pingId) : 0 };
    },
    toJSON(message) {
        const obj = {};
        if (message.pingId !== 0) {
            obj.pingId = Math.round(message.pingId);
        }
        return obj;
    },
    create(base) {
        return StreamPingRequest.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseStreamPingRequest();
        message.pingId = object.pingId ?? 0;
        return message;
    },
};
function createBaseYandexSessionRequest() {
    return { uuid: "", module: "" };
}
export const YandexSessionRequest = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.uuid !== "") {
            writer.uint32(10).string(message.uuid);
        }
        if (message.module !== "") {
            writer.uint32(18).string(message.module);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseYandexSessionRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.uuid = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.module = reader.string();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            uuid: isSet(object.uuid) ? globalThis.String(object.uuid) : "",
            module: isSet(object.module) ? globalThis.String(object.module) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.uuid !== "") {
            obj.uuid = message.uuid;
        }
        if (message.module !== "") {
            obj.module = message.module;
        }
        return obj;
    },
    create(base) {
        return YandexSessionRequest.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseYandexSessionRequest();
        message.uuid = object.uuid ?? "";
        message.module = object.module ?? "";
        return message;
    },
};
function createBaseYandexSessionResponse() {
    return { secretKey: "", expires: 0 };
}
export const YandexSessionResponse = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.secretKey !== "") {
            writer.uint32(10).string(message.secretKey);
        }
        if (message.expires !== 0) {
            writer.uint32(16).int32(message.expires);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseYandexSessionResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.secretKey = reader.string();
                    continue;
                case 2:
                    if (tag !== 16) {
                        break;
                    }
                    message.expires = reader.int32();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            secretKey: isSet(object.secretKey) ? globalThis.String(object.secretKey) : "",
            expires: isSet(object.expires) ? globalThis.Number(object.expires) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.secretKey !== "") {
            obj.secretKey = message.secretKey;
        }
        if (message.expires !== 0) {
            obj.expires = Math.round(message.expires);
        }
        return obj;
    },
    create(base) {
        return YandexSessionResponse.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseYandexSessionResponse();
        message.secretKey = object.secretKey ?? "";
        message.expires = object.expires ?? 0;
        return message;
    },
};
function bytesFromBase64(b64) {
    if (globalThis.Buffer) {
        return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
    }
    else {
        const bin = globalThis.atob(b64);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; ++i) {
            arr[i] = bin.charCodeAt(i);
        }
        return arr;
    }
}
function base64FromBytes(arr) {
    if (globalThis.Buffer) {
        return globalThis.Buffer.from(arr).toString("base64");
    }
    else {
        const bin = [];
        arr.forEach((byte) => {
            bin.push(globalThis.String.fromCharCode(byte));
        });
        return globalThis.btoa(bin.join(""));
    }
}
function isSet(value) {
    return value !== null && value !== undefined;
}

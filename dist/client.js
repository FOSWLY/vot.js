import config from "./config/config.js";
import { yandexProtobuf } from "./protobuf.js";
import { getSecYaHeaders, getSignature, getUUID } from "./secure.js";
import { AudioDownloadType, VideoTranslationStatus } from "./types/yandex.js";
import { fetchWithTimeout, getTimestamp } from "./utils/utils.js";
import { getVideoData } from "./utils/videoData.js";
import { convertVOT } from "./utils/vot.js";
import { StreamInterval } from "./protos/yandex.js";
import Logger from "./utils/logger.js";
class VOTJSError extends Error {
    data;
    constructor(message, data = undefined) {
        super(message);
        this.data = data;
        this.name = "VOTJSError";
        this.message = message;
    }
}
export default class VOTClient {
    host;
    hostVOT;
    schema;
    schemaVOT;
    fetch;
    fetchOpts;
    getVideoDataFn;
    sessions = {};
    requestLang;
    responseLang;
    userAgent = config.userAgent;
    paths = {
        videoTranslation: "/video-translation/translate",
        videoTranslationFailAudio: "/video-translation/fail-audio-js",
        videoTranslationAudio: "/video-translation/audio",
        videoSubtitles: "/video-subtitles/get-subtitles",
        streamPing: "/stream-translation/ping-stream",
        streamTranslation: "/stream-translation/translate-stream",
        createSession: "/session/create",
    };
    isCustomLink(url) {
        return !!(/\.(m3u8|m4(a|v)|mpd)/.exec(url) ??
            /^https:\/\/cdn\.qstv\.on\.epicgames\.com/.exec(url));
    }
    headers = {
        "User-Agent": this.userAgent,
        Accept: "application/x-protobuf",
        "Accept-Language": "en",
        "Content-Type": "application/x-protobuf",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
        "Sec-Fetch-Mode": "no-cors",
    };
    headersVOT = {
        "User-Agent": `vot.js/${config.version}`,
        "Content-Type": "application/json",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
    };
    constructor({ host = config.host, hostVOT = config.hostVOT, fetchFn = fetchWithTimeout, fetchOpts = {}, getVideoDataFn = getVideoData, requestLang = "en", responseLang = "ru", headers = {}, } = {}) {
        const schemaRe = /(http(s)?):\/\//;
        const schema = schemaRe.exec(host)?.[1];
        this.host = schema ? host.replace(`${schema}://`, "") : host;
        this.schema = schema ?? "https";
        const schemaVOT = schemaRe.exec(hostVOT)?.[1];
        this.hostVOT = schemaVOT ? hostVOT.replace(`${schemaVOT}://`, "") : hostVOT;
        this.schemaVOT = schemaVOT ?? "https";
        this.fetch = fetchFn;
        this.fetchOpts = fetchOpts;
        this.getVideoDataFn = getVideoDataFn;
        this.requestLang = requestLang;
        this.responseLang = responseLang;
        this.headers = { ...this.headers, ...headers };
    }
    getOpts(body, headers = {}, method = "POST") {
        return {
            method,
            headers: {
                ...this.headers,
                ...headers,
            },
            body,
            ...this.fetchOpts,
        };
    }
    async request(path, body, headers = {}, method = "POST") {
        const options = this.getOpts(new Blob([body]), headers, method);
        try {
            const res = await this.fetch(`${this.schema}://${this.host}${path}`, options);
            const data = (await res.arrayBuffer());
            return {
                success: res.status === 200,
                data,
            };
        }
        catch (err) {
            return {
                success: false,
                data: err?.message,
            };
        }
    }
    async requestJSON(path, body = null, headers = {}, method = "POST") {
        const options = this.getOpts(body, {
            "Content-Type": "application/json",
            ...headers,
        }, method);
        try {
            const res = await this.fetch(`${this.schema}://${this.host}${path}`, options);
            const data = (await res.json());
            return {
                success: res.status === 200,
                data,
            };
        }
        catch (err) {
            return {
                success: false,
                data: err?.message,
            };
        }
    }
    async requestVOT(path, body, headers = {}) {
        const options = this.getOpts(JSON.stringify(body), {
            ...this.headersVOT,
            ...headers,
        });
        try {
            const res = await this.fetch(`${this.schemaVOT}://${this.hostVOT}${path}`, options);
            const data = (await res.json());
            return {
                success: res.status === 200,
                data,
            };
        }
        catch (err) {
            return {
                success: false,
                data: err?.message,
            };
        }
    }
    async getSession(module) {
        const timestamp = getTimestamp();
        const session = this.sessions[module];
        if (session && session.timestamp + session.expires > timestamp) {
            return session;
        }
        const { secretKey, expires, uuid } = await this.createSession(module);
        this.sessions[module] = {
            secretKey,
            expires,
            timestamp,
            uuid,
        };
        return this.sessions[module];
    }
    async translateVideoYAImpl({ videoData, requestLang = this.requestLang, responseLang = this.responseLang, translationHelp = null, headers = {}, extraOpts = {}, shouldSendFailedAudio = true, }) {
        const { url, duration = config.defaultDuration } = videoData;
        const session = await this.getSession("video-translation");
        const body = yandexProtobuf.encodeTranslationRequest(url, duration, requestLang, responseLang, translationHelp, extraOpts);
        const path = this.paths.videoTranslation;
        const vtransHeaders = await getSecYaHeaders("Vtrans", session, body, path);
        const res = await this.request(path, body, {
            ...vtransHeaders,
            ...headers,
        });
        if (!res.success) {
            throw new VOTJSError("Failed to request video translation", res);
        }
        const translationData = yandexProtobuf.decodeTranslationResponse(res.data);
        const { status, translationId, } = translationData;
        switch (status) {
            case VideoTranslationStatus.FAILED:
                throw new VOTJSError("Yandex couldn't translate video", translationData);
            case VideoTranslationStatus.FINISHED:
            case VideoTranslationStatus.PART_CONTENT:
                if (!translationData.url) {
                    throw new VOTJSError("Audio link wasn't received from Yandex response", translationData);
                }
                return {
                    translationId,
                    translated: true,
                    url: translationData.url,
                    status,
                    remainingTime: translationData.remainingTime ?? -1,
                };
            case VideoTranslationStatus.WAITING:
            case VideoTranslationStatus.LONG_WAITING:
                return {
                    translationId,
                    translated: false,
                    status,
                    remainingTime: translationData.remainingTime,
                };
            case VideoTranslationStatus.AUDIO_REQUESTED:
                if (url.startsWith("https://youtu.be/") && shouldSendFailedAudio) {
                    await this.requestVtransFailAudio(url);
                    await this.requestVtransAudio(url, translationData.translationId, {
                        audioFile: new Uint8Array(),
                        fileId: AudioDownloadType.WEB_API_GET_ALL_GENERATING_URLS_DATA_FROM_IFRAME,
                    });
                    return await this.translateVideoYAImpl({
                        videoData,
                        requestLang,
                        responseLang,
                        translationHelp,
                        headers,
                        shouldSendFailedAudio: false,
                    });
                }
                return {
                    translationId,
                    translated: false,
                    status,
                    remainingTime: translationData.remainingTime ?? -1,
                };
            default:
                Logger.error("Unknown response", translationData);
                throw new VOTJSError("Unknown response from Yandex", translationData);
        }
    }
    async translateVideoVOTImpl({ url, videoId, service, requestLang = this.requestLang, responseLang = this.responseLang, headers = {}, }) {
        const votData = convertVOT(service, videoId, url);
        const res = await this.requestVOT(this.paths.videoTranslation, {
            provider: "yandex",
            service: votData.service,
            videoId: votData.videoId,
            fromLang: requestLang,
            toLang: responseLang,
            rawVideo: url,
        }, headers);
        if (!res.success) {
            throw new VOTJSError("Failed to request video translation", res);
        }
        const translationData = res.data;
        switch (translationData.status) {
            case "failed":
                throw new VOTJSError("Yandex couldn't translate video", translationData);
            case "success":
                if (!translationData.translatedUrl) {
                    throw new VOTJSError("Audio link wasn't received from VOT response", translationData);
                }
                return {
                    translationId: String(translationData.id),
                    translated: true,
                    url: translationData.translatedUrl,
                    status: 1,
                    remainingTime: -1,
                };
            case "waiting":
                return {
                    translationId: "",
                    translated: false,
                    remainingTime: translationData.remainingTime,
                    status: 2,
                    message: translationData.message,
                };
        }
    }
    async requestVtransFailAudio(url) {
        const res = await this.requestJSON(this.paths.videoTranslationFailAudio, JSON.stringify({
            video_url: url,
        }), undefined, "PUT");
        if (!res.data || typeof res.data === "string" || res.data.status !== 1) {
            throw new VOTJSError("Failed to request to fake video translation fail audio js", res);
        }
        return res;
    }
    async requestVtransAudio(url, translationId, audioBuffer, partialAudio, headers = {}) {
        const session = await this.getSession("video-translation");
        const body = yandexProtobuf.encodeTranslationAudioRequest(url, translationId, audioBuffer, partialAudio);
        const path = this.paths.videoTranslationAudio;
        const vtransHeaders = await getSecYaHeaders("Vtrans", session, body, path);
        const res = await this.request(path, body, {
            ...vtransHeaders,
            ...headers,
        }, "PUT");
        if (!res.success) {
            throw new VOTJSError("Failed to request video translation audio", res);
        }
        return yandexProtobuf.decodeTranslationAudioResponse(res.data);
    }
    async translateVideo({ videoData, requestLang = this.requestLang, responseLang = this.responseLang, translationHelp = null, headers = {}, extraOpts = {}, shouldSendFailedAudio = true, }) {
        const { url, videoId, host } = videoData;
        return this.isCustomLink(url)
            ? await this.translateVideoVOTImpl({
                url,
                videoId,
                service: host,
                requestLang,
                responseLang,
                headers,
            })
            : await this.translateVideoYAImpl({
                videoData,
                requestLang,
                responseLang,
                translationHelp,
                headers,
                extraOpts,
                shouldSendFailedAudio,
            });
    }
    async getSubtitles({ videoData, requestLang = this.requestLang, headers = {}, }) {
        const { url } = videoData;
        if (this.isCustomLink(url)) {
            throw new VOTJSError("Unsupported video URL for getting subtitles");
        }
        const session = await this.getSession("video-translation");
        const body = yandexProtobuf.encodeSubtitlesRequest(url, requestLang);
        const path = this.paths.videoSubtitles;
        const vsubsHeaders = await getSecYaHeaders("Vsubs", session, body, path);
        const res = await this.request(path, body, {
            ...vsubsHeaders,
            ...headers,
        });
        if (!res.success) {
            throw new VOTJSError("Failed to request video subtitles", res);
        }
        return yandexProtobuf.decodeSubtitlesResponse(res.data);
    }
    async pingStream({ pingId, headers = {} }) {
        const session = await this.getSession("video-translation");
        const body = yandexProtobuf.encodeStreamPingRequest(pingId);
        const path = this.paths.streamPing;
        const vtransHeaders = await getSecYaHeaders("Vtrans", session, body, path);
        const res = await this.request(path, body, {
            ...vtransHeaders,
            ...headers,
        });
        if (!res.success) {
            throw new VOTJSError("Failed to request stream ping", res);
        }
        return true;
    }
    async translateStream({ videoData, requestLang = this.requestLang, responseLang = this.responseLang, headers = {}, }) {
        const { url } = videoData;
        if (this.isCustomLink(url)) {
            throw new VOTJSError("Unsupported video URL for getting stream translation");
        }
        const session = await this.getSession("video-translation");
        const body = yandexProtobuf.encodeStreamRequest(url, requestLang, responseLang);
        const path = this.paths.streamTranslation;
        const vtransHeaders = await getSecYaHeaders("Vtrans", session, body, path);
        const res = await this.request(path, body, {
            ...vtransHeaders,
            ...headers,
        });
        if (!res.success) {
            throw new VOTJSError("Failed to request stream translation", res);
        }
        const translateResponse = yandexProtobuf.decodeStreamResponse(res.data);
        const interval = translateResponse.interval;
        switch (interval) {
            case StreamInterval.NO_CONNECTION:
            case StreamInterval.TRANSLATING:
                return {
                    translated: false,
                    interval,
                    message: interval === StreamInterval.NO_CONNECTION
                        ? "streamNoConnectionToServer"
                        : "translationTakeFewMinutes",
                };
            case StreamInterval.STREAMING: {
                return {
                    translated: true,
                    interval,
                    pingId: translateResponse.pingId,
                    result: translateResponse.translatedInfo,
                };
            }
            default:
                Logger.error("Unknown response", translateResponse);
                throw new VOTJSError("Unknown response from Yandex", translateResponse);
        }
    }
    async createSession(module) {
        const uuid = getUUID();
        const body = yandexProtobuf.encodeYandexSessionRequest(uuid, module);
        const res = await this.request(this.paths.createSession, body, {
            "Vtrans-Signature": await getSignature(body),
        });
        if (!res.success) {
            throw new VOTJSError("Failed to request create session", res);
        }
        const sessionResponse = yandexProtobuf.decodeYandexSessionResponse(res.data);
        return {
            ...sessionResponse,
            uuid,
        };
    }
}
export class VOTWorkerClient extends VOTClient {
    async request(path, body, headers = {}, method = "POST") {
        const options = this.getOpts(JSON.stringify({
            headers: {
                ...this.headers,
                ...headers,
            },
            body: Array.from(body),
        }), {
            "Content-Type": "application/json",
        }, method);
        try {
            const res = await this.fetch(`${this.schema}://${this.host}${path}`, options);
            const data = (await res.arrayBuffer());
            return {
                success: res.status === 200,
                data,
            };
        }
        catch (err) {
            return {
                success: false,
                data: err?.message,
            };
        }
    }
    async requestJSON(path, body = null, headers = {}, method = "POST") {
        const options = this.getOpts(JSON.stringify({
            headers: {
                ...this.headers,
                "Content-Type": "application/json",
                Accept: "application/json",
                ...headers,
            },
            body,
        }), {
            Accept: "application/json",
            "Content-Type": "application/json",
        }, method);
        try {
            const res = await this.fetch(`${this.schema}://${this.host}${path}`, options);
            const data = (await res.json());
            return {
                success: res.status === 200,
                data,
            };
        }
        catch (err) {
            return {
                success: false,
                data: err?.message,
            };
        }
    }
}

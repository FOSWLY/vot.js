import config from "./config/config.js";
import packageInfo from "../package.json";
import { yandexProtobuf } from "./protobuf.js";
import { getSignature, getUUID } from "./secure.js";
import { VideoTranslationStatus } from "./types/yandex.js";
import { fetchWithTimeout, getTimestamp } from "./utils/utils.js";
import { getVideoData } from "./utils/videoData.js";
import { convertVOT } from "./utils/vot.js";
import { StreamInterval } from "./protos/yandex.js";
const { version } = packageInfo;
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
    componentVersion = config.componentVersion;
    paths = {
        videoTranslation: "/video-translation/translate",
    };
    isCustomFormat(url) {
        return /\.(m3u8|m4(a|v)|mpd)/.exec(url);
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
        "User-Agent": `vot-cli/${version}`,
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
    getOpts(body, headers = {}) {
        return {
            method: "POST",
            headers: {
                ...this.headers,
                ...headers,
            },
            body,
            ...this.fetchOpts,
        };
    }
    async request(path, body, headers = {}) {
        const options = this.getOpts(new Blob([body]), headers);
        try {
            const res = await this.fetch(`${this.schema}://${this.host}${path}`, options);
            const data = await res.arrayBuffer();
            return {
                success: res.status === 200,
                data,
            };
        }
        catch (err) {
            console.error("[vot.js]", err.message);
            return {
                success: false,
                data: null,
            };
        }
    }
    async requestVOT(path, body, headers = {}) {
        const options = this.getOpts(JSON.stringify(body), {
            ...this.headersVOT,
            ...headers,
        });
        try {
            console.log(`${this.schemaVOT}://${this.hostVOT}${path}`);
            const res = await this.fetch(`${this.schemaVOT}://${this.hostVOT}${path}`, options);
            const data = (await res.json());
            return {
                success: res.status === 200,
                data,
            };
        }
        catch (err) {
            console.error("[vot.js]", err.message);
            return {
                success: false,
                data: null,
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
    async translateVideoYAImpl({ videoData, requestLang = this.requestLang, responseLang = this.responseLang, translationHelp = null, headers = {}, }) {
        const { url, duration = config.defaultDuration } = videoData;
        const { secretKey, uuid } = await this.getSession("video-translation");
        const body = yandexProtobuf.encodeTranslationRequest(url, duration, requestLang, responseLang, translationHelp);
        const sign = await getSignature(body);
        const res = await this.request(this.paths.videoTranslation, body, {
            "Vtrans-Signature": sign,
            "Sec-Vtrans-Sk": secretKey,
            "Sec-Vtrans-Token": `${sign}:${uuid}:${this.paths.videoTranslation}:${this.componentVersion}`,
            ...headers,
        });
        if (!res.success) {
            throw new VOTJSError("Failed to request video translation", res);
        }
        const translationData = yandexProtobuf.decodeTranslationResponse(res.data);
        switch (translationData.status) {
            case VideoTranslationStatus.FAILED:
                throw new VOTJSError("Yandex couldn't translate video", translationData);
            case VideoTranslationStatus.FINISHED:
            case VideoTranslationStatus.PART_CONTENT:
                if (!translationData.url) {
                    throw new VOTJSError("Audio link wasn't received from Yandex response", translationData);
                }
                return {
                    translated: true,
                    url: translationData.url,
                    remainingTime: translationData.remainingTime ?? -1,
                };
            case VideoTranslationStatus.WAITING:
                return {
                    translated: false,
                    remainingTime: translationData.remainingTime,
                };
            case VideoTranslationStatus.LONG_WAITING:
            case VideoTranslationStatus.LONG_WAITING_2:
                return {
                    translated: false,
                    remainingTime: translationData.remainingTime ?? -1,
                };
            default:
                console.error("[vot.js] Unknown response", translationData);
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
                    translated: true,
                    url: translationData.translatedUrl,
                    remainingTime: -1,
                };
            case "waiting":
                return {
                    translated: false,
                    remainingTime: translationData.remainingTime,
                    message: translationData.message,
                };
        }
    }
    async translateVideo({ videoData, requestLang = this.requestLang, responseLang = this.responseLang, translationHelp = null, headers = {}, }) {
        const { url, videoId, host } = videoData;
        return this.isCustomFormat(url)
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
            });
    }
    async getSubtitles({ videoData, requestLang = this.requestLang, headers = {}, }) {
        const { url } = videoData;
        if (this.isCustomFormat(url)) {
            throw new VOTJSError("Unsupported video URL for getting subtitles");
        }
        const { secretKey, uuid } = await this.getSession("video-translation");
        const body = yandexProtobuf.encodeSubtitlesRequest(url, requestLang);
        const sign = await getSignature(body);
        const pathname = "/video-subtitles/get-subtitles";
        const res = await this.request(pathname, body, {
            "Vsubs-Signature": await getSignature(body),
            "Sec-Vsubs-Sk": secretKey,
            "Sec-Vsubs-Token": `${sign}:${uuid}:${pathname}:${this.componentVersion}`,
            ...headers,
        });
        if (!res.success) {
            throw new VOTJSError("Failed to request video subtitles", res);
        }
        return yandexProtobuf.decodeSubtitlesResponse(res.data);
    }
    async pingStream({ pingId, headers = {} }) {
        const { secretKey, uuid } = await this.getSession("video-translation");
        const body = yandexProtobuf.encodeStreamPingRequest(pingId);
        const sign = await getSignature(body);
        const pathname = "/stream-translation/ping-stream";
        const res = await this.request(pathname, body, {
            "Vtrans-Signature": await getSignature(body),
            "Sec-Vtrans-Sk": secretKey,
            "Sec-Vtrans-Token": `${sign}:${uuid}:${pathname}:${this.componentVersion}`,
            ...headers,
        });
        if (!res.success) {
            throw new VOTJSError("Failed to request stream ping", res);
        }
        return true;
    }
    async translateStream({ videoData, requestLang = this.requestLang, responseLang = this.responseLang, headers = {}, }) {
        const { url } = videoData;
        if (this.isCustomFormat(url)) {
            throw new VOTJSError("Unsupported video URL for getting stream translation");
        }
        const { secretKey, uuid } = await this.getSession("video-translation");
        const body = yandexProtobuf.encodeStreamRequest(url, requestLang, responseLang);
        const sign = await getSignature(body);
        const pathname = "/stream-translation/translate-stream";
        const res = await this.request(pathname, body, {
            "Vtrans-Signature": await getSignature(body),
            "Sec-Vtrans-Sk": secretKey,
            "Sec-Vtrans-Token": `${sign}:${uuid}:${pathname}:${this.componentVersion}`,
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
                console.error("[vot.js] Unknown response", translateResponse);
                throw new VOTJSError("Unknown response from Yandex", translateResponse);
        }
    }
    async createSession(module) {
        const uuid = getUUID();
        const body = yandexProtobuf.encodeYandexSessionRequest(uuid, module);
        const res = await this.request("/session/create", body, {
            "Vtrans-Signature": await getSignature(body),
        });
        if (!res.success) {
            throw new VOTJSError("Failed to request create session", res);
        }
        const subtitlesResponse = yandexProtobuf.decodeYandexSessionResponse(res.data);
        return {
            ...subtitlesResponse,
            uuid,
        };
    }
}
export class VOTWorkerClient extends VOTClient {
    async request(path, body, headers = {}) {
        const options = this.getOpts(JSON.stringify({
            headers: {
                ...this.headers,
                ...headers,
            },
            body: Array.from(body),
        }), {
            "Content-Type": "application/json",
        });
        try {
            const res = await this.fetch(`${this.schema}://${this.host}${path}`, options);
            const data = await res.arrayBuffer();
            return {
                success: res.status === 200,
                data,
            };
        }
        catch (err) {
            console.error("[vot.js]", err.message);
            return {
                success: false,
                data: null,
            };
        }
    }
}

import config from "./config/config";
import { version } from "../package.json";
import { yandexProtobuf } from "./protobuf";
import { getSignature, getUUID } from "./secure";
import { VideoTranslationStatus } from "./types/yandex";
import { fetchWithTimeout, getTimestamp } from "./utils/utils";
import { getVideoData } from "./utils/videoData";
import { convertService } from "./utils/vot";
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
    /**
     * If you don't want to use the classic fetch
     * @includeExample examples/with_ofetch.ts:1-13
     */
    fetch;
    fetchOpts;
    getVideoDataFn;
    // sessions
    sessions = {};
    // default langs
    requestLang;
    responseLang;
    userAgent = config.userAgent;
    componentVersion = config.componentVersion;
    paths = {
        videoTranslation: "/video-translation/translate",
    };
    /**
     * Media with this format use VOT Backend API
     * Not all video files in .mpd format are currently supported!
     *
     * @source
     */
    customFormatRE = /\.(m3u8|m4(a|v)|mpd)/; //
    /**
     * Headers for interacting with Yandex API
     */
    headers = {
        "User-Agent": this.userAgent,
        Accept: "application/x-protobuf",
        "Accept-Language": "en",
        "Content-Type": "application/x-protobuf",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
        "Sec-Fetch-Mode": "no-cors",
        // node fetch doesn't support sec-ch
        // "sec-ch-ua": null,
        // "sec-ch-ua-mobile": null,
        // "sec-ch-ua-platform": null,
    };
    /**
     * Headers for interacting with VOT Backend API
     */
    headersVOT = {
        "User-Agent": `vot-cli/${version}`,
        "Content-Type": "application/json",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
    };
    constructor({ host = config.host, hostVOT = config.hostVOT, fetchFn = fetchWithTimeout, fetchOpts = {}, getVideoDataFn = getVideoData, requestLang = "en", responseLang = "ru", } = {}) {
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
    /**
     * The standard method for requesting the Yandex API, if necessary, you can override how it is done in the example
     * @includeExample examples/with_axios.ts:4-41
     */
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
    /**
     * The standard method for requesting the VOT Backend API
     */
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
    async translateVideoYAImpl({ url, duration = config.defaultDuration, requestLang = this.requestLang, responseLang = this.responseLang, translationHelp = null, headers = {}, }) {
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
                /*
                  PART_CONTENT:
                    Отдает частичный контент т.е. аудио не для всего видео, а только для части (~10min)
                    так же возвращается оставшееся время перевода (remainingTime) через которое нужно сделать повторный запрос,
                    в котором будет возвращено полное аудио перевода и статус FINISHED.
                    Если включена часть видео без перевода, то пишет "Эта часть видео еще не переведена"
                */
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
                /*
                  LONG_WAITING:
                    Иногда, в ответе приходит статус код 3, но видео всё, так же, ожидает перевода.
                    В конечном итоге, это занимает слишком много времени,
                    как-будто сервер не понимает, что данное видео уже недавно было переведено
                    и заместо возвращения готовой ссылки на перевод начинает переводить видео заново
                    при чём у него это получается за очень длительное время.
        
                  LONG_WAITING_2:
                    Тоже самое, что LONG_WAITING, но появляется при запросе переводе видео в режиме bypassCache=true.
                    remainingTime в этом случае залагивает и долгое время весит на одном и том же числе (обычно ~60-65).
                    В среднем перевод с этим статусом занимает более 10 минут. Вероятнее всего, чтобы так не происходило нужно делать 1 запрос с bypassCache=true,
                    а следующие с bypassCache=false, либо убирать firstRequest=true, но это, только, догадки
                */
                return {
                    translated: false,
                    remainingTime: translationData.remainingTime ?? -1,
                };
        }
        console.error("[vot.js] Unknown response", translationData);
        throw new VOTJSError("Unknown response from Yandex", translationData);
    }
    async translateVideoVOTImpl({ url, videoId, service, requestLang = this.requestLang, responseLang = this.responseLang, headers = {}, }) {
        const res = await this.requestVOT(this.paths.videoTranslation, {
            provider: "yandex",
            service: convertService(service),
            videoId,
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
    /**
     * @includeExample examples/basic.ts:4-11,21-37,55-65
     */
    async translateVideo({ url, duration = config.defaultDuration, requestLang = this.requestLang, responseLang = this.responseLang, translationHelp = null, headers = {}, }) {
        const { url: videoUrl, videoId, host, duration: videoDuration, } = await this.getVideoDataFn(url);
        const isCustomFormat = this.customFormatRE.exec(videoUrl);
        return isCustomFormat
            ? await this.translateVideoVOTImpl({
                url: videoUrl,
                videoId,
                service: host,
                requestLang,
                responseLang,
                headers,
            })
            : await this.translateVideoYAImpl({
                url: videoUrl,
                duration: videoDuration ?? duration,
                requestLang,
                responseLang,
                translationHelp,
                headers,
            });
    }
    /**
     * @includeExample examples/basic.ts:4-5,48-54
     */
    async getSubtitles({ url, requestLang = this.requestLang, headers = {}, }) {
        const { url: videoUrl } = await this.getVideoDataFn(url);
        if (this.customFormatRE.exec(videoUrl)) {
            throw new VOTJSError("Unsupported video URL for getting subtitles");
        }
        const { secretKey, uuid } = await this.getSession("video-translation");
        const body = yandexProtobuf.encodeSubtitlesRequest(videoUrl, requestLang);
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
    /**
     * @includeExample examples/stream.ts:7-44
     */
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
        // response doesn't have body
        return true;
    }
    /**
     * @includeExample examples/stream.ts:7-44
     */
    async translateStream({ url, requestLang = this.requestLang, responseLang = this.responseLang, headers = {}, }) {
        const { url: videoUrl } = await this.getVideoDataFn(url);
        if (this.customFormatRE.exec(videoUrl)) {
            throw new VOTJSError("Unsupported video URL for getting stream translation");
        }
        const { secretKey, uuid } = await this.getSession("video-translation");
        const body = yandexProtobuf.encodeStreamRequest(videoUrl, requestLang, responseLang);
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
            case 0:
            case 10:
                return {
                    translated: false,
                    interval,
                    message: interval === 0
                        ? "streamNoConnectionToServer"
                        : "translationTakeFewMinutes",
                };
            case 20: {
                return {
                    translated: true,
                    interval,
                    pingId: translateResponse.pingId,
                    result: translateResponse.translatedInfo,
                };
            }
        }
        console.error("[vot.js] Unknown response", translateResponse);
        throw new VOTJSError("Unknown response from Yandex", translateResponse);
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
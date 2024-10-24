import config from "./config/config";

import packageInfo from "../package.json";
import { yandexProtobuf } from "./protobuf";
import { getSignature, getUUID } from "./secure";
import type {
  VOTOpts,
  FetchFunction,
  GetVideoDataFunction,
  ClientSession,
  VOTSessions,
  URLSchema,
  ClientResponse,
} from "./types/client";
import type {
  VideoTranslationOpts,
  VideoTranslationResponse,
  RequestLang,
  ResponseLang,
  VideoSubtitlesOpts,
  StreamPingOptions,
  StreamTranslationOpts,
  StreamTranslationResponse,
  StreamTranslationObject,
  SessionModule,
  VideoTranslationFailAudioResponse,
} from "./types/yandex";
import { VideoTranslationStatus } from "./types/yandex";
import { fetchWithTimeout, getTimestamp } from "./utils/utils";
import { getVideoData } from "./utils/videoData";
import { TranslationResponse, VideoTranslationVOTOpts } from "./types/vot";
import { convertVOT } from "./utils/vot";
import { StreamInterval } from "./protos/yandex";

// https://stackoverflow.com/questions/64993118/error-should-not-import-the-named-export-version-imported-as-version
const { version } = packageInfo;

class VOTJSError extends Error {
  constructor(
    message: string,
    public data: unknown = undefined,
  ) {
    super(message);
    this.name = "VOTJSError";
    this.message = message;
  }
}

export default class VOTClient {
  host: string;
  hostVOT: string;

  schema: URLSchema;
  schemaVOT: URLSchema;

  /**
   * If you don't want to use the classic fetch
   * @includeExample examples/with_ofetch.ts:1-13
   */
  fetch: FetchFunction;
  fetchOpts: Record<string, unknown>;
  getVideoDataFn: GetVideoDataFunction;

  // sessions
  sessions: VOTSessions = {};

  // default langs
  requestLang: RequestLang;
  responseLang: ResponseLang;

  userAgent: string = config.userAgent;
  componentVersion: string = config.componentVersion;

  paths = {
    videoTranslation: "/video-translation/translate",
    videoTranslationFailAudio: "/video-translation/fail-audio-js",
    videoTranslationAudio: "/video-translation/audio",
    videoSubtitles: "/video-subtitles/get-subtitles",
    streamPing: "/stream-translation/ping-stream",
    streamTranslation: "/stream-translation/translate-stream",
    createSession: "/session/create",
  };

  /**
   * Media with this format use VOT Backend API
   * Not all video files in .mpd format are currently supported!
   */
  isCustomLink(url: string): boolean {
    return !!(
      /\.(m3u8|m4(a|v)|mpd)/.exec(url) ??
      /^https:\/\/cdn\.qstv\.on\.epicgames\.com/.exec(url)
    );
  }

  /**
   * Headers for interacting with Yandex API
   */
  headers: Record<string, string> = {
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
  headersVOT: Record<string, string> = {
    "User-Agent": `vot.js/${version}`,
    "Content-Type": "application/json",
    Pragma: "no-cache",
    "Cache-Control": "no-cache",
  };

  constructor({
    host = config.host,
    hostVOT = config.hostVOT,
    fetchFn = fetchWithTimeout,
    fetchOpts = {},
    getVideoDataFn = getVideoData,
    requestLang = "en",
    responseLang = "ru",
    headers = {},
  }: VOTOpts = {}) {
    const schemaRe = /(http(s)?):\/\//;
    const schema = schemaRe.exec(host)?.[1] as URLSchema | undefined;
    this.host = schema ? host.replace(`${schema}://`, "") : host;
    this.schema = schema ?? "https";
    const schemaVOT = schemaRe.exec(hostVOT)?.[1] as URLSchema | undefined;
    this.hostVOT = schemaVOT ? hostVOT.replace(`${schemaVOT}://`, "") : hostVOT;
    this.schemaVOT = schemaVOT ?? "https";
    this.fetch = fetchFn;
    this.fetchOpts = fetchOpts;
    this.getVideoDataFn = getVideoDataFn;
    this.requestLang = requestLang;
    this.responseLang = responseLang;
    this.headers = { ...this.headers, ...headers };
  }

  getOpts(
    body: unknown,
    headers: Record<string, string> = {},
    method = "POST",
  ) {
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

  /**
   * The standard method for requesting the Yandex API, if necessary, you can override how it is done in the example
   * @includeExample examples/with_axios.ts:4-41
   */
  async request<T = ArrayBuffer>(
    path: string,
    body: Uint8Array,
    headers: Record<string, string> = {},
    method = "POST",
  ): Promise<ClientResponse<T>> {
    const options = this.getOpts(new Blob([body]), headers, method);

    try {
      const res = await this.fetch(
        `${this.schema}://${this.host}${path}`,
        options,
      );
      const data = (await res.arrayBuffer()) as T;
      return {
        success: res.status === 200,
        data,
      };
    } catch (err) {
      return {
        success: false,
        data: (err as Error)?.message,
      };
    }
  }

  async requestJSON<T = unknown>(
    path: string,
    body: unknown = null,
    headers: Record<string, string> = {},
    method = "POST",
  ): Promise<ClientResponse<T>> {
    const options = this.getOpts(
      body,
      {
        "Content-Type": "application/json",
        ...headers,
      },
      method,
    );

    try {
      const res = await this.fetch(
        `${this.schema}://${this.host}${path}`,
        options,
      );
      const data = (await res.json()) as T;

      return {
        success: res.status === 200,
        data,
      };
    } catch (err) {
      return {
        success: false,
        data: (err as Error)?.message,
      };
    }
  }

  /**
   * The standard method for requesting the VOT Backend API
   */
  async requestVOT<T = unknown>(
    path: string,
    body: NonNullable<any>,
    headers: Record<string, string> = {},
  ): Promise<ClientResponse<T>> {
    const options = this.getOpts(JSON.stringify(body), {
      ...this.headersVOT,
      ...headers,
    });

    try {
      const res = await this.fetch(
        `${this.schemaVOT}://${this.hostVOT}${path}`,
        options,
      );
      const data = (await res.json()) as T;
      return {
        success: res.status === 200,
        data,
      };
    } catch (err) {
      return {
        success: false,
        data: (err as Error)?.message,
      };
    }
  }

  async getSession(module: SessionModule): Promise<ClientSession> {
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

  protected async translateVideoYAImpl({
    videoData,
    requestLang = this.requestLang,
    responseLang = this.responseLang,
    translationHelp = null,
    headers = {},
    shouldSendFailedAudio = true,
  }: VideoTranslationOpts): Promise<VideoTranslationResponse> {
    const { url, duration = config.defaultDuration } = videoData;

    const { secretKey, uuid } = await this.getSession("video-translation");
    const body = yandexProtobuf.encodeTranslationRequest(
      url,
      duration,
      requestLang,
      responseLang,
      translationHelp,
    );

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

    switch (translationData.status as VideoTranslationStatus) {
      case VideoTranslationStatus.FAILED:
        throw new VOTJSError(
          "Yandex couldn't translate video",
          translationData,
        );
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
          throw new VOTJSError(
            "Audio link wasn't received from Yandex response",
            translationData,
          );
        }

        return {
          translated: true,
          url: translationData.url,
          remainingTime: translationData.remainingTime ?? -1,
        };
      case VideoTranslationStatus.WAITING:
        return {
          translated: false,
          remainingTime: translationData.remainingTime!,
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
            UPD: Заметил, что Яндекс в этом случае загружает видео/аудио с ютуба в webm, а после отправляет в protobuf через PUT /translate-video/audio
            UPD 2: Или отправляет PUT /video-translation/fail-audio-js + PUT /translate-video/audio без самого аудио файла
        */

        if (url.startsWith("https://youtu.be/") && shouldSendFailedAudio) {
          // try to fix with fake requests (only for youtube)
          await this.requestVtransFailAudio(url);
          await this.requestVtransAudio(url, translationData.translationId);
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
          translated: false,
          remainingTime: translationData.remainingTime ?? -1,
        };
      default:
        console.error("[vot.js] Unknown response", translationData);
        throw new VOTJSError("Unknown response from Yandex", translationData);
    }
  }

  protected async translateVideoVOTImpl({
    url,
    videoId,
    service,
    requestLang = this.requestLang,
    responseLang = this.responseLang,
    headers = {},
  }: VideoTranslationVOTOpts): Promise<VideoTranslationResponse> {
    const votData = convertVOT(service, videoId, url);
    const res = await this.requestVOT<TranslationResponse>(
      this.paths.videoTranslation,
      {
        provider: "yandex",
        service: votData.service,
        videoId: votData.videoId,
        fromLang: requestLang,
        toLang: responseLang,
        rawVideo: url,
      },
      headers,
    );

    if (!res.success) {
      throw new VOTJSError("Failed to request video translation", res);
    }

    const translationData = res.data;
    switch (translationData.status) {
      case "failed":
        throw new VOTJSError(
          "Yandex couldn't translate video",
          translationData,
        );
      case "success":
        if (!translationData.translatedUrl) {
          throw new VOTJSError(
            "Audio link wasn't received from VOT response",
            translationData,
          );
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

  protected async requestVtransFailAudio(url: string) {
    const res = await this.requestJSON<VideoTranslationFailAudioResponse>(
      this.paths.videoTranslationFailAudio,
      JSON.stringify({
        video_url: url,
      }),
      undefined,
      "PUT",
    );
    if (!res.data || typeof res.data === "string" || res.data.status !== 1) {
      throw new VOTJSError(
        "Failed to request to fake video translation fail audio js",
        res,
      );
    }

    return res;
  }

  // TODO: add try download and set webm file blob (?)
  // * download webm help sources:
  // 1. https://github.com/kkdai/youtube/blob/23aa415a67479586129084478367c7478ec45878/client.go#L183C1-L183C29 (yabrowser used this android logic)
  // 2. yabrowser raw js
  async requestVtransAudio(
    url: string,
    translationId: string,
    headers: Record<string, string> = {},
  ) {
    const { secretKey, uuid } = await this.getSession("video-translation");
    const body = yandexProtobuf.encodeTranslationAudioRequest(
      url,
      translationId,
    );

    const sign = await getSignature(body);
    const res = await this.request(
      this.paths.videoTranslationAudio,
      body,
      {
        "Vtrans-Signature": sign,
        "Sec-Vtrans-Sk": secretKey,
        "Sec-Vtrans-Token": `${sign}:${uuid}:${this.paths.videoTranslationAudio}:${this.componentVersion}`,
        ...headers,
      },
      "PUT",
    );

    if (!res.success) {
      throw new VOTJSError("Failed to request video translation audio", res);
    }

    return yandexProtobuf.decodeTranslationAudioResponse(res.data);
  }

  /**
   * @includeExample examples/basic.ts:4-11,21-37,55-65
   */
  async translateVideo({
    videoData,
    requestLang = this.requestLang,
    responseLang = this.responseLang,
    translationHelp = null,
    headers = {},
  }: VideoTranslationOpts): Promise<VideoTranslationResponse> {
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
        });
  }

  /**
   * @includeExample examples/basic.ts:4-5,48-56
   */
  async getSubtitles({
    videoData,
    requestLang = this.requestLang,
    headers = {},
  }: VideoSubtitlesOpts) {
    const { url } = videoData;
    if (this.isCustomLink(url)) {
      throw new VOTJSError("Unsupported video URL for getting subtitles");
    }

    const { secretKey, uuid } = await this.getSession("video-translation");
    const body = yandexProtobuf.encodeSubtitlesRequest(url, requestLang);

    const sign = await getSignature(body);

    const res = await this.request(this.paths.videoSubtitles, body, {
      "Vsubs-Signature": await getSignature(body),
      "Sec-Vsubs-Sk": secretKey,
      "Sec-Vsubs-Token": `${sign}:${uuid}:${this.paths.videoSubtitles}:${this.componentVersion}`,
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
  async pingStream({ pingId, headers = {} }: StreamPingOptions) {
    const { secretKey, uuid } = await this.getSession("video-translation");
    const body = yandexProtobuf.encodeStreamPingRequest(pingId);

    const sign = await getSignature(body);
    const res = await this.request(this.paths.streamPing, body, {
      "Vtrans-Signature": await getSignature(body),
      "Sec-Vtrans-Sk": secretKey,
      "Sec-Vtrans-Token": `${sign}:${uuid}:${this.paths.streamPing}:${this.componentVersion}`,
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
  async translateStream({
    videoData,
    requestLang = this.requestLang,
    responseLang = this.responseLang,
    headers = {},
  }: StreamTranslationOpts): Promise<StreamTranslationResponse> {
    const { url } = videoData;
    if (this.isCustomLink(url)) {
      throw new VOTJSError(
        "Unsupported video URL for getting stream translation",
      );
    }

    const { secretKey, uuid } = await this.getSession("video-translation");

    const body = yandexProtobuf.encodeStreamRequest(
      url,
      requestLang,
      responseLang,
    );

    const sign = await getSignature(body);
    const res = await this.request(this.paths.streamTranslation, body, {
      "Vtrans-Signature": await getSignature(body),
      "Sec-Vtrans-Sk": secretKey,
      "Sec-Vtrans-Token": `${sign}:${uuid}:${this.paths.streamTranslation}:${this.componentVersion}`,
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
          message:
            interval === StreamInterval.NO_CONNECTION
              ? "streamNoConnectionToServer"
              : "translationTakeFewMinutes",
        };
      case StreamInterval.STREAMING: {
        return {
          translated: true,
          interval,
          pingId: translateResponse.pingId!,
          result: translateResponse.translatedInfo as StreamTranslationObject,
        };
      }
      default:
        console.error("[vot.js] Unknown response", translateResponse);
        throw new VOTJSError("Unknown response from Yandex", translateResponse);
    }
  }

  async createSession(module: SessionModule) {
    const uuid = getUUID();
    const body = yandexProtobuf.encodeYandexSessionRequest(uuid, module);
    const res = await this.request(this.paths.createSession, body, {
      "Vtrans-Signature": await getSignature(body),
    });

    if (!res.success) {
      throw new VOTJSError("Failed to request create session", res);
    }

    const sessionResponse = yandexProtobuf.decodeYandexSessionResponse(
      res.data,
    );

    return {
      ...sessionResponse,
      uuid,
    };
  }
}

export class VOTWorkerClient extends VOTClient {
  async request<T = ArrayBuffer>(
    path: string,
    body: Uint8Array,
    headers: Record<string, string> = {},
  ): Promise<ClientResponse<T>> {
    const options = this.getOpts(
      JSON.stringify({
        headers: {
          ...this.headers,
          ...headers,
        },
        body: Array.from(body),
      }),
      {
        "Content-Type": "application/json",
      },
    );

    try {
      const res = await this.fetch(
        `${this.schema}://${this.host}${path}`,
        options,
      );
      const data = (await res.arrayBuffer()) as T;
      return {
        success: res.status === 200,
        data,
      };
    } catch (err) {
      return {
        success: false,
        data: (err as Error)?.message,
      };
    }
  }
}

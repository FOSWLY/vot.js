import config from "@vot.js/shared/config";
import Logger from "@vot.js/shared/utils/logger";

import { StreamInterval } from "@vot.js/shared/protos";
import { getSecYaHeaders, getSignature, getUUID } from "@vot.js/shared/secure";
import { fetchWithTimeout, getTimestamp } from "@vot.js/shared/utils/utils";

import type { ClientSession, SessionModule } from "@vot.js/shared/types/secure";
import type { RequestLang, ResponseLang } from "@vot.js/shared/types/data";

import { YandexVOTProtobuf, YandexSessionProtobuf } from "./protobuf";
import type {
  VOTOpts,
  FetchFunction,
  VOTSessions,
  URLSchema,
  ClientResponse,
} from "./types/client";
import type {
  VideoTranslationOpts,
  VideoTranslationResponse,
  VideoSubtitlesOpts,
  StreamPingOptions,
  StreamTranslationOpts,
  StreamTranslationResponse,
  StreamTranslationObject,
  VideoTranslationFailAudioResponse,
  AudioBufferObject,
  PartialAudioObject,
} from "./types/yandex";
import { AudioDownloadType, VideoTranslationStatus } from "./types/yandex";
import type { TranslationResponse, VideoTranslationVOTOpts } from "./types/vot";
import { convertVOT } from "./utils/vot";

export class VOTJSError extends Error {
  constructor(
    message: string,
    public data: unknown = undefined,
  ) {
    super(message);
    this.name = "VOTJSError";
    this.message = message;
  }
}

export class MinimalClient {
  host: string;
  schema: URLSchema;

  /**
   * If you don't want to use the classic fetch
   * @includeExample examples/with_ofetch.ts:1-13
   */
  fetch: FetchFunction;
  fetchOpts: Record<string, unknown>;

  // sessions
  sessions: VOTSessions = {};
  userAgent: string = config.userAgent;

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
  };

  hostSchemaRe = /(http(s)?):\/\//;

  constructor({
    host = config.host,
    fetchFn = fetchWithTimeout,
    fetchOpts = {},
    headers = {},
  }: VOTOpts = {}) {
    const schema = this.hostSchemaRe.exec(host)?.[1] as URLSchema | undefined;
    this.host = schema ? host.replace(`${schema}://`, "") : host;
    this.schema = schema ?? "https";
    this.fetch = fetchFn;
    this.fetchOpts = fetchOpts;
    this.headers = { ...this.headers, ...headers };
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

  async createSession(module: SessionModule) {
    const uuid = getUUID();
    const body = YandexSessionProtobuf.encodeSessionRequest(uuid, module);
    const res = await this.request("/session/create", body, {
      "Vtrans-Signature": await getSignature(body),
    });

    if (!res.success) {
      throw new VOTJSError("Failed to request create session", res);
    }

    const sessionResponse = YandexSessionProtobuf.decodeSessionResponse(
      res.data,
    );

    return {
      ...sessionResponse,
      uuid,
    };
  }
}

export default class VOTClient extends MinimalClient {
  hostVOT: string;
  schemaVOT: URLSchema;

  // default langs
  requestLang: RequestLang;
  responseLang: ResponseLang;

  paths = {
    videoTranslation: "/video-translation/translate",
    videoTranslationFailAudio: "/video-translation/fail-audio-js",
    videoTranslationAudio: "/video-translation/audio",
    videoSubtitles: "/video-subtitles/get-subtitles",
    streamPing: "/stream-translation/ping-stream",
    streamTranslation: "/stream-translation/translate-stream",
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
   * Headers for interacting with VOT Backend API
   */
  headersVOT: Record<string, string> = {
    "User-Agent": `vot.js/${config.version}`,
    "Content-Type": "application/json",
    Pragma: "no-cache",
    "Cache-Control": "no-cache",
  };

  constructor({
    host,
    hostVOT = config.hostVOT,
    fetchFn,
    fetchOpts,
    requestLang = "en",
    responseLang = "ru",
    headers,
  }: VOTOpts = {}) {
    super({
      host,
      fetchFn,
      fetchOpts,
      headers,
    });

    const schemaVOT = this.hostSchemaRe.exec(hostVOT)?.[1] as
      | URLSchema
      | undefined;
    this.hostVOT = schemaVOT ? hostVOT.replace(`${schemaVOT}://`, "") : hostVOT;
    this.schemaVOT = schemaVOT ?? "https";
    this.requestLang = requestLang;
    this.responseLang = responseLang;
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

  protected async translateVideoYAImpl({
    videoData,
    requestLang = this.requestLang,
    responseLang = this.responseLang,
    translationHelp = null,
    headers = {},
    extraOpts = {},
    shouldSendFailedAudio = true,
  }: VideoTranslationOpts): Promise<VideoTranslationResponse> {
    const { url, duration = config.defaultDuration } = videoData;

    const session = await this.getSession("video-translation");
    const body = YandexVOTProtobuf.encodeTranslationRequest(
      url,
      duration,
      requestLang,
      responseLang,
      translationHelp,
      extraOpts,
    );

    const path = this.paths.videoTranslation;
    const vtransHeaders = await getSecYaHeaders("Vtrans", session, body, path);

    const res = await this.request(path, body, {
      ...vtransHeaders,
      ...headers,
    });

    if (!res.success) {
      throw new VOTJSError("Failed to request video translation", res);
    }

    const translationData = YandexVOTProtobuf.decodeTranslationResponse(
      res.data,
    );
    Logger.log("translateVideo", translationData);
    const {
      status,
      translationId,
    }: { status: VideoTranslationStatus; translationId: string } =
      translationData;

    switch (status) {
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
          translationId,
          translated: true,
          url: translationData.url,
          status,
          remainingTime: translationData.remainingTime ?? -1,
        };
      case VideoTranslationStatus.WAITING:
      case VideoTranslationStatus.LONG_WAITING:
        /**
          LONG_WAITING:
            Иногда, в ответе приходит статус код 3, но видео всё, так же, ожидает перевода.
            В конечном итоге, это занимает слишком много времени,
            как-будто сервер не понимает, что данное видео уже недавно было переведено
            и заместо возвращения готовой ссылки на перевод начинает переводить видео заново
            при чём у него это получается за очень длительное время.
         */
        return {
          translationId,
          translated: false,
          status,
          remainingTime: translationData.remainingTime!,
        };
      case VideoTranslationStatus.AUDIO_REQUESTED:
        /*
          AUDIO_REQUESTED:
            Действует, только, для перевода новых видео на ютубе.
            Пока не отправлено аудио каждый новый запрос перевода будет возвращать ожидание в ~120 секунд.

            Чтобы перевод продолжился, нужно:
            А) загружать видео с ютуба в качестве 144p(?) и формате webm, а после отправлять с помощью requestVtransAudio почанково, соблюдая размер чанка (config.minChunkSize)
            Б) Отправлять requestVtransFailAudio + requestVtransAudio без самого аудио файла (ниже есть пример)
            В случае варианта Б remainingTime залагивает на 5 секундах и висит так примерно 5-10 минут.
        */

        if (url.startsWith("https://youtu.be/") && shouldSendFailedAudio) {
          // try to fix with fake requests (only for youtube)
          await this.requestVtransFailAudio(url);
          await this.requestVtransAudio(url, translationData.translationId, {
            audioFile: new Uint8Array(),
            fileId:
              AudioDownloadType.WEB_API_GET_ALL_GENERATING_URLS_DATA_FROM_IFRAME,
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
          translationId: String(translationData.id),
          translated: true,
          url: translationData.translatedUrl,
          status: 1,
          remainingTime: -1,
        };
      case "waiting":
        return {
          // add set id on waiting to VOT Backend
          translationId: "",
          translated: false,
          remainingTime: translationData.remainingTime,
          status: 2,
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
    audioBuffer: AudioBufferObject,
    partialAudio?: PartialAudioObject,
    headers: Record<string, string> = {},
  ) {
    const session = await this.getSession("video-translation");
    const body = YandexVOTProtobuf.encodeTranslationAudioRequest(
      url,
      translationId,
      audioBuffer,
      partialAudio,
    );

    const path = this.paths.videoTranslationAudio;
    const vtransHeaders = await getSecYaHeaders("Vtrans", session, body, path);

    const res = await this.request(
      path,
      body,
      {
        ...vtransHeaders,
        ...headers,
      },
      "PUT",
    );

    if (!res.success) {
      throw new VOTJSError("Failed to request video translation audio", res);
    }

    return YandexVOTProtobuf.decodeTranslationAudioResponse(res.data);
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
    extraOpts = {},
    shouldSendFailedAudio = true,
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
          extraOpts,
          shouldSendFailedAudio,
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

    const session = await this.getSession("video-translation");
    const body = YandexVOTProtobuf.encodeSubtitlesRequest(url, requestLang);

    const path = this.paths.videoSubtitles;
    const vsubsHeaders = await getSecYaHeaders("Vsubs", session, body, path);

    const res = await this.request(path, body, {
      ...vsubsHeaders,
      ...headers,
    });

    if (!res.success) {
      throw new VOTJSError("Failed to request video subtitles", res);
    }

    return YandexVOTProtobuf.decodeSubtitlesResponse(res.data);
  }

  /**
   * @includeExample examples/stream.ts:7-44
   */
  async pingStream({ pingId, headers = {} }: StreamPingOptions) {
    const session = await this.getSession("video-translation");
    const body = YandexVOTProtobuf.encodeStreamPingRequest(pingId);

    const path = this.paths.streamPing;
    const vtransHeaders = await getSecYaHeaders("Vtrans", session, body, path);

    const res = await this.request(path, body, {
      ...vtransHeaders,
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

    const session = await this.getSession("video-translation");
    const body = YandexVOTProtobuf.encodeStreamRequest(
      url,
      requestLang,
      responseLang,
    );

    const path = this.paths.streamTranslation;
    const vtransHeaders = await getSecYaHeaders("Vtrans", session, body, path);

    const res = await this.request(path, body, {
      ...vtransHeaders,
      ...headers,
    });

    if (!res.success) {
      throw new VOTJSError("Failed to request stream translation", res);
    }

    const translateResponse = YandexVOTProtobuf.decodeStreamResponse(res.data);

    const interval: StreamInterval = translateResponse.interval;
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
        Logger.error("Unknown response", translateResponse);
        throw new VOTJSError("Unknown response from Yandex", translateResponse);
    }
  }
}

export class VOTWorkerClient extends VOTClient {
  constructor(opts: VOTOpts = {}) {
    opts.host = opts.host ?? config.hostWorker;
    super(opts);
  }

  async request<T = ArrayBuffer>(
    path: string,
    body: Uint8Array,
    headers: Record<string, string> = {},
    method = "POST",
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
      method,
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

  async requestJSON<T = unknown>(
    path: string,
    body: unknown = null,
    headers: Record<string, string> = {},
    method = "POST",
  ): Promise<ClientResponse<T>> {
    const options = this.getOpts(
      JSON.stringify({
        headers: {
          ...this.headers,
          "Content-Type": "application/json",
          Accept: "application/json",
          ...headers,
        },
        body,
      }),
      {
        Accept: "application/json",
        "Content-Type": "application/json",
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
}

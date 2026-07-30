import { ClientSession, SessionModule } from "@vot.js/shared/types/secure";
import { BaseProvider } from "./base";
import { getTimestamp } from "@vot.js/shared/utils/utils";
import { VOTSessions } from "../types/client";
import { getSecYaHeaders, getSignature, getUUID } from "@vot.js/shared/secure";
import { YandexSessionProtobuf, YandexVOTProtobuf } from "../protobuf";
import { VOTJSError } from "../client";
import {
  YandexProviderOpts,
  YandexVideoTranslationOpts,
} from "../types/providers/yandex";
import {
  AudioBufferObject,
  AudioDownloadType,
  GetSubtitlesResponse,
  PartialAudioObject,
  StreamPingOptions,
  StreamTranslationOpts,
  StreamTranslationResponse,
  VideoTranslationCacheOpts,
  VideoTranslationCacheResponse,
  VideoTranslationFailAudioResponse,
  VideoTranslationResponse,
  VideoTranslationStatus,
} from "../types/yandex";
import { config } from "@vot.js/shared";
import type { VideoService } from "../types/service";
import Logger from "@vot.js/shared/utils/logger";
import {
  PartialAudioBufferObject,
  StreamInterval,
  VideoTranslationAudioResponse,
} from "@vot.js/shared/protos";
import { BaseVideoSubtitlesOpts } from "../types/providers/base";
import { isCustomLink } from "../utils/videoData";

export class YandexProvider<
  V extends string = VideoService,
> extends BaseProvider<V> {
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

  paths = {
    videoTranslation: "/video-translation/translate",
    videoTranslationFailAudio: "/video-translation/fail-audio-js",
    videoTranslationAudio: "/video-translation/audio",
    videoTranslationCache: "/video-translation/cache",
    videoSubtitles: "/video-subtitles/get-subtitles",
    streamPing: "/stream-translation/ping-stream",
    streamTranslation: "/stream-translation/translate-stream",
  };

  sessions: VOTSessions = {};
  apiToken: string | undefined;

  constructor({ apiToken, ...baseOpts }: YandexProviderOpts = {}) {
    super(baseOpts);
    this.apiToken = apiToken;
  }

  get apiTokenHeader(): Record<string, string> {
    if (!this.apiToken) {
      return {};
    }

    return {
      // idk it's bug or not, but thanks who left it <3
      Authorization: `OAuth ${this.apiToken}`,
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

  async requestVtransFailAudio(url: string) {
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

  async translateVideo({
    videoData,
    requestLang = this.requestLang,
    responseLang = this.responseLang,
    translationHelp = null,
    headers = {},
    extraOpts = {},
    shouldSendFailedAudio = true,
  }: YandexVideoTranslationOpts<V>): Promise<VideoTranslationResponse> {
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
    const apiTokenHeader = extraOpts.useLivelyVoice ? this.apiTokenHeader : {};
    const res = await this.request(path, body, {
      ...vtransHeaders,
      ...apiTokenHeader,
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
          remainingTime: translationData.remainingTime ?? -1,
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
          return await this.translateVideo({
            videoData,
            requestLang,
            responseLang,
            translationHelp,
            headers,
            extraOpts,
            shouldSendFailedAudio: false,
          });
        }

        return {
          translationId,
          translated: false,
          status,
          remainingTime: translationData.remainingTime ?? -1,
        };
      case VideoTranslationStatus.SESSION_REQUIRED:
        throw new VOTJSError(
          "Yandex auth required to translate video. See docs for more info",
          translationData,
        );
      default:
        Logger.error("Unknown response", translationData);
        throw new VOTJSError("Unknown response from Yandex", translationData);
    }
  }

  async requestVtransAudio(
    url: string,
    translationId: string,
    audioBuffer: AudioBufferObject,
    partialAudio?: never,
    headers?: Record<string, string>,
  ): Promise<VideoTranslationAudioResponse>;
  async requestVtransAudio(
    url: string,
    translationId: string,
    audioBuffer: PartialAudioBufferObject,
    partialAudio: PartialAudioObject,
    headers?: Record<string, string>,
  ): Promise<VideoTranslationAudioResponse>;
  async requestVtransAudio(
    url: string,
    translationId: string,
    audioBuffer: AudioBufferObject | PartialAudioBufferObject,
    partialAudio?: PartialAudioObject,
    headers: Record<string, string> = {},
  ): Promise<VideoTranslationAudioResponse> {
    const session = await this.getSession("video-translation");
    let body: Uint8Array;

    if (YandexVOTProtobuf.isPartialAudioBuffer(audioBuffer)) {
      if (!partialAudio) {
        throw new VOTJSError(
          "Partial audio metadata is required for partial audio buffer",
          audioBuffer,
        );
      }

      body = YandexVOTProtobuf.encodeTranslationAudioRequest(
        url,
        translationId,
        audioBuffer,
        partialAudio,
      );
    } else {
      body = YandexVOTProtobuf.encodeTranslationAudioRequest(
        url,
        translationId,
        audioBuffer,
        undefined,
      );
    }

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

  async getSubtitles({
    videoData,
    requestLang = this.requestLang,
    headers = {},
  }: BaseVideoSubtitlesOpts<V>): Promise<GetSubtitlesResponse> {
    const { url } = videoData;
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

    const subtitlesData = YandexVOTProtobuf.decodeSubtitlesResponse(res.data);
    const subtitles = subtitlesData.subtitles.map((subtitle) => {
      const { language, url, translatedLanguage, translatedUrl } = subtitle;
      return {
        language,
        url,
        translatedLanguage,
        translatedUrl,
      };
    });
    return {
      waiting: subtitlesData.waiting,
      subtitles,
    };
  }

  /**
   * @includeExample examples/stream.ts[7:44]
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
   * @includeExample examples/stream.ts[7:44]
   */
  async translateStream({
    videoData,
    requestLang = this.requestLang,
    responseLang = this.responseLang,
    headers = {},
  }: StreamTranslationOpts<V>): Promise<StreamTranslationResponse> {
    const { url } = videoData;
    if (isCustomLink(url)) {
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
        if (translateResponse.pingId === undefined) {
          throw new VOTJSError(
            "Stream ping id wasn't received from Yandex response",
            translateResponse,
          );
        }

        if (!translateResponse.translatedInfo) {
          throw new VOTJSError(
            "Stream translation info wasn't received from Yandex response",
            translateResponse,
          );
        }

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

  async translateVideoCache({
    videoData,
    requestLang = this.requestLang,
    responseLang = this.responseLang,
    headers = {},
  }: VideoTranslationCacheOpts<V>): Promise<VideoTranslationCacheResponse> {
    const { url, duration = config.defaultDuration } = videoData;

    const session = await this.getSession("video-translation");
    const body = YandexVOTProtobuf.encodeTranslationCacheRequest(
      url,
      duration,
      requestLang,
      responseLang,
    );

    const path = this.paths.videoTranslationCache;
    const vtransHeaders = await getSecYaHeaders("Vtrans", session, body, path);

    const res = await this.request(
      path,
      body,
      {
        ...vtransHeaders,
        ...headers,
      },
      "POST",
    );

    if (!res.success) {
      throw new VOTJSError("Failed to request video translation cache", res);
    }

    return YandexVOTProtobuf.decodeTranslationCacheResponse(res.data);
  }
}

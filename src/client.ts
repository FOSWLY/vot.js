import config from "./config/config";
import { yandexProtobuf } from "./protobuf";
import { getSignature, getUUID } from "./secure";
import type {
  VOTOpts,
  FetchFunction,
  GetVideoDataFunction,
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
} from "./types/yandex";
import { VideoTranslationStatus } from "./types/yandex";
import { getVideoData } from "./utils/videoData";

class VOTJSError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VOTJSError";
    this.message = message;
  }
}

export default class VOTClient {
  host!: string;
  fetch!: FetchFunction;
  fetchOpts!: Record<string, unknown>;
  getVideoDataFn!: GetVideoDataFunction;

  // default langs
  requestLang!: RequestLang;
  responseLang!: ResponseLang;

  userAgent: string = config.userAgent;
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

  constructor({
    host = config.host,
    fetchFn = fetch,
    fetchOpts = {},
    getVideoDataFn = getVideoData,
    requestLang = "en",
    responseLang = "ru",
  }: VOTOpts = {}) {
    this.host = host;
    this.fetch = fetchFn;
    this.fetchOpts = fetchOpts;
    this.getVideoDataFn = getVideoDataFn;
    this.requestLang = requestLang;
    this.responseLang = responseLang;
  }

  async request(
    path: string,
    body: Uint8Array,
    headers: Record<string, string> = {},
  ) {
    const options: any = {
      method: "POST",
      headers: {
        ...this.headers,
        ...headers,
      },
      body: new Blob([body]),
      ...this.fetchOpts,
    };

    try {
      const res = await this.fetch(`https://${this.host}${path}`, options);
      const data = await res.arrayBuffer();
      return {
        success: res.status === 200,
        data,
      };
    } catch (err: any) {
      console.error("[vot.js]", err.message);
      return {
        success: false,
        data: null,
      };
    }
  }

  async translateVideo({
    url,
    duration = config.defaultDuration,
    requestLang = this.requestLang,
    responseLang = this.responseLang,
    translationHelp = null,
    headers = {},
  }: VideoTranslationOpts): Promise<VideoTranslationResponse> {
    const { url: videoUrl, duration: videoDuration } =
      await this.getVideoDataFn(url);
    // добавить проверку на m3u8
    const body = yandexProtobuf.encodeTranslationRequest(
      videoUrl,
      videoDuration ?? duration,
      requestLang,
      responseLang,
      translationHelp,
    );

    const res = await this.request("/video-translation/translate", body, {
      "Vtrans-Signature": await getSignature(body),
      "Sec-Vtrans-Token": getUUID(false),
      ...headers,
    });

    if (!res.success) {
      throw new VOTJSError("Failed to request video translation");
    }

    const translateResponse = yandexProtobuf.decodeTranslationResponse(
      res.data as ArrayBuffer,
    );

    switch (translateResponse.status) {
      case VideoTranslationStatus.FAILED:
        throw new VOTJSError("Yandex couldn't translate video");
      case VideoTranslationStatus.FINISHED:
      case VideoTranslationStatus.PART_CONTENT:
        /*
          PartContent
          Отдает частичный контент т.е. аудио не для всего видео, а только для части (~10min)
          так же возвращается оставшееся время перевода (remainingTime) через которое нужно сделать повторный запрос,
          в котором будет возвращено полное аудио перевода и статус FINISHED.
          Если включена часть видео без перевода, то пишет "Эта часть видео еще не переведена"
        */
        if (!translateResponse.url) {
          throw new VOTJSError(
            "Audio link wasn't received from Yandex response",
          );
        }

        return {
          translated: true,
          url: translateResponse.url,
          remainingTime: translateResponse.remainingTime ?? -1,
        };
      case VideoTranslationStatus.WAITING:
        return {
          translated: false,
          remainingTime: translateResponse.remainingTime as number,
        };
      case VideoTranslationStatus.LONG_WAITING:
      case VideoTranslationStatus.LONG_WAITING_2:
        /*
          LONG_WAITING
            Иногда, в ответе приходит статус код 3, но видео всё, так же, ожидает перевода.
            В конечном итоге, это занимает слишком много времени,
            как-будто сервер не понимает, что данное видео уже недавно было переведено
            и заместо возвращения готовой ссылки на перевод начинает переводить видео заново
            при чём у него это получается за очень длительное время.

          LONG_WAITING_2
            Случайно встретил 6 статус код при котором видео так же продолжается перевод,
            но после него ничего сверхъестественного не происходит.
            Появляется при первом запросе с 17=1, но не исключено,
            что может появится и просто так
        */
        return {
          translated: false,
          remainingTime: translateResponse.remainingTime ?? -1,
        };
    }

    console.error("[vot.js] Unknown response", translateResponse);
    throw new VOTJSError("Unknown response from Yandex");
  }

  async getSubtitles({
    url,
    requestLang = this.requestLang,
    headers = {},
  }: VideoSubtitlesOpts) {
    const { url: videoUrl } = await this.getVideoDataFn(url);
    const body = yandexProtobuf.encodeSubtitlesRequest(videoUrl, requestLang);

    const res = await this.request("/video-subtitles/get-subtitles", body, {
      "Vsubs-Signature": await getSignature(body),
      "Sec-Vsubs-Token": getUUID(false),
      ...headers,
    });

    if (!res.success) {
      throw new VOTJSError("Failed to request video subtitles");
    }

    return yandexProtobuf.decodeSubtitlesResponse(res.data as ArrayBuffer);
  }

  async pingStream({ pingId, headers = {} }: StreamPingOptions) {
    const body = yandexProtobuf.encodeStreamPingRequest(pingId);

    const res = await this.request("/stream-translation/ping-stream", body, {
      "Vtrans-Signature": await getSignature(body),
      "Sec-Vtrans-Token": getUUID(false),
      ...headers,
    });

    if (!res.success) {
      throw new VOTJSError("Failed to request stream ping");
    }

    // response doesn't have body
    return true;
  }

  async translateStream({
    url,
    requestLang = this.requestLang,
    responseLang = this.responseLang,
    headers = {},
  }: StreamTranslationOpts): Promise<StreamTranslationResponse> {
    const { url: videoUrl } = await this.getVideoDataFn(url);
    const body = yandexProtobuf.encodeStreamRequest(
      videoUrl,
      requestLang,
      responseLang,
    );

    const res = await this.request(
      "/stream-translation/translate-stream",
      body,
      {
        "Vtrans-Signature": await getSignature(body),
        "Sec-Vtrans-Token": getUUID(false),
        ...headers,
      },
    );

    if (!res.success) {
      throw new VOTJSError("Failed to request stream translation");
    }

    const translateResponse = yandexProtobuf.decodeStreamResponse(
      res.data as ArrayBuffer,
    );

    const interval = translateResponse.interval;
    switch (interval) {
      case 0:
      case 10:
        return {
          translated: false,
          interval,
          message:
            interval === 0
              ? "streamNoConnectionToServer"
              : "translationTakeFewMinutes",
        };
      case 20: {
        return {
          translated: true,
          interval,
          result: translateResponse.translatedInfo as StreamTranslationObject,
        };
      }
    }

    console.error("[vot.js] Unknown response", translateResponse);
    throw new VOTJSError("Unknown response from Yandex");
  }

  // async createSession() {
  //   const payload = {
  //     uuid: getUUID(false),
  //     module: "video-translation",
  //   };
  //   const body = yandexProtobuf.encodeYandexSessionRequest(
  //     payload.uuid,
  //     payload.module,
  //   );

  //   const res = await this.request("/session/create", body, {
  //     "Vtrans-Signature": await getSignature(body),
  //   });

  //   if (!res.success) {
  //     throw new VOTJSError("Failed to request video subtitles");
  //   }

  //   const subtitlesResponse = yandexProtobuf.decodeYandexSessionResponse(
  //     res.data as ArrayBuffer,
  //   );

  //   console.log(subtitlesResponse);
  //   return subtitlesResponse;
  // }
}

export class VOTWorkerClient extends VOTClient {
  async request(
    path: string,
    body: Uint8Array,
    headers: Record<string, string> = {},
  ) {
    const options: any = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        headers: {
          ...this.headers,
          ...headers,
        },
        body: Array.from(body),
      }),
      ...this.fetchOpts,
    };

    try {
      const res = await this.fetch(`https://${this.host}${path}`, options);
      const data = await res.arrayBuffer();
      return {
        success: res.status === 200,
        data,
      };
    } catch (err: any) {
      console.error("[vot.js]", err.message);
      return {
        success: false,
        data: null,
      };
    }
  }
}

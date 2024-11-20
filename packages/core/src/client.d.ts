import type { ClientSession, SessionModule } from "@vot.js/shared/types/secure";
import type { RequestLang, ResponseLang } from "@vot.js/shared/types/data";
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
  VideoTranslationFailAudioResponse,
  AudioBufferObject,
  PartialAudioObject,
} from "./types/yandex";
import type { VideoTranslationVOTOpts } from "./types/vot";
export default class VOTClient {
  host: string;
  hostVOT: string;
  schema: URLSchema;
  schemaVOT: URLSchema;
  fetch: FetchFunction;
  fetchOpts: Record<string, unknown>;
  sessions: VOTSessions;
  requestLang: RequestLang;
  responseLang: ResponseLang;
  userAgent: string;
  paths: {
    videoTranslation: string;
    videoTranslationFailAudio: string;
    videoTranslationAudio: string;
    videoSubtitles: string;
    streamPing: string;
    streamTranslation: string;
    createSession: string;
  };
  isCustomLink(url: string): boolean;
  headers: Record<string, string>;
  headersVOT: Record<string, string>;
  constructor({
    host,
    hostVOT,
    fetchFn,
    fetchOpts,
    requestLang,
    responseLang,
    headers,
  }?: VOTOpts);
  getOpts(
    body: unknown,
    headers?: Record<string, string>,
    method?: string,
  ): {
    method: string;
    headers: {
      [x: string]: string;
    };
    body: unknown;
  };
  request<T = ArrayBuffer>(
    path: string,
    body: Uint8Array,
    headers?: Record<string, string>,
    method?: string,
  ): Promise<ClientResponse<T>>;
  requestJSON<T = unknown>(
    path: string,
    body?: unknown,
    headers?: Record<string, string>,
    method?: string,
  ): Promise<ClientResponse<T>>;
  requestVOT<T = unknown>(
    path: string,
    body: NonNullable<any>,
    headers?: Record<string, string>,
  ): Promise<ClientResponse<T>>;
  getSession(module: SessionModule): Promise<ClientSession>;
  protected translateVideoYAImpl({
    videoData,
    requestLang,
    responseLang,
    translationHelp,
    headers,
    extraOpts,
    shouldSendFailedAudio,
  }: VideoTranslationOpts): Promise<VideoTranslationResponse>;
  protected translateVideoVOTImpl({
    url,
    videoId,
    service,
    requestLang,
    responseLang,
    headers,
  }: VideoTranslationVOTOpts): Promise<VideoTranslationResponse>;
  protected requestVtransFailAudio(
    url: string,
  ): Promise<ClientResponse<VideoTranslationFailAudioResponse>>;
  requestVtransAudio(
    url: string,
    translationId: string,
    audioBuffer: AudioBufferObject,
    partialAudio?: PartialAudioObject,
    headers?: Record<string, string>,
  ): Promise<any>;
  translateVideo({
    videoData,
    requestLang,
    responseLang,
    translationHelp,
    headers,
    extraOpts,
    shouldSendFailedAudio,
  }: VideoTranslationOpts): Promise<VideoTranslationResponse>;
  getSubtitles({
    videoData,
    requestLang,
    headers,
  }: VideoSubtitlesOpts): Promise<any>;
  pingStream({ pingId, headers }: StreamPingOptions): Promise<boolean>;
  translateStream({
    videoData,
    requestLang,
    responseLang,
    headers,
  }: StreamTranslationOpts): Promise<StreamTranslationResponse>;
  createSession(module: SessionModule): Promise<any>;
}
export declare class VOTWorkerClient extends VOTClient {
  request<T = ArrayBuffer>(
    path: string,
    body: Uint8Array,
    headers?: Record<string, string>,
    method?: string,
  ): Promise<ClientResponse<T>>;
  requestJSON<T = unknown>(
    path: string,
    body?: unknown,
    headers?: Record<string, string>,
    method?: string,
  ): Promise<ClientResponse<T>>;
}
//# sourceMappingURL=client.d.ts.map

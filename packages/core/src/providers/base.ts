import { config } from "@vot.js/shared";
import { fetchWithTimeout } from "@vot.js/shared/utils/utils";

import { ClientResponse, URLSchema } from "../types/client";
import type {
  BaseProviderOpts,
  BaseStreamTranslationOpts,
  BaseVideoSubtitlesOpts,
  BaseVideoTranslationOpts,
  FetchFunction,
} from "../types/providers/base";
import { RequestLang, ResponseLang } from "@vot.js/shared/types/data";
import {
  GetSubtitlesResponse,
  StreamTranslationResponse,
  VideoTranslationResponse,
} from "../types/yandex";
import { VideoService } from "../types/service";

export abstract class BaseProvider<V extends string = VideoService> {
  host: string;
  schema: URLSchema;

  /**
   * If you don't want to use the classic fetch
   * @includeExample examples/with_ofetch.ts[1:13]
   */
  fetch: FetchFunction;
  fetchOpts: Record<string, unknown>;

  userAgent: string = config.userAgent;

  // default langs
  requestLang: RequestLang;
  responseLang: ResponseLang;

  /**
   * Headers for interacting with API
   */
  headers: Record<string, string> = {
    "User-Agent": this.userAgent,
    "Accept-Language": "en",
    Pragma: "no-cache",
    "Cache-Control": "no-cache",
  };

  hostSchemaRe = /(http(s)?):\/\//;

  constructor({
    host = config.host,
    fetchFn = fetchWithTimeout,
    fetchOpts = {},
    headers = {},
    requestLang = "en",
    responseLang = "ru",
  }: BaseProviderOpts = {}) {
    const schema = this.hostSchemaRe.exec(host)?.[1] as URLSchema | null;
    this.host = schema ? host.replace(`${schema}://`, "") : host;
    this.schema = schema ?? "https";
    this.fetch = fetchFn;
    this.fetchOpts = fetchOpts;
    this.headers = { ...this.headers, ...headers };
    this.requestLang = requestLang;
    this.responseLang = responseLang;
  }

  /**
   * The standard method for requesting the Yandex API, if necessary, you can override how it is done in the example
   * @includeExample examples/with_axios.ts[4:41]
   */
  async request<T = ArrayBuffer>(
    path: string,
    body: Uint8Array,
    headers: Record<string, string> = {},
    method = "POST",
  ): Promise<ClientResponse<T>> {
    const options = this.getOpts(new Blob([body as BlobPart]), headers, method);

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
    body: BodyInit | null | undefined = null,
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
    body: BodyInit | null | undefined,
    headers: Record<string, string> = {},
    method = "POST",
  ): RequestInit {
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

  abstract translateVideo(
    opts: BaseVideoTranslationOpts<V>,
  ): Promise<VideoTranslationResponse>;

  abstract getSubtitles(
    opts: BaseVideoSubtitlesOpts<V>,
  ): Promise<GetSubtitlesResponse>;

  abstract translateStream(
    opts: BaseStreamTranslationOpts<V>,
  ): Promise<StreamTranslationResponse>;
}

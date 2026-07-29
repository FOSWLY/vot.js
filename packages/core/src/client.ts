import type { RequestLang, ResponseLang } from "@vot.js/shared/types/data";

import type { VOTOpts } from "./types/client";
import type { VideoService } from "./types/service";
import { YandexProvider } from "./providers/yandex";
import { VOTProvider } from "./types/providers";
import type { BaseProvider } from "./providers/base";

export class VOTJSError extends Error {
  constructor(
    message: string,
    public data: unknown = undefined,
  ) {
    super(message);
    this.name = "VOTJSError";
  }
}

export default class VOTClient<
  V extends string = VideoService,
  C extends VOTProvider<V, BaseProvider<V>> = typeof YandexProvider<V>,
> {
  readonly provider: InstanceType<C>;

  constructor({
    provider,
    host,
    fetchFn,
    fetchOpts,
    requestLang = "en",
    responseLang = "ru",
    apiToken,
    headers,
  }: VOTOpts<V, C> = {}) {
    const ProviderClass = provider ?? YandexProvider<V>;
    this.provider = new ProviderClass({
      host: host,
      fetchFn,
      fetchOpts,
      headers,
      apiToken,
      requestLang,
      responseLang,
    }) as InstanceType<C>;
  }

  async translateVideo(opts: Parameters<InstanceType<C>["translateVideo"]>[0]) {
    return await this.provider.translateVideo(opts);
  }

  async translateStream(
    opts: Parameters<InstanceType<C>["translateStream"]>[0],
  ) {
    return await this.provider.translateStream(opts);
  }

  async getSubtitles(opts: Parameters<InstanceType<C>["getSubtitles"]>[0]) {
    return await this.provider.getSubtitles(opts);
  }

  get requestLang(): RequestLang {
    return this.provider.requestLang;
  }

  set requestLang(lang: RequestLang) {
    this.provider.requestLang = lang;
  }

  get responseLang(): ResponseLang {
    return this.provider.responseLang;
  }

  set responseLang(lang: ResponseLang) {
    this.provider.responseLang = lang;
  }
}

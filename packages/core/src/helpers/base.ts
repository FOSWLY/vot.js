import { fetchWithTimeout } from "@vot.js/shared/utils/utils";

import type { MinimalVideoData } from "../types/client";
import type { BaseHelperInterface, BaseHelperOpts } from "../types/helpers/base";
import type { FetchFunction } from "../types/providers/base";
import type { ServiceConf, VideoService } from "../types/service";

export class VideoHelperError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VideoHelperError";
  }
}

/**
 * Environment-agnostic helper base shared by `@vot.js/node` and `@vot.js/ext`.
 * It must not touch `window`/`document`; runtime-specific defaults live in the
 * subclasses of each package.
 */
export class BaseHelper<
  T extends string = VideoService,
  S extends ServiceConf<T> = ServiceConf<T>,
> implements BaseHelperInterface<T, S> {
  API_ORIGIN: string;
  fetch: FetchFunction;
  extraInfo: boolean;
  referer: string;
  origin: string;
  service?: S;
  language: string;

  constructor({
    fetchFn = fetchWithTimeout,
    extraInfo = true,
    referer = "",
    origin = "",
    service,
    language = "en",
  }: BaseHelperOpts<S> = {}) {
    this.fetch = fetchFn;
    this.extraInfo = extraInfo;
    this.referer = referer;
    this.origin = /^(http(s)?):\/\//.test(String(origin)) ? origin : "";
    this.API_ORIGIN = this.origin;
    this.service = service;
    this.language = language;
  }

  getVideoData(_videoId: string): Promise<MinimalVideoData<T> | undefined> {
    return Promise.resolve(undefined);
  }

  getVideoId(_url: URL): Promise<string | undefined> {
    return Promise.resolve(undefined);
  }

  returnBaseData(videoId: string) {
    if (!this.service) {
      return undefined;
    }

    return {
      url: this.service.url + videoId,
      videoId,
      host: this.service.host,
      duration: undefined,
    };
  }
}

import type {
  BaseHelperInterface,
  BaseHelperOpts,
} from "@vot.js/core/types/helpers/base";
import { fetchWithTimeout } from "@vot.js/shared/utils/utils";
import { FetchFunction } from "@vot.js/core/types/providers/base";

import type { MinimalVideoData } from "../types/client";
import type { ServiceConf, VideoService } from "../types/service";

export class VideoHelperError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VideoHelperError";
  }
}

export class BaseHelper implements BaseHelperInterface<
  VideoService,
  ServiceConf
> {
  API_ORIGIN: string;
  fetch: FetchFunction;
  extraInfo: boolean;
  referer: string;
  origin: string;
  service?: ServiceConf;
  language: string;

  constructor({
    fetchFn = fetchWithTimeout,
    extraInfo = true,
    referer = "",
    origin = "",
    service,
    language = "en",
  }: BaseHelperOpts<ServiceConf> = {}) {
    this.fetch = fetchFn;
    this.extraInfo = extraInfo;
    this.referer = referer;
    this.origin = /^(http(s)?):\/\//.test(String(origin)) ? origin : "";
    this.API_ORIGIN = this.origin;
    this.service = service;
    this.language = language;
  }

  getVideoData(_videoId: string): Promise<MinimalVideoData | undefined> {
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

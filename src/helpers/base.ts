/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FetchFunction, MinimalVideoData } from "../types/client";
import { BaseHelperOpts } from "../types/helpers/base";
import { ServiceConf } from "../types/yandex";
import { fetchWithTimeout } from "../utils/utils";

export class VideoHelperError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VideoHelper";
    this.message = message;
  }
}

export class BaseHelper {
  API_ORIGIN = "https://example.com";
  fetch: FetchFunction;
  extraInfo: boolean;
  referer: string;
  service: ServiceConf | undefined;

  constructor({
    fetchFn = fetchWithTimeout,
    extraInfo = true,
    referer = "",
    service,
  }: BaseHelperOpts = {}) {
    this.fetch = fetchFn;
    this.extraInfo = extraInfo;
    this.referer = referer;
    this.service = service;
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    return undefined;
  }

  async getVideoId(url: URL): Promise<string | undefined> {
    return undefined;
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

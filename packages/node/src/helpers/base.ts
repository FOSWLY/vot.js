/* eslint-disable @typescript-eslint/require-await */
import { FetchFunction } from "@vot.js/core/types/client";
import { BaseHelperOpts } from "@vot.js/core/types/helpers/base";
import { fetchWithTimeout } from "@vot.js/shared/utils/utils";
import { ResponseLang } from "@vot.js/shared/types/data";

import type { MinimalVideoData } from "../types/client";
import type { ServiceConf } from "../types/service";

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
  origin: string;
  service?: ServiceConf;
  language: ResponseLang;

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
    this.service = service;
    this.language = language;
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

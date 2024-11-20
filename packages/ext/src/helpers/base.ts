/* eslint-disable @typescript-eslint/require-await */
import { FetchFunction } from "@vot.js/core/types/client";
import { BaseHelperOpts } from "@vot.js/core/types/helpers/base";
import { fetchWithTimeout } from "@vot.js/shared/utils/utils";

import type { MinimalVideoData } from "../types/client";
import { ServiceConf } from "../types/service";

export class VideoHelperError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VideoHelper";
    this.message = message;
  }
}

export class BaseHelper {
  API_ORIGIN = window.location.origin;
  fetch: FetchFunction;
  extraInfo: boolean;
  referer: string;
  origin: string;
  service: ServiceConf | undefined;

  constructor({
    fetchFn = fetchWithTimeout,
    extraInfo = true,
    referer = document.referrer ?? window.location.origin + "/",
    origin = window.location.origin,
    service,
  }: BaseHelperOpts<ServiceConf> = {}) {
    this.fetch = fetchFn;
    this.extraInfo = extraInfo;
    this.referer = referer;
    this.origin = /^(http(s)?):\/\//.test(String(origin))
      ? origin
      : window.location.origin;
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

import type { FetchFunction } from "@vot.js/core/types/client";
import type { BaseHelperInterface } from "@vot.js/core/types/helpers/base";
import { fetchWithTimeout } from "@vot.js/shared/utils/utils";

import type { MinimalVideoData } from "../types/client";
import type { BaseHelperOpts } from "../types/helpers/base";
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
  API_ORIGIN = window.location.origin;
  fetch: FetchFunction;
  extraInfo: boolean;
  referer: string;
  origin: string;
  service?: ServiceConf;
  video?: HTMLVideoElement;
  language: string;

  constructor({
    fetchFn = fetchWithTimeout,
    extraInfo = true,
    referer = document.referrer ?? `${window.location.origin}/`,
    origin = window.location.origin,
    service,
    video,
    language = "en",
  }: BaseHelperOpts = {}) {
    this.fetch = fetchFn;
    this.extraInfo = extraInfo;
    this.referer = referer;
    this.origin = /^(http(s)?):\/\//.test(String(origin))
      ? origin
      : window.location.origin;
    this.service = service;
    this.video = video;
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

import { fetchWithTimeout } from "@vot.js/shared/utils/utils";
export class VideoHelperError extends Error {
  constructor(message) {
    super(message);
    this.name = "VideoHelper";
    this.message = message;
  }
}
export class BaseHelper {
  API_ORIGIN = "https://example.com";
  fetch;
  extraInfo;
  referer;
  origin;
  service;
  constructor({
    fetchFn = fetchWithTimeout,
    extraInfo = true,
    referer = "",
    origin = "",
    service,
  } = {}) {
    this.fetch = fetchFn;
    this.extraInfo = extraInfo;
    this.referer = referer;
    this.origin = /^(http(s)?):\/\//.test(String(origin)) ? origin : "";
    this.service = service;
  }
  async getVideoData(videoId) {
    return undefined;
  }
  async getVideoId(url) {
    return undefined;
  }
  returnBaseData(videoId) {
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

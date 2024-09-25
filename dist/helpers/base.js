import { fetchWithTimeout } from "../utils/utils.js";
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
    service;
    constructor({ fetchFn = fetchWithTimeout, extraInfo = true, referer = "", service, } = {}) {
        this.fetch = fetchFn;
        this.extraInfo = extraInfo;
        this.referer = referer;
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

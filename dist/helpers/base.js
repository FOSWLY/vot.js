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
    constructor({ fetchFn = fetchWithTimeout } = {}) {
        this.fetch = fetchFn;
    }
    async getVideoData(videoId) {
        return undefined;
    }
    async getVideoId(url) {
        return undefined;
    }
}

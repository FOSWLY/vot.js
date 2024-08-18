import { BaseHelper } from "./base.js";
export default class AppleDeveloperHelper extends BaseHelper {
    API_ORIGIN = "https://developer.apple.com";
    async getVideoData(videoId) {
        const res = await this.fetch(`${this.API_ORIGIN}/${videoId}`);
        const content = await res.text();
        const contentUrl = /https:\/\/devstreaming-cdn\.apple\.com\/videos\/([^.]+)\/(cmaf\.m3u8)/.exec(content)?.[0];
        if (!contentUrl) {
            return undefined;
        }
        return {
            url: contentUrl,
        };
    }
    async getVideoId(url) {
        return /videos\/play\/([^/]+)\/([\d]+)/.exec(url.pathname)?.[0];
    }
}

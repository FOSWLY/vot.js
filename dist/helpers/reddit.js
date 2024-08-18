import { BaseHelper } from "./base.js";
export default class RedditHelper extends BaseHelper {
    API_ORIGIN = "https://www.reddit.com";
    async getVideoData(videoId) {
        const res = await this.fetch(`${this.API_ORIGIN}/r/${videoId}`);
        const content = await res.text();
        const contentUrl = /https:\/\/v\.redd\.it\/([^/]+)\/HLSPlaylist\.m3u8\?([^"]+)/
            .exec(content)?.[0]
            ?.replaceAll("&amp;", "&");
        if (!contentUrl) {
            return undefined;
        }
        return {
            url: decodeURIComponent(contentUrl),
        };
    }
    async getVideoId(url) {
        return /\/r\/(([^/]+)\/([^/]+)\/([^/]+)\/([^/]+))/.exec(url.pathname)?.[1];
    }
}

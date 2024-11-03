import Logger from "../utils/logger.js";
import { BaseHelper, VideoHelperError } from "./base.js";
export default class RedditHelper extends BaseHelper {
    API_ORIGIN = "https://www.reddit.com";
    async getVideoData(videoId) {
        try {
            const res = await this.fetch(`${this.API_ORIGIN}/r/${videoId}`);
            const content = await res.text();
            const contentUrl = /https:\/\/v\.redd\.it\/([^/]+)\/HLSPlaylist\.m3u8\?([^"]+)/
                .exec(content)?.[0]
                ?.replaceAll("&amp;", "&");
            if (!contentUrl) {
                throw new VideoHelperError("Failed to find content url");
            }
            return {
                url: decodeURIComponent(contentUrl),
            };
        }
        catch (err) {
            Logger.error(`Failed to get reddit video data by video ID: ${videoId}`, err.message);
            return undefined;
        }
    }
    async getVideoId(url) {
        return /\/r\/(([^/]+)\/([^/]+)\/([^/]+)\/([^/]+))/.exec(url.pathname)?.[1];
    }
}

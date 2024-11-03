import { BaseHelper } from "./base.js";
import Logger from "../utils/logger.js";
export default class KickHelper extends BaseHelper {
    API_ORIGIN = "https://kick.com/api";
    async getClipInfo(clipId) {
        try {
            const res = await this.fetch(`${this.API_ORIGIN}/v2/clips/${clipId}`);
            const data = (await res.json());
            const { clip_url: url, duration, title } = data.clip;
            return {
                url,
                duration,
                title,
            };
        }
        catch (err) {
            Logger.error(`Failed to get kick clip info by clipId: ${clipId}.`, err.message);
            return undefined;
        }
    }
    async getVideoInfo(videoId) {
        try {
            const res = await this.fetch(`${this.API_ORIGIN}/v1/video/${videoId}`);
            const data = (await res.json());
            const { source: url, livestream } = data;
            const { session_title: title, duration } = livestream;
            return {
                url,
                duration: Math.round(duration / 1000),
                title,
            };
        }
        catch (err) {
            Logger.error(`Failed to get kick video info by videoId: ${videoId}.`, err.message);
            return undefined;
        }
    }
    async getVideoData(videoId) {
        return videoId.startsWith("videos")
            ? await this.getVideoInfo(videoId.replace("videos/", ""))
            : await this.getClipInfo(videoId.replace("clips/", ""));
    }
    async getVideoId(url) {
        return /([^/]+)\/((videos|clips)\/([^/]+))/.exec(url.pathname)?.[2];
    }
}

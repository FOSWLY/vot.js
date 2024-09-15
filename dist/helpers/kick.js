import sites from "../config/sites.js";
import { BaseHelper } from "./base.js";
import { VideoService } from "../types/yandex.js";
export default class KickHelper extends BaseHelper {
    API_ORIGIN = "https://kick.com/api/v2";
    async getClipInfo(clipId) {
        try {
            const res = await this.fetch(`${this.API_ORIGIN}/clips/${clipId}`);
            return (await res.json());
        }
        catch (err) {
            console.error(`Failed to get kick clip info by clipId: ${clipId}.`, err.message);
            return false;
        }
    }
    async getVideoData(videoId) {
        if (!videoId.startsWith("clip_")) {
            return {
                url: sites.find((s) => s.host === VideoService.kick).url + videoId,
            };
        }
        const clipInfo = await this.getClipInfo(videoId);
        if (!clipInfo) {
            return undefined;
        }
        const { clip_url, duration, title } = clipInfo.clip;
        return {
            url: clip_url,
            duration,
            title,
        };
    }
    async getVideoId(url) {
        return /([^/]+)\/(videos|clips)\/([^/]+)/.exec(url.pathname)?.[0];
    }
}

import Logger from "../utils/logger.js";
import { BaseHelper } from "./base.js";
export default class OdyseeHelper extends BaseHelper {
    API_ORIGIN = "https://odysee.com";
    async getVideoData(videoId) {
        try {
            const res = await this.fetch(`${this.API_ORIGIN}/${videoId}`);
            const content = await res.text();
            const url = /"contentUrl":(\s)?"([^"]+)"/.exec(content)?.[2];
            if (!url) {
                throw new Error("Odysee url doesn't parsed");
            }
            return { url };
        }
        catch (err) {
            Logger.error(`Failed to get odysee video data by video ID: ${videoId}`, err.message);
            return undefined;
        }
    }
    async getVideoId(url) {
        return url.pathname.slice(1);
    }
}

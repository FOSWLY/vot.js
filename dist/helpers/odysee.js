import { BaseHelper } from "./base.js";
export default class OdyseeHelper extends BaseHelper {
    API_ORIGIN = "https://odysee.com";
    async getVideoData(videoId) {
        try {
            const res = await this.fetch(`${this.API_ORIGIN}/${videoId}`);
            const content = await res.text();
            return { url: /"contentUrl":(\s)?"([^"]+)"/.exec(content)?.[2] };
        }
        catch (err) {
            console.error("Failed to get odysee video data", err.message);
            return undefined;
        }
    }
    async getVideoId(url) {
        return url.pathname.slice(1);
    }
}

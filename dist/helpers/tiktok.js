import { BaseHelper } from "./base.js";
export default class TikTokHelper extends BaseHelper {
    async getVideoId(url) {
        return /([^/]+)\/video\/([^/]+)/.exec(url.pathname)?.[0];
    }
}

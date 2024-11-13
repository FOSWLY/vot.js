import { BaseHelper } from "./base.js";
export default class RutubeHelper extends BaseHelper {
    async getVideoId(url) {
        return /(?:video|embed)\/([^/]+)/.exec(url.pathname)?.[1];
    }
}

import { BaseHelper } from "./base.js";
export default class PeertubeHelper extends BaseHelper {
    async getVideoId(url) {
        return /\/w\/([^/]+)/.exec(url.pathname)?.[0];
    }
}

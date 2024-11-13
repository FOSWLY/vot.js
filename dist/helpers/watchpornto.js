import { BaseHelper } from "./base.js";
export default class WatchPornToHelper extends BaseHelper {
    async getVideoId(url) {
        return /(video|embed)\/(\d+)(\/[^/]+\/)?/.exec(url.pathname)?.[0];
    }
}

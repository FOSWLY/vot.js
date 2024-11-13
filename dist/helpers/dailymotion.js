import { BaseHelper } from "./base.js";
export default class DailymotionHelper extends BaseHelper {
    async getVideoId(url) {
        return url.hostname === "dai.ly"
            ? url.pathname.slice(1)
            : /video\/([^/]+)/.exec(url.pathname)?.[1];
    }
}

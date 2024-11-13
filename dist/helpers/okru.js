import { BaseHelper } from "./base.js";
export default class OKRuHelper extends BaseHelper {
    async getVideoId(url) {
        return /\/video\/(\d+)/.exec(url.pathname)?.[1];
    }
}

import { BaseHelper } from "./base.js";
export default class TwitterHelper extends BaseHelper {
    async getVideoId(url) {
        return /status\/([^/]+)/.exec(url.pathname)?.[1];
    }
}

import { BaseHelper } from "./base.js";
export default class NewgroundsHelper extends BaseHelper {
    async getVideoId(url) {
        return /([^/]+)\/(view)\/([^/]+)/.exec(url.pathname)?.[0];
    }
}

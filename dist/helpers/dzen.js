import { BaseHelper } from "./base.js";
export default class DzenHelper extends BaseHelper {
    async getVideoId(url) {
        return /video\/watch\/([^/]+)/.exec(url.pathname)?.[1];
    }
}

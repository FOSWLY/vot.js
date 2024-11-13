import { BaseHelper } from "./base.js";
export default class ArchiveHelper extends BaseHelper {
    async getVideoId(url) {
        return /(details|embed)\/([^/]+)/.exec(url.pathname)?.[2];
    }
}

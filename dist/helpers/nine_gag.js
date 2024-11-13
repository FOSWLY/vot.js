import { BaseHelper } from "./base.js";
export default class NineGAGHelper extends BaseHelper {
    async getVideoId(url) {
        return /gag\/([^/]+)/.exec(url.pathname)?.[1];
    }
}

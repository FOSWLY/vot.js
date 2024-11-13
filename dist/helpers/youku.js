import { BaseHelper } from "./base.js";
export default class YoukuHelper extends BaseHelper {
    async getVideoId(url) {
        return /v_show\/id_[\w=]+/.exec(url.pathname)?.[0];
    }
}

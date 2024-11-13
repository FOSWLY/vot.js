import { BaseHelper } from "./base.js";
export default class FacebookHelper extends BaseHelper {
    async getVideoId(url) {
        return url.pathname.slice(1);
    }
}

import { BaseHelper } from "./base.js";
export default class PornhubHelper extends BaseHelper {
    async getVideoId(url) {
        return (url.searchParams.get("viewkey") ??
            /embed\/([^/]+)/.exec(url.pathname)?.[1]);
    }
}

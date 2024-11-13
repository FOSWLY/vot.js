import { BaseHelper } from "./base.js";
export default class BilibiliHelper extends BaseHelper {
    async getVideoId(url) {
        const bangumiId = /bangumi\/play\/([^/]+)/.exec(url.pathname)?.[0];
        if (bangumiId) {
            return bangumiId;
        }
        const bvid = url.searchParams.get("bvid");
        if (bvid) {
            return `video/${bvid}`;
        }
        let vid = /video\/([^/]+)/.exec(url.pathname)?.[0];
        if (vid && url.searchParams.get("p") !== null) {
            vid += `/?p=${url.searchParams.get("p")}`;
        }
        return vid;
    }
}

import { BaseHelper } from "./base.js";
export default class YoutubeHelper extends BaseHelper {
    async getVideoId(url) {
        if (url.hostname === "youtu.be") {
            url.search = `?v=${url.pathname.replace("/", "")}`;
            url.pathname = "/watch";
        }
        return (/(?:watch|embed|shorts|live)\/([^/]+)/.exec(url.pathname)?.[1] ??
            url.searchParams.get("v"));
    }
}

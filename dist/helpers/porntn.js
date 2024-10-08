import { parseFromString } from "dom-parser";
import { BaseHelper, VideoHelperError } from "./base.js";
import { proxyMedia } from "../utils/utils.js";
export default class PornTNHelper extends BaseHelper {
    async getVideoData(videoId) {
        try {
            const res = await this.fetch(this.service?.url + videoId);
            const content = await res.text();
            const doc = parseFromString(content.replace("<!DOCTYPE html>", ""));
            const varDelimiter = /var flashvars\s=\s/;
            const dataScript = doc
                .getElementsByTagName("script")
                .find((node) => varDelimiter.exec(node.textContent));
            if (!dataScript) {
                throw new VideoHelperError("Failed to find data script");
            }
            const scriptText = dataScript.textContent
                .split(varDelimiter)?.[1]
                ?.split(";\n", 1)[0]
                .replace(/(\t|\n)/g, "");
            console.log(scriptText);
            const source = /video_url: 'function\/0\/([^']+)'/.exec(content)?.[1];
            const rnd = /rnd: '([^']+)'/.exec(content)?.[1];
            if (!source || !rnd) {
                throw new VideoHelperError("Failed to find video source or rnd");
            }
            const title = /video_title: '([^']+)'/.exec(content)?.[1];
            const url = new URL(source);
            url.searchParams.append("rnd", rnd);
            console.log(url.href);
            return {
                url: proxyMedia(url),
                title,
            };
        }
        catch (err) {
            console.error(`Failed to get PornTN data by videoId: ${videoId}`, err.message);
            return undefined;
        }
    }
    async getVideoId(url) {
        return /\/videos\/(([^/]+)\/([^/]+))/.exec(url.pathname)?.[1];
    }
}

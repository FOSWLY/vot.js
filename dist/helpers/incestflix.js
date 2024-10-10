import { parseFromString } from "dom-parser";
import { BaseHelper, VideoHelperError } from "./base.js";
import { proxyMedia } from "../utils/utils.js";
export default class IncestflixHelper extends BaseHelper {
    async getVideoData(videoId) {
        try {
            const res = await this.fetch(this.service?.url + videoId);
            const content = await res.text();
            const doc = parseFromString(content.replace("<!DOCTYPE html>", ""));
            const videoEl = doc.getElementById("incflix-stream");
            if (!videoEl) {
                throw new VideoHelperError(`Failed to find video element for videoID ${videoId}`);
            }
            const sourceEl = videoEl.getElementsByTagName("source")?.[0];
            if (!sourceEl) {
                throw new VideoHelperError("Failed to find source element");
            }
            const srcLink = sourceEl.getAttribute("src");
            const source = new URL(srcLink.startsWith("//") ? `https:${srcLink}` : srcLink);
            source.searchParams.append("media-proxy", "video.mp4");
            return {
                url: proxyMedia(source),
            };
        }
        catch (err) {
            console.error(`Failed to get Incestflix data by videoId: ${videoId}`, err.message);
            return undefined;
        }
    }
    async getVideoId(url) {
        return /\/watch\/([^/]+)/.exec(url.pathname)?.[1];
    }
}

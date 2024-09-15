import { parseFromString } from "dom-parser";
import { BaseHelper, VideoHelperError } from "./base.js";
import { proxyMedia } from "../utils/utils.js";
export default class LinkedinHelper extends BaseHelper {
    API_ORIGIN = "https://www.linkedin.com/learning";
    async getVideoData(videoId) {
        try {
            const res = await this.fetch(`${this.API_ORIGIN}/${videoId}`);
            const content = await res.text();
            const doc = parseFromString(content.replace("<!DOCTYPE html>", ""));
            const videoEl = doc.getElementsByClassName("video-js")?.[0];
            if (!videoEl) {
                throw new VideoHelperError(`Failed to find video element for videoID ${videoId}`);
            }
            const dataSource = (videoEl.getAttribute("data-sources") ?? "[]")
                .replaceAll("&quot;", '"')
                .replaceAll("&amp;", "&");
            const sources = JSON.parse(dataSource);
            const videoUrl = sources.find((source) => source.src.includes(".mp4"));
            if (!videoUrl) {
                throw new Error(`Failed to find video url for videoID ${videoId}`);
            }
            const url = new URL(videoUrl.src);
            const captionUrl = videoEl.getAttribute("data-captions-url");
            const subtitles = captionUrl
                ? [
                    {
                        language: "en",
                        format: "vtt",
                        url: captionUrl,
                    },
                ]
                : undefined;
            return {
                url: proxyMedia(url),
                subtitles,
            };
        }
        catch (err) {
            console.error("Failed to get linkedin video data", err.message);
            return undefined;
        }
    }
    async getVideoId(url) {
        return /\/learning\/(([^/]+)\/([^/]+))/.exec(url.pathname)?.[1];
    }
}

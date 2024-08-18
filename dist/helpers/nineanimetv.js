import { BaseHelper } from "./base.js";
export default class NineAnimeTVHelper extends BaseHelper {
    API_ORIGIN = "https://9animetv.to/ajax/episode";
    RAPID_CLOUD_ORIGIN = "https://rapid-cloud.co/ajax/embed-6-v2";
    async getSourceId(episodeId) {
        try {
            const res = await this.fetch(`${this.API_ORIGIN}/servers?episodeId=${episodeId}`);
            const content = (await res.json());
            if (!content.html) {
                return false;
            }
            return /data-id="(\d+)"/.exec(content.html)?.[1];
        }
        catch (err) {
            console.error(`Failed to get 9animetv servers info by episodeId: ${episodeId}.`, err.message);
            return false;
        }
    }
    async getPlayerLink(sourceId) {
        try {
            const res = await this.fetch(`${this.API_ORIGIN}/sources?id=${sourceId}`);
            const content = (await res.json());
            if (!content.link.includes("rapid-cloud.co")) {
                return false;
            }
            return content.link;
        }
        catch (err) {
            console.error(`Failed to get player link by sourceId: ${sourceId}.`, err.message);
            return false;
        }
    }
    async getRapidCloudData(rapidId) {
        try {
            const res = await this.fetch(`${this.RAPID_CLOUD_ORIGIN}/getSources?id=${rapidId}`);
            const content = (await res.json());
            if (content.encrypted) {
                console.warn("Encrypted RapidCloud data found. Let us know about it", content);
                return false;
            }
            return content;
        }
        catch (err) {
            console.error(`Failed to get rapid cloud data by rapidId: ${rapidId}.`, err.message);
            return false;
        }
    }
    async getVideoData(videoId) {
        const episodeId = videoId.split("?ep=")[1];
        const sourceId = await this.getSourceId(episodeId);
        if (!sourceId) {
            return undefined;
        }
        const playerLink = await this.getPlayerLink(sourceId);
        if (!playerLink) {
            return undefined;
        }
        const rapidCloudId = /\/([^/?]+)\?/.exec(playerLink)?.[1];
        if (!rapidCloudId) {
            return undefined;
        }
        const rapidData = await this.getRapidCloudData(rapidCloudId);
        if (!rapidData) {
            return undefined;
        }
        const videoUrl = rapidData.sources.find((file) => file.type === "hls")?.file;
        if (!videoUrl) {
            return undefined;
        }
        return {
            url: videoUrl,
        };
    }
    async getVideoId(url) {
        return /[^/]+$/.exec(url.href)?.[0];
    }
}

import { BaseHelper } from "./base.js";
import { normalizeLang } from "../utils/utils.js";
import Logger from "../utils/logger.js";
export default class EpicGamesHelper extends BaseHelper {
    API_ORIGIN = "https://dev.epicgames.com/community/api/learning";
    async getPostInfo(videoId) {
        try {
            const res = await this.fetch(`${this.API_ORIGIN}/post.json?hash_id=${videoId}`);
            return (await res.json());
        }
        catch (err) {
            Logger.error(`Failed to get epicgames post info by videoId: ${videoId}.`, err.message);
            return false;
        }
    }
    async getVideoData(videoId) {
        const postInfo = await this.getPostInfo(videoId);
        if (!postInfo) {
            return undefined;
        }
        const videoBlock = postInfo.blocks.find((block) => block.type === "video");
        const playlistUrl = videoBlock?.video_url?.replace("qsep://", "https://");
        if (!playlistUrl) {
            return undefined;
        }
        const { title, description } = postInfo;
        const subtitles = videoBlock?.video_captions?.map((caption) => ({
            language: normalizeLang(caption.locale),
            format: "vtt",
            url: caption.signed_url,
        }));
        return {
            url: playlistUrl,
            title,
            description,
            subtitles,
        };
    }
    async getVideoId(url) {
        return /\/(\w{3,5})\/[^/]+$/.exec(url.pathname)?.[1];
    }
}

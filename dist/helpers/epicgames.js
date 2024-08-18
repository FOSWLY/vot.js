import { BaseHelper } from "./base.js";
export default class EpicGamesHelper extends BaseHelper {
    API_ORIGIN = "https://dev.epicgames.com/community/api/learning";
    async getPostInfo(videoId) {
        try {
            const res = await this.fetch(`${this.API_ORIGIN}/post.json?hash_id=${videoId}`);
            return (await res.json());
        }
        catch (err) {
            console.error(`Failed to get epicgames post info by videoId: ${videoId}.`, err.message);
            return false;
        }
    }
    async getVideoData(videoId) {
        const postInfo = await this.getPostInfo(videoId);
        if (!postInfo) {
            return undefined;
        }
        const playlistUrl = postInfo.blocks
            .find((block) => block.type === "video")
            ?.video_url?.replace("qsep://", "https://");
        if (!playlistUrl) {
            return undefined;
        }
        return {
            url: playlistUrl,
        };
    }
    async getVideoId(url) {
        return /\/(\w{3,5})\/[^/]+$/.exec(url.pathname)?.[1];
    }
}

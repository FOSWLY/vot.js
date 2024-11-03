import { BaseHelper } from "./base.js";
import Logger from "../utils/logger.js";
export default class PatreonHelper extends BaseHelper {
    API_ORIGIN = "https://www.patreon.com/api";
    async getPosts(postId) {
        try {
            const res = await this.fetch(`${this.API_ORIGIN}/posts/${postId}?json-api-use-default-includes=false`);
            return (await res.json());
        }
        catch (err) {
            Logger.error(`Failed to get patreon posts by postId: ${postId}.`, err.message);
            return false;
        }
    }
    async getVideoData(postId) {
        const postData = await this.getPosts(postId);
        if (!postData) {
            return undefined;
        }
        const postFileUrl = postData.data.attributes.post_file.url;
        if (!postFileUrl) {
            return undefined;
        }
        return {
            url: postFileUrl,
        };
    }
    async getVideoId(url) {
        const fullPostId = /posts\/([^/]+)/.exec(url.pathname)?.[1];
        if (!fullPostId) {
            return undefined;
        }
        return fullPostId.replace(/[^\d.]/g, "");
    }
}

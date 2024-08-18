import { BaseHelper } from "./base.js";
export default class MailRuHelper extends BaseHelper {
    API_ORIGIN = "https://my.mail.ru";
    async getVideoMeta(videoId) {
        try {
            const res = await this.fetch(`${this.API_ORIGIN}/+/video/meta/${videoId}?xemail=&ajax_call=1&func_name=&mna=&mnb=&ext=1&_=${new Date().getTime()}`);
            return (await res.json());
        }
        catch (err) {
            console.error("Failed to get mail.ru video data", err.message);
            return undefined;
        }
    }
    async getVideoId(url) {
        const pathname = url.pathname;
        if (/\/(v|mail|bk|inbox)\//.exec(pathname)) {
            return pathname.slice(1);
        }
        const videoId = /video\/embed\/([^/]+)/.exec(pathname)?.[1];
        if (!videoId) {
            return undefined;
        }
        const videoData = await this.getVideoMeta(videoId);
        if (!videoData) {
            return undefined;
        }
        return videoData.meta.url.replace("//my.mail.ru/", "");
    }
}

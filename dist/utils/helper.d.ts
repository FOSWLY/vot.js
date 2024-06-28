import * as MailRu from "../types/helpers/mailru";
import * as Weverse from "../types/helpers/weverse";
import * as Kodik from "../types/helpers/kodik";
import * as Patreon from "../types/helpers/patreon";
import { VideoService } from "../types/yandex";
export declare class MailRuHelper {
    getVideoData(videoId: string): Promise<MailRu.VideoInfo | undefined>;
}
export declare class WeverseHelper {
    API_ORIGIN: string;
    API_APP_ID: string;
    API_HMAC_KEY: string;
    HEADERS: {
        Accept: string;
        Origin: string;
        Referer: string;
    };
    getURLData(): {
        appId: string;
        language: string;
        os: string;
        platform: string;
        wpf: string;
    };
    createHash(pathname: string): Promise<{
        wmsgpad: string;
        wmd: string;
    }>;
    getPostPreview(postId: string): Promise<Weverse.PostPreview | false>;
    getVideoInKey(videoId: number): Promise<false | Weverse.InKey>;
    getVideoInfo(infraVideoId: string, inkey: string, serviceId: string): Promise<false | Weverse.VideoInfo>;
    extractVideoInfo(videoList: Weverse.Video[]): Weverse.Video | undefined;
    getVideoData(postId: string): Promise<{
        url: string;
        duration: number;
    } | undefined>;
}
export declare class KodikHelper {
    API_ORIGIN: string;
    getSecureData(videoPath: Kodik.Path): Promise<Kodik.SecureData | false>;
    getFtor(secureData: Kodik.SecureData): Promise<Kodik.VideoData | false>;
    decryptUrl(encryptedUrl: string): string;
    getVideoData(videoPath: Kodik.Path): Promise<{
        url: string;
    } | undefined>;
}
export declare class PatreonHelper {
    getPosts(postId: number | string): Promise<Patreon.PostsResponse | false>;
    getVideoData(postId: string | number): Promise<{
        url: string;
    } | undefined>;
}
export declare class RedditHelper {
    getVideoData(videoId: string): Promise<{
        url: string;
    } | undefined>;
}
/**
 * A convenient wrapper over the rest of the helpers
 */
export default class VideoHelper {
    /** @source */
    static [VideoService.mailru]: MailRuHelper;
    /** @source */
    static [VideoService.weverse]: WeverseHelper;
    /** @source */
    static [VideoService.kodik]: KodikHelper;
    /** @source */
    static [VideoService.patreon]: PatreonHelper;
    /** @source */
    static [VideoService.reddit]: RedditHelper;
}
//# sourceMappingURL=helper.d.ts.map
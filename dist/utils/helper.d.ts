import * as MailRu from "../types/helpers/mailru.js";
import * as Weverse from "../types/helpers/weverse.js";
import * as Kodik from "../types/helpers/kodik.js";
import * as Patreon from "../types/helpers/patreon.js";
import * as BannedVideo from "../types/helpers/bannedvideo.js";
import * as Kick from "../types/helpers/kick.js";
import { VideoService } from "../types/yandex.js";
export declare class MailRuHelper {
    API_ORIGIN: string;
    getExtraVideoId(pathname: string): Promise<string | undefined>;
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
    getHashURLParams(pathname: string): Promise<string>;
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
export declare class BannedVideoHelper {
    getVideoInfo(videoId: string): Promise<false | BannedVideo.GraphQLResponse>;
    getVideoData(videoId: string): Promise<false | {
        url: string;
        duration: number;
        isStream: boolean;
        title: string;
        description: string;
    }>;
}
export declare class KickHelper {
    getClipInfo(clipId: string): Promise<false | Kick.Response>;
    getVideoData(videoId: string): Promise<false | {
        url: string;
        duration?: undefined;
        title?: undefined;
    } | {
        url: string;
        duration: number;
        title: string;
    }>;
}
export declare class AppleDeveloperHelper {
    getVideoData(videoId: string): Promise<{
        url: string;
    } | undefined>;
}
export default class VideoHelper {
    static [VideoService.mailru]: MailRuHelper;
    static [VideoService.weverse]: WeverseHelper;
    static [VideoService.kodik]: KodikHelper;
    static [VideoService.patreon]: PatreonHelper;
    static [VideoService.reddit]: RedditHelper;
    static [VideoService.bannedvideo]: BannedVideoHelper;
    static [VideoService.kick]: KickHelper;
    static [VideoService.appledeveloper]: AppleDeveloperHelper;
    static [VideoService.epicgames]: EpicGamesHelper;
    static [VideoService.nineanimetv]: NineAnimetvHelper;
}
//# sourceMappingURL=helper.d.ts.map
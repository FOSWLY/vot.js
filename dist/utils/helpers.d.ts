import * as MailRu from "../types/helpers/mailru";
import * as Weverse from "../types/helpers/weverse";
export declare class VideoHelper {
    static mailru: {
        getVideoData(videoId: string): Promise<MailRu.VideoInfo | undefined>;
    };
    static weverse: {
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
    };
}
//# sourceMappingURL=helpers.d.ts.map
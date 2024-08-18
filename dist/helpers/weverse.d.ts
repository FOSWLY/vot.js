import { BaseHelper } from "./base.js";
import * as Weverse from "../types/helpers/weverse.js";
export default class WeverseHelper extends BaseHelper {
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
    getVideoData(videoId: string): Promise<{
        url: string;
        duration: number;
    } | undefined>;
    getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=weverse.d.ts.map
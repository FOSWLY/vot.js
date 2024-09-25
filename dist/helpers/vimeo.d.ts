import { MinimalVideoData } from "../types/client.js";
import * as Vimeo from "../types/helpers/vimeo.js";
import { BaseHelper } from "./base.js";
export default class VimeoHelper extends BaseHelper {
    API_KEY: string;
    DEFAULT_SITE_ORIGIN: string;
    SITE_ORIGIN: string;
    isErrorData(data: Vimeo.Data): data is Vimeo.Error;
    isPrivatePlayer(): boolean | "";
    getViewerData(): Promise<false | Vimeo.ViewerData>;
    getVideoInfo(videoId: string): Promise<false | Vimeo.VideoInfo>;
    getPrivateVideoSource(files: Vimeo.PrivateFiles): Promise<string | false>;
    getPrivateVideoInfo(videoId: string): Promise<false | {
        url: string;
        video_url: string;
        title: string;
        duration: number;
        subs: Vimeo.PrivateVideoSubtitle[];
    }>;
    getSubsInfo(videoId: string): Promise<false | Vimeo.VideoSubsData>;
    getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
    getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=vimeo.d.ts.map
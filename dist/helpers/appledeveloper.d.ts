import { BaseHelper } from "./base.js";
export default class AppleDeveloperHelper extends BaseHelper {
    API_ORIGIN: string;
    getVideoData(videoId: string): Promise<{
        url: string;
    } | undefined>;
    getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=appledeveloper.d.ts.map
import { BaseHelper } from "./base.js";
export default class OdyseeHelper extends BaseHelper {
    API_ORIGIN: string;
    getVideoData(videoId: string): Promise<{
        url: string | undefined;
    } | undefined>;
    getVideoId(url: URL): Promise<string>;
}
//# sourceMappingURL=odysee.d.ts.map
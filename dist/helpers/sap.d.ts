import * as Sap from "../types/helpers/sap.js";
import { MinimalVideoData } from "../types/client.js";
import { BaseHelper } from "./base.js";
export default class SapHelper extends BaseHelper {
    API_ORIGIN: string;
    requestKaltura(kalturaDomain: string, partnerId: string | number, entryId: string): Promise<Sap.Response | undefined>;
    getKalturaData(videoId: string): Promise<Sap.Response | undefined>;
    getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
    getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=sap.d.ts.map
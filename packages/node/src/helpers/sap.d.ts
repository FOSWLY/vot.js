import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";
export default class SapHelper extends BaseHelper {
  API_ORIGIN: string;
  requestKaltura(
    kalturaDomain: string,
    partnerId: string | number,
    entryId: string,
  ): Promise<any>;
  getKalturaData(videoId: string): Promise<any>;
  getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
  getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=sap.d.ts.map

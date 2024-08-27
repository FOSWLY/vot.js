import { BaseHelper } from "./base.js";
import * as Kodik from "../types/helpers/kodik.js";
import { MinimalVideoData } from "../types/client.js";
export default class KodikHelper extends BaseHelper {
    API_ORIGIN: string;
    getSecureData(videoPath: string): Promise<Kodik.SecureData | false>;
    getFtor(secureData: Kodik.SecureData): Promise<Kodik.VideoData | false>;
    decryptUrl(encryptedUrl: string): string;
    getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
    getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=kodik.d.ts.map
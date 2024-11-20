import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";
import * as Kodik from "@vot.js/shared/types/helpers/kodik";
export default class KodikHelper extends BaseHelper {
  API_ORIGIN: string;
  getSecureData(videoPath: string): Promise<Kodik.SecureData | false>;
  getFtor(secureData: Kodik.SecureData): Promise<Kodik.VideoData | false>;
  decryptUrl(encryptedUrl: string): string;
  getVideoData(videoId: string): Promise<MinimalVideoData | undefined>;
  getVideoId(url: URL): Promise<string | undefined>;
}
//# sourceMappingURL=kodik.d.ts.map

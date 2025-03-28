import { BaseHelper } from "./base";

import * as Bunkr from "../types/helpers/bunkr";

import { VideoDataError } from "@vot.js/core/utils/videoData";
import Logger from "@vot.js/shared/utils/logger";

export default class BunkrHelper extends BaseHelper {
  base64ToBytes(base64: string): Uint8Array {
    const decoded = atob(base64);
    return new Uint8Array([...decoded].map((char) => char.charCodeAt(0)));
  }

  xorDecrypt(data: Uint8Array, key: string): string {
    const keyBytes = new TextEncoder().encode(key);
    const result = data.map((byte, i) => byte ^ keyBytes[i % keyBytes.length]);
    return new TextDecoder().decode(result);
  }

  decryptBase64XOR(encryptedBase64: string, key: string): string {
    return this.xorDecrypt(this.base64ToBytes(encryptedBase64), key);
  }

  async getVideoData(videoId: string) {
    try {
      const res = await this.fetch(this.origin + "/api/vs", {
        method: "POST",
        body: JSON.stringify({
          slug: videoId,
        }),
      });
      const data = (await res.json()) as Bunkr.APIResponse;
      if (!data.encrypted) {
        throw new VideoDataError("Unknown Bunkr API Response");
      }

      const secret = `SECRET_KEY_` + Math.floor(data.timestamp / 3600);
      // player.enc.js
      const decryptedUrl = this.decryptBase64XOR(data.url, secret);
      if (!decryptedUrl.includes(".mp4")) {
        throw new VideoDataError("Decrypted url isn't have .mp4 extension");
      }
      return {
        url: decryptedUrl,
      };
    } catch (err) {
      Logger.error(
        `Failed to get Bunkr video data, because ${(err as Error).message}`,
      );
      return undefined;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/f\/([^/]+)/.exec(url.pathname)?.[1];
  }
}

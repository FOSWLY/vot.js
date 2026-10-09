import { VideoDataError } from "@vot.js/core/utils/videoData";
import Logger from "@vot.js/shared/utils/logger";
import type * as Bunkr from "../types/helpers/bunkr";
import { BaseHelper } from "./base";

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

  /**
   * Current Bunkr flow (2026): the /f/<slug> page embeds the CDN url (`jsCDN`)
   * and the player signs its path via `signUrl` (?token=&ex=) before playback
   */
  async getSignedPageUrl(videoId: string): Promise<string | undefined> {
    const res = await this.fetch(`${this.origin}/f/${videoId}`);
    const html = await res.text();
    const unescape = (v?: string) => v?.replace(/\\\//g, "/");
    const cdnUrl = unescape(/var\s+jsCDN\s*=\s*"([^"]+)"/.exec(html)?.[1]);
    if (!cdnUrl) return undefined;

    const signUrl = unescape(/var\s+signUrl\s*=\s*"([^"]+)"/.exec(html)?.[1]);
    if (!signUrl) return cdnUrl;

    try {
      const url = new URL(cdnUrl);
      const signRes = await this.fetch(
        `${signUrl}?path=${encodeURIComponent(decodeURIComponent(url.pathname))}`,
      );
      const { token, ex } = (await signRes.json()) as Bunkr.SignResponse;
      if (token) {
        url.searchParams.set("token", token);
        url.searchParams.set("ex", String(ex));
      }
      return url.toString();
    } catch {
      return cdnUrl;
    }
  }

  async getVideoData(videoId: string) {
    try {
      const pageUrl = await this.getSignedPageUrl(videoId).catch(() => undefined);
      if (pageUrl) {
        return { url: pageUrl };
      }

      // legacy encrypted API (player.enc.js)
      const res = await this.fetch(`${this.origin}/api/vs`, {
        method: "POST",
        body: JSON.stringify({
          slug: videoId,
        }),
      });
      const data = (await res.json()) as Bunkr.APIResponse;
      if (!data.encrypted) {
        throw new VideoDataError("Unknown Bunkr API Response");
      }

      const secret = `SECRET_KEY_${Math.floor(data.timestamp / 3600)}`;
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

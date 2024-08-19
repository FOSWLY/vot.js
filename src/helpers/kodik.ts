import { parseFromString } from "dom-parser";

import { BaseHelper, VideoHelperError } from "./base";
import config from "../config/config";
import * as Kodik from "../types/helpers/kodik";

export default class KodikHelper extends BaseHelper {
  API_ORIGIN = "https://kodik.biz";

  async getSecureData(videoPath: string): Promise<Kodik.SecureData | false> {
    try {
      const res = await this.fetch(`${this.API_ORIGIN}${videoPath}`, {
        headers: {
          "User-Agent": config.userAgent,
          // only to mask request
          Origin: this.API_ORIGIN,
          Referer: this.API_ORIGIN,
        },
      });

      const content = await res.text();
      const [videoType, videoId, hash] = videoPath.split("/").filter((a) => a);

      const doc = parseFromString(content);
      const secureScript = Array.from(
        doc.getElementsByTagName("script"),
      ).filter((s) => s.innerHTML.includes(`videoId = "${videoId}"`));
      if (!secureScript.length) {
        throw new VideoHelperError("Failed to find secure script");
      }

      const secureContent = /'{[^']+}'/.exec(
        secureScript[0].textContent.trim(),
      )?.[0];
      if (!secureContent) {
        throw new VideoHelperError("Secure json wasn't found in secure script");
      }

      const secureJSON = JSON.parse(
        secureContent.replaceAll("'", ""),
      ) as Kodik.SecureContent;
      return {
        videoType: videoType as Kodik.VideoType,
        videoId,
        hash,
        ...secureJSON,
      };
    } catch (err: unknown) {
      console.error(
        `Failed to get kodik secure data by videoPath: ${videoPath}.`,
        (err as Error).message,
      );
      return false;
    }
  }

  async getFtor(
    secureData: Kodik.SecureData,
  ): Promise<Kodik.VideoData | false> {
    const {
      videoType,
      videoId: id,
      hash,
      d,
      d_sign,
      pd,
      pd_sign,
      ref,
      ref_sign,
    } = secureData;
    try {
      const res = await this.fetch(this.API_ORIGIN + "/ftor", {
        method: "POST",
        headers: {
          "User-Agent": config.userAgent,
          // only to mask request
          Origin: this.API_ORIGIN,
          Referer: `${this.API_ORIGIN}/${videoType}/${id}/${hash}/360p`,
        },
        body: new URLSearchParams({
          // only to mask request (they don't check for these fields, but validate if they exist)
          d,
          d_sign,
          pd,
          pd_sign,
          ref: decodeURIComponent(ref),
          ref_sign,
          bad_user: "false",
          cdn_is_working: "true",
          info: "{}",
          // required
          type: videoType,
          hash,
          id,
        }),
      });

      return (await res.json()) as Kodik.VideoData;
    } catch (err: unknown) {
      console.error(
        `Failed to get kodik video data (type: ${videoType}, id: ${id}, hash: ${hash})`,
        (err as Error).message,
      );
      return false;
    }
  }

  decryptUrl(encryptedUrl: string) {
    // app.player_single.js
    const decryptedUrl = atob(
      encryptedUrl.replace(/[a-zA-Z]/g, function (e) {
        const charCode = e.charCodeAt(0) + 13;
        return String.fromCharCode(
          (e <= "Z" ? 90 : 122) >= charCode ? charCode : charCode - 26,
        );
      }),
    );

    return "https:" + decryptedUrl;
  }

  async getVideoData(videoId: string) {
    const secureData = await this.getSecureData(videoId);
    if (!secureData) {
      return undefined;
    }

    const videoData = await this.getFtor(secureData);
    if (!videoData) {
      return undefined;
    }

    const videoDataLinks = Object.entries(
      videoData.links[videoData.default.toString()],
    );
    // idk what other types there may be, so i will add a this check
    const videoLink = videoDataLinks.find(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, data]) => data.type === "application/x-mpegURL",
    )?.[1];
    if (!videoLink) {
      return undefined;
    }

    return {
      url: this.decryptUrl(videoLink.src),
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/(seria|video)\/([^/]+)\/([^/]+)\/([\d]+)p/.exec(
      url.pathname,
    )?.[0];
  }
}
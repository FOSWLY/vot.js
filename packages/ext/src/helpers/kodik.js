import { BaseHelper, VideoHelperError } from "./base";
import config from "@vot.js/shared/config";
import Logger from "@vot.js/shared/utils/logger";
export default class KodikHelper extends BaseHelper {
  API_ORIGIN = window.location.origin;
  async getSecureData(videoPath) {
    try {
      const res = await this.fetch(`${this.API_ORIGIN}${videoPath}`, {
        headers: {
          "User-Agent": config.userAgent,
          Origin: this.API_ORIGIN,
          Referer: this.API_ORIGIN,
        },
      });
      const content = await res.text();
      const [videoType, videoId, hash] = videoPath.split("/").filter((a) => a);
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
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
      const secureJSON = JSON.parse(secureContent.replaceAll("'", ""));
      return {
        videoType: videoType,
        videoId,
        hash,
        ...secureJSON,
      };
    } catch (err) {
      Logger.error(
        `Failed to get kodik secure data by videoPath: ${videoPath}.`,
        err.message,
      );
      return false;
    }
  }
  async getFtor(secureData) {
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
          Origin: this.API_ORIGIN,
          Referer: `${this.API_ORIGIN}/${videoType}/${id}/${hash}/360p`,
        },
        body: new URLSearchParams({
          d,
          d_sign,
          pd,
          pd_sign,
          ref: decodeURIComponent(ref),
          ref_sign,
          bad_user: "false",
          cdn_is_working: "true",
          info: "{}",
          type: videoType,
          hash,
          id,
        }),
      });
      return await res.json();
    } catch (err) {
      Logger.error(
        `Failed to get kodik video data (type: ${videoType}, id: ${id}, hash: ${hash})`,
        err.message,
      );
      return false;
    }
  }
  decryptUrl(encryptedUrl) {
    const decryptedUrl = atob(
      encryptedUrl.replace(/[a-zA-Z]/g, function (e) {
        const charCode = e.charCodeAt(0) + 13;
        const pos = e <= "Z" ? 90 : 122;
        return String.fromCharCode(pos >= charCode ? charCode : charCode - 26);
      }),
    );
    return "https:" + decryptedUrl;
  }
  async getVideoData(videoId) {
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
    const videoLink = videoDataLinks.find(
      ([, data]) => data.type === "application/x-mpegURL",
    )?.[1];
    if (!videoLink) {
      return undefined;
    }
    return {
      url: this.decryptUrl(videoLink.src),
    };
  }
  async getVideoId(url) {
    return /\/(seria|video)\/([^/]+)\/([^/]+)\/([\d]+)p/.exec(
      url.pathname,
    )?.[0];
  }
}

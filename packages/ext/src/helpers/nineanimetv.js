import { BaseHelper } from "./base";
import { normalizeLang } from "@vot.js/shared/utils/utils";
import Logger from "@vot.js/shared/utils/logger";
export default class NineAnimeTVHelper extends BaseHelper {
  API_ORIGIN = "https://9animetv.to/ajax/episode";
  RAPID_CLOUD_ORIGIN = "https://rapid-cloud.co/ajax/embed-6-v2";
  async getSourceId(episodeId) {
    try {
      const res = await this.fetch(
        `${this.API_ORIGIN}/servers?episodeId=${episodeId}`,
      );
      const content = await res.json();
      if (!content.html) {
        return false;
      }
      return /data-id="(\d+)"/.exec(content.html)?.[1];
    } catch (err) {
      Logger.error(
        `Failed to get 9animetv servers info by episodeId: ${episodeId}.`,
        err.message,
      );
      return false;
    }
  }
  async getPlayerLink(sourceId) {
    try {
      const res = await this.fetch(`${this.API_ORIGIN}/sources?id=${sourceId}`);
      const content = await res.json();
      if (!content.link.includes("rapid-cloud.co")) {
        return false;
      }
      return content.link;
    } catch (err) {
      Logger.error(
        `Failed to get player link by sourceId: ${sourceId}.`,
        err.message,
      );
      return false;
    }
  }
  async getRapidCloudData(rapidId) {
    try {
      const res = await this.fetch(
        `${this.RAPID_CLOUD_ORIGIN}/getSources?id=${rapidId}`,
      );
      const content = await res.json();
      if (content.encrypted) {
        Logger.warn(
          "Encrypted RapidCloud data found. Let us know about it",
          content,
        );
        return false;
      }
      return content;
    } catch (err) {
      Logger.error(
        `Failed to get rapid cloud data by rapidId: ${rapidId}.`,
        err.message,
      );
      return false;
    }
  }
  async getVideoData(videoId) {
    const episodeId = videoId.split("?ep=")[1];
    const sourceId = await this.getSourceId(episodeId);
    if (!sourceId) {
      return undefined;
    }
    const playerLink = await this.getPlayerLink(sourceId);
    if (!playerLink) {
      return undefined;
    }
    const rapidCloudId = /\/([^/?]+)\?/.exec(playerLink)?.[1];
    if (!rapidCloudId) {
      return undefined;
    }
    const rapidData = await this.getRapidCloudData(rapidCloudId);
    if (!rapidData) {
      return undefined;
    }
    const videoUrl = rapidData.sources.find(
      (file) => file.type === "hls",
    )?.file;
    if (!videoUrl) {
      return undefined;
    }
    const subtitles = rapidData.tracks.reduce((result, track) => {
      const fileName = /([\w+]+)(-\d)?\.vtt/.exec(track.file)?.[1];
      if (!fileName) {
        return result;
      }
      const lang = fileName.length === 3 ? fileName : track.label;
      const language = normalizeLang(lang);
      if (result.find((t) => t.language === language)) {
        return result;
      }
      result.push({
        language,
        format: "vtt",
        url: track.file,
      });
      return result;
    }, []);
    return {
      url: videoUrl,
      subtitles,
    };
  }
  async getVideoId(url) {
    return new Promise((resolve) => {
      const origin = "https://9animetv.to";
      window.addEventListener("message", (e) => {
        if (e.origin !== origin) {
          return undefined;
        }
        if (e.data?.startsWith("getVideoId:")) {
          const videoId = e.data.replace("getVideoId:", "");
          return resolve(videoId);
        }
        return undefined;
      });
      window.top.postMessage("getVideoId", origin);
    });
  }
}

import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";

import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import * as EpicGames from "@vot.js/shared/types/helpers/epicgames";
import { normalizeLang } from "@vot.js/shared/utils/utils";
import Logger from "@vot.js/shared/utils/logger";

export default class EpicGamesHelper extends BaseHelper {
  API_ORIGIN = "https://dev.epicgames.com/community/api/learning";

  async getPostInfo(videoId: string) {
    try {
      const res = await this.fetch(
        `${this.API_ORIGIN}/post.json?hash_id=${videoId}`,
      );

      return (await res.json()) as EpicGames.Post;
    } catch (err) {
      Logger.error(
        `Failed to get epicgames post info by videoId: ${videoId}.`,
        (err as Error).message,
      );
      return false;
    }
  }

  getVideoBlock() {
    const videoUrlRe = /videoUrl\s?=\s"([^"]+)"?/;
    const script = Array.from(document.body.querySelectorAll("script")).find(
      (s) => videoUrlRe.exec(s.innerHTML),
    );
    if (!script) {
      return undefined;
    }

    const content = script.innerHTML.trim();
    const playlistUrl = videoUrlRe
      .exec(content)?.[1]
      ?.replace("qsep://", "https://");
    if (!playlistUrl) {
      return undefined;
    }

    let subtitlesString = /sources\s?=\s(\[([^\]]+)\])?/.exec(content)?.[1];
    if (!subtitlesString) {
      return {
        playlistUrl,
        subtitles: [],
      };
    }

    try {
      subtitlesString = (
        subtitlesString
          .replace(/src:(\s)+?(videoUrl)/g, 'src:"removed"')
          .substring(0, subtitlesString.lastIndexOf("},")) + "]"
      )
        .split("\n")
        .map((line) => line.replace(/([^\s]+):\s?(?!.*\1)/, '"$1":'))
        .join("\n");
      const subtitlesObj = JSON.parse(
        subtitlesString,
      ) as EpicGames.VideoSources[];
      const subtitles = subtitlesObj.filter((sub) => sub.type === "captions");

      return {
        playlistUrl,
        subtitles,
      };
    } catch {
      return {
        playlistUrl,
        subtitles: [],
      };
    }
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const courseId = videoId.split(":")?.[1];
    const postInfo = await this.getPostInfo(courseId);
    if (!postInfo) {
      return undefined;
    }

    const videoBlock = this.getVideoBlock();
    if (!videoBlock) {
      return undefined;
    }

    const { playlistUrl, subtitles: videoSubtitles } = videoBlock;
    const { title, description } = postInfo;
    const subtitles: VideoDataSubtitle[] = videoSubtitles.map((caption) => ({
      language: normalizeLang(caption.srclang),
      source: "epicgames",
      format: "vtt",
      url: caption.src,
    }));

    // url returns a json containing a dash playlist (in base64) in the playlist field
    return {
      url: playlistUrl,
      title,
      description,
      subtitles,
    };
  }

  async getVideoId(url: URL): Promise<string | undefined> {
    return new Promise((resolve) => {
      const origin = "https://dev.epicgames.com";
      const reqId = btoa(window.location.href);
      window.addEventListener("message", (e) => {
        if (e.origin !== origin) {
          return undefined;
        }

        if (!(typeof e.data === "string" && e.data.startsWith("getVideoId:"))) {
          return undefined;
        }

        // e.data is getVideoId:base64IframeLink:videoId for support multi frames on page
        const videoId = e.data.replace("getVideoId:", "");
        return resolve(videoId);
      });
      window.top!.postMessage(`getVideoId:${reqId}`, origin);
    });
  }
}

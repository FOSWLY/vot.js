import type { VideoDataSubtitle } from "@vot.js/core/types/client";
import type * as EpicGames from "@vot.js/shared/types/helpers/epicgames";
import Logger from "@vot.js/shared/utils/logger";
import { normalizeLang } from "@vot.js/shared/utils/utils";
import type { MinimalVideoData } from "../types/client";
import { BaseHelper } from "./base";

const VIDEO_URL_RE = /videoUrl\s*=\s*["'`]([^"'`]+)["'`]/;
const POST_HASH_RE = /\/learning\/(?:[^/]+\/)*?(\w{3,8})\/[^/?#]+\/?(?:[?#]|$)/;

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

  async fetchPlaylistUrl(embedId: string) {
    try {
      const res = await this.fetch(
        `https://dev.epicgames.com/community/api/cms/videos/${embedId}/embed.html`,
      );
      const content = await res.text();
      return VIDEO_URL_RE.exec(content)?.[1]?.replace("qsep://", "https://");
    } catch (err) {
      Logger.error(
        `Failed to get playlist url by embed Id ${embedId}, because: ${(err as Error).message}`,
      );
      return undefined;
    }
  }

  getVideoBlock(): EpicGames.EmbedVideoBlock | undefined {
    const videoUrlRe = VIDEO_URL_RE;
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
      subtitlesString = `${subtitlesString
        .replace(/src:(\s)+?(videoUrl)/g, 'src:"removed"')
        .substring(0, subtitlesString.lastIndexOf("},"))}]`
        .split("\n")
        .map((line) => line.replace(/([^\s]+):\s?(?!.*\1)/, '"$1":'))
        .join("\n");
      const subtitlesObj = JSON.parse(
        subtitlesString,
      ) as EpicGames.VideoSources[];
      const subtitles = subtitlesObj.filter(
        (sub): sub is EpicGames.VideoCaption => sub.type === "captions",
      );

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
    // videoId can be `postHash` or `base64IframeLink:postHash`
    const postHash = videoId.split(":").pop();
    if (!postHash) {
      return undefined;
    }

    const postInfo = await this.getPostInfo(postHash);
    if (!postInfo) {
      return undefined;
    }

    let videoBlock = this.getVideoBlock();
    if (!videoBlock) {
      // helper is running outside of the embed iframe (or embed markup changed)
      const postVideo = postInfo.blocks?.find(
        (block): block is EpicGames.VideoBlock => block.type === "video",
      );
      const playlistUrl = postVideo
        ? await this.fetchPlaylistUrl(postVideo.video_id)
        : undefined;
      if (!playlistUrl) {
        return undefined;
      }

      videoBlock = { playlistUrl, subtitles: [] };
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

  getPostHashFromUrl(url: string | undefined) {
    if (!url) {
      return undefined;
    }

    try {
      const { hostname, pathname } = new URL(url);
      if (hostname !== "dev.epicgames.com") {
        return undefined;
      }

      return POST_HASH_RE.exec(pathname)?.[1];
    } catch {
      return undefined;
    }
  }

  getVideoIdByMessage(timeout = 3000): Promise<string | undefined> {
    return new Promise((resolve) => {
      const origin = "https://dev.epicgames.com";
      const reqId = btoa(window.location.href);
      const onMessage = (e: MessageEvent) => {
        if (e.origin !== origin) {
          return;
        }

        if (
          !(
            typeof e.data === "string" &&
            e.data.startsWith(`getVideoId:${reqId}:`)
          )
        ) {
          return;
        }

        // e.data is getVideoId:base64IframeLink:videoId for support multi frames on page
        window.removeEventListener("message", onMessage);
        clearTimeout(timer);
        resolve(e.data.replace("getVideoId:", ""));
      };
      const timer = setTimeout(() => {
        window.removeEventListener("message", onMessage);
        resolve(undefined);
      }, timeout);
      window.addEventListener("message", onMessage);
      window.top?.postMessage(`getVideoId:${reqId}`, origin);
    });
  }

  async getVideoId(url: URL): Promise<string | undefined> {
    // top-level page (or direct link)
    const fromUrl = this.getPostHashFromUrl(url.href);
    if (fromUrl) {
      return fromUrl;
    }

    // embed iframe is same-origin with the post page, so we can read it directly
    let topHref: string | undefined;
    try {
      topHref = window.top?.location.href;
    } catch {
      topHref = undefined;
    }

    return (
      this.getPostHashFromUrl(topHref) ??
      this.getPostHashFromUrl(document.referrer) ??
      (await this.getVideoIdByMessage())
    );
  }
}

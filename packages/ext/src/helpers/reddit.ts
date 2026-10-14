import Logger from "@vot.js/shared/utils/logger";
import type { MinimalVideoData } from "../types/client";
import { BaseHelper, VideoHelperError } from "./base";

export default class RedditHelper extends BaseHelper {
  API_ORIGIN = "https://www.reddit.com";

  private async getDashAudioUrl(dashUrl: string): Promise<string | undefined> {
    const res = await fetch(dashUrl);
    if (!res.ok) return undefined;

    const xml = await res.text();
    const doc = new DOMParser().parseFromString(xml, "application/xml");

    const audioBaseUrl =
      doc.querySelector('AdaptationSet[contentType="audio"] BaseURL')
        ?.textContent ??
      doc.querySelector('Representation[id="AUDIO-1"] BaseURL')?.textContent;

    if (!audioBaseUrl) return undefined;

    const base = new URL(dashUrl);
    return new URL(audioBaseUrl, base).href;
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      const res = await fetch(`${this.API_ORIGIN}/r/${videoId}.json`, {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        throw new VideoHelperError(`Reddit API error: ${res.status}`);
      }

      const json = await res.json();
      const post = json?.[0]?.data?.children?.[0]?.data;

      const redditVideo =
        post?.secure_media?.reddit_video ??
        post?.media?.reddit_video ??
        post?.crosspost_parent_list?.[0]?.secure_media?.reddit_video ??
        post?.crosspost_parent_list?.[0]?.media?.reddit_video;

      if (!redditVideo) {
        throw new VideoHelperError("No reddit_video found in post");
      }

      const dashUrl: string | undefined = redditVideo.dash_url?.replaceAll(
        "&amp;",
        "&",
      );

      if (!dashUrl) {
        throw new VideoHelperError("No dash_url in reddit_video");
      }

      const audioUrl = await this.getDashAudioUrl(dashUrl);
      if (!audioUrl) {
        throw new VideoHelperError("Failed to extract audio URL from DASH MPD");
      }

      return { url: audioUrl };
    } catch (err) {
      Logger.error(
        `Failed to get reddit video data by video ID: ${videoId}`,
        (err as Error).message,
      );
      return undefined;
    }
  }

  async getVideoId(url: URL) {
    return /\/r\/(([^/]+)\/([^/]+)\/([^/]+)\/([^/]+))/.exec(url.pathname)?.[1];
  }
}

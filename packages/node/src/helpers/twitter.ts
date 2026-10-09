import {
  getSyndicationToken,
  getTweetVideoInfo,
  selectTweetVideo,
  type TweetResultData,
} from "@vot.js/core/utils/twitter";
import type { MinimalVideoData } from "../types/client";
import { BaseHelper } from "./base";

export default class TwitterHelper extends BaseHelper {
  async getVideoId(url: URL) {
    const embedId = url.searchParams.get("id");
    if (embedId) return embedId;
    return /status\/([^/]+)/.exec(url.pathname)?.[1];
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      const response = await this.fetch(
        `https://cdn.syndication.twimg.com/tweet-result?id=${encodeURIComponent(videoId)}&lang=en&token=${getSyndicationToken(videoId)}`,
      );
      if (!response.ok) return undefined;
      const data = (await response.json()) as TweetResultData;
      const video = selectTweetVideo(getTweetVideoInfo(data));
      if (!video?.url) return undefined;
      return {
        url: video.url,
        duration: video.duration,
        title: data.text,
      };
    } catch {
      return undefined;
    }
  }
}

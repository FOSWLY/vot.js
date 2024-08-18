import { BaseHelper } from "./base";
import * as EpicGames from "../types/helpers/epicgames";

export default class EpicGamesHelper extends BaseHelper {
  API_ORIGIN = "https://dev.epicgames.com/community/api/learning";

  async getPostInfo(videoId: string) {
    try {
      const res = await this.fetch(
        `${this.API_ORIGIN}/post.json?hash_id=${videoId}`,
      );

      return (await res.json()) as EpicGames.Post;
    } catch (err: unknown) {
      console.error(
        `Failed to get epicgames post info by videoId: ${videoId}.`,
        (err as Error).message,
      );
      return false;
    }
  }

  async getVideoData(videoId: string) {
    const postInfo = await this.getPostInfo(videoId);
    if (!postInfo) {
      return undefined;
    }

    const playlistUrl = postInfo.blocks
      .find((block) => block.type === "video")
      ?.video_url?.replace("qsep://", "https://");
    if (!playlistUrl) {
      return undefined;
    }

    // url returns a json containing a dash playlist (in base64) in the playlist field
    return {
      url: playlistUrl,
      //subtitles: content.blocks?.[1]?.video_captions?.[0]?.signed_url,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /\/(\w{3,5})\/[^/]+$/.exec(url.pathname)?.[1];
  }
}

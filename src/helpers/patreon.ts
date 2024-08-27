import { BaseHelper } from "./base";
import * as Patreon from "../types/helpers/patreon";
import { MinimalVideoData } from "../types/client";

export default class PatreonHelper extends BaseHelper {
  API_ORIGIN = "https://www.patreon.com/api";

  async getPosts(
    postId: number | string,
  ): Promise<Patreon.PostsResponse | false> {
    try {
      const res = await this.fetch(
        `${this.API_ORIGIN}/posts/${postId}?json-api-use-default-includes=false`,
      );

      return (await res.json()) as Patreon.PostsResponse;
    } catch (err: unknown) {
      console.error(
        `Failed to get patreon posts by postId: ${postId}.`,
        (err as Error).message,
      );
      return false;
    }
  }

  async getVideoData(
    postId: string | number,
  ): Promise<MinimalVideoData | undefined> {
    const postData = await this.getPosts(postId);
    if (!postData) {
      return undefined;
    }

    const postFileUrl = postData.data.attributes.post_file.url;
    if (!postFileUrl) {
      return undefined;
    }

    return {
      url: postFileUrl,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    const fullPostId = /posts\/([^/]+)/.exec(url.pathname)?.[1];
    if (!fullPostId) {
      return undefined;
    }

    return fullPostId.replace(/[^\d.]/g, "");
  }
}

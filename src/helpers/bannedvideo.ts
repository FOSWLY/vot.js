import { BaseHelper } from "./base";
import * as BannedVideo from "../types/helpers/bannedvideo";
import { MinimalVideoData } from "../types/client";

export default class BannedVideoHelper extends BaseHelper {
  API_ORIGIN = "https://api.banned.video";

  async getVideoInfo(
    videoId: string,
  ): Promise<false | BannedVideo.GraphQLResponse> {
    try {
      const res = await this.fetch(`${this.API_ORIGIN}/graphql`, {
        method: "POST",
        body: JSON.stringify({
          operationName: "GetVideo",
          query: `query GetVideo($id: String!) {
            getVideo(id: $id) {
              title
              description: summary
              duration: videoDuration
              videoUrl: directUrl
              isStream: live
            }
          }`,
          variables: {
            id: videoId,
          },
        }),
        headers: {
          "User-Agent": "bannedVideoFrontEnd",
          "apollographql-client-name": "banned-web",
          "apollographql-client-version": "1.3",
          "content-type": "application/json",
        },
      });

      return (await res.json()) as BannedVideo.GraphQLResponse;
    } catch (err: unknown) {
      console.error(
        `Failed to get bannedvideo video info by videoId: ${videoId}.`,
        (err as Error).message,
      );
      return false;
    }
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const videoInfo = await this.getVideoInfo(videoId);
    if (!videoInfo) {
      return undefined;
    }

    const { videoUrl, duration, isStream, description, title } =
      videoInfo.data.getVideo;

    return {
      url: videoUrl,
      duration,
      isStream,
      title,
      description,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return url.searchParams.get("id") ?? undefined;
  }
}

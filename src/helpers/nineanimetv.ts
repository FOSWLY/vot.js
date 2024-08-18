import { BaseHelper } from "./base";
import * as NineAnimeTV from "../types/helpers/nineanimetv";

export default class NineAnimeTVHelper extends BaseHelper {
  API_ORIGIN = "https://9animetv.to/ajax/episode";
  RAPID_CLOUD_ORIGIN = "https://rapid-cloud.co/ajax/embed-6-v2";

  async getSourceId(episodeId: string | number) {
    try {
      const res = await this.fetch(
        `${this.API_ORIGIN}/servers?episodeId=${episodeId}`,
      );

      const content = (await res.json()) as NineAnimeTV.ServersData;
      if (!content.html) {
        return false;
      }

      return /data-id="(\d+)"/.exec(content.html)?.[1];
    } catch (err: unknown) {
      console.error(
        `Failed to get 9animetv servers info by episodeId: ${episodeId}.`,
        (err as Error).message,
      );
      return false;
    }
  }

  async getPlayerLink(sourceId: string | number) {
    try {
      const res = await this.fetch(`${this.API_ORIGIN}/sources?id=${sourceId}`);

      const content = (await res.json()) as NineAnimeTV.PlayerSources;
      if (!content.link.includes("rapid-cloud.co")) {
        // ignore empty link and strcloud.in (it always returns an error instead of a video)
        return false;
      }

      return content.link;
    } catch (err: unknown) {
      console.error(
        `Failed to get player link by sourceId: ${sourceId}.`,
        (err as Error).message,
      );
      return false;
    }
  }

  async getRapidCloudData(rapidId: string) {
    try {
      const res = await this.fetch(
        `${this.RAPID_CLOUD_ORIGIN}/getSources?id=${rapidId}`,
      );

      const content = (await res.json()) as NineAnimeTV.RapidData;
      if (content.encrypted) {
        // I haven't seen such links, so I don't know what they look like, it's better to skip
        console.warn(
          "Encrypted RapidCloud data found. Let us know about it",
          content,
        );
        return false;
      }

      return content;
    } catch (err: unknown) {
      console.error(
        `Failed to get rapid cloud data by rapidId: ${rapidId}.`,
        (err as Error).message,
      );
      return false;
    }
  }

  async getVideoData(videoId: string) {
    const episodeId = videoId.split("?ep=")[1];
    const sourceId = await this.getSourceId(episodeId);
    if (!sourceId) {
      return undefined;
    }

    const playerLink = await this.getPlayerLink(sourceId);
    if (!playerLink) {
      return undefined;
    }

    // only get id from link
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

    return {
      url: videoUrl,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /[^/]+$/.exec(url.href)?.[0];
  }
}

import { BaseHelper } from "./base";
import type { MinimalVideoData } from "../types/client";

import Logger from "@vot.js/shared/utils/logger";

export default class OdyseeHelper extends BaseHelper {
  API_ORIGIN = "https://odysee.com";

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    try {
      const res = await this.fetch(`${this.API_ORIGIN}/${videoId}`);
      const content = await res.text();
      const url = /"contentUrl":(\s)?"([^"]+)"/.exec(content)?.[2];
      if (!url) {
        throw new Error("Odysee url doesn't parsed");
      }

      return { url };
    } catch (err: unknown) {
      Logger.error(
        `Failed to get odysee video data by video ID: ${videoId}`,
        (err as Error).message,
      );
      return undefined;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return url.pathname.slice(1);
  }
}

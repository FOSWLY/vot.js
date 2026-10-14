import type { MinimalVideoData } from "../types/client";
import { BaseHelper } from "./base";

export default class OdyseeHelper extends BaseHelper {
  API_ORIGIN = "https://odysee.com";

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const url = `${this.API_ORIGIN}/${videoId}`.replace(/:[a-zA-Z0-9]+$/, "");
    return { url };
  }

  async getVideoId(url: URL) {
    return url.pathname.slice(1);
  }
}

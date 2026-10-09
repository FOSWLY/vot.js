import JWPlayerHelper from "../players/jwplayer";
import type { MinimalVideoData } from "../types/client";
import { BaseHelper } from "./base";

export default class NoodleMagazineHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL): Promise<string | undefined> {
    return url.pathname.slice(1);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    return new JWPlayerHelper().getVideoData(videoId);
  }
}

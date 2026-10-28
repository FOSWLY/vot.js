import JWPlayerHelper from "../players/jwplayer";
import type { MinimalVideoData } from "../types/client";
import { BaseHelper } from "./base";

export default class BeaconHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return url.href;
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    return new JWPlayerHelper().getVideoData(videoId);
  }
}

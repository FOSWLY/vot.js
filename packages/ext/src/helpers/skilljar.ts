import JWPlayerHelper from "../players/jwplayer";
import type { MinimalVideoData } from "../types/client";
import { BaseHelper } from "./base";

export default class SkilljarHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL): Promise<string | undefined> {
    return url.pathname.slice(1);
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const jwHelper = new JWPlayerHelper();
    return jwHelper.getVideoData(videoId);
  }
}

import BrightcovePlayerHelper from "../players/brightcove";
import { PlayerSiteHelper } from "./playerSite";

export default class CraftsyHelper extends PlayerSiteHelper {
  protected player = new BrightcovePlayerHelper();
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL): Promise<string | undefined> {
    return /\/class\/([\w-]+)/.exec(url.pathname)?.[1];
  }
}

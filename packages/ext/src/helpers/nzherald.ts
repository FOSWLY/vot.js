import BrightcovePlayerHelper from "../players/brightcove";
import { PlayerSiteHelper } from "./playerSite";

export default class NZHeraldHelper extends PlayerSiteHelper {
  protected player = new BrightcovePlayerHelper();

  async getVideoId(url: URL): Promise<string | undefined> {
    return /\/([A-Z0-9]+)\/?$/.exec(url.pathname)?.[1];
  }
}

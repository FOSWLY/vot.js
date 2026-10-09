import BrightcovePlayerHelper from "../players/brightcove";
import { PlayerSiteHelper } from "./playerSite";

export default class BrightcoveHelper extends PlayerSiteHelper {
  protected player = new BrightcovePlayerHelper();

  async getVideoId(url: URL): Promise<string | undefined> {
    return url.searchParams.get("videoId") || undefined;
  }
}

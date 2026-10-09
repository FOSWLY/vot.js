import JWPlayerHelper from "../players/jwplayer";
import { PlayerSiteHelper } from "./playerSite";

export default class BeaconHelper extends PlayerSiteHelper {
  protected player = new JWPlayerHelper();
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL): Promise<string | undefined> {
    return /\/content\/([\w-]+)/.exec(url.pathname)?.[1];
  }
}

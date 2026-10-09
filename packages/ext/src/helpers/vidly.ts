import JWPlayerHelper from "../players/jwplayer";
import { PlayerSiteHelper } from "./playerSite";

export default class VidlyHelper extends PlayerSiteHelper {
  protected player = new JWPlayerHelper();
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL): Promise<string | undefined> {
    return /^\/embeded\.html$/.test(url.pathname)
      ? url.searchParams.get("link") || undefined
      : /^\/(\w+)(?:\/|$)/.exec(url.pathname)?.[1];
  }
}

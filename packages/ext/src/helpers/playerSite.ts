import type { BasePlayer } from "../players/base";
import type { MinimalVideoData } from "../types/client";
import { BaseHelper } from "./base";

/** Reuse a player extractor without confusing a site ID with a page URL. */
export abstract class PlayerSiteHelper extends BaseHelper {
  protected abstract player: BasePlayer;

  async getVideoData(_videoId: string): Promise<MinimalVideoData | undefined> {
    const pageUrl = new URL(window.location.href);
    pageUrl.hash = "";
    return this.player.getVideoData(pageUrl.href);
  }
}

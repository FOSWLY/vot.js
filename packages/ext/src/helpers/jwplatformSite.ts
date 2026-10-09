import JWPlayerHelper, { type JWPlayerPlaylistItem } from "../players/jwplayer";
import type { MinimalVideoData } from "../types/client";
import { PlayerSiteHelper } from "./playerSite";

/** Public media API only; no script evaluation or authentication. */
export abstract class JWPlatformSiteHelper extends PlayerSiteHelper {
  protected player = new JWPlayerHelper();

  protected getMediaId(videoId: string): string | undefined {
    return /^[A-Za-z0-9]{8}$/.test(videoId) ? videoId : undefined;
  }

  protected acceptsPlayer(_videoId: string): boolean {
    return true;
  }

  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    if (this.acceptsPlayer(videoId) && this.player.getPlayer()) {
      const result = await super.getVideoData(videoId);
      if (result) return result;
    }
    const mediaId = this.getMediaId(videoId);
    if (!mediaId) return undefined;
    try {
      const response = await this.fetch(
        `https://cdn.jwplayer.com/v2/media/${mediaId}`,
      );
      if (!response.ok) return undefined;
      const data = (await response.json()) as {
        playlist?: JWPlayerPlaylistItem[];
      };
      const item = data.playlist?.[0];
      if (!item || typeof item !== "object") return undefined;
      const pageUrl = new URL(window.location.href);
      pageUrl.hash = "";
      return this.player.getVideoDataByPlaylistItem(pageUrl.href, item);
    } catch {
      return undefined;
    }
  }
}

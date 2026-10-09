import { JWPlatformSiteHelper } from "./jwplatformSite";

/** The article ID and the JW media ID are different. */
export default class SpiegelHelper extends JWPlatformSiteHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    return /^\/(?:[^/]+\/)+[^/]*-([0-9]+|[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})(?:-embed|-iframe)?(?:\.html)?$/.exec(
      url.pathname,
    )?.[1];
  }

  protected acceptsPlayer(videoId: string): boolean {
    const mediaId = this.getMediaId(videoId);
    return Boolean(
      mediaId && this.player.getPlaylistItem()?.mediaid === mediaId,
    );
  }

  protected getMediaId(_videoId: string): string | undefined {
    const ids = new Set<string>();
    // getAttribute returns entity-decoded JSON; never execute page scripts.
    for (const node of document.querySelectorAll(
      '[data-component="JWPlayer"][data-settings]',
    )) {
      try {
        const settings = JSON.parse(
          node.getAttribute("data-settings") ?? "null",
        );
        if (
          typeof settings?.mediaId === "string" &&
          /^[A-Za-z0-9]{8}$/.test(settings.mediaId)
        )
          ids.add(settings.mediaId);
      } catch {
        /* An unready/invalid widget is not a video. */
      }
    }
    // Do not guess among unrelated inline/recommendation videos.
    return ids.size === 1 ? ids.values().next().value : undefined;
  }
}

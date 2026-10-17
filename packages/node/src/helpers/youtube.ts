import { BaseHelper } from "./base";

export default class YoutubeHelper extends BaseHelper {
  private static extractVideoId(url: URL): string | undefined {
    // Handle YouTube "share/redirect" wrappers.
    // Example: /attribution_link?u=%2Fwatch%3Fv%3DVIDEO_ID%26feature%3Dshare
    if (url.pathname === "/attribution_link") {
      const u = url.searchParams.get("u");
      if (u) {
        try {
          const decoded = decodeURIComponent(u);
          const inner = decoded.startsWith("http")
            ? new URL(decoded)
            : new URL(decoded, url.origin);
          return YoutubeHelper.extractVideoId(inner);
        } catch {
          // ignore
        }
      }
    }

    const rawHash = url.hash.replace(/^#/, "");
    if (rawHash) {
      const normalizedHash = rawHash.startsWith("!")
        ? rawHash.slice(1)
        : rawHash;
      let decodedHash = normalizedHash;
      try {
        decodedHash = decodeURIComponent(normalizedHash);
      } catch {
        // ignore malformed URL-encoding
      }

      try {
        const hashUrl = decodedHash.startsWith("http")
          ? new URL(decodedHash)
          : new URL(
              decodedHash.startsWith("/") ? decodedHash : `/${decodedHash}`,
              url.origin,
            );
        const hashVideoId = YoutubeHelper.extractVideoId(hashUrl);
        if (hashVideoId) {
          return hashVideoId;
        }
      } catch {
        const hashVideoId = /(?:^|[?&#])v=([^&#]+)/.exec(decodedHash)?.[1];
        if (hashVideoId) {
          return hashVideoId;
        }
      }
    }

    // youtu.be/<id>
    if (url.hostname === "youtu.be") {
      const id = url.pathname.replace(/^\/+/, "").split("/")[0];
      return id || undefined;
    }

    // /watch?v=<id>
    const vParam = url.searchParams.get("v");
    if (vParam) return vParam;

    // /shorts/<id>, /embed/<id>, /live/<id>, /v/<id>, /e/<id>
    const pathId =
      /\/(?:shorts|embed|live|v|e)\/([^/?#]+)/.exec(url.pathname)?.[1] ??
      undefined;

    return pathId || undefined;
  }

  async getVideoId(url: URL) {
    return YoutubeHelper.extractVideoId(url);
  }
}

import { NativeDeltaHelper } from "./nativeDelta";
export default class NaverTVHelper extends NativeDeltaHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    if (
      !/^m\.naver\.com$/.test(url.hostname) ||
      !url.pathname.startsWith("/shorts/") ||
      !url.searchParams.get("seedMediaId")
    )
      return undefined;
    const canonical = new URL(url.href);
    canonical.hash = "";
    return canonical.href;
  }
}

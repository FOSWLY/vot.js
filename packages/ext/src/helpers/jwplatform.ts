import { JWPlatformSiteHelper } from "./jwplatformSite";

export default class JWPlatformHelper extends JWPlatformSiteHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    return /^\/players\/([A-Za-z0-9]{8})(?:-[A-Za-z0-9]{8})?\.html$/.exec(
      url.pathname,
    )?.[1];
  }
}

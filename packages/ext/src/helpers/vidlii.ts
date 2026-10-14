import { NativeDeltaHelper } from "./nativeDelta";

export default class VidliiHelper extends NativeDeltaHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    const id =
      /^https?:\/\/(?:www\.)?vidlii\.com\/(?:watch|embed)\?.*?\bv=(?<id>[0-9A-Za-z_-]{11})(?=$|[&#])/.exec(
        url.href,
      )?.groups?.id;
    return id;
  }
}

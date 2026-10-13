import { BaseHelper, VideoHelperError } from "./base";
const vidliiUrlPattern =
  /^https?:\/\/(?:www\.)?vidlii\.com\/(?:watch|embed)\?.*?\bv=(?<id>[0-9A-Za-z_-]{11})(?=$|[&#])/;
export function parseVidliiVideoId(url: string): string | undefined {
  const id = vidliiUrlPattern.exec(url)?.groups?.id;
  return id;
}
export default class VidliiHelper extends BaseHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    return parseVidliiVideoId(url.href);
  }
}

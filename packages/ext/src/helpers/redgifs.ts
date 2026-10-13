import { NativeDeltaHelper } from "./nativeDelta";
const redgifsUrlPattern =
  /^https?:\/\/(?:(?:www\.)?redgifs\.com\/(?:watch|ifr)\/|thumbs2\.redgifs\.com\/)(?<id>[^-\/?#\.]+)(?=$|[-\/?#\.])/;
export function parseRedgifsVideoId(url: string): string | undefined {
  const id = redgifsUrlPattern.exec(url)?.groups?.id;
  return id?.toLowerCase();
}
export default class RedgifsHelper extends NativeDeltaHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    return parseRedgifsVideoId(url.href);
  }
}

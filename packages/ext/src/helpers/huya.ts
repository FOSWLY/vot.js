import { NativeDeltaHelper } from "./nativeDelta";
const huyaUrlPattern =
  /^https?:\/\/(?:www\.)?huya\.com\/video\/play\/(?<id>\d+)\.html(?=$|[\/?#])/;
export function parseHuyaVideoId(url: string): string | undefined {
  const id = huyaUrlPattern.exec(url)?.groups?.id;
  return id;
}
export default class HuyaHelper extends NativeDeltaHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    return parseHuyaVideoId(url.href);
  }
}

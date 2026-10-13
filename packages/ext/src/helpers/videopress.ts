import { NativeDeltaHelper } from "./nativeDelta";
const videopressUrlPattern =
  /^https?:\/\/video(?:\.word)?press\.com\/embed\/(?<id>[\da-zA-Z]{8})(?:\/)?(?:[?#].*)?$/;
export default class VideoPressHelper extends NativeDeltaHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    return videopressUrlPattern.exec(url.href)?.groups?.id;
  }
}

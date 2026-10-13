import { NativeDeltaHelper } from "./nativeDelta";
export default class SpiegelHelper extends NativeDeltaHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    if (!/^(?:www\.)?spiegel\.de$/.test(url.hostname)) return undefined;
    return /^\/(?:[^/]+\/)+[^/]*-([0-9]+|[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})(?:-embed|-iframe)?(?:\.html)?$/.exec(
      url.pathname,
    )?.[1];
  }
}

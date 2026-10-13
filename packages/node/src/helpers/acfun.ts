import { BaseHelper, VideoHelperError } from "./base";
const acfunUrlPattern =
  /^https?:\/\/www\.acfun\.cn\/v\/ac(?<id>[_\d]+)(?=$|[\/?#])/;
export function parseAcFunVideoId(url: string): string | undefined {
  const id = acfunUrlPattern.exec(url)?.groups?.id;
  return id;
}
export default class AcFunHelper extends BaseHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    return parseAcFunVideoId(url.href);
  }
}

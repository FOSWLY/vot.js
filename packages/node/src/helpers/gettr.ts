import { BaseHelper, VideoHelperError } from "./base";
const gettrUrlPattern =
  /^(?:https?:\/\/(www\.)?gettr\.com\/post\/(?<id>[a-z0-9]+))(?:\/)?(?:[?#].*)?$/;
export default class GettrHelper extends BaseHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    const match = gettrUrlPattern.exec(url.href);
    return match?.groups?.id;
  }
}

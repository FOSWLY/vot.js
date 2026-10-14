import { BaseHelper } from "./base";

export default class AcFunHelper extends BaseHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    if (
      !/^https?:$/.test(url.protocol) ||
      url.username ||
      url.password ||
      url.port ||
      url.hostname !== "www.acfun.cn"
    )
      return undefined;
    return /^\/v\/ac(?<id>[_\d]+)(?=$|[/?#])/.exec(url.pathname)?.groups?.id;
  }
}

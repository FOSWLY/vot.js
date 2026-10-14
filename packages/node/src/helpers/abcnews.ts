import { BaseHelper } from "./base";

export default class AbcNewsHelper extends BaseHelper {
  async getVideoId(url: URL): Promise<string | undefined> {
    return /^https?:\/\/(?:abcnews\.go\.com\/(?:(?:[^/]+\/)*video\/(?<display_id>[0-9a-z-]+)-|video\/(?:embed|itemfeed)\?(?:[^#]*&)?id=)|fivethirtyeight\.abcnews\.go\.com\/video\/embed\/\d+\/)(?<id>\d+)(?=$|[/?#&])/.exec(
      url.href,
    )?.groups?.id;
  }
}

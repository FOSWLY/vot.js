import { BaseHelper } from "./base";

export default class OlympicsReplayHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return /\/([a-z]{2}\/(?:[a-z0-9-]+\/)?(?:replay|videos?|original-series\/episode)\/[\w-]+)\/?$/i.exec(
      url.pathname,
    )?.[1];
  }
}

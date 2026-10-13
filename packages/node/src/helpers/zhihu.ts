import { BaseHelper, VideoHelperError } from "./base";
export default class ZhihuHelper extends BaseHelper {
  async getVideoId(url: URL) {
    if (!/^(?:www\.)?zhihu\.com$/.test(url.hostname)) return undefined;
    return /\/zvideo\/(\d+)/.exec(url.pathname)?.[1];
  }
}

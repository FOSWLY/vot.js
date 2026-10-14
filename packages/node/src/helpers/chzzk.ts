import { BaseHelper } from "./base";
export default class CHZZKHelper extends BaseHelper {
  async getVideoId(url: URL) {
    if (!/^chzzk\.naver\.com$/.test(url.hostname)) return undefined;
    return /\/video\/(\d+)/.exec(url.pathname)?.[1];
  }
}

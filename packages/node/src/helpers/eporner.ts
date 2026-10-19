import { BaseHelper } from "./base";

export default class EpornerHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return /\/(?:video-|embed\/)([a-zA-Z0-9]+)/.exec(url.pathname)?.[1];
  }
}

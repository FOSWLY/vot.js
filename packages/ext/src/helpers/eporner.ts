import { BaseHelper } from "./base";

export default class EpornerHelper extends BaseHelper {
  async getVideoId(url: URL) {
    // ! LINK SHOULD BE LIKE THIS eporner.com/video-XXXXXXXXX/isdfsd-dfjsdfjsdf-dsfsdf-dsfsda-dsad-ddsd
    return /video-([^/]+)\/([^/]+)/.exec(url.pathname)?.[0];
  }
}

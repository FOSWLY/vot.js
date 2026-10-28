import { BaseHelper } from "./base";

export default class SpankBangHelper extends BaseHelper {
  async getVideoId(url: URL) {
    return (
      /\/([\da-z]+\/(?:video|play|embed)(?:\/[^/]+)?)\/?$/i.exec(
        url.pathname,
      )?.[1] ??
      /\/([\da-z]+-[\da-z]+\/playlist\/[^/]+)\/?$/i.exec(url.pathname)?.[1]
    );
  }
}

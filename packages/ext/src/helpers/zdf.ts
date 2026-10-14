import { BaseHelper } from "./base";

const zdfPlayPathRe = /^\/play\/([^/?#]+)\/([^/?#]+)\/([^/?#]+)\/?$/i;

export default class ZDFHelper extends BaseHelper {
  async getVideoId(url: URL) {
    const match = zdfPlayPathRe.exec(url.pathname);
    if (!match) {
      return undefined;
    }

    const [, publicationForm, collectionCanonical, videoCanonical] = match;
    return `${publicationForm}/${collectionCanonical}/${videoCanonical}`;
  }
}

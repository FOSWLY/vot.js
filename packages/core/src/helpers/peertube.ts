import { BaseHelper } from "./base";

export default class PeertubeHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    // Supported path forms: /videos/watch/<id>, /videos/embed/<id>, /w/<id>
    const videoId = /\/(?:videos\/(?:watch|embed)|w)\/([^/]+)/.exec(
      url.pathname,
    )?.[1];
    return videoId ? `/videos/watch/${videoId}` : undefined;
  }
}

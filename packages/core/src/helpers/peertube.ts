import { BaseHelper } from "./base";

export default class PeertubeHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    // Same path forms as yt-dlp PeerTubeIE: /videos/watch/<id>, /videos/embed/<id>, /w/<id>
    const videoId = /\/(?:videos\/(?:watch|embed)|w)\/([^/]+)/.exec(
      url.pathname,
    )?.[1];
    return videoId ? `/videos/watch/${videoId}` : undefined;
  }
}

import type { MinimalVideoData } from "../types/client";
import { BaseHelper } from "./base";

const MUX_STREAM_RE = /^https:\/\/stream\.mux\.com\//;

export default class UpdraftHelper extends BaseHelper {
  async getVideoData(_videoId: string): Promise<MinimalVideoData | undefined> {
    // The player is a media-chrome <hls-video>: the <video> lives in its shadow root, and the Mux stream url is on the host element
    const root = this.video?.getRootNode();
    const src =
      (root instanceof ShadowRoot && root.host.getAttribute("src")) ||
      document.querySelector("hls-video[src]")?.getAttribute("src");
    return src && MUX_STREAM_RE.test(src) ? { url: src } : undefined;
  }

  async getVideoId(url: URL) {
    return /^\/courses\/([^/]+\/[^/]+\/[^/]+)/.exec(url.pathname)?.[1];
  }
}

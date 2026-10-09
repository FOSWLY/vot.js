import { BaseHelper } from "./base";

export default class StreamableHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return /^\/(?:[es]\/)?(\w+)\/?$/.exec(url.pathname)?.[1];
  }

  async getVideoData(videoId: string) {
    try {
      const res = await this.fetch(
        `https://ajax.streamable.com/videos/${encodeURIComponent(videoId)}`,
      );
      if (!res.ok) return undefined;
      const data = (await res.json()) as {
        title?: string;
        duration?: number;
        files?: Record<string, { url?: string } | undefined>;
      };
      const src = data.files?.mp4?.url ?? data.files?.["mp4-mobile"]?.url;
      if (!src) return undefined;
      return {
        url: src.startsWith("//") ? `https:${src}` : src,
        duration: data.duration,
        title: data.title,
      };
    } catch {
      return undefined;
    }
  }
}

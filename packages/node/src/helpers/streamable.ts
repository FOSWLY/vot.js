import { BaseHelper, VideoHelperError } from "./base";
export default class StreamableHelper extends BaseHelper {
  async getVideoId(url: URL) {
    if (!/^streamable\.com$/.test(url.hostname)) return undefined;
    return /^\/(?:[es]\/)?(\w+)\/?$/.exec(url.pathname)?.[1];
  }
  async getVideoData(videoId: string) {
    const response = await this.fetch(
      "https://ajax.streamable.com/videos/" + encodeURIComponent(videoId),
    );
    if (!response.ok)
      throw new VideoHelperError(
        "Streamable metadata unavailable: " + response.status,
      );
    const data = (await response.json()) as {
      title?: string;
      duration?: number;
      files?: Record<string, { url?: string }>;
    };
    const src = data.files?.mp4?.url ?? data.files?.["mp4-mobile"]?.url;
    if (!src) throw new VideoHelperError("Streamable has no public MP4 source");
    const url = new URL(src, "https://streamable.com/");
    if (!["https:", "http:"].includes(url.protocol))
      throw new VideoHelperError("Unsupported Streamable media URL");
    return {
      url: url.href,
      title: data.title,
      duration:
        typeof data.duration === "number" &&
        Number.isFinite(data.duration) &&
        data.duration >= 0
          ? data.duration
          : undefined,
    };
  }
}

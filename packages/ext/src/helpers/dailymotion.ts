import { BaseHelper } from "./base";

export default class DailymotionHelper extends BaseHelper {
  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(_url: URL) {
    // geo.dailymotion.com
    const plainPlayerConfig = Array.from(document.querySelectorAll("*")).filter(
      (s) => s.innerHTML.trim().includes(".m3u8"),
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const videoUrl = (plainPlayerConfig?.[1]?.lastChild as any)?.src as
      | string
      | undefined;
    return videoUrl ? /\/video\/(\w+)\.m3u8/.exec(videoUrl)?.[1] : undefined;
  }
}

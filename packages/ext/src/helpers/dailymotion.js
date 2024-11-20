import { BaseHelper } from "./base";
export default class DailymotionHelper extends BaseHelper {
  async getVideoId(url) {
    const plainPlayerConfig = Array.from(document.querySelectorAll("*")).filter(
      (s) => s.innerHTML.trim().includes(".m3u8"),
    );
    const videoUrl = plainPlayerConfig?.[1]?.lastChild?.src;
    return videoUrl ? /\/video\/(\w+)\.m3u8/.exec(videoUrl)?.[1] : undefined;
  }
}

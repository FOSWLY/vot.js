import { BaseHelper } from "./base";

export default class OdyseeHelper extends BaseHelper {
  API_ORIGIN = "https://odysee.com";

  async getVideoData(videoId: string) {
    try {
      const res = await this.fetch(`${this.API_ORIGIN}/${videoId}`);
      const content = await res.text();
      return { url: /"contentUrl":(\s)?"([^"]+)"/.exec(content)?.[2] };
    } catch (err: unknown) {
      console.error("Failed to get odysee video data", (err as Error).message);
      return undefined;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoId(url: URL) {
    return url.pathname.slice(1);
  }
}

import { BaseHelper } from "./base";

export default class TwitchHelper extends BaseHelper {
  API_ORIGIN = "https://clips.twitch.tv";

  async getClipLink(pathname: string, clipId: string | null) {
    const clearPathname = pathname.slice(1);
    const isEmbed = clearPathname === "embed";
    const videoPath = isEmbed ? clipId : clearPathname;
    const res = await this.fetch(`${this.API_ORIGIN}/${videoPath}`, {
      // maybe this way there is a better chance that the schema will be on the page
      headers: {
        "User-Agent": "Googlebot/2.1 (+http://www.googlebot.com/bot.html)",
      },
    });

    const content = await res.text();

    // get creator.url from schema
    const channelLink = /"url":"https:\/\/www\.twitch\.tv\/([^"]+)"/.exec(
      content,
    );
    if (!channelLink) {
      return undefined;
    }

    return `${channelLink[1]}/clip/${videoPath}`;
  }

  async getVideoId(url: URL) {
    const pathname = url.pathname;
    if (/^m\.twitch\.tv$/.test(pathname)) {
      return /videos\/([^/]+)/.exec(url.href)?.[0] ?? pathname.slice(1);
    } else if (/^player\.twitch\.tv$/.test(url.hostname)) {
      return `videos/${url.searchParams.get("video")}`;
    }

    const clipPath = /([^/]+)\/(?:clip)\/([^/]+)/.exec(pathname);
    if (clipPath) {
      return clipPath[0];
    }

    const isClipsDomain = /^clips\.twitch\.tv$/.test(url.hostname);
    if (isClipsDomain) {
      return await this.getClipLink(pathname, url.searchParams.get("clip"));
    }

    return /(?:videos)\/([^/]+)/.exec(pathname)?.[0];
  }
}

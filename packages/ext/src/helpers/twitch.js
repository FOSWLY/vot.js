import { BaseHelper, VideoHelperError } from "./base";
export default class TwitchHelper extends BaseHelper {
  API_ORIGIN = "https://clips.twitch.tv";
  async getClipLink(pathname, clipId) {
    const schema = document.querySelector("script[type='application/ld+json']");
    const clearPathname = pathname.slice(1);
    if (schema) {
      const schemaJSON = JSON.parse(schema.innerText);
      const channelLink = schemaJSON["@graph"].find(
        (obj) => obj["@type"] === "VideoObject",
      )?.creator.url;
      if (!channelLink) {
        throw new VideoHelperError("Failed to find channel link");
      }
      const channelName = channelLink.replace("https://www.twitch.tv/", "");
      return `${channelName}/clip/${clearPathname}`;
    }
    const isEmbed = clearPathname === "embed";
    const channelLink = document.querySelector(
      isEmbed
        ? ".tw-link[data-test-selector='stream-info-card-component__stream-avatar-link']"
        : ".clips-player a:not([class])",
    );
    if (!channelLink) {
      return undefined;
    }
    const channelName = channelLink.href.replace("https://www.twitch.tv/", "");
    return `${channelName}/clip/${isEmbed ? clipId : clearPathname}`;
  }
  async getVideoId(url) {
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
import { BaseHelper, VideoHelperError } from "./base";
import { MinimalVideoData } from "../types/client";

import * as Sap from "@vot.js/shared/types/helpers/sap";

export default class TwitchHelper extends BaseHelper {
  API_ORIGIN = "https://clips.twitch.tv";

  // eslint-disable-next-line @typescript-eslint/require-await
  async getClipLink(pathname: string, clipId: string | null) {
    const schema = document.querySelector<HTMLScriptElement>(
      "script[type='application/ld+json']",
    );
    const clearPathname = pathname.slice(1);
    if (schema) {
      const schemaJSON = JSON.parse(schema.innerText) as Sap.Schema;
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
    const channelLink = document.querySelector<HTMLLinkElement>(
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

  // eslint-disable-next-line @typescript-eslint/require-await
  async getVideoData(videoId: string): Promise<MinimalVideoData | undefined> {
    const title = document.querySelector<HTMLElement>(
      '[data-a-target="stream-title"], [data-test-selector="stream-info-card-component__subtitle"]',
    )?.innerText;
    const isStream = !!document.querySelector(
      '[data-a-target="animated-channel-viewers-count"], .channel-status-info--live, .top-bar--pointer-enabled .tw-channel-status-text-indicator',
    );

    return {
      url: this.service!.url + videoId,
      isStream,
      title,
    };
  }

  async getVideoId(url: URL): Promise<string | undefined> {
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

    const videoPath = /(?:videos)\/([^/]+)/.exec(pathname);
    if (videoPath) {
      return videoPath[0];
    }

    const isUserOfflinePage = document.querySelector<HTMLLinkElement>(
      ".home-offline-hero .tw-link",
    );
    if (isUserOfflinePage?.href) {
      const pageUrl = new URL(isUserOfflinePage.href);
      return /(?:videos)\/([^/]+)/.exec(pageUrl.pathname)?.[0];
    }

    return document.querySelector(".persistent-player") ? pathname : undefined;
  }
}

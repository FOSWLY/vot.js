import sites from "../config/sites";
import { ServiceConf, VideoService } from "../types/yandex";
import * as Kodik from "../types/helpers/kodik";
import VideoHelper from "./helper";
import { fetchWithTimeout } from "./utils";
import { VideoData } from "../types/client";

class VideoDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VideoDataError";
    this.message = message;
  }
}

export function getService(videoUrl: string) {
  if (/(file:\/\/|(http(s)?:\/\/)(127\.0\.0\.1|localhost))/.exec(videoUrl))
    return false;

  let enteredURL: URL;
  try {
    enteredURL = new URL(videoUrl) as URL;
  } catch (e) {
    console.error(`Invalid URL: ${videoUrl}. Have you forgotten https?`);
    return false;
  }

  const hostname = enteredURL.hostname;
  const isMathes = (match: unknown) => {
    if (match instanceof RegExp) {
      return match.test(hostname);
    } else if (typeof match === "string") {
      return hostname.includes(match);
    } else if (typeof match === "function") {
      return match(enteredURL) as boolean;
    }
    return false;
  };

  return sites.find((e) => {
    return (
      (Array.isArray(e.match) ? e.match.some(isMathes) : isMathes(e.match)) &&
      e.host &&
      e.url
    );
  });
}

export async function getVideoID(
  service: ServiceConf,
  videoURL: string,
): Promise<string | null | undefined> {
  const url = new URL(videoURL);
  switch (service.host) {
    case VideoService.custom:
      return url.href;
    case VideoService.piped:
    case VideoService.poketube:
    case VideoService.invidious:
    case VideoService.youtube:
      if (url.hostname === "youtu.be") {
        url.search = `?v=${url.pathname.replace("/", "")}`;
        url.pathname = "/watch";
      }

      return (
        /(?:watch|embed|shorts|live)\/([^/]+)/.exec(url.pathname)?.[1] ??
        url.searchParams.get("v")
      );
    case VideoService.vk: {
      const pathID = /^\/(video|clip)-?\d{8,9}_\d{9}$/.exec(url.pathname);
      const paramZ = url.searchParams.get("z");
      const paramOID = url.searchParams.get("oid");
      const paramID = url.searchParams.get("id");
      if (pathID) {
        return (pathID as RegExpMatchArray)[0].slice(1);
      } else if (paramZ) {
        return paramZ.split("/")[0];
      } else if (paramOID && paramID) {
        return `video-${Math.abs(parseInt(paramOID))}_${paramID}`;
      }

      return null;
    }
    case VideoService.nine_gag:
    case VideoService.gag:
      return /gag\/([^/]+)/.exec(url.pathname)?.[1];
    case VideoService.twitch: {
      const clipPath = /([^/]+)\/(?:clip)\/([^/]+)/.exec(url.pathname);
      const isClipsDomain = /^clips\.twitch\.tv$/.test(url.hostname);
      if (/^m\.twitch\.tv$/.test(url.hostname)) {
        return /videos\/([^/]+)/.exec(url.href)?.[0] ?? url.pathname.slice(1);
      } else if (/^player\.twitch\.tv$/.test(url.hostname)) {
        return `videos/${url.searchParams.get("video")}`;
      } else if (isClipsDomain) {
        const pathname = url.pathname.slice(1);
        const isEmbed = pathname === "embed";
        const res = await fetchWithTimeout(
          `https://clips.twitch.tv/${
            isEmbed ? url.searchParams.get("clip") : url.pathname.slice(1)
          }`,
          {
            // maybe this way there is a better chance that the schema will be on the page
            headers: {
              "User-Agent":
                "Googlebot/2.1 (+http://www.googlebot.com/bot.html)",
            },
          },
        );

        const content = await res.text();

        // get creator.url from schema
        const channelLink = /"url":"https:\/\/www\.twitch\.tv\/([^"]+)"/.exec(
          content,
        );
        if (!channelLink) {
          return null;
        }

        return `${channelLink[1]}/clip/${
          isEmbed ? url.searchParams.get("clip") : pathname
        }`;
      } else if (clipPath) {
        return clipPath[0];
      }

      return /(?:videos)\/([^/]+)/.exec(url.pathname)?.[0];
    }
    case VideoService.proxitok:
    case VideoService.tiktok:
      return /([^/]+)\/video\/([^/]+)/.exec(url.pathname)?.[0];
    case VideoService.vimeo: {
      const appId = url.searchParams.get("app_id");
      const videoId =
        /[^/]+\/[^/]+$/.exec(url.pathname)?.[0] ??
        /[^/]+$/.exec(url.pathname)?.[0];

      return appId ? `${videoId}?app_id=${appId}` : videoId;
    }
    case VideoService.xvideos:
      return /[^/]+\/[^/]+$/.exec(url.pathname)?.[0];
    case VideoService.pornhub:
      return (
        url.searchParams.get("viewkey") ??
        /embed\/([^/]+)/.exec(url.pathname)?.[1]
      );
    case VideoService.twitter:
      return /status\/([^/]+)/.exec(url.pathname)?.[1];
    case VideoService.rumble:
    case VideoService.facebook:
      return url.pathname.slice(1);
    case VideoService.rutube:
      return /(?:video|embed)\/([^/]+)/.exec(url.pathname)?.[1];
    case VideoService.bilibili: {
      const bvid = url.searchParams.get("bvid");
      if (bvid) {
        return bvid;
      }

      let vid = /video\/([^/]+)/.exec(url.pathname)?.[1];
      if (vid && url.searchParams.get("p") !== null) {
        vid += `/?p=${url.searchParams.get("p")}`;
      }
      return vid;
    }
    case VideoService.mailru: {
      const pathname = url.pathname;
      if (pathname.startsWith("/v/") || pathname.startsWith("/mail/")) {
        return pathname.slice(1);
      }

      const videoId = /video\/embed\/([^/]+)/.exec(pathname)?.[1];
      if (!videoId) {
        return null;
      }

      const videoData = await VideoHelper.mailru.getVideoData(videoId);
      if (!videoData) {
        return null;
      }

      return videoData.meta.url.replace("//my.mail.ru/", "");
    }
    case VideoService.bitchute:
      return /(video|embed)\/([^/]+)/.exec(url.pathname)?.[2];
    case VideoService.eporner:
      // ! LINK SHOULD BE LIKE THIS eporner.com/video-XXXXXXXXX/isdfsd-dfjsdfjsdf-dsfsdf-dsfsda-dsad-ddsd
      return /video-([^/]+)\/([^/]+)/.exec(url.pathname)?.[0];
    case VideoService.peertube:
      return /\/w\/([^/]+)/.exec(url.pathname)?.[0];
    case VideoService.dailymotion: {
      return url.hostname === "dai.ly"
        ? url.pathname.slice(1)
        : /video\/([^/]+)/.exec(url.pathname)?.[1];
    }
    case VideoService.trovo: {
      const vid = url.searchParams.get("vid");
      if (!vid) {
        return null;
      }

      const path = /([^/]+)\/([\d]+)/.exec(url.pathname)?.[0];
      if (!path) {
        return null;
      }

      return `${path}?vid=${vid}`;
    }
    case VideoService.yandexdisk:
      return /\/i\/([^/]+)/.exec(url.pathname)?.[1];
    case VideoService.okru: {
      return /\/video\/(\d+)/.exec(url.pathname)?.[1];
    }
    case VideoService.googledrive:
      return /\/file\/d\/([^/]+)/.exec(url.pathname)?.[1];
    case VideoService.bannedvideo: {
      return url.searchParams.get("id");
    }
    case VideoService.weverse:
      return /([^/]+)\/(live|media)\/([^/]+)/.exec(url.pathname)?.[3];
    case VideoService.newgrounds:
      return /([^/]+)\/(view)\/([^/]+)/.exec(url.pathname)?.[0];
    case VideoService.egghead:
      return url.pathname.slice(1);
    case VideoService.youku:
      return /v_show\/id_[\w=]+/.exec(url.pathname)?.[0];
    case VideoService.archive:
      return /(details|embed)\/([^/]+)/.exec(url.pathname)?.[2];
    case VideoService.kodik:
      return /\/(seria|video)\/([^/]+)\/([^/]+)\/([\d]+)p/.exec(
        url.pathname,
      )?.[0] as Kodik.Path;
    case VideoService.patreon: {
      const fullPostId = /posts\/([^/]+)/.exec(url.pathname)?.[1];
      if (!fullPostId) {
        return undefined;
      }

      return fullPostId.replace(/[^\d.]/g, "");
    }
    case VideoService.reddit:
      return /\/r\/(([^/]+)\/([^/]+)\/([^/]+)\/([^/]+))/.exec(
        url.pathname,
      )?.[1];
    case VideoService.kick: {
      const videoId = /video\/([^/]+)/.exec(url.pathname)?.[0];
      if (videoId) {
        return videoId;
      }

      return url.searchParams.get("clip");
    }
    case VideoService.appledeveloper: {
      return /videos\/play\/([^/]+)\/([\d]+)/.exec(url.pathname)?.[0];
    }
    default:
      return undefined;
  }
}

export async function getVideoData(url: string): Promise<VideoData> {
  const service = getService(url);
  if (!service) {
    throw new VideoDataError(`URL: "${url}" is unknown service`);
  }

  const videoId = await getVideoID(service, url);
  if (!videoId) {
    throw new VideoDataError(`Entered unsupported link: "${url}"`);
  }

  if (service.host === VideoService.peertube) {
    service.url = new URL(url).origin; // set the url of the current site for peertube
  }

  if (service.rawResult) {
    return {
      url: videoId,
      videoId,
      host: service.host,
      duration: undefined,
    };
  }

  if (!service.needExtraData) {
    return {
      url: service.url + videoId,
      videoId,
      host: service.host,
      duration: undefined,
    };
  }

  const result =
    await VideoHelper[service.host as VideoService.weverse].getVideoData(
      videoId,
    );
  if (!result) {
    throw new VideoDataError(`Failed to get video raw url for ${service.host}`);
  }

  return {
    ...result,
    videoId,
    host: service.host,
  };
}

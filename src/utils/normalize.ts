import sites from "../config/sites";
import { ServiceConf, VideoService } from "../types/yandex";
import { VideoHelper } from "./helpers";

class NormalizeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NormalizeError";
    this.message = message;
  }
}

function getService(videoUrl: string) {
  if (videoUrl.startsWith("file://")) return false;

  let enteredURL: URL;
  try {
    enteredURL = new URL(videoUrl) as URL;
  } catch (e) {
    console.error(`Invalid URL: ${videoUrl}. Have you forgotten https?`);
    return false;
  }

  if (enteredURL.pathname.endsWith(".mp4")) {
    return {
      host: VideoService.custom,
    } as ServiceConf;
  }

  const hostname = enteredURL.hostname;

  const isMathes = (match: any) => {
    if (match instanceof RegExp) {
      return match.test(hostname);
    } else if (typeof match === "string") {
      return hostname.includes(match);
    } else if (typeof match === "function") {
      return match(enteredURL);
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

async function getVideoID(
  service: ServiceConf,
  videoURL: string,
): Promise<string | null | undefined> {
  const url = new URL(videoURL);
  switch (service.host) {
    case VideoService.custom:
      return url.href;
    case VideoService.piped:
    case VideoService.invidious:
    case VideoService.youtube:
      if (url.hostname === "youtu.be") {
        url.search = `?v=${url.pathname.replace("/", "")}`;
        url.pathname = "/watch";
      }

      return (
        url.pathname.match(/(?:watch|embed|shorts)\/([^/]+)/)?.[1] ||
        url.searchParams.get("v")
      );
    case VideoService.vk: {
      const pathID = url.pathname.match(/^\/video-?[0-9]{8,9}_[0-9]{9}$/);
      const paramZ = url.searchParams.get("z");
      const paramOID = url.searchParams.get("oid");
      const paramID = url.searchParams.get("id");
      if (pathID) {
        return (pathID as RegExpMatchArray)[0].slice(1);
      } else if (paramZ) {
        return (paramZ as string).split("/")[0];
      } else if (paramOID && paramID) {
        return `video-${Math.abs(parseInt(paramOID))}_${paramID}`;
      }

      return null;
    }
    case VideoService.nine_gag:
    case VideoService.gag:
      return url.pathname.match(/gag\/([^/]+)/)?.[1];
    case VideoService.twitch: {
      const clipPath = url.pathname.match(/([^/]+)\/(?:clip)\/([^/]+)/);
      const isClipsDomain = /^clips\.twitch\.tv$/.test(url.hostname);
      if (/^m\.twitch\.tv$/.test(url.hostname)) {
        return url.href.match(/videos\/([^/]+)/)?.[0] || url.pathname.slice(1);
      } else if (/^player\.twitch\.tv$/.test(url.hostname)) {
        return `videos/${url.searchParams.get("video")}`;
      } else if (isClipsDomain) {
        const pathname = url.pathname.slice(1);
        const isEmbed = pathname === "embed";
        const res = await fetch(
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
        const channelLink = content.match(
          /"url":"https:\/\/www\.twitch\.tv\/([^"]+)"/,
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

      return url.pathname.match(/(?:videos)\/([^/]+)/)?.[0];
    }
    case VideoService.proxitok:
    case VideoService.tiktok:
      return url.pathname.match(/([^/]+)\/video\/([^/]+)/)?.[0];
    case VideoService.vimeo: {
      const appId = url.searchParams.get("app_id");
      const videoId =
        url.pathname.match(/[^/]+\/[^/]+$/)?.[0] ||
        url.pathname.match(/[^/]+$/)?.[0];

      return appId ? `${videoId}?app_id=${appId}` : videoId;
    }
    case VideoService.xvideos:
      return url.pathname.match(/[^/]+\/[^/]+$/)?.[0];
    case VideoService.pornhub:
      return (
        url.searchParams.get("viewkey") ||
        url.pathname.match(/embed\/([^/]+)/)?.[1]
      );
    case VideoService.twitter:
      return url.pathname.match(/status\/([^/]+)/)?.[1];
    case VideoService.rumble:
    case VideoService.facebook:
      return url.pathname.slice(1);
    case VideoService.rutube:
      return url.pathname.match(/(?:video|embed)\/([^/]+)/)?.[1];
    case VideoService.bilibili: {
      const bvid = url.searchParams.get("bvid");
      if (bvid) {
        return bvid;
      }

      let vid = url.pathname.match(/video\/([^/]+)/)?.[1];
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

      const videoId = pathname.match(/video\/embed\/([^/]+)/)?.[1];
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
      return url.pathname.match(/(video|embed)\/([^/]+)/)?.[2];
    case VideoService.eporner:
      // ! LINK SHOULD BE LIKE THIS eporner.com/video-XXXXXXXXX/isdfsd-dfjsdfjsdf-dsfsdf-dsfsda-dsad-ddsd
      return url.pathname.match(/video-([^/]+)\/([^/]+)/)?.[0];
    case VideoService.peertube:
      return url.pathname.match(/\/w\/([^/]+)/)?.[0];
    case VideoService.dailymotion: {
      return url.hostname === "dai.ly"
        ? url.pathname.slice(1)
        : url.pathname.match(/video\/([^/]+)/)?.[1];
    }
    case VideoService.trovo: {
      const vid = url.searchParams.get("vid");
      if (!vid) {
        return null;
      }

      const path = url.pathname.match(/([^/]+)\/([\d]+)/)?.[0];
      if (!path) {
        return null;
      }

      return `${path}?vid=${vid}`;
    }
    case VideoService.yandexdisk:
      return url.pathname.match(/\/i\/([^/]+)/)?.[1];
    case VideoService.okru: {
      return url.pathname.match(/\/video\/(\d+)/)?.[1];
    }
    case VideoService.googledrive:
      return url.pathname.match(/\/file\/d\/([^/]+)/)?.[1];
    case VideoService.bannedvideo: {
      const videoId = url.searchParams.get("id");
      const res = await fetch(`${service.url}${videoId}`);

      const content = await res.text();

      // get og:video from meta
      return content.match(
        /https:\/\/download.assets.video\/videos\/([^.]+).mp4/,
      )?.[0];
    }
    case VideoService.weverse: {
      const postId = url.pathname.match(/([^/]+)\/(live|media)\/([^/]+)/)?.[3];
      if (!postId) {
        return undefined;
      }

      const result = await VideoHelper.weverse.getVideoData(postId);
      return result ? result.url : undefined;
    }
    case VideoService.newgrounds:
      return url.pathname.match(/([^/]+)\/(view)\/([^/]+)/)?.[0];
    case VideoService.egghead:
      return url.pathname.slice(1);
    case VideoService.youku:
      return url.pathname.match(/v_show\/id_[\w=]+/)?.[0];
    case VideoService.custom:
      return url.pathname + url.search;
    default:
      return undefined;
  }
}

async function normalize(url: string): Promise<string> {
  const service = getService(url);
  if (!service) {
    throw new NormalizeError(`URL: "${url}" is unknown service`);
  }

  let videoId = await getVideoID(service, url);
  if (!videoId) {
    throw new NormalizeError(`Entered unsupported link: "${url}"`);
  }

  if ([VideoService.peertube].includes(service.host)) {
    service.url = new URL(url).origin; // set the url of the current site for peertube and directlink
  }

  return [
    VideoService.weverse,
    VideoService.bannedvideo,
    VideoService.custom,
  ].includes(service.host)
    ? videoId
    : `${service.url}${videoId}`;
}

export { normalize };

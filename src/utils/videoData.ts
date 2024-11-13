import sites from "../config/sites";
import { ServiceConf, VideoService } from "../types/yandex";
import VideoHelper, {
  availableHelpers,
  AvailableVideoHelpers,
} from "../helpers";
import { GetVideoDataOpts, VideoData } from "../types/client";
import Logger from "./logger";

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
  } catch {
    Logger.error(`Invalid URL: ${videoUrl}. Have you forgotten https?`);
    return false;
  }

  const hostname = enteredURL.hostname;
  const isMathes = (match: unknown) => {
    if (match instanceof RegExp) {
      return match.test(hostname);
    } else if (typeof match === "string") {
      return hostname.includes(match);
    } else if (typeof match === "function") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
  opts: GetVideoDataOpts = {},
): Promise<string | null | undefined> {
  // fix type mismatch
  const url = new URL(videoURL) as URL;
  const serviceHost = service.host;
  if (Object.keys(availableHelpers).includes(serviceHost)) {
    const helper = new VideoHelper(opts).getHelper(
      serviceHost as keyof AvailableVideoHelpers,
    );
    return await helper.getVideoId(url);
  }

  switch (serviceHost) {
    case VideoService.custom:
      return url.href;
    case VideoService.piped:
    case VideoService.poketube:
    case VideoService.invidious:
    case VideoService.ricktube:
    case VideoService.youtube:
      if (url.hostname === "youtu.be") {
        url.search = `?v=${url.pathname.replace("/", "")}`;
        url.pathname = "/watch";
      }

      return (
        /(?:watch|embed|shorts|live)\/([^/]+)/.exec(url.pathname)?.[1] ??
        url.searchParams.get("v")
      );
    default:
      return undefined;
  }
}

export async function getVideoData(
  url: string,
  opts: GetVideoDataOpts = {},
): Promise<VideoData> {
  const service = getService(url);
  if (!service) {
    throw new VideoDataError(`URL: "${url}" is unknown service`);
  }

  const videoId = await getVideoID(service, url, opts);
  if (!videoId) {
    throw new VideoDataError(`Entered unsupported link: "${url}"`);
  }

  const origin = new URL(url).origin;
  if (
    [VideoService.peertube, VideoService.coursehunterLike].includes(
      service.host,
    )
  ) {
    service.url = origin; // set the url of the current site for peertube
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

  const helper = new VideoHelper({
    ...opts,
    service,
    origin,
  }).getHelper(service.host as keyof AvailableVideoHelpers);
  const result = await helper.getVideoData(videoId);
  if (!result) {
    throw new VideoDataError(`Failed to get video raw url for ${service.host}`);
  }

  return {
    ...result,
    videoId,
    host: service.host,
  };
}

import { VideoService as CoreVideoService } from "@vot.js/core/types/service";
import type { VideoData } from "@vot.js/core/types/client";
import { VideoDataError, localLinkRe } from "@vot.js/core/utils/videoData";

import sites from "../data/sites";
import { type ServiceConf, VideoService } from "../types/service";
import type { GetVideoDataOpts } from "../types/client";
import VideoHelper, {
  availableHelpers,
  type AvailableVideoHelpers,
} from "../helpers";

export function getService() {
  if (localLinkRe.exec(window.location.href)) {
    return [];
  }

  const hostname = window.location.hostname;
  const enteredURL = new URL(window.location.href);
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

  return sites.filter((e) => {
    return (
      (Array.isArray(e.match) ? e.match.some(isMathes) : isMathes(e.match)) &&
      e.host &&
      e.url
    );
  });
}

export async function getVideoID(
  service: ServiceConf,
  opts: GetVideoDataOpts = {},
) {
  const url = new URL(window.location.href);
  const serviceHost = service.host;
  if (Object.keys(availableHelpers).includes(serviceHost)) {
    const helper = new VideoHelper(opts).getHelper(
      serviceHost as keyof AvailableVideoHelpers,
    );
    return await helper.getVideoId(url);
  }
  return serviceHost === CoreVideoService.custom ? url.href : undefined;
}

export async function getVideoData(
  service: ServiceConf,
  opts: GetVideoDataOpts = {},
): Promise<VideoData<VideoService>> {
  const videoId = await getVideoID(service, opts);
  if (!videoId) {
    throw new VideoDataError(`Entered unsupported link: "${service.host}"`);
  }

  const origin = window.location.origin;
  if (
    [
      CoreVideoService.peertube,
      CoreVideoService.coursehunterLike,
      CoreVideoService.cloudflarestream,
    ].includes(service.host as CoreVideoService)
  ) {
    service.url = origin; // set the url of the current site
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

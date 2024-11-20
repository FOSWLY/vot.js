import { VideoService as CoreVideoService } from "@vot.js/core/types/service";
import { VideoDataError, localLinkRe } from "@vot.js/core/utils/videoData";
import sites from "../data/sites";
import VideoHelper, { availableHelpers } from "../helpers";
export function getService() {
  if (localLinkRe.exec(window.location.href)) {
    return [];
  }
  const hostname = window.location.hostname;
  const enteredURL = new URL(window.location.href);
  const isMathes = (match) => {
    if (match instanceof RegExp) {
      return match.test(hostname);
    } else if (typeof match === "string") {
      return hostname.includes(match);
    } else if (typeof match === "function") {
      return match(enteredURL);
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
export async function getVideoID(service, video, opts = {}) {
  const url = new URL(window.location.href);
  const serviceHost = service.host;
  if (Object.keys(availableHelpers).includes(serviceHost)) {
    const helper = new VideoHelper(opts).getHelper(serviceHost);
    return await helper.getVideoId(url);
  }
  return serviceHost === CoreVideoService.custom ? url.href : undefined;
}
export async function getVideoData(service, video, opts = {}) {
  const videoId = await getVideoID(service, video, opts);
  if (!videoId) {
    throw new VideoDataError(`Entered unsupported link: "${service.host}"`);
  }
  const origin = window.location.origin;
  if (
    [CoreVideoService.peertube, CoreVideoService.coursehunterLike].includes(
      service.host,
    )
  ) {
    service.url = origin;
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
  }).getHelper(service.host);
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

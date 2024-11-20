import { VideoService as CoreVideoService } from "@vot.js/core/types/service";
import { VideoDataError, localLinkRe } from "@vot.js/core/utils/videoData";
import Logger from "@vot.js/shared/utils/logger";
import sites from "../data/sites";
import VideoHelper, { availableHelpers } from "../helpers";
export function getService(videoUrl) {
  if (localLinkRe.exec(videoUrl)) {
    return false;
  }
  let enteredURL;
  try {
    enteredURL = new URL(videoUrl);
  } catch {
    Logger.error(`Invalid URL: ${videoUrl}. Have you forgotten https?`);
    return false;
  }
  const hostname = enteredURL.hostname;
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
  return sites.find((e) => {
    return (
      (Array.isArray(e.match) ? e.match.some(isMathes) : isMathes(e.match)) &&
      e.host &&
      e.url
    );
  });
}
export async function getVideoID(service, videoURL, opts = {}) {
  const url = new URL(videoURL);
  const serviceHost = service.host;
  if (Object.keys(availableHelpers).includes(serviceHost)) {
    const helper = new VideoHelper(opts).getHelper(serviceHost);
    return await helper.getVideoId(url);
  }
  return serviceHost === CoreVideoService.custom ? url.href : undefined;
}
export async function getVideoData(url, opts = {}) {
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

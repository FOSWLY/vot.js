import sites from "../config/sites.js";
import { VideoService } from "../types/yandex.js";
import VideoHelper, { availableHelpers, } from "../helpers/index.js";
import Logger from "./logger.js";
class VideoDataError extends Error {
    constructor(message) {
        super(message);
        this.name = "VideoDataError";
        this.message = message;
    }
}
export function getService(videoUrl) {
    if (/(file:\/\/|(http(s)?:\/\/)(127\.0\.0\.1|localhost))/.exec(videoUrl))
        return false;
    let enteredURL;
    try {
        enteredURL = new URL(videoUrl);
    }
    catch {
        Logger.error(`Invalid URL: ${videoUrl}. Have you forgotten https?`);
        return false;
    }
    const hostname = enteredURL.hostname;
    const isMathes = (match) => {
        if (match instanceof RegExp) {
            return match.test(hostname);
        }
        else if (typeof match === "string") {
            return hostname.includes(match);
        }
        else if (typeof match === "function") {
            return match(enteredURL);
        }
        return false;
    };
    return sites.find((e) => {
        return ((Array.isArray(e.match) ? e.match.some(isMathes) : isMathes(e.match)) &&
            e.host &&
            e.url);
    });
}
export async function getVideoID(service, videoURL, opts = {}) {
    const url = new URL(videoURL);
    const serviceHost = service.host;
    if (Object.keys(availableHelpers).includes(serviceHost)) {
        const helper = new VideoHelper(opts).getHelper(serviceHost);
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
            return (/(?:watch|embed|shorts|live)\/([^/]+)/.exec(url.pathname)?.[1] ??
                url.searchParams.get("v"));
        default:
            return undefined;
    }
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
    if ([VideoService.peertube, VideoService.coursehunterLike].includes(service.host)) {
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

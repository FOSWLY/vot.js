import { VideoService } from "../types/service";

/**
 * Convert vot.js data to vot-backend compatible data
 */
export function convertVOT<T extends string = VideoService>(
  service: T,
  videoId: string | number,
  url: string,
) {
  if (service === VideoService.patreon) {
    return {
      service: "mux",
      videoId: new URL(url).pathname.slice(1),
    };
  }

  return {
    service,
    videoId,
  };
}

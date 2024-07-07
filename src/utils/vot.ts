import { VideoService } from "../types/yandex";

/**
 * Convert vot.js data to vot-backend compatible data
 */
export function convertVOT(
  service: VideoService,
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

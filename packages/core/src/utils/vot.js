import { VideoService } from "../types/service";
export function convertVOT(service, videoId, url) {
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

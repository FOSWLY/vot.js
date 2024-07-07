import { VideoService } from "../types/yandex.js";
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

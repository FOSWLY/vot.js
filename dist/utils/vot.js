import { VideoService } from "../types/yandex";
/**
 * Convert vot.js service to vot-backend compatible service
 */
export function convertService(service) {
    return service === VideoService.patreon ? "mux" : service;
}

import { RequestHeaders, RequestLang, ResponseLang, VideoService } from "./yandex.js";
export type TranslationStatus = "success" | "waiting" | "parted" | "failed";
export type TranslationProvider = "yandex";
export type VideoTranslationVOTOpts = {
    url: string;
    videoId: string;
    service: VideoService;
    requestLang?: RequestLang;
    responseLang?: ResponseLang;
    headers?: RequestHeaders;
};
export type TranslationWaitingResponse = {
    status: "waiting";
    remainingTime: number;
    message: string;
};
export type TranslationSuccessResponse = {
    id: number;
    status: "success";
    provider: TranslationProvider;
    translatedUrl: string;
    message: string;
    createdAt: string;
};
export type TranslationFailedResponse = {
    id: number;
    status: "failed";
    provider: TranslationProvider;
    translatedUrl: null;
    message: string;
    createdAt: string;
};
export type TranslationResponse = TranslationWaitingResponse | TranslationSuccessResponse | TranslationFailedResponse;
//# sourceMappingURL=vot.d.ts.map
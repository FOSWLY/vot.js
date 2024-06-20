export type TranslationHelp = {
    target: "video_file_url" | "subtitles_file_url";
    targetUrl: string;
};
export type RequestHeaders = Record<string, any>;
export type RequestLang = "auto" | "ru" | "en" | "zh" | "ko" | "lt" | "lv" | "ar" | "fr" | "it" | "es" | "de" | "ja";
export type ResponseLang = "ru" | "en" | "kk";
export declare enum VideoService {
    custom = "custom",
    directlink = "custom",
    youtube = "youtube",
    piped = "piped",
    invidious = "invidious",
    vk = "vk",
    nine_gag = "nine_gag",
    gag = "nine_gag",
    twitch = "twitch",
    proxitok = "proxitok",
    tiktok = "tiktok",
    vimeo = "vimeo",
    xvideos = "xvideos",
    pornhub = "pornhub",
    twitter = "twitter",
    rumble = "rumble",
    facebook = "facebook",
    rutube = "rutube",
    coub = "coub",
    bilibili = "bilibili",
    mail_ru = "mailru",
    mailru = "mailru",
    bitchute = "bitchute",
    eporner = "eporner",
    peertube = "peertube",
    dailymotion = "dailymotion",
    trovo = "trovo",
    yandexdisk = "yandexdisk",
    ok_ru = "okru",
    okru = "okru",
    googledrive = "googledrive",
    bannedvideo = "bannedvideo",
    weverse = "weverse",
    newgrounds = "newgrounds",
    egghead = "egghead",
    youku = "youku",
    kodik = "kodik",
    patreon = "patreon"
}
export type ServiceConf = {
    host: VideoService;
    url?: string;
    match?: any;
};
export declare enum VideoTranslationStatus {
    FAILED = 0,
    FINISHED = 1,
    WAITING = 2,
    LONG_WAITING = 3,
    PART_CONTENT = 5,
    LONG_WAITING_2 = 6
}
export type VideoTranslationOpts = {
    url: string;
    duration?: number;
    requestLang?: RequestLang;
    responseLang?: ResponseLang;
    translationHelp?: TranslationHelp[] | null;
    headers?: RequestHeaders;
};
export type TranslatedVideoTranslationResponse = {
    translated: true;
    url: string;
    remainingTime: number;
};
export type WaitingVideoTranslationResponse = {
    translated: false;
    remainingTime: number;
};
export type VideoTranslationResponse = TranslatedVideoTranslationResponse | WaitingVideoTranslationResponse;
export type VideoSubtitlesOpts = {
    url: string;
    requestLang?: RequestLang;
    headers?: RequestHeaders;
};
export type StreamPingOptions = {
    pingId: number;
    headers?: RequestHeaders;
};
export type StreamTranslationOpts = {
    url: string;
    requestLang?: RequestLang;
    responseLang?: ResponseLang;
    headers?: RequestHeaders;
};
export type StreamTranslationObject = {
    url: string;
    timestamp: number;
};
export type TranslatedStreamTranslationResponse = {
    translated: true;
    interval: number;
    result: StreamTranslationObject;
};
export type WaitingStreamTranslationResponse = {
    translated: false;
    interval: number;
    message: string;
};
export type StreamTranslationResponse = TranslatedStreamTranslationResponse | WaitingStreamTranslationResponse;
//# sourceMappingURL=yandex.d.ts.map
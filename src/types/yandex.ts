import { VideoData } from "./client";
import { availableLangs, availableTTS } from "../consts";

export type TranslationHelpTarget = "video_file_url" | "subtitles_file_url";
export type SessionModule = "video-translation" | "summarization";

export type TranslationHelp = {
  target: TranslationHelpTarget;
  targetUrl: string;
};

export type RequestHeaders = Record<string, any>;
export type RequestLang = (typeof availableLangs)[number];
export type ResponseLang = (typeof availableTTS)[number];

export enum VideoService {
  custom = "custom",
  directlink = custom,
  youtube = "youtube",
  piped = "piped",
  invidious = "invidious",
  vk = "vk",
  nine_gag = "nine_gag",
  gag = nine_gag,
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
  mailru = mail_ru,
  bitchute = "bitchute",
  eporner = "eporner",
  peertube = "peertube",
  dailymotion = "dailymotion",
  trovo = "trovo",
  yandexdisk = "yandexdisk",
  ok_ru = "okru",
  okru = ok_ru,
  googledrive = "googledrive",
  bannedvideo = "bannedvideo",
  weverse = "weverse",
  newgrounds = "newgrounds",
  egghead = "egghead",
  youku = "youku",
  archive = "archive",
  kodik = "kodik",
  patreon = "patreon",
  reddit = "reddit",
  kick = "kick",
  apple_developer = "apple_developer",
  appledeveloper = apple_developer,
  poketube = "poketube",
  epicgames = "epicgames",
  nineanimetv = "nineanimetv",
  odysee = "odysee",
}

export type ServiceConf = {
  host: VideoService;
  url?: string;
  match?: any;
  rawResult?: true;
  needExtraData?: true;
};

export enum VideoTranslationStatus {
  FAILED = 0,
  FINISHED = 1,
  WAITING = 2,
  LONG_WAITING = 3,
  PART_CONTENT = 5,
  LONG_WAITING_2 = 6,
}

export type VideoTranslationOpts = {
  videoData: VideoData;
  requestLang?: RequestLang;
  responseLang?: ResponseLang;
  translationHelp?: TranslationHelp[] | null;
  headers?: RequestHeaders;
};

export type TranslatedVideoTranslationResponse = {
  translated: true;
  url: string;
  remainingTime: number;
  message?: string;
};

export type WaitingVideoTranslationResponse = {
  translated: false;
  remainingTime: number;
  message?: string;
};

export type VideoTranslationResponse =
  | TranslatedVideoTranslationResponse
  | WaitingVideoTranslationResponse;

export type VideoSubtitlesOpts = {
  videoData: VideoData;
  requestLang?: RequestLang;
  headers?: RequestHeaders;
};

export type StreamPingOptions = {
  pingId: number;
  headers?: RequestHeaders;
};

export type StreamTranslationOpts = {
  videoData: VideoData;
  requestLang?: RequestLang;
  responseLang?: ResponseLang;
  headers?: RequestHeaders;
};

export type StreamTranslationObject = {
  url: string;
  timestamp: string;
};

export type TranslatedStreamTranslationResponse = {
  translated: true;
  interval: number;
  result: StreamTranslationObject;
  pingId: number;
};

export type WaitingStreamTranslationResponse = {
  translated: false;
  interval: number;
  message: string;
};

export type StreamTranslationResponse =
  | TranslatedStreamTranslationResponse
  | WaitingStreamTranslationResponse;

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
  x = "twitter",
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
  archive = "archive",
  kodik = "kodik",
  patreon = "patreon",
  reddit = "reddit",
  kick = "kick",
  apple_developer = "apple_developer",
  appledeveloper = "apple_developer",
  poketube = "poketube",
  epicgames = "epicgames",
  nineanimetv = "nineanimetv",
  odysee = "odysee",
  coursehunterLike = "coursehunterLike",
  sap = "sap",
  watchpornto = "watchpornto",
  linkedin = "linkedin",
  ricktube = "ricktube",
  incestflix = "incestflix",
  porntn = "porntn",
  dzen = "dzen",
}
export type ServiceConf<T = VideoService> = {
  host: T;
  url?: string;
  match?: any;
  rawResult?: true;
  needExtraData?: true;
  additionalData?: string;
};
//# sourceMappingURL=service.d.ts.map

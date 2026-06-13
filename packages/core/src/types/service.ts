export enum VideoService {
  custom = "custom",
  directlink = custom,
  youtube = "youtube",
  preservetube = "preservetube",
  piped = "piped",
  invidious = "invidious",
  niconico = "niconico",
  vk = "vk",
  nine_gag = "nine_gag",
  gag = nine_gag,
  twitch = "twitch",
  proxitok = "proxitok",
  tiktok = "tiktok",
  vimeo = "vimeo",
  xvideos = "xvideos",
  xhamster = "xhamster",
  spankbang = "spankbang",
  rule34video = "rule34video",
  picarto = "picarto",
  olympicsreplay = "olympics_replay",
  pornhub = "pornhub",
  twitter = "twitter",
  x = twitter,
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
  weibo = "weibo",
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
  epicgames = "epicgames",
  odysee = "odysee",
  coursehunterLike = "coursehunterLike",
  sap = "sap",
  watchpornto = "watchpornto",
  jove = "jove",
  linkedin = "linkedin",
  incestflix = "incestflix",
  porntn = "porntn",
  dzen = "dzen",
  bunnystream = "bunnystream",
  cloudflarestream = "cloudflarestream",
  loom = "loom",
  rtnews = "rtnews",
  bitview = "bitview",
  thisvid = "thisvid",
  ign = "ign",
  noodlemagazine = "noodlemagazine",
  zdf = "zdf",
  bunkr = "bunkr",
  imdb = "imdb",
  telegram = "telegram",
}

/**
 * A host matcher used to identify which service a URL belongs to.
 */
export type ServiceMatch = RegExp | string | ((enteredUrl: URL) => boolean);

export type ServiceMatchRule = ServiceMatch | ServiceMatch[];

export type ServiceConf<T extends string = VideoService> = {
  host: T;
  url?: string;
  match?: ServiceMatchRule;
  rawResult?: true;
  needExtraData?: true;
  additionalData?: string;
};

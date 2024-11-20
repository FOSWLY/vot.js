import { BaseHelperOpts } from "@vot.js/core/types/helpers/base";
import { ServiceConf } from "../types/service";
import MailRuHelper from "./mailru";
import WeverseHelper from "./weverse";
import KodikHelper from "./kodik";
import PatreonHelper from "./patreon";
import RedditHelper from "./reddit";
import BannedVideoHelper from "./bannedvideo";
import KickHelper from "./kick";
import AppleDeveloperHelper from "./appledeveloper";
import EpicGamesHelper from "./epicgames";
import NineAnimeTVHelper from "./nineanimetv";
import OdyseeHelper from "./odysee";
import CoursehunterLikeHelper from "./coursehunterLike";
import TwitchHelper from "./twitch";
import SapHelper from "./sap";
import LinkedinHelper from "./linkedin";
import VimeoHelper from "./vimeo";
import YandexDiskHelper from "./yandexdisk";
import VKHelper from "./vk";
import TrovoHelper from "./trovo";
import IncestflixHelper from "./incestflix";
import PornTNHelper from "./porntn";
import GoogleDriveHelper from "./googledrive";
import BilibiliHelper from "./bilibili";
import XVideosHelper from "./xvideos";
import WatchPornToHelper from "./watchpornto";
import ArchiveHelper from "./archive";
import DailymotionHelper from "./dailymotion";
import YoukuHelper from "./youku";
import EggheadHelper from "./egghead";
import NewgroundsHelper from "./newgrounds";
import OKRuHelper from "./okru";
import PeertubeHelper from "./peertube";
import EpornerHelper from "./eporner";
import BitchuteHelper from "./bitchute";
import RutubeHelper from "./rutube";
import FacebookHelper from "./facebook";
import RumbleHelper from "./rumble";
import TwitterHelper from "./twitter";
import PornhubHelper from "./pornhub";
import TikTokHelper from "./tiktok";
import NineGAGHelper from "./nine_gag";
import YoutubeHelper from "./youtube";
import DzenHelper from "./dzen";
export * as MailRuHelper from "./mailru";
export * as WeverseHelper from "./weverse";
export * as KodikHelper from "./kodik";
export * as PatreonHelper from "./patreon";
export * as RedditHelper from "./reddit";
export * as BannedVideoHelper from "./bannedvideo";
export * as KickHelper from "./kick";
export * as AppleDeveloperHelper from "./appledeveloper";
export * as EpicGamesHelper from "./epicgames";
export * as NineAnimeTVHelper from "./nineanimetv";
export * as OdyseeHelper from "./odysee";
export * as CoursehunterLikeHelper from "./coursehunterLike";
export * as TwitchHelper from "./twitch";
export * as SapHelper from "./sap";
export * as LinkedinHelper from "./linkedin";
export * as VimeoHelper from "./vimeo";
export * as YandexDiskHelper from "./yandexdisk";
export * as VKHelper from "./vk";
export * as TrovoHelper from "./trovo";
export * as IncestflixHelper from "./incestflix";
export * as PornTNHelper from "./porntn";
export * as GoogleDriveHelper from "./googledrive";
export * as BilibiliHelper from "./bilibili";
export * as XVideosHelper from "./xvideos";
export * as WatchPornToHelper from "./watchpornto";
export * as ArchiveHelper from "./archive";
export * as DailymotionHelper from "./dailymotion";
export * as YoukuHelper from "./youku";
export * as EggheadHelper from "./egghead";
export * as NewgroundsHelper from "./newgrounds";
export * as OKRuHelper from "./okru";
export * as PeertubeHelper from "./peertube";
export * as EpornerHelper from "./eporner";
export * as BitchuteHelper from "./bitchute";
export * as RutubeHelper from "./rutube";
export * as FacebookHelper from "./facebook";
export * as RumbleHelper from "./rumble";
export * as TwitterHelper from "./twitter";
export * as PornhubHelper from "./pornhub";
export * as TikTokHelper from "./tiktok";
export * as NineGAGHelper from "./nine_gag";
export * as YoutubeHelper from "./youtube";
export * as DzenHelper from "./dzen";
export declare const availableHelpers: {
  mailru: typeof MailRuHelper;
  weverse: typeof WeverseHelper;
  kodik: typeof KodikHelper;
  patreon: typeof PatreonHelper;
  reddit: typeof RedditHelper;
  bannedvideo: typeof BannedVideoHelper;
  kick: typeof KickHelper;
  apple_developer: typeof AppleDeveloperHelper;
  epicgames: typeof EpicGamesHelper;
  nineanimetv: typeof NineAnimeTVHelper;
  odysee: typeof OdyseeHelper;
  coursehunterLike: typeof CoursehunterLikeHelper;
  twitch: typeof TwitchHelper;
  sap: typeof SapHelper;
  linkedin: typeof LinkedinHelper;
  vimeo: typeof VimeoHelper;
  yandexdisk: typeof YandexDiskHelper;
  vk: typeof VKHelper;
  trovo: typeof TrovoHelper;
  incestflix: typeof IncestflixHelper;
  porntn: typeof PornTNHelper;
  googledrive: typeof GoogleDriveHelper;
  bilibili: typeof BilibiliHelper;
  xvideos: typeof XVideosHelper;
  watchpornto: typeof WatchPornToHelper;
  archive: typeof ArchiveHelper;
  dailymotion: typeof DailymotionHelper;
  youku: typeof YoukuHelper;
  egghead: typeof EggheadHelper;
  newgrounds: typeof NewgroundsHelper;
  okru: typeof OKRuHelper;
  peertube: typeof PeertubeHelper;
  eporner: typeof EpornerHelper;
  bitchute: typeof BitchuteHelper;
  rutube: typeof RutubeHelper;
  facebook: typeof FacebookHelper;
  rumble: typeof RumbleHelper;
  twitter: typeof TwitterHelper;
  pornhub: typeof PornhubHelper;
  tiktok: typeof TikTokHelper;
  proxitok: typeof TikTokHelper;
  nine_gag: typeof NineGAGHelper;
  youtube: typeof YoutubeHelper;
  ricktube: typeof YoutubeHelper;
  invidious: typeof YoutubeHelper;
  poketube: typeof YoutubeHelper;
  piped: typeof YoutubeHelper;
  dzen: typeof DzenHelper;
};
export type AvailableVideoHelpers = typeof availableHelpers;
export default class VideoHelper {
  helpersData: BaseHelperOpts<ServiceConf>;
  constructor(helpersData?: BaseHelperOpts<ServiceConf>);
  getHelper<K extends keyof AvailableVideoHelpers>(
    service: K,
  ): AvailableVideoHelpers[K]["prototype"];
}
//# sourceMappingURL=index.d.ts.map
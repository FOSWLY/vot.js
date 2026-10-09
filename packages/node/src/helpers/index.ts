import type { BaseHelperOpts } from "@vot.js/core/types/helpers/base";
import { VideoService as CoreVideoService } from "@vot.js/core/types/service";

import type { ServiceConf } from "../types/service";
import { coreHelpers } from "@vot.js/core/helpers";
import AppleDeveloperHelper from "./appledeveloper";
import ArchiveHelper from "./archive";
import BannedVideoHelper from "./bannedvideo";
import BilibiliHelper from "./bilibili";
import BitviewHelper from "./bitview";
import BunkrHelper from "./bunkr";
import CoursehunterLikeHelper from "./coursehunterLike";
import DailymotionHelper from "./dailymotion";
import EpicGamesHelper from "./epicgames";
import GoogleDriveHelper from "./googledrive";
import IgnHelper from "./ign";
import KinopoiskHelper from "./kinopoisk";
import JoveHelper from "./jove";
import KickHelper from "./kick";
import KodikHelper from "./kodik";
import LinkedinHelper from "./linkedin";
import LoomHelper from "./loom";
import MailRuHelper from "./mailru";
import NineGAGHelper from "./nine_gag";
import OdyseeHelper from "./odysee";
import PatreonHelper from "./patreon";
import PornTNHelper from "./porntn";
import RedditHelper from "./reddit";
import RtNewsHelper from "./rtnews";
import SapHelper from "./sap";
import TelegramHelper from "./telegram";
import TwitchHelper from "./twitch";
import TwitterHelper from "./twitter";
import VimeoHelper from "./vimeo";
import VKHelper from "./vk";
import YandexDiskHelper from "./yandexdisk";
import YoutubeHelper from "./youtube";
import JOIDatabaseHelper from "./joidatabase";

// Re-export the shared helper namespaces + registry so `@vot.js/node/helpers` stays a complete barrel.
export * from "@vot.js/core/helpers";
export * as AppleDeveloperHelper from "./appledeveloper";
export * as ArchiveHelper from "./archive";
export * as BannedVideoHelper from "./bannedvideo";
export * as BilibiliHelper from "./bilibili";
export * as BitviewHelper from "./bitview";
export * as BunkrHelper from "./bunkr";
export * as CoursehunterLikeHelper from "./coursehunterLike";
export * as DailymotionHelper from "./dailymotion";
export * as EpicGamesHelper from "./epicgames";
export * as GoogleDriveHelper from "./googledrive";
export * as IgnHelper from "./ign";
export * as KinopoiskHelper from "./kinopoisk";
export * as JoveHelper from "./jove";
export * as KickHelper from "./kick";
export * as KodikHelper from "./kodik";
export * as LinkedinHelper from "./linkedin";
export * as LoomHelper from "./loom";
export * as MailRuHelper from "./mailru";
export * as NineGAGHelper from "./nine_gag";
export * as OdyseeHelper from "./odysee";
export * as PatreonHelper from "./patreon";
export * as PornTNHelper from "./porntn";
export * as RedditHelper from "./reddit";
export * as RtNewsHelper from "./rtnews";
export * as SapHelper from "./sap";
export * as TelegramHelper from "./telegram";
export * as TwitchHelper from "./twitch";
export * as TwitterHelper from "./twitter";
export * as VimeoHelper from "./vimeo";
export * as VKHelper from "./vk";
export * as YandexDiskHelper from "./yandexdisk";
export * as YoutubeHelper from "./youtube";
export * as JOIDatabaseHelper from "./joidatabase";

export const availableHelpers = {
  // shared, environment-agnostic helpers (see @vot.js/core/helpers)
  ...coreHelpers,
  // runtime-specific helpers; entries below override core ones
  [CoreVideoService.mailru]: MailRuHelper,
  [CoreVideoService.kodik]: KodikHelper,
  [CoreVideoService.patreon]: PatreonHelper,
  [CoreVideoService.reddit]: RedditHelper,
  [CoreVideoService.bannedvideo]: BannedVideoHelper,
  [CoreVideoService.kick]: KickHelper,
  [CoreVideoService.appledeveloper]: AppleDeveloperHelper,
  [CoreVideoService.epicgames]: EpicGamesHelper,
  [CoreVideoService.odysee]: OdyseeHelper,
  [CoreVideoService.coursehunterLike]: CoursehunterLikeHelper,
  [CoreVideoService.twitch]: TwitchHelper,
  [CoreVideoService.sap]: SapHelper,
  [CoreVideoService.jove]: JoveHelper,
  [CoreVideoService.linkedin]: LinkedinHelper,
  [CoreVideoService.vimeo]: VimeoHelper,
  [CoreVideoService.yandexdisk]: YandexDiskHelper,
  [CoreVideoService.vk]: VKHelper,
  [CoreVideoService.porntn]: PornTNHelper,
  [CoreVideoService.googledrive]: GoogleDriveHelper,
  [CoreVideoService.bilibili]: BilibiliHelper,
  [CoreVideoService.archive]: ArchiveHelper,
  [CoreVideoService.dailymotion]: DailymotionHelper,
  [CoreVideoService.twitter]: TwitterHelper,
  [CoreVideoService.nine_gag]: NineGAGHelper,
  [CoreVideoService.youtube]: YoutubeHelper,
  [CoreVideoService.preservetube]: YoutubeHelper,
  [CoreVideoService.invidious]: YoutubeHelper,
  [CoreVideoService.piped]: YoutubeHelper,
  [CoreVideoService.loom]: LoomHelper,
  [CoreVideoService.rtnews]: RtNewsHelper,
  [CoreVideoService.bitview]: BitviewHelper,
  [CoreVideoService.ign]: IgnHelper,
  [CoreVideoService.bunkr]: BunkrHelper,
  [CoreVideoService.kinopoisk]: KinopoiskHelper,
  [CoreVideoService.telegram]: TelegramHelper,
  [CoreVideoService.joidatabase]: JOIDatabaseHelper,
};

export type AvailableVideoHelpers = typeof availableHelpers;

/**
 * A convenient wrapper over the rest of the helpers
 */
export default class VideoHelper {
  helpersData: BaseHelperOpts<ServiceConf>;

  constructor(helpersData: BaseHelperOpts<ServiceConf> = {}) {
    this.helpersData = helpersData;
  }

  getHelper<K extends keyof AvailableVideoHelpers>(
    service: K,
  ): AvailableVideoHelpers[K]["prototype"] {
    return new availableHelpers[service](this.helpersData);
  }
}

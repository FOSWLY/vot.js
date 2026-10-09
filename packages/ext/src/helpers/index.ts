import type { BaseHelperOpts } from "@vot.js/core/types/helpers/base";
import {
  VideoService as CoreVideoService,
  type ServiceConf as CoreServiceConf,
} from "@vot.js/core/types/service";

import { ExtVideoService, type ServiceConf } from "../types/service";

import { coreHelpers } from "@vot.js/core/helpers";
import AppleDeveloperHelper from "./appledeveloper";
import ArchiveHelper from "./archive";
import ArtstationHelper from "./artstation";
import BannedVideoHelper from "./bannedvideo";
import BilibiliHelper from "./bilibili";
import BitviewHelper from "./bitview";
import BunkrHelper from "./bunkr";
import CoursehunterLikeHelper from "./coursehunterLike";
import CourseraHelper from "./coursera";
import DailymotionHelper from "./dailymotion";
import DataCampHelper from "./datacamp";
import DeeplearningAIHelper from "./deeplearningai";
import DouyinHelper from "./douyin";
import DropoutHelper from "./dropout";
import EpicGamesHelper from "./epicgames";
import GoogleDriveHelper from "./googledrive";
import IgnHelper from "./ign";
import KinopoiskHelper from "./kinopoisk";
import JOIDatabaseHelper from "./joidatabase";
import JoveHelper from "./jove";
import KickHelper from "./kick";
import KickstarterHelper from "./kickstarter";
import KodikHelper from "./kodik";
import LinkedinHelper from "./linkedin";
import LoomHelper from "./loom";
import MailRuHelper from "./mailru";
import MediafileHelper from "./mediafile";
import NetacadHelper from "./netacad";
import NineGAGHelper from "./nine_gag";
import NoodleMagazineHelper from "./noodlemagazine";
import OdyseeHelper from "./odysee";
import OracleLearnHelper from "./oraclelearn";
import PatreonHelper from "./patreon";
import PornTNHelper from "./porntn";
import PreserveTubeHelper from "./preservetube";
import RedditHelper from "./reddit";
import RtNewsHelper from "./rtnews";
import SapHelper from "./sap";
import SkilljarHelper from "./skilljar";
import TelegramHelper from "./telegram";
import TwitchHelper from "./twitch";
import TwitterHelper from "./twitter";
import UdemyHelper from "./udemy";
import VimeoHelper from "./vimeo";
import VKHelper from "./vk";
import YandexDiskHelper from "./yandexdisk";
import YoutubeHelper from "./youtube";

// Re-export the shared helper namespaces + registry so `@vot.js/ext/helpers` stays a complete barrel.
export * from "@vot.js/core/helpers";
export * as VideoJSHelper from "../players/videojs";
export * as AppleDeveloperHelper from "./appledeveloper";
export * as ArchiveHelper from "./archive";
export * as ArtstationHelper from "./artstation";
export * as BannedVideoHelper from "./bannedvideo";
export * as BilibiliHelper from "./bilibili";
export * as BitviewHelper from "./bitview";
export * as BunkrHelper from "./bunkr";
export * as CoursehunterLikeHelper from "./coursehunterLike";
export * as CourseraHelper from "./coursera";
export * as DailymotionHelper from "./dailymotion";
export * as DataCampHelper from "./datacamp";
export * as DeeplearningAIHelper from "./deeplearningai";
export * as DouyinHelper from "./douyin";
export * as DropoutHelper from "./dropout";
export * as EpicGamesHelper from "./epicgames";
export * as GoogleDriveHelper from "./googledrive";
export * as IgnHelper from "./ign";
export * as KinopoiskHelper from "./kinopoisk";
export * as JoveHelper from "./jove";
export * as KickHelper from "./kick";
export * as KickstarterHelper from "./kickstarter";
export * as KodikHelper from "./kodik";
export * as LinkedinHelper from "./linkedin";
export * as LoomHelper from "./loom";
export * as MailRuHelper from "./mailru";
export * as MediafileHelper from "./mediafile";
export * as NetacadHelper from "./netacad";
export * as NineGAGHelper from "./nine_gag";
export * as NoodleMagazineHelper from "./noodlemagazine";
export * as OdyseeHelper from "./odysee";
export * as OracleLearnHelper from "./oraclelearn";
export * as PatreonHelper from "./patreon";
export * as PornTNHelper from "./porntn";
export * as PreserveTubeHelper from "./preservetube";
export * as RedditHelper from "./reddit";
export * as RtNewsHelper from "./rtnews";
export * as SapHelper from "./sap";
export * as SkilljarHelper from "./skilljar";
export * as TelegramHelper from "./telegram";
export * as TwitchHelper from "./twitch";
export * as TwitterHelper from "./twitter";
export * as UdemyHelper from "./udemy";
export * as VimeoHelper from "./vimeo";
export * as VKHelper from "./vk";
export * as YandexDiskHelper from "./yandexdisk";
export * as YoutubeHelper from "./youtube";

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
  [CoreVideoService.preservetube]: PreserveTubeHelper,
  [CoreVideoService.invidious]: YoutubeHelper,
  [CoreVideoService.piped]: YoutubeHelper,
  [CoreVideoService.loom]: LoomHelper,
  [CoreVideoService.rtnews]: RtNewsHelper,
  [CoreVideoService.bitview]: BitviewHelper,
  [CoreVideoService.joidatabase]: JOIDatabaseHelper,
  [CoreVideoService.ign]: IgnHelper,
  [CoreVideoService.bunkr]: BunkrHelper,
  [CoreVideoService.kinopoisk]: KinopoiskHelper,
  [CoreVideoService.telegram]: TelegramHelper,
  [CoreVideoService.noodlemagazine]: NoodleMagazineHelper,
  [ExtVideoService.udemy]: UdemyHelper,
  [ExtVideoService.coursera]: CourseraHelper,
  [ExtVideoService.douyin]: DouyinHelper,
  [ExtVideoService.artstation]: ArtstationHelper,
  [ExtVideoService.kickstarter]: KickstarterHelper,
  [ExtVideoService.datacamp]: DataCampHelper,
  [ExtVideoService.oraclelearn]: OracleLearnHelper,
  [ExtVideoService.deeplearningai]: DeeplearningAIHelper,
  [ExtVideoService.netacad]: NetacadHelper,
  [ExtVideoService.mediafile]: MediafileHelper,
  [ExtVideoService.skilljar]: SkilljarHelper,
  [ExtVideoService.dropout]: DropoutHelper,
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
    // Shared core helpers are typed against core services; the conf passed here
    // always belongs to the requested helper, so this narrowing is safe.
    return new availableHelpers[service](
      this.helpersData as BaseHelperOpts<ServiceConf> &
        BaseHelperOpts<CoreServiceConf>,
    );
  }
}

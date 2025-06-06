import type { BaseHelperOpts } from "@vot.js/core/types/helpers/base";
import { VideoService as CoreVideoService } from "@vot.js/core/types/service";

import { ExtVideoService, type ServiceConf } from "../types/service";

import AppleDeveloperHelper from "./appledeveloper";
import ArchiveHelper from "./archive";
import ArtstationHelper from "./artstation";
import BannedVideoHelper from "./bannedvideo";
import BilibiliHelper from "./bilibili";
import BitchuteHelper from "./bitchute";
import BitviewHelper from "./bitview";
import BunkrHelper from "./bunkr";
import CloudflareStreamHelper from "./cloudflarestream";
import CoursehunterLikeHelper from "./coursehunterLike";
import CourseraHelper from "./coursera";
import DailymotionHelper from "./dailymotion";
import DeeplearningAIHelper from "./deeplearningai";
import DouyinHelper from "./douyin";
import DzenHelper from "./dzen";
import EggheadHelper from "./egghead";
import EpicGamesHelper from "./epicgames";
import EpornerHelper from "./eporner";
import FacebookHelper from "./facebook";
import GoogleDriveHelper from "./googledrive";
import IgnHelper from "./ign";
import IMDBHelper from "./imdb";
import IncestflixHelper from "./incestflix";
import KickHelper from "./kick";
import KickstarterHelper from "./kickstarter";
import KodikHelper from "./kodik";
import LinkedinHelper from "./linkedin";
import LoomHelper from "./loom";
import MailRuHelper from "./mailru";
import NewgroundsHelper from "./newgrounds";
import NineGAGHelper from "./nine_gag";
import OdyseeHelper from "./odysee";
import OKRuHelper from "./okru";
import OracleLearnHelper from "./oraclelearn";
import PatreonHelper from "./patreon";
import PeertubeHelper from "./peertube";
import PornhubHelper from "./pornhub";
import PornTNHelper from "./porntn";
import RedditHelper from "./reddit";
import RtNewsHelper from "./rtnews";
import RumbleHelper from "./rumble";
import RutubeHelper from "./rutube";
import SapHelper from "./sap";
import TelegramHelper from "./telegram";
import ThisVidHelper from "./thisvid";
import TikTokHelper from "./tiktok";
import TrovoHelper from "./trovo";
import TwitchHelper from "./twitch";
import TwitterHelper from "./twitter";
import UdemyHelper from "./udemy";
import VimeoHelper from "./vimeo";
import VKHelper from "./vk";
import WatchPornToHelper from "./watchpornto";
import WeverseHelper from "./weverse";
import XVideosHelper from "./xvideos";
import YandexDiskHelper from "./yandexdisk";
import YoukuHelper from "./youku";
import YoutubeHelper from "./youtube";

export * as MailRuHelper from "./mailru";
export * as WeverseHelper from "./weverse";
export * as KodikHelper from "./kodik";
export * as PatreonHelper from "./patreon";
export * as RedditHelper from "./reddit";
export * as BannedVideoHelper from "./bannedvideo";
export * as KickHelper from "./kick";
export * as AppleDeveloperHelper from "./appledeveloper";
export * as EpicGamesHelper from "./epicgames";
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
export * as UdemyHelper from "./udemy";
export * as CourseraHelper from "./coursera";
export * as CloudflareStreamHelper from "./cloudflarestream";
export * as DouyinHelper from "./douyin";
export * as LoomHelper from "./loom";
export * as ArtstationHelper from "./artstation";
export * as RtNewsHelper from "./rtnews";
export * as VideoJSHelper from "./videojs";
export * as BitviewHelper from "./bitview";
export * as KickstarterHelper from "./kickstarter";
export * as ThisVidHelper from "./thisvid";
export * as IgnHelper from "./ign";
export * as BunkrHelper from "./bunkr";
export * as IMDBHelper from "./imdb";
export * as TelegramHelper from "./telegram";
export * as OracleLearnHelper from "./oraclelearn";
export * as DeeplearningAIHelper from "./deeplearningai";

export const availableHelpers = {
  [CoreVideoService.mailru]: MailRuHelper,
  [CoreVideoService.weverse]: WeverseHelper,
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
  [CoreVideoService.linkedin]: LinkedinHelper,
  [CoreVideoService.vimeo]: VimeoHelper,
  [CoreVideoService.yandexdisk]: YandexDiskHelper,
  [CoreVideoService.vk]: VKHelper,
  [CoreVideoService.trovo]: TrovoHelper,
  [CoreVideoService.incestflix]: IncestflixHelper,
  [CoreVideoService.porntn]: PornTNHelper,
  [CoreVideoService.googledrive]: GoogleDriveHelper,
  [CoreVideoService.bilibili]: BilibiliHelper,
  [CoreVideoService.xvideos]: XVideosHelper,
  [CoreVideoService.watchpornto]: WatchPornToHelper,
  [CoreVideoService.archive]: ArchiveHelper,
  [CoreVideoService.dailymotion]: DailymotionHelper,
  [CoreVideoService.youku]: YoukuHelper,
  [CoreVideoService.egghead]: EggheadHelper,
  [CoreVideoService.newgrounds]: NewgroundsHelper,
  [CoreVideoService.okru]: OKRuHelper,
  [CoreVideoService.peertube]: PeertubeHelper,
  [CoreVideoService.eporner]: EpornerHelper,
  [CoreVideoService.bitchute]: BitchuteHelper,
  [CoreVideoService.rutube]: RutubeHelper,
  [CoreVideoService.facebook]: FacebookHelper,
  [CoreVideoService.rumble]: RumbleHelper,
  [CoreVideoService.twitter]: TwitterHelper,
  [CoreVideoService.pornhub]: PornhubHelper,
  [CoreVideoService.tiktok]: TikTokHelper,
  [CoreVideoService.proxitok]: TikTokHelper,
  [CoreVideoService.nine_gag]: NineGAGHelper,
  [CoreVideoService.youtube]: YoutubeHelper,
  [CoreVideoService.ricktube]: YoutubeHelper,
  [CoreVideoService.invidious]: YoutubeHelper,
  [CoreVideoService.poketube]: YoutubeHelper,
  [CoreVideoService.piped]: YoutubeHelper,
  [CoreVideoService.dzen]: DzenHelper,
  [CoreVideoService.cloudflarestream]: CloudflareStreamHelper,
  [CoreVideoService.loom]: LoomHelper,
  [CoreVideoService.rtnews]: RtNewsHelper,
  [CoreVideoService.bitview]: BitviewHelper,
  [CoreVideoService.thisvid]: ThisVidHelper,
  [CoreVideoService.ign]: IgnHelper,
  [CoreVideoService.bunkr]: BunkrHelper,
  [CoreVideoService.imdb]: IMDBHelper,
  [CoreVideoService.telegram]: TelegramHelper,
  [ExtVideoService.udemy]: UdemyHelper,
  [ExtVideoService.coursera]: CourseraHelper,
  [ExtVideoService.douyin]: DouyinHelper,
  [ExtVideoService.artstation]: ArtstationHelper,
  [ExtVideoService.kickstarter]: KickstarterHelper,
  [ExtVideoService.oraclelearn]: OracleLearnHelper,
  [ExtVideoService.deeplearningai]: DeeplearningAIHelper,
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

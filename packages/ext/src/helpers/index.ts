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
import BunnyStreamHelper from "./bunnystream";
import CloudflareStreamHelper from "./cloudflarestream";
import CoursehunterLikeHelper from "./coursehunterLike";
import CourseraHelper from "./coursera";
import DailymotionHelper from "./dailymotion";
import DataCampHelper from "./datacamp";
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
import JoveHelper from "./jove";
import KickHelper from "./kick";
import KickstarterHelper from "./kickstarter";
import KodikHelper from "./kodik";
import LinkedinHelper from "./linkedin";
import LoomHelper from "./loom";
import MailRuHelper from "./mailru";
import MediafileHelper from "./mediafile";
import NetacadHelper from "./netacad";
import NewgroundsHelper from "./newgrounds";
import NicoNicoHelper from "./niconico";
import NineGAGHelper from "./nine_gag";
import OdyseeHelper from "./odysee";
import OKRuHelper from "./okru";
import OlympicsReplayHelper from "./olympicsreplay";
import OracleLearnHelper from "./oraclelearn";
import PatreonHelper from "./patreon";
import PeertubeHelper from "./peertube";
import PicartoHelper from "./picarto";
import PornhubHelper from "./pornhub";
import PornTNHelper from "./porntn";
import PreserveTubeHelper from "./preservetube";
import RedditHelper from "./reddit";
import RtNewsHelper from "./rtnews";
import Rule34VideoHelper from "./rule34video";
import RumbleHelper from "./rumble";
import RutubeHelper from "./rutube";
import SapHelper from "./sap";
import SkilljarHelper from "./skilljar";
import SpankBangHelper from "./spankbang";
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
import WeiboHelper from "./weibo";
import WeverseHelper from "./weverse";
import XHamsterHelper from "./xhamster";
import XVideosHelper from "./xvideos";
import YandexDiskHelper from "./yandexdisk";
import YoukuHelper from "./youku";
import YoutubeHelper from "./youtube";
import ZDFHelper from "./zdf";

export * as VideoJSHelper from "../players/videojs";
export * as AppleDeveloperHelper from "./appledeveloper";
export * as ArchiveHelper from "./archive";
export * as ArtstationHelper from "./artstation";
export * as BannedVideoHelper from "./bannedvideo";
export * as BilibiliHelper from "./bilibili";
export * as BitchuteHelper from "./bitchute";
export * as BitviewHelper from "./bitview";
export * as BunkrHelper from "./bunkr";
export * as BunnyStreamHelper from "./bunnystream";
export * as CloudflareStreamHelper from "./cloudflarestream";
export * as CoursehunterLikeHelper from "./coursehunterLike";
export * as CourseraHelper from "./coursera";
export * as DailymotionHelper from "./dailymotion";
export * as DataCampHelper from "./datacamp";
export * as DeeplearningAIHelper from "./deeplearningai";
export * as DouyinHelper from "./douyin";
export * as DzenHelper from "./dzen";
export * as EggheadHelper from "./egghead";
export * as EpicGamesHelper from "./epicgames";
export * as EpornerHelper from "./eporner";
export * as FacebookHelper from "./facebook";
export * as GoogleDriveHelper from "./googledrive";
export * as IgnHelper from "./ign";
export * as IMDBHelper from "./imdb";
export * as IncestflixHelper from "./incestflix";
export * as JoveHelper from "./jove";
export * as KickHelper from "./kick";
export * as KickstarterHelper from "./kickstarter";
export * as KodikHelper from "./kodik";
export * as LinkedinHelper from "./linkedin";
export * as LoomHelper from "./loom";
export * as MailRuHelper from "./mailru";
export * as MediafileHelper from "./mediafile";
export * as NetacadHelper from "./netacad";
export * as NewgroundsHelper from "./newgrounds";
export * as NicoNicoHelper from "./niconico";
export * as NineGAGHelper from "./nine_gag";
export * as OdyseeHelper from "./odysee";
export * as OKRuHelper from "./okru";
export * as OlympicsReplayHelper from "./olympicsreplay";
export * as OracleLearnHelper from "./oraclelearn";
export * as PatreonHelper from "./patreon";
export * as PeertubeHelper from "./peertube";
export * as PicartoHelper from "./picarto";
export * as PornhubHelper from "./pornhub";
export * as PornTNHelper from "./porntn";
export * as PreserveTubeHelper from "./preservetube";
export * as RedditHelper from "./reddit";
export * as RtNewsHelper from "./rtnews";
export * as Rule34VideoHelper from "./rule34video";
export * as RumbleHelper from "./rumble";
export * as RutubeHelper from "./rutube";
export * as SapHelper from "./sap";
export * as SkilljarHelper from "./skilljar";
export * as SpankBangHelper from "./spankbang";
export * as TelegramHelper from "./telegram";
export * as ThisVidHelper from "./thisvid";
export * as TikTokHelper from "./tiktok";
export * as TrovoHelper from "./trovo";
export * as TwitchHelper from "./twitch";
export * as TwitterHelper from "./twitter";
export * as UdemyHelper from "./udemy";
export * as VimeoHelper from "./vimeo";
export * as VKHelper from "./vk";
export * as WatchPornToHelper from "./watchpornto";
export * as WeiboHelper from "./weibo";
export * as WeverseHelper from "./weverse";
export * as XHamsterHelper from "./xhamster";
export * as XVideosHelper from "./xvideos";
export * as YandexDiskHelper from "./yandexdisk";
export * as YoukuHelper from "./youku";
export * as YoutubeHelper from "./youtube";
export * as ZDFHelper from "./zdf";

export const availableHelpers = {
  [CoreVideoService.mailru]: MailRuHelper,
  [CoreVideoService.weverse]: WeverseHelper,
  [CoreVideoService.weibo]: WeiboHelper,
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
  [CoreVideoService.trovo]: TrovoHelper,
  [CoreVideoService.incestflix]: IncestflixHelper,
  [CoreVideoService.porntn]: PornTNHelper,
  [CoreVideoService.googledrive]: GoogleDriveHelper,
  [CoreVideoService.bilibili]: BilibiliHelper,
  [CoreVideoService.xvideos]: XVideosHelper,
  [CoreVideoService.xhamster]: XHamsterHelper,
  [CoreVideoService.spankbang]: SpankBangHelper,
  [CoreVideoService.rule34video]: Rule34VideoHelper,
  [CoreVideoService.picarto]: PicartoHelper,
  [CoreVideoService.olympicsreplay]: OlympicsReplayHelper,
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
  [CoreVideoService.preservetube]: PreserveTubeHelper,
  [CoreVideoService.invidious]: YoutubeHelper,
  [CoreVideoService.piped]: YoutubeHelper,
  [CoreVideoService.zdf]: ZDFHelper,
  [CoreVideoService.dzen]: DzenHelper,
  [CoreVideoService.bunnystream]: BunnyStreamHelper,
  [CoreVideoService.cloudflarestream]: CloudflareStreamHelper,
  [CoreVideoService.loom]: LoomHelper,
  [CoreVideoService.rtnews]: RtNewsHelper,
  [CoreVideoService.bitview]: BitviewHelper,
  [CoreVideoService.thisvid]: ThisVidHelper,
  [CoreVideoService.ign]: IgnHelper,
  [CoreVideoService.bunkr]: BunkrHelper,
  [CoreVideoService.imdb]: IMDBHelper,
  [CoreVideoService.telegram]: TelegramHelper,
  [CoreVideoService.niconico]: NicoNicoHelper,
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

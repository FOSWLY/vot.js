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
import DropoutHelper from "./dropout";
import DzenHelper from "./dzen";
import EggheadHelper from "./egghead";
import EpicGamesHelper from "./epicgames";
import EpornerHelper from "./eporner";
import FacebookHelper from "./facebook";
import GoogleDriveHelper from "./googledrive";
import IgnHelper from "./ign";
import IMDBHelper from "./imdb";
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
import NewgroundsHelper from "./newgrounds";
import NicoNicoHelper from "./niconico";
import NineGAGHelper from "./nine_gag";
import NoodleMagazineHelper from "./noodlemagazine";
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
import WistiaHelper from "./wistia";

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
export * as DropoutHelper from "./dropout";
export * as DzenHelper from "./dzen";
export * as EggheadHelper from "./egghead";
export * as EpicGamesHelper from "./epicgames";
export * as EpornerHelper from "./eporner";
export * as FacebookHelper from "./facebook";
export * as GoogleDriveHelper from "./googledrive";
export * as IgnHelper from "./ign";
export * as IMDBHelper from "./imdb";
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
export * as NewgroundsHelper from "./newgrounds";
export * as NicoNicoHelper from "./niconico";
export * as NineGAGHelper from "./nine_gag";
export * as NoodleMagazineHelper from "./noodlemagazine";
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
export * as WistiaHelper from "./wistia";

export const availableHelpers = {
  // Additive migrated helpers.
  [CoreVideoService.abcnews]: AbcNewsHelper,
  [CoreVideoService.bfmtv]: BfmTvHelper,
  [CoreVideoService.dailymail]: DailyMailHelper,
  [CoreVideoService.videopress]: VideoPressHelper,
  [CoreVideoService.vidlii]: VidliiHelper,
  [CoreVideoService.cbsnews]: CBSNewsHelper,
  [CoreVideoService.nytimes]: NYTimesHelper,
  [CoreVideoService.washingtonpost]: WashingtonPostHelper,
  [CoreVideoService.wsj]: WSJHelper,
  [CoreVideoService.acfun]: AcFunHelper,
  [CoreVideoService.gettr]: GettrHelper,
  [CoreVideoService.huya]: HuyaHelper,
  [CoreVideoService.medaltv]: MedalTvHelper,
  [CoreVideoService.redgifs]: RedgifsHelper,
  [CoreVideoService.pinterest]: PinterestHelper,
  [CoreVideoService.navertv]: NaverTVHelper,
  [CoreVideoService.chzzk]: CHZZKHelper,
  [CoreVideoService.imgur]: ImgurHelper,
  [CoreVideoService.zhihu]: ZhihuHelper,
  [CoreVideoService.snapchat]: SnapchatSpotlightHelper,
  [CoreVideoService.streamable]: StreamableHelper,
  [ExtVideoService.beacon]: BeaconHelper,
  [ExtVideoService.brightcove]: BrightcoveHelper,
  [ExtVideoService.craftsy]: CraftsyHelper,
  [ExtVideoService.espn]: ESPNHelper,
  [ExtVideoService.jwplatform]: JWPlatformHelper,
  [ExtVideoService.noz]: NOZHelper,
  [ExtVideoService.nzherald]: NZHeraldHelper,
  [ExtVideoService.onefootball]: OneFootballHelper,
  [ExtVideoService.spiegel]: SpiegelHelper,
  [ExtVideoService.vidly]: VidlyHelper,
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
  [CoreVideoService.joidatabase]: JOIDatabaseHelper,
  [CoreVideoService.ign]: IgnHelper,
  [CoreVideoService.bunkr]: BunkrHelper,
  [CoreVideoService.imdb]: IMDBHelper,
  [CoreVideoService.kinopoisk]: KinopoiskHelper,
  [CoreVideoService.telegram]: TelegramHelper,
  [CoreVideoService.niconico]: NicoNicoHelper,
  [CoreVideoService.noodlemagazine]: NoodleMagazineHelper,
  [CoreVideoService.wistia]: WistiaHelper,
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
    return new availableHelpers[service](this.helpersData);
  }
}

// Additive delta exports.
import AbcNewsHelper from "./abcnews";
export * as AbcNewsHelper from "./abcnews";
import BfmTvHelper from "./bfmtv";
export * as BfmTvHelper from "./bfmtv";
import DailyMailHelper from "./dailymail";
export * as DailyMailHelper from "./dailymail";
import VideoPressHelper from "./videopress";
export * as VideoPressHelper from "./videopress";
import VidliiHelper from "./vidlii";
export * as VidliiHelper from "./vidlii";
import CBSNewsHelper from "./cbsnews";
export * as CBSNewsHelper from "./cbsnews";
import NYTimesHelper from "./nytimes";
export * as NYTimesHelper from "./nytimes";
import WashingtonPostHelper from "./washingtonpost";
export * as WashingtonPostHelper from "./washingtonpost";
import WSJHelper from "./wsj";
export * as WSJHelper from "./wsj";
import AcFunHelper from "./acfun";
export * as AcFunHelper from "./acfun";
import GettrHelper from "./gettr";
export * as GettrHelper from "./gettr";
import HuyaHelper from "./huya";
export * as HuyaHelper from "./huya";
import MedalTvHelper from "./medaltv";
export * as MedalTvHelper from "./medaltv";
import RedgifsHelper from "./redgifs";
export * as RedgifsHelper from "./redgifs";
import PinterestHelper from "./pinterest";
export * as PinterestHelper from "./pinterest";
import NaverTVHelper from "./navertv";
export * as NaverTVHelper from "./navertv";
import CHZZKHelper from "./chzzk";
export * as CHZZKHelper from "./chzzk";
import ImgurHelper from "./imgur";
export * as ImgurHelper from "./imgur";
import ZhihuHelper from "./zhihu";
export * as ZhihuHelper from "./zhihu";
import SnapchatSpotlightHelper from "./snapchat";
export * as SnapchatSpotlightHelper from "./snapchat";
import StreamableHelper from "./streamable";
export * as StreamableHelper from "./streamable";
import BeaconHelper from "./beacon";
export * as BeaconHelper from "./beacon";
import BrightcoveHelper from "./brightcove";
export * as BrightcoveHelper from "./brightcove";
import CraftsyHelper from "./craftsy";
export * as CraftsyHelper from "./craftsy";
import ESPNHelper from "./espn";
export * as ESPNHelper from "./espn";
import JWPlatformHelper from "./jwplatform";
export * as JWPlatformHelper from "./jwplatform";
import NOZHelper from "./noz";
export * as NOZHelper from "./noz";
import NZHeraldHelper from "./nzherald";
export * as NZHeraldHelper from "./nzherald";
import OneFootballHelper from "./onefootball";
export * as OneFootballHelper from "./onefootball";
import SpiegelHelper from "./spiegel";
export * as SpiegelHelper from "./spiegel";
import VidlyHelper from "./vidly";
export * as VidlyHelper from "./vidly";

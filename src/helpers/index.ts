import { VideoService } from "../types/yandex";
import { BaseHelperOpts } from "../types/helpers/base";

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

export const availableHelpers = {
  [VideoService.mailru]: MailRuHelper,
  [VideoService.weverse]: WeverseHelper,
  [VideoService.kodik]: KodikHelper,
  [VideoService.patreon]: PatreonHelper,
  [VideoService.reddit]: RedditHelper,
  [VideoService.bannedvideo]: BannedVideoHelper,
  [VideoService.kick]: KickHelper,
  [VideoService.appledeveloper]: AppleDeveloperHelper,
  [VideoService.epicgames]: EpicGamesHelper,
  [VideoService.nineanimetv]: NineAnimeTVHelper,
  [VideoService.odysee]: OdyseeHelper,
  [VideoService.coursehunterLike]: CoursehunterLikeHelper,
  [VideoService.twitch]: TwitchHelper,
  [VideoService.sap]: SapHelper,
  [VideoService.linkedin]: LinkedinHelper,
  [VideoService.vimeo]: VimeoHelper,
  [VideoService.yandexdisk]: YandexDiskHelper,
  [VideoService.vk]: VKHelper,
  [VideoService.trovo]: TrovoHelper,
  [VideoService.incestflix]: IncestflixHelper,
  [VideoService.porntn]: PornTNHelper,
  [VideoService.googledrive]: GoogleDriveHelper,
  [VideoService.bilibili]: BilibiliHelper,
  [VideoService.xvideos]: XVideosHelper,
  [VideoService.watchpornto]: WatchPornToHelper,
  [VideoService.archive]: ArchiveHelper,
  [VideoService.dailymotion]: DailymotionHelper,
  [VideoService.youku]: YoukuHelper,
  [VideoService.egghead]: EggheadHelper,
  [VideoService.newgrounds]: NewgroundsHelper,
  [VideoService.okru]: OKRuHelper,
  [VideoService.peertube]: PeertubeHelper,
  [VideoService.eporner]: EpornerHelper,
  [VideoService.bitchute]: BitchuteHelper,
  [VideoService.rutube]: RutubeHelper,
  [VideoService.facebook]: FacebookHelper,
  [VideoService.rumble]: RumbleHelper,
  [VideoService.twitter]: TwitterHelper,
  [VideoService.pornhub]: PornhubHelper,
  [VideoService.tiktok]: TikTokHelper,
  [VideoService.proxitok]: TikTokHelper,
  [VideoService.nine_gag]: NineGAGHelper,
  [VideoService.youtube]: YoutubeHelper,
  [VideoService.ricktube]: YoutubeHelper,
  [VideoService.invidious]: YoutubeHelper,
  [VideoService.poketube]: YoutubeHelper,
  [VideoService.piped]: YoutubeHelper,
};

export type AvailableVideoHelpers = typeof availableHelpers;

/**
 * A convenient wrapper over the rest of the helpers
 */
export default class VideoHelper {
  helpersData: BaseHelperOpts;

  constructor(helpersData: BaseHelperOpts = {}) {
    this.helpersData = helpersData;
  }

  getHelper<K extends keyof AvailableVideoHelpers>(
    service: K,
  ): AvailableVideoHelpers[K]["prototype"] {
    return new availableHelpers[service](this.helpersData);
  }
}

import { VideoService } from "../types/yandex.js";
import MailRuHelper from "./mailru.js";
import WeverseHelper from "./weverse.js";
import KodikHelper from "./kodik.js";
import PatreonHelper from "./patreon.js";
import RedditHelper from "./reddit.js";
import BannedVideoHelper from "./bannedvideo.js";
import KickHelper from "./kick.js";
import AppleDeveloperHelper from "./appledeveloper.js";
import EpicGamesHelper from "./epicgames.js";
import NineAnimeTVHelper from "./nineanimetv.js";
import OdyseeHelper from "./odysee.js";
import CoursehunterLikeHelper from "./coursehunterLike.js";
import TwitchHelper from "./twitch.js";
import SapHelper from "./sap.js";
import LinkedinHelper from "./linkedin.js";
import VimeoHelper from "./vimeo.js";
import YandexDiskHelper from "./yandexdisk.js";
import VKHelper from "./vk.js";
import TrovoHelper from "./trovo.js";
import IncestflixHelper from "./incestflix.js";
import PornTNHelper from "./porntn.js";
import GoogleDriveHelper from "./googledrive.js";
import BilibiliHelper from "./bilibili.js";
import XVideosHelper from "./xvideos.js";
import WatchPornToHelper from "./watchpornto.js";
import ArchiveHelper from "./archive.js";
import DailymotionHelper from "./dailymotion.js";
import YoukuHelper from "./youku.js";
import EggheadHelper from "./egghead.js";
import NewgroundsHelper from "./newgrounds.js";
import OKRuHelper from "./okru.js";
import PeertubeHelper from "./peertube.js";
import EpornerHelper from "./eporner.js";
import BitchuteHelper from "./bitchute.js";
import RutubeHelper from "./rutube.js";
import FacebookHelper from "./facebook.js";
import RumbleHelper from "./rumble.js";
import TwitterHelper from "./twitter.js";
import PornhubHelper from "./pornhub.js";
import TikTokHelper from "./tiktok.js";
import NineGAGHelper from "./nine_gag.js";
import YoutubeHelper from "./youtube.js";
import DzenHelper from "./dzen.js";
export * as MailRuHelper from "./mailru.js";
export * as WeverseHelper from "./weverse.js";
export * as KodikHelper from "./kodik.js";
export * as PatreonHelper from "./patreon.js";
export * as RedditHelper from "./reddit.js";
export * as BannedVideoHelper from "./bannedvideo.js";
export * as KickHelper from "./kick.js";
export * as AppleDeveloperHelper from "./appledeveloper.js";
export * as EpicGamesHelper from "./epicgames.js";
export * as NineAnimeTVHelper from "./nineanimetv.js";
export * as OdyseeHelper from "./odysee.js";
export * as CoursehunterLikeHelper from "./coursehunterLike.js";
export * as TwitchHelper from "./twitch.js";
export * as SapHelper from "./sap.js";
export * as LinkedinHelper from "./linkedin.js";
export * as VimeoHelper from "./vimeo.js";
export * as YandexDiskHelper from "./yandexdisk.js";
export * as VKHelper from "./vk.js";
export * as TrovoHelper from "./trovo.js";
export * as IncestflixHelper from "./incestflix.js";
export * as PornTNHelper from "./porntn.js";
export * as GoogleDriveHelper from "./googledrive.js";
export * as BilibiliHelper from "./bilibili.js";
export * as XVideosHelper from "./xvideos.js";
export * as WatchPornToHelper from "./watchpornto.js";
export * as ArchiveHelper from "./archive.js";
export * as DailymotionHelper from "./dailymotion.js";
export * as YoukuHelper from "./youku.js";
export * as EggheadHelper from "./egghead.js";
export * as NewgroundsHelper from "./newgrounds.js";
export * as OKRuHelper from "./okru.js";
export * as PeertubeHelper from "./peertube.js";
export * as EpornerHelper from "./eporner.js";
export * as BitchuteHelper from "./bitchute.js";
export * as RutubeHelper from "./rutube.js";
export * as FacebookHelper from "./facebook.js";
export * as RumbleHelper from "./rumble.js";
export * as TwitterHelper from "./twitter.js";
export * as PornhubHelper from "./pornhub.js";
export * as TikTokHelper from "./tiktok.js";
export * as NineGAGHelper from "./nine_gag.js";
export * as YoutubeHelper from "./youtube.js";
export * as DzenHelper from "./dzen.js";
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
    [VideoService.dzen]: DzenHelper,
};
export default class VideoHelper {
    helpersData;
    constructor(helpersData = {}) {
        this.helpersData = helpersData;
    }
    getHelper(service) {
        return new availableHelpers[service](this.helpersData);
    }
}

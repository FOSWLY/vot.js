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
import CoursehunterHelper from "./coursehunter.js";
import TwitchHelper from "./twitch.js";
import SapHelper from "./sap.js";
import LinkedinHelper from "./linkedin.js";
import VimeoHelper from "./vimeo.js";
import YandexDiskHelper from "./yandexdisk.js";
import VKHelper from "./vk.js";
import TrovoHelper from "./trovo.js";
import CoursetrainHelper from "./coursetrain.js";
import IncestflixHelper from "./incestflix.js";
import PornTNHelper from "./porntn.js";
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
export * as CoursehunterHelper from "./coursehunter.js";
export * as TwitchHelper from "./twitch.js";
export * as SapHelper from "./sap.js";
export * as LinkedinHelper from "./linkedin.js";
export * as VimeoHelper from "./vimeo.js";
export * as YandexDiskHelper from "./yandexdisk.js";
export * as VKHelper from "./vk.js";
export * as TrovoHelper from "./trovo.js";
export * as CoursetrainHelper from "./coursetrain.js";
export * as IncestflixHelper from "./incestflix.js";
export * as PornTNHelper from "./porntn.js";
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
    [VideoService.coursehunter]: CoursehunterHelper,
    [VideoService.twitch]: TwitchHelper,
    [VideoService.sap]: SapHelper,
    [VideoService.linkedin]: LinkedinHelper,
    [VideoService.vimeo]: VimeoHelper,
    [VideoService.yandexdisk]: YandexDiskHelper,
    [VideoService.vk]: VKHelper,
    [VideoService.trovo]: TrovoHelper,
    [VideoService.coursetrain]: CoursetrainHelper,
    [VideoService.incestflix]: IncestflixHelper,
    [VideoService.porntn]: PornTNHelper,
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

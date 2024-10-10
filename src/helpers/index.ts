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

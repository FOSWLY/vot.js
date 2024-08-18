import { VideoService } from "../types/yandex";
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
import CoursehunterHelper from "./coursehunter";
import TwitchHelper from "./twitch";

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
export * as CoursehunterHelper from "./coursehunter";
export * as TwitchHelper from "./twitch";

/**
 * A convenient wrapper over the rest of the helpers
 */
export default class VideoHelper {
  /** @source */
  static [VideoService.mailru] = new MailRuHelper();

  /** @source */
  static [VideoService.weverse] = new WeverseHelper();

  /** @source */
  static [VideoService.kodik] = new KodikHelper();

  /** @source */
  static [VideoService.patreon] = new PatreonHelper();

  /** @source */
  static [VideoService.reddit] = new RedditHelper();

  /** @source */
  static [VideoService.bannedvideo] = new BannedVideoHelper();

  /** @source */
  static [VideoService.kick] = new KickHelper();

  /** @source */
  static [VideoService.appledeveloper] = new AppleDeveloperHelper();

  /** @source */
  static [VideoService.epicgames] = new EpicGamesHelper();

  /** @source */
  static [VideoService.nineanimetv] = new NineAnimeTVHelper();

  /** @source */
  static [VideoService.odysee] = new OdyseeHelper();

  /** @source */
  static [VideoService.twitch] = new TwitchHelper();

  /** @source */
  static [VideoService.coursehunter] = new CoursehunterHelper();
}

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
  static readonly [VideoService.mailru] = new MailRuHelper();

  /** @source */
  static readonly [VideoService.weverse] = new WeverseHelper();

  /** @source */
  static readonly [VideoService.kodik] = new KodikHelper();

  /** @source */
  static readonly [VideoService.patreon] = new PatreonHelper();

  /** @source */
  static readonly [VideoService.reddit] = new RedditHelper();

  /** @source */
  static readonly [VideoService.bannedvideo] = new BannedVideoHelper();

  /** @source */
  static readonly [VideoService.kick] = new KickHelper();

  /** @source */
  static readonly [VideoService.appledeveloper] = new AppleDeveloperHelper();

  /** @source */
  static readonly [VideoService.epicgames] = new EpicGamesHelper();

  /** @source */
  static readonly [VideoService.nineanimetv] = new NineAnimeTVHelper();

  /** @source */
  static readonly [VideoService.odysee] = new OdyseeHelper();

  /** @source */
  static readonly [VideoService.twitch] = new TwitchHelper();

  /** @source */
  static readonly [VideoService.coursehunter] = new CoursehunterHelper();
}

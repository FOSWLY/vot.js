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
export default class VideoHelper {
    static [VideoService.mailru]: MailRuHelper;
    static [VideoService.weverse]: WeverseHelper;
    static [VideoService.kodik]: KodikHelper;
    static [VideoService.patreon]: PatreonHelper;
    static [VideoService.reddit]: RedditHelper;
    static [VideoService.bannedvideo]: BannedVideoHelper;
    static [VideoService.kick]: KickHelper;
    static [VideoService.appledeveloper]: AppleDeveloperHelper;
    static [VideoService.epicgames]: EpicGamesHelper;
    static [VideoService.nineanimetv]: NineAnimeTVHelper;
    static [VideoService.odysee]: OdyseeHelper;
    static [VideoService.twitch]: TwitchHelper;
    static [VideoService.coursehunter]: CoursehunterHelper;
}
//# sourceMappingURL=index.d.ts.map
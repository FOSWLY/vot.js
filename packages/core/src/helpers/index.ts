/**
 * Central registry of environment-agnostic site helpers shared by
 * `@vot.js/node` and `@vot.js/ext`.
 *
 * Runtime packages spread `coreHelpers` into their own `availableHelpers` map
 * and only register runtime-specific helpers (or overrides) on top of it, so
 * no per-package forwarding files are needed.
 */
import { VideoService } from "../types/service";

import BitchuteHelper from "./bitchute";
import BunnyStreamHelper from "./bunnystream";
import CloudflareStreamHelper from "./cloudflarestream";
import DzenHelper from "./dzen";
import EggheadHelper from "./egghead";
import EpornerHelper from "./eporner";
import FacebookHelper from "./facebook";
import IMDBHelper from "./imdb";
import NewgroundsHelper from "./newgrounds";
import NicoNicoHelper from "./niconico";
import OKRuHelper from "./okru";
import OlympicsReplayHelper from "./olympicsreplay";
import PeertubeHelper from "./peertube";
import PicartoHelper from "./picarto";
import PornhubHelper from "./pornhub";
import Rule34VideoHelper from "./rule34video";
import RumbleHelper from "./rumble";
import RutubeHelper from "./rutube";
import SpankBangHelper from "./spankbang";
import ThisVidHelper from "./thisvid";
import TikTokHelper from "./tiktok";
import TrovoHelper from "./trovo";
import WatchPornToHelper from "./watchpornto";
import WeiboHelper from "./weibo";
import WeverseHelper from "./weverse";
import WistiaHelper from "./wistia";
import XHamsterHelper from "./xhamster";
import XVideosHelper from "./xvideos";
import YoukuHelper from "./youku";
import ZDFHelper from "./zdf";

export * as BitchuteHelper from "./bitchute";
export * as BunnyStreamHelper from "./bunnystream";
export * as CloudflareStreamHelper from "./cloudflarestream";
export * as DzenHelper from "./dzen";
export * as EggheadHelper from "./egghead";
export * as EpornerHelper from "./eporner";
export * as FacebookHelper from "./facebook";
export * as IMDBHelper from "./imdb";
export * as NewgroundsHelper from "./newgrounds";
export * as NicoNicoHelper from "./niconico";
export * as OKRuHelper from "./okru";
export * as OlympicsReplayHelper from "./olympicsreplay";
export * as PeertubeHelper from "./peertube";
export * as PicartoHelper from "./picarto";
export * as PornhubHelper from "./pornhub";
export * as Rule34VideoHelper from "./rule34video";
export * as RumbleHelper from "./rumble";
export * as RutubeHelper from "./rutube";
export * as SpankBangHelper from "./spankbang";
export * as ThisVidHelper from "./thisvid";
export * as TikTokHelper from "./tiktok";
export * as TrovoHelper from "./trovo";
export * as WatchPornToHelper from "./watchpornto";
export * as WeiboHelper from "./weibo";
export * as WeverseHelper from "./weverse";
export * as WistiaHelper from "./wistia";
export * as XHamsterHelper from "./xhamster";
export * as XVideosHelper from "./xvideos";
export * as YoukuHelper from "./youku";
export * as ZDFHelper from "./zdf";

export const coreHelpers = {
  [VideoService.weverse]: WeverseHelper,
  [VideoService.weibo]: WeiboHelper,
  [VideoService.trovo]: TrovoHelper,
  [VideoService.xvideos]: XVideosHelper,
  [VideoService.xhamster]: XHamsterHelper,
  [VideoService.spankbang]: SpankBangHelper,
  [VideoService.rule34video]: Rule34VideoHelper,
  [VideoService.picarto]: PicartoHelper,
  [VideoService.olympicsreplay]: OlympicsReplayHelper,
  [VideoService.watchpornto]: WatchPornToHelper,
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
  [VideoService.pornhub]: PornhubHelper,
  [VideoService.tiktok]: TikTokHelper,
  [VideoService.proxitok]: TikTokHelper,
  [VideoService.zdf]: ZDFHelper,
  [VideoService.dzen]: DzenHelper,
  [VideoService.bunnystream]: BunnyStreamHelper,
  [VideoService.cloudflarestream]: CloudflareStreamHelper,
  [VideoService.thisvid]: ThisVidHelper,
  [VideoService.imdb]: IMDBHelper,
  [VideoService.niconico]: NicoNicoHelper,
  [VideoService.wistia]: WistiaHelper,
};

export type CoreVideoHelpers = typeof coreHelpers;
export type CoreHelperService = keyof CoreVideoHelpers;

/** Resolve a shared helper class from the core registry. */
export function getCoreHelper<K extends CoreHelperService>(service: K): CoreVideoHelpers[K] {
  return coreHelpers[service];
}

export function isCoreHelperService(service: string): service is CoreHelperService {
  return Object.prototype.hasOwnProperty.call(coreHelpers, service);
}

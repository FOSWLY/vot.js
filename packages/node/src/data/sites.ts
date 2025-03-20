import { VideoService as CoreVideoService } from "@vot.js/core/types/service";
import {
  sitesInvidious,
  sitesPiped,
  sitesProxiTok,
  sitesPeertube,
  sitesPoketube,
  sitesRicktube,
  sitesCoursehunterLike,
} from "@vot.js/shared/alternativeUrls";

import { type ServiceConf } from "../types/service";

export default [
  {
    host: CoreVideoService.youtube,
    url: "https://youtu.be/",
    match: /^((www.|m.)?youtube(-nocookie|kids)?.com)|(youtu.be)$/,
  },
  {
    // Sites host Invidious. I tested the performance only on invidious.kevin.rocks, youtu.be and inv.vern.cc
    host: CoreVideoService.invidious,
    url: "https://youtu.be/",
    match: sitesInvidious,
  },
  {
    // Sites host Piped. I tested the performance only on piped.video
    host: CoreVideoService.piped,
    url: "https://youtu.be/",
    match: sitesPiped,
  },
  {
    // Sites host Poketube. I tested the performance only on poketube.fun
    host: CoreVideoService.poketube,
    url: "https://youtu.be/",
    match: sitesPoketube,
  },
  {
    // Sites host Ricktube
    host: CoreVideoService.ricktube,
    url: "https://youtu.be/",
    match: sitesRicktube,
  },
  {
    host: CoreVideoService.vk,
    url: "https://vk.com/video?z=",
    match: [/^(www.|m.)?vk.(com|ru)$/, /^(www.|m.)?vkvideo.ru$/],
  },
  {
    host: CoreVideoService.nine_gag,
    url: "https://9gag.com/gag/",
    match: /^9gag.com$/,
  },
  {
    host: CoreVideoService.twitch,
    url: "https://twitch.tv/",
    match: [
      /^m.twitch.tv$/,
      /^(www.)?twitch.tv$/,
      /^clips.twitch.tv$/,
      /^player.twitch.tv$/,
    ],
  },
  {
    host: CoreVideoService.proxitok,
    url: "https://www.tiktok.com/",
    match: sitesProxiTok,
  },
  {
    host: CoreVideoService.tiktok,
    url: "https://www.tiktok.com/",
    match: /^(www.)?tiktok.com$/,
  },
  {
    host: CoreVideoService.vimeo,
    url: "https://vimeo.com/",
    match: /^vimeo.com$/,
    needExtraData: true,
  },
  {
    host: CoreVideoService.vimeo,
    url: "https://player.vimeo.com/",
    match: /^player.vimeo.com$/,
    additionalData: "embed",
    needExtraData: true,
  },
  {
    host: CoreVideoService.xvideos,
    url: "https://www.xvideos.com/",
    match: [
      /^(www.)?xvideos(-ar)?.com$/,
      /^(www.)?xvideos(\d\d\d).com$/,
      /^(www.)?xv-ru.com$/,
    ],
  },
  {
    host: CoreVideoService.pornhub,
    url: "https://rt.pornhub.com/view_video.php?viewkey=",
    match: /^[a-z]+.pornhub.(com|org)$/,
  },
  {
    host: CoreVideoService.twitter,
    url: "https://twitter.com/i/status/",
    match: /^(twitter|x).com$/,
  },
  {
    host: CoreVideoService.rumble,
    url: "https://rumble.com/",
    match: /^rumble.com$/,
  },
  {
    host: CoreVideoService.facebook,
    url: "https://facebook.com/",
    match: (url: URL) =>
      url.host.includes("facebook.com") &&
      (url.pathname.includes("/videos/") || url.pathname.includes("/reel/")),
  },
  {
    host: CoreVideoService.rutube,
    url: "https://rutube.ru/video/",
    match: /^rutube.ru$/,
  },
  {
    host: CoreVideoService.bilibili,
    url: "https://www.bilibili.com/",
    match: /^(www|m|player).bilibili.com$/,
  },
  {
    host: CoreVideoService.mailru,
    url: "https://my.mail.ru/",
    match: /^my.mail.ru$/,
  },
  {
    host: CoreVideoService.bitchute,
    url: "https://www.bitchute.com/video/",
    match: /^(www.)?bitchute.com$/,
  },
  {
    host: CoreVideoService.eporner,
    url: "https://www.eporner.com/",
    match: /^(www.)?eporner.com$/,
  },
  {
    host: CoreVideoService.peertube,
    url: "stub", // This is a stub. The present value is set using origin url
    match: sitesPeertube,
  },
  {
    host: CoreVideoService.dailymotion,
    url: "https://dai.ly/",
    match: /^(www.)?dailymotion.com|dai.ly$/,
  },
  {
    host: CoreVideoService.trovo,
    url: "https://trovo.live/s/",
    match: /^trovo.live$/,
  },
  {
    host: CoreVideoService.yandexdisk,
    url: "https://yadi.sk/",
    match:
      /^disk.yandex.(ru|kz|com(\.(am|ge|tr))?|by|az|co\.il|ee|lt|lv|md|net|tj|tm|uz)|yadi.sk$/,
    needExtraData: true,
  },
  {
    host: CoreVideoService.okru,
    url: "https://ok.ru/video/",
    match: /^ok.ru$/,
  },
  {
    host: CoreVideoService.googledrive,
    url: "https://drive.google.com/file/d/",
    match: /^drive.google.com$/,
  },

  {
    host: CoreVideoService.bannedvideo,
    url: "https://madmaxworld.tv/watch?id=", // madmaxworld.tv for bypass cloudflare UAM on /watch page
    match: /^(www.)?banned.video|madmaxworld.tv$/,
    needExtraData: true,
  },
  {
    host: CoreVideoService.weverse,
    url: "https://weverse.io/",
    match: /^weverse.io$/,
    needExtraData: true,
  },
  {
    host: CoreVideoService.newgrounds,
    url: "https://www.newgrounds.com/",
    match: /^(www.)?newgrounds.com$/,
  },
  {
    // TODO: Добавить поддержку tips (сделать через m3u8 т.к. обычная ссылка не принимается) и платных курсов
    host: CoreVideoService.egghead,
    url: "https://egghead.io/",
    match: /^egghead.io$/,
  },
  {
    host: CoreVideoService.youku,
    url: "https://v.youku.com/",
    match: /^v.youku.com$/,
  },
  {
    host: CoreVideoService.archive,
    url: "https://archive.org/details/",
    match: /^archive.org$/,
  },
  {
    host: CoreVideoService.kodik,
    url: "stub",
    match: /^kodik.(info|biz|cc)$/,
    needExtraData: true,
  },
  {
    host: CoreVideoService.patreon,
    url: "stub",
    match: /^(www.)?patreon.com$/,
    needExtraData: true,
  },
  {
    host: CoreVideoService.reddit,
    url: "stub",
    match: /^(www.|new.|old.)?reddit.com$/,
    needExtraData: true,
  },
  {
    host: CoreVideoService.kick,
    url: "https://kick.com/",
    match: /^kick.com$/,
    needExtraData: true,
  },
  {
    host: CoreVideoService.appledeveloper,
    url: "https://developer.apple.com/",
    match: /^developer.apple.com$/,
    needExtraData: true,
  },
  {
    host: CoreVideoService.epicgames,
    url: "https://dev.epicgames.com/community/learning/",
    match: /^dev.epicgames.com$/,
    needExtraData: true,
  },
  {
    host: CoreVideoService.nineanimetv,
    url: "https://9animetv.to/watch/",
    match: /^9animetv.to$/,
    needExtraData: true,
  },
  {
    host: CoreVideoService.odysee,
    url: "stub",
    match: /^odysee.com$/,
    needExtraData: true,
  },
  {
    host: CoreVideoService.coursehunterLike,
    url: "stub",
    match: sitesCoursehunterLike,
    needExtraData: true,
  },
  {
    host: CoreVideoService.sap,
    url: "https://learning.sap.com/courses/",
    match: /^learning.sap.com$/,
    needExtraData: true,
  },
  {
    host: CoreVideoService.watchpornto,
    url: "https://watchporn.to/",
    match: /^watchporn.to$/,
  },
  {
    host: CoreVideoService.linkedin,
    url: "https://www.linkedin.com/learning/",
    match: /^(www.)?linkedin.com$/,
    needExtraData: true,
  },
  {
    host: CoreVideoService.incestflix,
    url: "https://www.incestflix.net/watch/",
    match: /^(www.)?incestflix.(net|to|com)$/,
    needExtraData: true,
  },
  {
    host: CoreVideoService.porntn,
    url: "https://porntn.com/videos/",
    match: /^porntn.com$/,
    needExtraData: true,
  },
  {
    host: CoreVideoService.dzen,
    url: "https://dzen.ru/video/watch/",
    match: /^dzen.ru$/,
  },
  {
    host: CoreVideoService.cloudflarestream,
    url: "stub",
    match: /^(watch|embed|iframe|customer-[^.]+).cloudflarestream.com$/,
  },
  {
    host: CoreVideoService.loom,
    url: "https://www.loom.com/share/",
    match: /^(www.)?loom.com$/,
  },
  {
    host: CoreVideoService.rtnews,
    url: "https://www.rt.com/",
    match: /^(www.)?rt.com$/,
    needExtraData: true,
  },
  {
    host: CoreVideoService.bitview,
    url: "https://www.bitview.net/watch?v=",
    match: /^(www.)?bitview.net$/,
    needExtraData: true,
  },
  {
    host: CoreVideoService.thisvid,
    url: "https://thisvid.com/",
    match: /^(www.)?thisvid.com$/,
  },
  {
    host: CoreVideoService.custom,
    url: "stub",
    match: (url: URL) => /([^.]+).(mp4|webm)/.test(url.pathname),
    rawResult: true,
  },
] as ServiceConf[];

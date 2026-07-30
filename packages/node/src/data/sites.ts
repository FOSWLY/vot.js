import { VideoService as CoreVideoService } from "@vot.js/core/types/service";
import {
  sitesCoursehunterLike,
  sitesInvidious,
  sitesPeertube,
  sitesPiped,
  sitesProxiTok,
} from "@vot.js/shared/alternativeUrls";

import type { ServiceConf } from "../types/service";

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
    host: CoreVideoService.preservetube,
    url: "https://preservetube.com/watch?v=",
    match: /^preservetube\.com$/,
  },
  {
    host: CoreVideoService.zdf,
    url: "https://www.zdf.de/play/",
    match: [/^zdf.de$/, /^(www.)?zdf.de$/],
  },
  {
    host: CoreVideoService.niconico,
    url: "https://www.nicovideo.jp/watch/",
    match: [/^(www\.|sp\.)?nicovideo\.jp$/, /^nico\.ms$/],
  },
  {
    host: CoreVideoService.vk,
    url: "https://vk.com/",
    match: [/^(www\.|m\.)?vk\.(com|ru)$/, /^(.*\.)?vkvideo\.ru$/],
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
    match: /^(www\.|m\.)?vimeo.com$/,
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
    host: CoreVideoService.xhamster,
    url: "https://xhamster.com/",
    match: (url: URL) =>
      /^(?:[^.]+\.)?(?:xhamster\.(?:com|desi)|xhamster\d+\.(?:com|desi)|xhvid\.com)$/.test(
        url.host,
      ) && /\/(?:videos\/[^/]+-[\dA-Za-z]+)\/?$/.test(url.pathname),
  },
  {
    host: CoreVideoService.spankbang,
    url: "https://spankbang.com/",
    match: (url: URL) =>
      /^(?:[^.]+\.)?spankbang\.com$/.test(url.host) &&
      /\/(?:[\da-z]+\/(?:video|play|embed)(?:\/[^/]+)?|[\da-z]+-[\da-z]+\/playlist\/[^/?#&]+)\/?$/i.test(
        url.pathname,
      ),
  },
  {
    host: CoreVideoService.rule34video,
    url: "https://rule34video.com/video/",
    match: (url: URL) =>
      /^(www\.)?rule34video\.com$/.test(url.host) &&
      /\/videos?\/\d+/.test(url.pathname),
  },
  {
    host: CoreVideoService.picarto,
    url: "https://picarto.tv/",
    match: (url: URL) =>
      /^(www\.)?picarto\.tv$/.test(url.host) &&
      /^(?:\/[^/]+\/(?:profile\/)?videos\/[^/?#&]+|\/videopopout\/[^/?#&]+|\/[^/#?]+\/?)$/.test(
        url.pathname,
      ),
  },
  {
    host: CoreVideoService.olympicsreplay,
    url: "https://olympics.com/",
    match: (url: URL) =>
      /^(www\.)?olympics\.com$/.test(url.host) &&
      /^\/[a-z]{2}\/(?:paris-2024\/)?(?:replay|videos?|original-series\/episode)\/[\w-]+\/?$/i.test(
        url.pathname,
      ),
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
    host: CoreVideoService.bilibili,
    url: "https://www.bilibili.tv/",
    match: /^(?:www\.|m\.)?bilibili\.tv$/,
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
    url: "https://www.dailymotion.com/video/",
    match: /^((www\.)?dailymotion\.com|geo(\d+)?\.dailymotion\.com|dai\.ly)$/,
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
    host: CoreVideoService.weibo,
    url: "https://weibo.com/",
    match: (url: URL) =>
      (/^(?:www\.)?weibo\.com$/.test(url.host) &&
        /^\/(?:\d+\/[A-Za-z0-9]+|0\/[A-Za-z0-9]+|tv\/show\/\d+:(?:[\da-f]{32}|\d{16,}))\/?$/.test(
          url.pathname,
        )) ||
      (/^video\.weibo\.com$/.test(url.host) &&
        /^\/show\/?$/.test(url.pathname) &&
        /^\d+:(?:[\da-f]{32}|\d{16,})$/i.test(
          url.searchParams.get("fid") ?? "",
        )),
  },
  {
    host: CoreVideoService.newgrounds,
    url: "https://www.newgrounds.com/",
    match: /^(www.)?newgrounds.com$/,
  },
  {
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
    match: /^kodikplayer.com$/,
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
    host: CoreVideoService.jove,
    url: "https://jove.com/",
    match: /^(?:app|www)\.jove\.com$/,
  },
  {
    host: CoreVideoService.linkedin,
    url: "https://www.linkedin.com/learning/",
    match: /^(www.)?linkedin.com$/,
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
    host: CoreVideoService.bunnystream,
    url: "stub",
    match: [
      /^video\.bunnycdn\.com$/,
      /^iframe\.mediadelivery\.net$/,
      /^(?:[^.]+\.)*b-cdn\.net$/,
    ],
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
    host: CoreVideoService.ign,
    url: "https://de.ign.com/",
    match: /^(\w{2}.)ign.com$/,
    needExtraData: true,
  },
  {
    host: CoreVideoService.ign,
    url: "https://www.ign.com/",
    match: /^(www.)?ign.com$/,
    needExtraData: true,
  },
  {
    host: CoreVideoService.bunkr,
    url: "https://bunkr.site/",
    // https://github.com/mikf/gallery-dl/blob/master/gallery_dl/extractor/bunkr.py
    match:
      /^bunkr.(site|black|cat|media|red|site|ws|org|s[kiu]|c[ir]|fi|p[hks]|ru|la|is|to|a[cx])$/,
    needExtraData: true,
  },
  {
    host: CoreVideoService.imdb,
    url: "https://www.imdb.com/video/",
    match: /^(www.)?imdb.com$/,
  },
  {
    host: CoreVideoService.telegram,
    url: "https://t.me/",
    match: /^t.me$/,
  },
  {
    host: CoreVideoService.wistia,
    url: "https://fast.wistia.net/embed/iframe/",
    match: /^fast.wistia.net$/,
  },
  {
    host: CoreVideoService.custom,
    url: "stub",
    match: (url: URL) => /([^/]+)\.(mp4|webm)/.test(url.pathname),
    rawResult: true,
  },
] as ServiceConf[];

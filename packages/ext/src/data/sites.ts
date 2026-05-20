import { VideoService as CoreVideoService } from "@vot.js/core/types/service";
import {
  sitesCoursehunterLike,
  sitesInvidious,
  sitesPeertube,
  sitesPiped,
  sitesProxiTok,
} from "@vot.js/shared/alternativeUrls";

import { ExtVideoService, type ServiceConf } from "../types/service";

const sharedSelectors = {
  bilibiliPlayer:
    ".bpx-player-video-wrap, div.player-mobile-box.player-mobile-autoplay",
  flowplayer: ".fp-player, div.flowplayer",
  idPlayer: "#player",
  jwPlayer: ".jwplayer, .jw-media",
  player: ".player",
  shakaPlayer: '.shaka-video-container, [id^="shaka-video-container-"]',
  videoJsUniversal:
    "[id^='vjs_video_']:not([id*='_html5_api']):not(video), video-js:not([id*='_html5_api']), .video-js:not(video):not([id*='_html5_api']), .vjs-player:not([id*='_html5_api']), [data-vjs-player]:not([id*='_html5_api'])",
  vkVideoPlayer: ".videoplayer_media, vk-video-player",
} as const;

export default [
  {
    additionalData: "mobile",
    host: CoreVideoService.youtube,
    url: "https://youtu.be/",
    match: /^m.youtube.com$/,
    selector: ".player-container",
    needExtraData: true,
  },
  {
    host: CoreVideoService.youtube,
    url: "https://youtu.be/",
    match: (enteredUrl) =>
      /^(www.)?youtube(-nocookie|kids)?.com$/.test(enteredUrl.hostname) &&
      enteredUrl.pathname.startsWith("/tv"),
    selector: "#container",
    needExtraData: true,
  },
  {
    host: CoreVideoService.youtube,
    url: "https://youtu.be/",
    match: (url: URL) =>
      /^(www.)?youtube(-nocookie|kids)?.com$/.test(url.host) &&
      !url.pathname.startsWith("/embed/"),
    selector: ".html5-video-container:not(#inline-player *)",
    needExtraData: true,
  },
  {
    host: CoreVideoService.youtube,
    url: "https://youtu.be/",
    additionalData: "embed",
    match: (url: URL) =>
      /^(www.)?youtube(-nocookie|kids)?.com$/.test(url.host) &&
      url.pathname.startsWith("/embed/"),
    selector: "html",
    needExtraData: true,
  },
  {
    host: CoreVideoService.youtube,
    url: "https://youtu.be/",
    match: (url) => /^music\.youtube\.com$/.test(url.host),
    selector: "#song-video",
    eventSelector: "#player",
    needExtraData: true,
  },
  {
    host: CoreVideoService.invidious,
    url: "https://youtu.be/",
    match: sitesInvidious,
    selector: sharedSelectors.idPlayer,
    needBypassCSP: true,
  },
  {
    host: CoreVideoService.piped,
    url: "https://youtu.be/",
    match: sitesPiped,
    selector: sharedSelectors.shakaPlayer,
    needBypassCSP: true,
  },
  {
    host: CoreVideoService.preservetube,
    url: "https://preservetube.com/",
    match: /^preservetube\.com$/,
    selector: "div.video-wrapper",
    needExtraData: true,
  },
  {
    host: CoreVideoService.zdf,
    url: "https://www.zdf.de/play/",
    match: [/^zdf.de$/, /^(www.)?zdf.de$/],
    selector: "div.zdfplayer-app.zdfplayer-desktop, div.zdfplayer-app",
  },
  {
    host: CoreVideoService.niconico,
    url: "https://www.nicovideo.jp/watch/",
    match: [/^(www\.|sp\.)?nicovideo\.jp$/, /^nico\.ms$/],
    selector: `[class*="grid-area_[player]"] > div`,
  },
  {
    additionalData: "mobile",
    host: CoreVideoService.vk,
    url: "https://vk.com/",
    match: [/^m.vk.(com|ru)$/, /^m.vkvideo.ru$/],
    selector: sharedSelectors.vkVideoPlayer,
    shadowRoot: true,
    needExtraData: true,
  },
  {
    additionalData: "clips",
    host: CoreVideoService.vk,
    url: "https://vk.com/",
    match: /^(www.|m.)?vk.(com|ru)$/,
    selector: 'div[data-testid="clipcontainer-video"]',
    needExtraData: true,
  },
  {
    host: CoreVideoService.vk,
    url: "https://vk.com/",
    match: [/^(www\.|m\.)?vk\.(com|ru)$/, /^(.*\.)?vkvideo\.ru$/],
    selector: sharedSelectors.vkVideoPlayer,
    needExtraData: true,
  },
  {
    host: CoreVideoService.nine_gag,
    url: "https://9gag.com/gag/",
    match: /^9gag.com$/,
    selector: ".video-post",
    needExtraData: true,
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
    needExtraData: true,
    selector: ".video-ref, main > div > section > div > div > div",
  },
  {
    host: CoreVideoService.proxitok,
    url: "https://www.tiktok.com/",
    match: sitesProxiTok,
    selector: ".column.has-text-centered",
  },
  {
    host: CoreVideoService.tiktok,
    url: "https://www.tiktok.com/",
    match: /^(www.)?tiktok.com$/,
    selector: null,
  },
  {
    host: ExtVideoService.douyin,
    url: "https://www.douyin.com/",
    match: /^(www.)?douyin.com/,
    selector: ".xg-video-container",
    needExtraData: true,
    needBypassCSP: true,
  },
  {
    host: CoreVideoService.vimeo,
    url: "https://vimeo.com/",
    match: /^(www\.|m\.)?vimeo.com$/,
    needExtraData: true,
    selector: sharedSelectors.player,
  },
  {
    host: CoreVideoService.vimeo,
    url: "https://player.vimeo.com/",
    match: /^player.vimeo.com$/,
    additionalData: "embed",
    needExtraData: true,
    needBypassCSP: true,
    selector: sharedSelectors.player,
  },
  {
    host: CoreVideoService.xvideos,
    url: "https://www.xvideos.com/",
    match: [
      /^(www.)?xvideos(-ar)?.com$/,
      /^(www.)?xvideos(\d\d\d).com$/,
      /^(www.)?xv-ru.com$/,
    ],
    selector: "#hlsplayer",
    needBypassCSP: true,
  },
  {
    host: CoreVideoService.xhamster,
    url: "https://xhamster.com/",
    match: (url: URL) =>
      /^(?:[^.]+\.)?(?:xhamster\.(?:com|desi)|xhamster\d+\.(?:com|desi)|xhvid\.com)$/.test(
        url.host,
      ) && /\/(?:videos\/[^/]+-[\dA-Za-z]+)\/?$/.test(url.pathname),
    selector: "#player-container",
  },
  {
    host: CoreVideoService.spankbang,
    url: "https://spankbang.com/",
    match: (url: URL) =>
      /^(?:[^.]+\.)?spankbang\.com$/.test(url.host) &&
      /\/(?:[\da-z]+\/(?:video|play|embed)(?:\/[^/]+)?|[\da-z]+-[\da-z]+\/playlist\/[^/?#&]+)\/?$/i.test(
        url.pathname,
      ),
    selector: "#main_video_player",
  },
  {
    host: CoreVideoService.rule34video,
    url: "https://rule34video.com/video/",
    match: (url: URL) =>
      /^(www\.)?rule34video\.com$/.test(url.host) &&
      /\/videos?\/\d+/.test(url.pathname),
    selector: sharedSelectors.flowplayer,
  },
  {
    host: CoreVideoService.picarto,
    url: "https://picarto.tv/",
    match: (url: URL) =>
      /^(www\.)?picarto\.tv$/.test(url.host) &&
      /^(?:\/[^/]+\/(?:profile\/)?videos\/[^/?#&]+|\/videopopout\/[^/?#&]+|\/[^/#?]+\/?)$/.test(
        url.pathname,
      ),
    selector: `[class*="VideosTab__PlayerWrapper"]`,
  },
  {
    host: CoreVideoService.olympicsreplay,
    url: "https://olympics.com/",
    match: (url: URL) =>
      /^(www\.)?olympics\.com$/.test(url.host) &&
      /^\/[a-z]{2}\/(?:[a-z0-9-]+\/)?(?:replay|videos?|original-series\/episode)\/[\w-]+\/?$/i.test(
        url.pathname,
      ),
    selector: sharedSelectors.videoJsUniversal,
  },
  {
    host: CoreVideoService.pornhub,
    url: "https://rt.pornhub.com/view_video.php?viewkey=",
    match: /^[a-z]+.pornhub.(com|org)$/,
    selector: "div.video-element-wrapper-js",
  },
  {
    additionalData: "embed",
    host: CoreVideoService.pornhub,
    url: "https://rt.pornhub.com/view_video.php?viewkey=",
    match: (url: URL) =>
      /^[a-z]+.pornhub.(com|org)$/.exec(url.host) &&
      url.pathname.startsWith("/embed/"),
    selector: sharedSelectors.idPlayer,
  },
  {
    host: CoreVideoService.twitter,
    url: "https://twitter.com/i/status/",
    match: /^(twitter|x).com$/,
    selector: 'div[data-testid="videoComponent"]',
    needBypassCSP: true,
  },
  {
    host: CoreVideoService.rumble,
    url: "https://rumble.com/",
    match: /^rumble.com$/,
    selector: `[id^="vid_"] > div`,
  },
  {
    host: CoreVideoService.facebook,
    url: "https://facebook.com/",
    match: (url: URL) =>
      url.host.includes("facebook.com") && url.pathname.includes("/videos/"),
    selector: 'div[role="main"] div[data-pagelet$="video" i]',
    needBypassCSP: true,
  },
  {
    additionalData: "reels",
    host: CoreVideoService.facebook,
    url: "https://facebook.com/",
    match: (url: URL) =>
      url.host.includes("facebook.com") && url.pathname.includes("/reel/"),
    selector: 'div[role="main"]',
    needBypassCSP: true,
  },
  {
    host: CoreVideoService.rutube,
    url: "https://rutube.ru/video/",
    match: /^rutube.ru$/,
    selector: `div[class*="videoWrapper"]`,
  },
  {
    additionalData: "embed",
    host: CoreVideoService.rutube,
    url: "https://rutube.ru/video/",
    match: /^rutube.ru$/,
    selector: "#app > div > div",
  },
  {
    host: CoreVideoService.bilibili,
    url: "https://www.bilibili.com/",
    match: /^(www|m|player).bilibili.com$/,
    selector: sharedSelectors.bilibiliPlayer,
  },
  {
    host: CoreVideoService.bilibili,
    url: "https://www.bilibili.tv/",
    match: /^(?:www\.|m\.)?bilibili\.tv$/,
    selector: sharedSelectors.bilibiliPlayer,
  },
  // Добавляет лишние видео в обработчик
  {
    additionalData: "old", // /blackboard/webplayer/embed-old.html
    host: CoreVideoService.bilibili,
    url: "https://www.bilibili.com/",
    match: /^(www|m).bilibili.com$/,
    selector: null,
  },
  {
    host: CoreVideoService.mailru,
    url: "https://my.mail.ru/",
    match: /^my.mail.ru$/,
    selector: "#b-video-wrapper",
  },
  {
    host: CoreVideoService.bitchute,
    url: "https://www.bitchute.com/video/",
    match: /^(www.)?bitchute.com$/,
    selector: sharedSelectors.videoJsUniversal,
  },
  {
    host: CoreVideoService.eporner,
    url: "https://www.eporner.com/",
    match: /^(www.)?eporner.com$/,
    selector: sharedSelectors.videoJsUniversal,
  },
  {
    host: CoreVideoService.peertube,
    url: "stub",
    match: sitesPeertube,
    selector: sharedSelectors.videoJsUniversal,
  },
  {
    host: CoreVideoService.dailymotion,
    url: "https://www.dailymotion.com/video/",
    match:
      /^((www\.|player\.)?dailymotion\.com|geo(\d+)?\.dailymotion\.com|dai\.ly)$/,
    selector: sharedSelectors.player,
  },
  {
    host: CoreVideoService.trovo,
    url: "https://trovo.live/s/",
    match: /^trovo.live$/,
    selector: ".player-video",
  },
  {
    host: CoreVideoService.yandexdisk,
    url: "https://yadi.sk/",
    match:
      /^disk.yandex.(ru|kz|com(\.(am|ge|tr))?|by|az|co\.il|ee|lt|lv|md|net|tj|tm|uz)$/,
    selector: ".video-player__player > div:nth-child(1)",
    needBypassCSP: true,
    needExtraData: true,
  },
  {
    host: CoreVideoService.okru,
    url: "https://ok.ru/video/",
    match: /^ok.ru$/,
    selector: sharedSelectors.vkVideoPlayer,
    shadowRoot: true,
  },
  {
    host: CoreVideoService.googledrive,
    url: "https://drive.google.com/file/d/",
    match: /^youtube.googleapis.com$/,
    selector: "html",
  },
  {
    host: CoreVideoService.bannedvideo,
    url: "https://madmaxworld.tv/watch?id=",
    match: /^(www.)?banned.video|madmaxworld.tv$/,
    selector: sharedSelectors.videoJsUniversal,
    needExtraData: true,
  },
  {
    host: CoreVideoService.weverse,
    url: "https://weverse.io/",
    match: /^weverse.io$/,
    selector: ".webplayer-internal-source-wrapper",
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
        )) ||
      (/^(?:www\.)?weibo\.com$/.test(url.host) &&
        /^\/newlogin\/?$/.test(url.pathname) &&
        (url.searchParams.has("url") ||
          /^[A-Za-z0-9]+$/.test(url.searchParams.get("layerid") ?? ""))),
    selector: sharedSelectors.videoJsUniversal || "#playVideo",
  },
  {
    host: CoreVideoService.newgrounds,
    url: "https://www.newgrounds.com/",
    match: /^(www.)?newgrounds.com$/,
    selector: ".ng-video-player",
  },
  {
    host: CoreVideoService.egghead,
    url: "https://egghead.io/",
    match: /^egghead.io$/,
    selector: ".cueplayer-react-video-holder",
  },
  {
    host: CoreVideoService.youku,
    url: "https://v.youku.com/",
    match: /^v.youku.com$/,
    selector: "#ykPlayer",
  },
  {
    host: CoreVideoService.archive,
    url: "https://archive.org/details/",
    match: /^archive.org$/,
    selector: sharedSelectors.jwPlayer,
    needExtraData: true,
  },
  {
    host: CoreVideoService.kodik,
    url: "stub",
    match: /^kodikplayer.com$/,
    selector: sharedSelectors.flowplayer,
    needExtraData: true,
  },
  {
    host: CoreVideoService.patreon,
    url: "stub",
    match: /^(www.)?patreon.com$/,
    selector: `[class*="videoArea"]`,
    needExtraData: true,
  },
  {
    additionalData: "old",
    host: CoreVideoService.reddit,
    url: "stub",
    match: /^old.reddit.com$/,
    selector: ".reddit-video-player-root",
    needExtraData: true,
    needBypassCSP: true,
  },
  {
    host: CoreVideoService.reddit,
    url: "stub",
    match: /^(www.|new.)?reddit.com$/,
    selector: "div[slot=post-media-container]",
    shadowRoot: true,
    needExtraData: true,
    needBypassCSP: true,
  },
  {
    host: CoreVideoService.kick,
    url: "https://kick.com/",
    match: /^kick.com$/,
    selector: "#injected-embedded-channel-player-video > div",
    needExtraData: true,
  },
  {
    host: CoreVideoService.appledeveloper,
    url: "https://developer.apple.com/",
    match: /^developer.apple.com$/,
    selector: ".developer-video-player",
    needExtraData: true,
    needBypassCSP: true,
  },
  {
    host: CoreVideoService.epicgames,
    url: "https://dev.epicgames.com/community/learning/",
    match: /^dev.epicgames.com$/,
    selector: sharedSelectors.videoJsUniversal,
    needExtraData: true,
  },
  {
    host: CoreVideoService.odysee,
    url: "stub",
    match: /^odysee.com$/,
    selector: ".video-js-parent",
    needExtraData: true,
  },
  {
    host: CoreVideoService.coursehunterLike,
    url: "stub",
    match: sitesCoursehunterLike,
    selector: null,
    needExtraData: true,
  },
  {
    host: CoreVideoService.sap,
    url: "https://learning.sap.com/courses/",
    match: /^learning.sap.com$/,
    selector: ".kaltura-player-container",
    needExtraData: true,
    needBypassCSP: true,
  },
  {
    host: ExtVideoService.udemy,
    url: "https://www.udemy.com/",
    match: /udemy.com$/,
    selector: sharedSelectors.shakaPlayer,
    needExtraData: true,
  },
  {
    host: ExtVideoService.datacamp,
    url: "https://www.datacamp.com/courses/",
    match: (url) =>
      /^(?:campus\.|projector\.)?datacamp\.com$/.test(url.hostname),
    selector: sharedSelectors.videoJsUniversal,
    needExtraData: true,
  },
  {
    // ONLY IF YOU LOGINED TO COURSERA /learn/NAME/lecture/XXXX
    host: ExtVideoService.coursera,
    url: "https://www.coursera.org/",
    match: /coursera.org$/,
    selector: sharedSelectors.videoJsUniversal,
    needExtraData: true,
  },
  {
    host: CoreVideoService.watchpornto,
    url: "https://watchporn.to/",
    match: /^watchporn.to$/,
    selector: sharedSelectors.flowplayer,
  },
  {
    host: CoreVideoService.jove,
    url: "https://jove.com/",
    match: /^(?:app|www)\.jove\.com$/,
    selector: sharedSelectors.flowplayer,
  },
  {
    host: CoreVideoService.linkedin,
    url: "https://www.linkedin.com/learning/",
    match: /^(www.)?linkedin.com$/,
    selector: sharedSelectors.videoJsUniversal,
    needExtraData: true,
    needBypassCSP: true,
  },
  {
    host: CoreVideoService.incestflix,
    url: "https://www.incestflix.net/watch/",
    match: /^(www.)?incestflix.(net|to|com)$/,
    selector: "#incflix-stream",
    needExtraData: true,
  },
  {
    host: CoreVideoService.porntn,
    url: "https://porntn.com/videos/",
    match: /^porntn.com$/,
    selector: sharedSelectors.flowplayer,
    needExtraData: true,
  },
  {
    host: CoreVideoService.dzen,
    url: "https://dzen.ru/video/watch/",
    match: /^dzen.ru$/,
    selector: `[class*="player__playerWrap"] > div`,
  },
  {
    host: CoreVideoService.bunnystream,
    url: "stub",
    match: [
      /^video\.bunnycdn\.com$/,
      /^iframe\.mediadelivery\.net$/,
      /^(?:[^.]+\.)*b-cdn\.net$/,
    ],
    selector: null,
  },
  {
    host: CoreVideoService.cloudflarestream,
    url: "stub",
    match: /^(watch|embed|iframe|customer-[^.]+).cloudflarestream.com$/,
    selector: null,
  },
  {
    host: CoreVideoService.loom,
    url: "https://www.loom.com/share/",
    match: /^(www.)?loom.com$/,
    selector: ".VideoLayersContainer",
    needExtraData: true,
    needBypassCSP: true,
  },
  {
    host: ExtVideoService.artstation,
    url: "https://www.artstation.com/learning/",
    match: /^(www.)?artstation.com$/,
    selector: sharedSelectors.videoJsUniversal,
    needExtraData: true,
  },
  {
    host: CoreVideoService.rtnews,
    url: "https://www.rt.com/",
    match: /^(www.)?rt.com$/,
    selector: sharedSelectors.jwPlayer,
    needExtraData: true,
  },
  {
    host: CoreVideoService.bitview,
    url: "https://www.bitview.net/watch?v=",
    match: /^(www.)?bitview.net$/,
    selector: ".vlScreen",
    needExtraData: true,
  },
  {
    host: ExtVideoService.kickstarter,
    url: "https://www.kickstarter.com/",
    match: /^(www.)?kickstarter.com/,
    selector: ".ksr-video-player",
    needExtraData: true,
  },
  {
    host: CoreVideoService.thisvid,
    url: "https://thisvid.com/",
    match: /^(www.)?thisvid.com$/,
    selector: sharedSelectors.flowplayer,
  },
  {
    additionalData: "regional",
    host: CoreVideoService.ign,
    url: "https://de.ign.com/",
    match: /^(\w{2}.)?ign.com$/,
    needExtraData: true,
    selector: ".video-container",
  },
  {
    host: CoreVideoService.ign,
    url: "https://www.ign.com/",
    match: /^(www.)?ign.com$/,
    selector: sharedSelectors.player,
    needExtraData: true,
  },
  {
    host: CoreVideoService.bunkr,
    url: "https://bunkr.site/",
    // https://github.com/mikf/gallery-dl/blob/master/gallery_dl/extractor/bunkr.py
    match:
      /^bunkr\.(site|black|cat|media|red|site|ws|org|s[kiu]|c[ir]|fi|p[hks]|ru|la|is|to|a[cx])$/,
    needExtraData: true,
    selector: ".plyr__video-wrapper",
  },
  {
    host: CoreVideoService.imdb,
    url: "https://www.imdb.com/video/",
    match: /^(www\.)?imdb\.com$/,
    selector: sharedSelectors.jwPlayer,
  },
  {
    host: CoreVideoService.telegram,
    url: "https://t.me/",
    match: (url: URL) =>
      /^web\.telegram\.org$/.test(url.hostname) &&
      url.pathname.startsWith("/k"),
    selector: ".ckin__player",
  },
  {
    host: ExtVideoService.oraclelearn,
    url: "https://mylearn.oracle.com/ou/course/",
    match: /^mylearn\.oracle\.com/,
    selector: sharedSelectors.videoJsUniversal,
    needExtraData: true,
    needBypassCSP: true,
  },
  {
    host: ExtVideoService.deeplearningai,
    url: "https://learn.deeplearning.ai/courses/",
    match: /^learn(-dev|-staging)?\.deeplearning\.ai/,
    selector: ".lesson-video-player",
    needExtraData: true,
  },
  {
    host: ExtVideoService.netacad,
    url: "https://www.netacad.com/",
    match: /^(www\.)?netacad\.com/,
    selector: sharedSelectors.videoJsUniversal,
    needExtraData: true,
  },
  {
    host: ExtVideoService.mediafile,
    url: "https://mediafile.cc/",
    match: /^(www\.)?mediafile\.cc$/,
    selector: "div#playerContainer",
    needExtraData: true,
  },
  {
    host: ExtVideoService.skilljar,
    url: "https://anthropic.skilljar.com/",
    match: /skilljar\.com$/,
    selector: sharedSelectors.jwPlayer,
    needExtraData: true,
  },
  {
    host: CoreVideoService.custom,
    url: "stub",
    match: (url: URL) => /([^.]+)\.(mp4|webm)/.test(url.pathname),
    rawResult: true,
  },
] as ServiceConf[];

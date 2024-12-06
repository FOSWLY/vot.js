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

import { ExtVideoService, type ServiceConf } from "../types/service";

export default [
  {
    additionalData: "mobile",
    host: CoreVideoService.youtube,
    url: "https://youtu.be/",
    match: /^m.youtube.com$/,
    selector: "shorts-video #player",
  },
  {
    additionalData: "mobile",
    host: CoreVideoService.youtube,
    url: "https://youtu.be/",
    match: /^m.youtube.com$/,
    selector: ".player-container",
  },
  {
    host: CoreVideoService.youtube,
    url: "https://youtu.be/",
    match: /^(www.)?youtube(-nocookie|kids)?.com$/,
    selector: ".html5-video-container:not(#inline-player *)",
  },
  {
    host: CoreVideoService.invidious,
    url: "https://youtu.be/",
    match: sitesInvidious,
    selector: "#player",
    needBypassCSP: true,
  },
  {
    host: CoreVideoService.piped,
    url: "https://youtu.be/",
    match: sitesPiped,
    selector: ".shaka-video-container",
    needBypassCSP: true,
  },
  {
    host: CoreVideoService.poketube,
    url: "https://youtu.be/",
    match: sitesPoketube,
    selector: ".video-player-container",
  },
  {
    host: CoreVideoService.ricktube,
    url: "https://youtu.be/",
    match: sitesRicktube,
    selector: "#oframeplayer > pjsdiv:has(video)",
  },
  {
    additionalData: "mobile",
    host: CoreVideoService.vk,
    url: "https://vk.com/video?z=",
    match: /^m.vk.(com|ru)$/,
    selector: "vk-video-player",
    shadowRoot: true,
    needExtraData: true,
  },
  {
    additionalData: "clips",
    host: CoreVideoService.vk,
    url: "https://vk.com/video?z=",
    match: /^(www.|m.)?vk.(com|ru)$/,
    selector: 'div[data-testid="clipcontainer-video"]',
    needExtraData: true,
  },
  {
    host: CoreVideoService.vk,
    url: "https://vk.com/video?z=",
    match: [/^(www.|m.)?vk.(com|ru)$/, /^(www.|m.)?vkvideo.ru$/],
    selector: ".videoplayer_media",
    needExtraData: true,
  },
  {
    host: CoreVideoService.nine_gag,
    url: "https://9gag.com/gag/",
    match: /^9gag.com$/,
    selector: ".video-post",
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
    host: CoreVideoService.vimeo,
    url: "https://vimeo.com/",
    match: /^vimeo.com$/,
    needExtraData: true,
    selector: ".player",
  },
  {
    host: CoreVideoService.vimeo,
    url: "https://player.vimeo.com/",
    match: /^player.vimeo.com$/,
    additionalData: "embed",
    needExtraData: true,
    needBypassCSP: true,
    selector: ".player",
  },
  {
    host: CoreVideoService.xvideos,
    url: "https://www.xvideos.com/",
    match: /^(www.)?(xvideos|xv-ru).com$/,
    selector: ".video-bg-pic",
    needBypassCSP: true,
  },
  {
    host: CoreVideoService.pornhub,
    url: "https://rt.pornhub.com/view_video.php?viewkey=",
    match: /^[a-z]+.pornhub.com$/,
    selector: ".mainPlayerDiv > .video-element-wrapper-js > div",
    eventSelector: ".mgp_eventCatcher",
  },
  {
    additionalData: "embed",
    host: CoreVideoService.pornhub,
    url: "https://rt.pornhub.com/view_video.php?viewkey=",
    match: (url: URL) =>
      url.host.includes("pornhub.com") && url.pathname.startsWith("/embed/"),
    selector: "#player",
  },
  {
    host: CoreVideoService.twitter,
    url: "https://twitter.com/i/status/",
    match: /^(twitter|x).com$/,
    selector: 'div[data-testid="videoComponent"] > div:nth-child(1) > div',
    eventSelector: 'div[data-testid="videoPlayer"]',
    needBypassCSP: true,
  },
  {
    host: CoreVideoService.rumble,
    url: "https://rumble.com/",
    match: /^rumble.com$/,
    selector: "#videoPlayer > .videoPlayer-Rumble-cls > div",
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
    selector: ".video-player > div > div > div:nth-child(2)",
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
    selector: ".bpx-player-video-wrap",
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
    selector: ".video-js",
  },
  {
    host: CoreVideoService.eporner,
    url: "https://www.eporner.com/",
    match: /^(www.)?eporner.com$/,
    selector: ".vjs-v7",
  },
  {
    host: CoreVideoService.peertube,
    url: "stub",
    match: sitesPeertube,
    selector: ".vjs-v7",
  },
  {
    host: CoreVideoService.dailymotion,
    url: "https://dai.ly/",
    match: /^geo([\d]+)?.dailymotion.com$/,
    selector: ".player",
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
    match: /^disk.yandex.ru$/,
    selector: ".video-player__player > div:nth-child(1)",
    eventSelector: ".video-player__player",
    needBypassCSP: true,
    needExtraData: true,
  },
  {
    host: CoreVideoService.okru,
    url: "https://ok.ru/video/",
    match: /^ok.ru$/,
    selector: "vk-video-player",
    shadowRoot: true,
  },
  {
    host: CoreVideoService.googledrive,
    url: "https://drive.google.com/file/d/",
    match: /^youtube.googleapis.com$/,
    selector: ".html5-video-container",
  },
  {
    host: CoreVideoService.bannedvideo,
    url: "https://madmaxworld.tv/watch?id=",
    match: /^(www.)?banned.video|madmaxworld.tv$/,
    selector: ".vjs-v7",
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
    selector: ".jw-media",
  },
  {
    host: CoreVideoService.kodik,
    url: "stub",
    match: /^kodik.(info|biz|cc)$/,
    selector: ".fp-player",
    needExtraData: true,
  },
  {
    host: CoreVideoService.patreon,
    url: "stub",
    match: /^(www.)?patreon.com$/,
    selector:
      'div[data-tag="post-card"] div[elevation="subtle"] > div > div > div > div',
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
    selector: ".vjs-v7",
    needExtraData: true,
  },
  {
    host: CoreVideoService.nineanimetv,
    url: "https://9animetv.to/watch/",
    match: /^rapid-cloud.co$/,
    selector: ".jw-media",
    needExtraData: true,
  },
  {
    host: CoreVideoService.odysee,
    url: "stub",
    match: /^odysee.com$/,
    selector: ".vjs-v7",
    needExtraData: true,
  },
  {
    host: CoreVideoService.coursehunterLike,
    url: "stub",
    match: sitesCoursehunterLike,
    selector: "#oframeplayer > pjsdiv:has(video)",
    needExtraData: true,
  },
  {
    host: CoreVideoService.sap,
    url: "https://learning.sap.com/courses/",
    match: /^learning.sap.com$/,
    selector: ".playkit-container",
    eventSelector: ".playkit-player",
    needExtraData: true,
    needBypassCSP: true,
  },
  {
    host: ExtVideoService.udemy,
    url: "https://www.udemy.com/",
    match: /udemy.com$/,
    selector:
      'div[data-purpose="curriculum-item-viewer-content"] > section > div > div > div > div:nth-of-type(2)',
    needExtraData: true,
  },
  {
    // ONLY IF YOU LOGINED TO COURSERA /learn/NAME/lecture/XXXX
    host: ExtVideoService.coursera,
    url: "https://www.coursera.org/",
    match: /coursera.org$/,
    selector: ".vjs-v8",
    needExtraData: true,
  },
  {
    host: CoreVideoService.watchpornto,
    url: "https://watchporn.to/",
    match: /^watchporn.to$/,
    selector: ".fp-player",
  },
  {
    host: CoreVideoService.linkedin,
    url: "https://www.linkedin.com/learning/",
    match: /^(www.)?linkedin.com$/,
    selector: ".vjs-v7",
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
    selector: ".fp-player",
    needExtraData: true,
  },
  {
    host: CoreVideoService.dzen,
    url: "https://dzen.ru/video/watch/",
    match: /^dzen.ru$/,
    selector: ".zen-ui-video-video-player",
  },
  {
    host: CoreVideoService.cloudflarestream,
    url: "stub",
    match: /^(watch|embed|iframe|customer-[^.]+).cloudflarestream.com$/,
  },
  {
    host: CoreVideoService.custom,
    url: "stub",
    match: (url: URL) => /([^.]+).(mp4|webm)/.test(url.pathname),
    rawResult: true,
  },
] as ServiceConf[];

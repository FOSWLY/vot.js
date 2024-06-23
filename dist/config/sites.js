import { VideoService } from "../types/yandex";
import { sitesInvidious, sitesPiped, sitesProxiTok, sitesPeertube, } from "./alternativeUrls";
export default [
    {
        host: VideoService.youtube,
        url: "https://youtu.be/",
        match: /^((www.|m.)?youtube(-nocookie|kids)?.com)|(youtu.be)$/,
    },
    {
        // Sites host Invidious. I tested the performance only on invidious.kevin.rocks, youtu.be and inv.vern.cc
        host: VideoService.invidious,
        url: "https://youtu.be/",
        match: sitesInvidious,
    },
    {
        // Sites host Piped. I tested the performance only on piped.video
        host: VideoService.piped,
        url: "https://youtu.be/",
        match: sitesPiped,
    },
    {
        host: VideoService.vk,
        url: "https://vk.com/video?z=",
        match: /^(www.|m.)?vk.(com|ru)$/,
    },
    {
        host: VideoService.nine_gag,
        url: "https://9gag.com/gag/",
        match: /^9gag.com$/,
    },
    {
        host: VideoService.twitch,
        url: "https://twitch.tv/",
        match: [
            /^m.twitch.tv$/,
            /^(www.)?twitch.tv$/,
            /^clips.twitch.tv$/,
            /^player.twitch.tv$/,
        ],
    },
    {
        host: VideoService.proxitok,
        url: "https://www.tiktok.com/",
        match: sitesProxiTok,
    },
    {
        host: VideoService.tiktok,
        url: "https://www.tiktok.com/",
        match: /^(www.)?tiktok.com$/,
    },
    {
        host: VideoService.vimeo,
        url: "https://vimeo.com/",
        match: /^vimeo.com$/,
    },
    {
        host: VideoService.vimeo,
        url: "https://player.vimeo.com/",
        match: /^player.vimeo.com$/,
    },
    {
        host: VideoService.xvideos,
        url: "https://www.xvideos.com/",
        match: /^(www.)?xvideos.com$/,
    },
    {
        host: VideoService.pornhub,
        url: "https://rt.pornhub.com/view_video.php?viewkey=",
        match: /^[a-z]+.pornhub.com$/,
    },
    {
        host: VideoService.twitter,
        url: "https://twitter.com/i/status/",
        match: /^twitter.com$/,
    },
    {
        host: VideoService.rumble,
        url: "https://rumble.com/",
        match: /^rumble.com$/,
    },
    {
        host: VideoService.facebook,
        url: "https://facebook.com/",
        match: (url) => url.host.includes("facebook.com") &&
            (url.pathname.includes("/videos/") || url.pathname.includes("/reel/")),
    },
    {
        host: VideoService.rutube,
        url: "https://rutube.ru/video/",
        match: /^rutube.ru$/,
    },
    {
        host: VideoService.bilibili,
        url: "https://www.bilibili.com/video/",
        match: /^(www|m|player).bilibili.com$/,
    },
    {
        host: VideoService.mailru,
        url: "https://my.mail.ru/",
        match: /^my.mail.ru$/,
    },
    {
        host: VideoService.bitchute,
        url: "https://www.bitchute.com/video/",
        match: /^(www.)?bitchute.com$/,
    },
    {
        host: VideoService.eporner,
        url: "https://www.eporner.com/",
        match: /^(www.)?eporner.com$/,
    },
    {
        host: VideoService.peertube,
        url: "stub", // This is a stub. The present value is set using origin url
        match: sitesPeertube,
    },
    {
        host: VideoService.dailymotion,
        url: "https://dai.ly/",
        match: /^(www.)?dailymotion.com|dai.ly$/,
    },
    {
        host: VideoService.trovo,
        url: "https://trovo.live/s/",
        match: /^trovo.live$/,
    },
    {
        host: VideoService.yandexdisk,
        url: "https://yadi.sk/i/",
        match: /^disk.yandex.ru|yadi.sk$/,
    },
    {
        host: VideoService.okru,
        url: "https://ok.ru/video/",
        match: /^ok.ru$/,
    },
    {
        host: VideoService.googledrive,
        url: "https://drive.google.com/file/d/",
        match: /^drive.google.com$/,
    },
    {
        host: VideoService.bannedvideo,
        url: "https://madmaxworld.tv/watch?id=", // madmaxworld.tv for bypass cloudflare uam on /watch page
        match: /^(www.)?banned.video|madmaxworld.tv$/,
    },
    {
        host: VideoService.weverse,
        url: "https://weverse.io/",
        match: /^weverse.io$/,
    },
    {
        host: VideoService.newgrounds,
        url: "https://www.newgrounds.com/",
        match: /^(www.)?newgrounds.com$/,
    },
    {
        // TODO: Добавить поддержку tips (сделать через m3u8 т.к. обычная ссылка не принимается) и платных курсов
        host: VideoService.egghead,
        url: "https://egghead.io/",
        match: /^egghead.io$/,
    },
    {
        host: VideoService.youku,
        url: "https://v.youku.com/",
        match: /^v.youku.com$/,
    },
    {
        host: VideoService.kodik,
        url: "stub", // This is a stub. Final url is set in getVideoData function
        match: /^kodik.(info|biz|cc)$/,
    },
    {
        host: VideoService.patreon,
        url: "stub", // This is a stub. Final url is set in getVideoData function
        match: /^(www.)?patreon.com$/,
    },
    {
        host: VideoService.custom,
        url: "stub", // This is a stub. The present value is set using origin url
        match: (url) => /([^.]+).mp4/.test(url.pathname),
    },
];

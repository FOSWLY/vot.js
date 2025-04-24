import { describe, test, expect } from "bun:test";
import { getVideoData } from "../packages/node/src/utils/videoData";
import config from "../packages/shared/src/data/config";
import { fetchWithTimeout } from "../packages/shared/src/utils/utils";

// de.ign.com returns 403 in Russia and maybe in some other countries
const proxied = Bun.env.HTTP_PROXY ?? Bun.env.HTTPS_PROXY;

const fetchWithProxy = (
  url: string | URL | Request,
  options: Record<string, any> = {
    headers: {
      "User-Agent": config.userAgent,
    },
    proxy: proxied,
  },
) => {
  return fetchWithTimeout(url, options);
};

const normalize = async (url: string, referer?: string) => {
  const data = await getVideoData(url, { referer, fetchFn: fetchWithProxy });
  // console.log(data);
  return data?.url;
};

describe("youtube", () => {
  const expected = "https://youtu.be/LK6nLR1bzpI";

  test("short", async () => {
    expect(await normalize(expected)).toEqual(expected);
  });
  test("normal", async () => {
    expect(await normalize("https://youtube.com/watch?v=LK6nLR1bzpI")).toEqual(
      expected,
    );
  });
  test("normal + queries", async () => {
    expect(
      await normalize(
        "https://youtube.com/watch?v=LK6nLR1bzpI&list=dfgfdgwd&index=8",
      ),
    ).toEqual(expected);
  });
  test("embed", async () => {
    expect(await normalize("https://youtube.com/embed/LK6nLR1bzpI")).toEqual(
      expected,
    );
  });
  test("mobile", async () => {
    expect(
      await normalize("https://m.youtube.com/watch?v=LK6nLR1bzpI"),
    ).toEqual(expected);
  });
  test("invidious", async () => {
    expect(await normalize("https://yewtu.be/watch?v=LK6nLR1bzpI")).toEqual(
      expected,
    );
  });
  test("piped", async () => {
    expect(await normalize("https://piped.video/watch?v=LK6nLR1bzpI")).toEqual(
      expected,
    );
  });
  test("poketube", async () => {
    expect(await normalize("https://poketube.fun/watch?v=LK6nLR1bzpI")).toEqual(
      expected,
    );
  });
  test("ricktube", async () => {
    expect(await normalize("https://ricktube.ru/watch?v=LK6nLR1bzpI")).toEqual(
      expected,
    );
  });
});

describe("vk", () => {
  const expected = "https://vk.com/video?z=video-197217619_456239151";
  test("video", async () => {
    expect(await normalize(expected)).toEqual(expected);
  });
  test("video with channel/group", async () => {
    expect(
      await normalize(
        "https://vk.com/video/@hololivepics?z=video-197217619_456239151",
      ),
    ).toEqual(expected);
  });
  test("video short", async () => {
    expect(await normalize("https://vk.com/video-197217619_456239151")).toEqual(
      expected,
    );
  });
  test("video playlist", async () => {
    expect(
      await normalize(
        "https://vkvideo.ru/playlist/-36637441_9/video-36637441_456240372",
      ),
    ).toEqual("https://vk.com/video?z=video-36637441_456240372");
  });
  test("with club id", async () => {
    expect(
      await normalize(
        "https://vk.com/videos-77521?z=video-77521_162222515%2Fclub77521",
      ),
    ).toEqual("https://vk.com/video?z=video-77521_162222515");
  });
  test("solid long video id", async () => {
    expect(
      await normalize("https://vkvideo.ru/video1036523373_456239034"),
    ).toEqual("https://vk.com/video?z=video1036523373_456239034");
  });
  test("embed", async () => {
    expect(
      await normalize(
        "https://vk.com/video_ext.php?oid=-77521&id=162222515&hash=87b046504ccd8bfa",
      ),
    ).toEqual("https://vk.com/video?z=video-77521_162222515");
  });
  test("clips", async () => {
    expect(
      await normalize(
        "https://vk.com/clips-74006511?z=clip-74006511_456247211",
      ),
    ).toEqual("https://vk.com/video?z=clip-74006511_456247211");
  });
  test("solid clip id", async () => {
    expect(await normalize("https://vk.com/clip30014565_456240946")).toEqual(
      "https://vk.com/video?z=clip30014565_456240946",
    );
  });
});

test("9gag", async () => {
  const expected = "https://9gag.com/gag/a1mePmP";
  expect(await normalize(expected)).toEqual(expected);
});

describe("twitch", () => {
  const expectedClip =
    "https://twitch.tv/littlemisstina/clip/AnnoyingCallousUdonBibleThump-OjU_BN2egdPWQLhl";
  const expectedVideo = "https://twitch.tv/videos/2161902531";
  describe("clips", () => {
    test("normal", async () => {
      expect(await normalize(expectedClip)).toEqual(expectedClip);
    });
    test("mobile", async () => {
      expect(
        await normalize(
          "https://m.twitch.tv/littlemisstina/clip/AnnoyingCallousUdonBibleThump-OjU_BN2egdPWQLhl",
        ),
      ).toEqual(expectedClip);
    });
    test("clips subdomain", async () => {
      expect(
        await normalize(
          "https://clips.twitch.tv/AnnoyingCallousUdonBibleThump-OjU_BN2egdPWQLhl",
        ),
      ).toEqual(expectedClip);
    });
    test("clips embed", async () => {
      expect(
        await normalize(
          "https://clips.twitch.tv/embed?clip=AnnoyingCallousUdonBibleThump-OjU_BN2egdPWQLhl&parent=ya.ru",
        ),
      ).toEqual(expectedClip);
    });
  });

  describe("videos", () => {
    test("normal", async () => {
      expect(await normalize(expectedVideo)).toEqual(expectedVideo);
    });
    test("mobile", async () => {
      expect(await normalize("https://m.twitch.tv/videos/2161902531")).toEqual(
        expectedVideo,
      );
    });
    test("embed", async () => {
      expect(
        await normalize(
          "https://player.twitch.tv/?video=2161902531&parent=ya.ru",
        ),
      ).toEqual(expectedVideo);
    });
  });
});

describe("tiktok", () => {
  const expected =
    "https://www.tiktok.com/@atpapparel_/video/7060162784562023681";
  test("normal", async () => {
    expect(await normalize(expected)).toEqual(expected);
  });
  test("proxitok", async () => {
    expect(
      await normalize(
        "https://proxitok.pabloferreiro.es/@atpapparel_/video/7060162784562023681?lang=en&t=1717455050396",
      ),
    ).toEqual(expected);
  });
});

describe("vimeo", () => {
  const expected = "https://vimeo.com/1074816435";
  const expectedUnlisted = "https://vimeo.com/1074813550/af636e7a9d";
  test("public", async () => {
    expect(await normalize(expected)).toEqual(expected);
  });
  test("unlisted", async () => {
    expect(await normalize(expectedUnlisted)).toEqual(expectedUnlisted);
  });
  test("embed", async () => {
    expect(
      await normalize("https://player.vimeo.com/video/1074816435"),
    ).toEqual(expected);
  });
  test("embed unlisted", async () => {
    const expected = "https://player.vimeo.com/video/1074813550?h=af636e7a9d";
    expect(await normalize(expected)).toEqual(expectedUnlisted);
  });
  test("embed hidden", async () => {
    const expected = "https://player.vimeo.com/video/722299957";
    expect(await normalize(expected, "https://leetcode.com/")).toEqual(
      expected,
    );
  });
  test("embed hidden 2", async () => {
    const expected = "https://player.vimeo.com/video/994752187";
    expect(await normalize(expected, "https://laracasts.com/")).toEqual(
      expected,
    );
  });
  test("channels video", async () => {
    expect(
      await normalize("https://vimeo.com/channels/keypeele/75629013"),
    ).toEqual("https://vimeo.com/75629013");
  });
  test("groups video", async () => {
    expect(
      await normalize("https://vimeo.com/groups/travelhd/videos/22439234"),
    ).toBeOneOf([
      "https://vimeo.com/terjes/themountain",
      "https://vimeo.com/22439234",
    ]);
  });
  test("album video", async () => {
    expect(
      await normalize("https://vimeo.com/album/2632481/video/79010983"),
    ).toEqual("https://vimeo.com/79010983");
  });
  test("showcase video", async () => {
    expect(
      await normalize("https://vimeo.com/showcase/2632481/video/79010983"),
    ).toEqual("https://vimeo.com/79010983");
  });
});

describe("xvideos", () => {
  const pathname = "video.iulmvlvbaff/_";
  const expected = `https://www.xvideos.com/${pathname}`;
  test("normal", async () => {
    expect(await normalize(expected)).toEqual(expected);
  });
  test("xv-ru", async () => {
    expect(await normalize(`https://xv-ru.com/${pathname}`)).toEqual(expected);
  });
  test("xvideos-ar", async () => {
    expect(await normalize(`https://xvideos-ar.com/${pathname}`)).toEqual(
      expected,
    );
  });
  test("xvideos with numbers", async () => {
    expect(await normalize(`https://xvideos005.com/${pathname}`)).toEqual(
      expected,
    );
  });
});

describe("pornhub", () => {
  const expected =
    "https://rt.pornhub.com/view_video.php?viewkey=63fbab152b987";
  const embedUrl = "https://rt.pornhub.com/embed/63fbab152b987";

  test("normal (tld .com)", async () => {
    expect(await normalize(expected)).toEqual(expected);
  });
  test("normal (tld .org)", async () => {
    expect(
      await normalize(expected.replace("pornhub.com", "pornhub.org")),
    ).toEqual(expected);
  });
  test("embed (tld .com)", async () => {
    expect(await normalize(embedUrl)).toEqual(expected);
  });
  test("embed (tld .org)", async () => {
    expect(
      await normalize(embedUrl.replace("pornhub.com", "pornhub.org")),
    ).toEqual(expected);
  });
});

describe("twitter", () => {
  const expected = "https://twitter.com/i/status/1764435177265074440";
  test("normal", async () => {
    expect(await normalize(expected)).toEqual(expected);
  });

  test("normal (x.com)", async () => {
    expect(await normalize(expected.replace("twitter.com", "x.com"))).toEqual(
      expected,
    );
  });

  test("with channel", async () => {
    expect(
      await normalize(
        "https://twitter.com/morganmillipede/status/1764435177265074440",
      ),
    ).toEqual(expected);
  });
});

test("rumble", async () => {
  const expected =
    "https://rumble.com/v4x6daq-the-maldives-of-thailandkhao-sok-thailands-best-kept-secret-.html";
  expect(await normalize(expected)).toEqual(expected);
});

describe("facebook", () => {
  test("normal", async () => {
    const expected =
      "https://facebook.com/61555539449269/videos/763712302417182";
    expect(await normalize(expected)).toEqual(expected);
  });
  test("reels", async () => {
    const expected = "https://facebook.com/reel/2477335955735821";
    expect(await normalize(expected)).toEqual(expected);
  });
});

describe("rutube", () => {
  const expected = "https://rutube.ru/video/05cf562327c7c4397294c84343ca0c8a";
  test("normal", async () => {
    expect(await normalize(expected)).toEqual(expected);
  });
  test("embed", async () => {
    expect(
      await normalize(
        "https://rutube.ru/play/embed/05cf562327c7c4397294c84343ca0c8a",
      ),
    ).toEqual(expected);
  });
});

describe("bilibili", () => {
  const expected = "https://www.bilibili.com/video/BV1rw41177Ha";
  test("normal", async () => {
    expect(await normalize(expected)).toEqual(expected);
  });
  test("embed", async () => {
    expect(
      await normalize(
        "https://player.bilibili.com/player.html?isOutside=true&aid=326463122&bvid=BV1rw41177Ha&cid=1411046954&p=1",
      ),
    ).toEqual(expected);
  });
  test("bangumi", async () => {
    const expectedBangumi = "https://www.bilibili.com/bangumi/play/ep277052";
    expect(await normalize(expectedBangumi)).toEqual(expectedBangumi);
  });
});

describe("mail.ru", () => {
  const expected = "https://my.mail.ru/v/thisishorosho_tv/video/22/1251.html";
  test("normal", async () => {
    expect(await normalize(expected)).toEqual(expected);
  });
  test("embed", async () => {
    expect(
      await normalize("https://my.mail.ru/video/embed/-15860145993022237"),
    ).toEqual(expected);
  });
});

describe("bitchute", () => {
  const expected = "https://www.bitchute.com/video/Jg05UmA6vEI";
  test("normal", async () => {
    expect(await normalize(expected)).toEqual(expected);
  });
  test("embed", async () => {
    expect(
      await normalize("https://www.bitchute.com/embed/Jg05UmA6vEI/"),
    ).toEqual(expected);
  });
});

test("eporner", async () => {
  const expected =
    "https://www.eporner.com/video-XXXXXXXXX/isdfsd-dfjsdfjsdf-dsfsdf-dsfsda-dsad-ddsd";
  expect(await normalize(expected)).toEqual(expected);
});

describe("peertube", () => {
  test("tube.shanti.cafe", async () => {
    const expected = "https://tube.shanti.cafe/w/pf94VxeC9H7CtV9MYyJeLU";
    expect(await normalize(expected)).toEqual(expected);
  });

  test("dalek.zone", async () => {
    const expected = "https://dalek.zone/w/pf94VxeC9H7CtV9MYyJeLU";
    expect(await normalize(expected)).toEqual(expected);
  });
});

describe("dailymotion", () => {
  const expected = "https://dai.ly/x8rikn3";
  test("normal", async () => {
    expect(
      await normalize("https://www.dailymotion.com/video/x8rikn3"),
    ).toEqual(expected);
  });
  test("short", async () => {
    expect(await normalize(expected)).toEqual(expected);
  });
});

test("trovo", async () => {
  const expected =
    "https://trovo.live/s/JI9IJIbKA/549786549905?vid=vc-3270835012275231775";
  expect(await normalize(expected)).toEqual(expected);
});

describe("yandex disk", () => {
  const expected = "https://yadi.sk/i/hbqmQQTZAWB8Mw";
  const tlds = [
    "ru",
    "kz",
    "com",
    "com.am",
    "com.ge",
    "com.tr",
    "by",
    "az",
    "co.il",
    "ee",
    "lt",
    "lv",
    "md",
    "net",
    "tj",
    "tm",
    "uz",
  ];

  for (const tld of tlds) {
    test(`normal (tld .${tld})`, async () => {
      expect(
        await normalize(`https://disk.yandex.${tld}/i/hbqmQQTZAWB8Mw`),
      ).toEqual(expected);
    });
  }

  test("short", async () => {
    expect(await normalize(expected)).toEqual(expected);
  });

  test("direct /d/ to file", async () => {
    expect(await normalize("https://disk.yandex.ru/d/XK2xRGsn1UVwDQ")).toEqual(
      "https://yadi.sk/d/XK2xRGsn1UVwDQ",
    );
  });

  test("/d/ -> short", async () => {
    expect(
      await normalize(
        "https://disk.yandex.ru/d/v5S3KvwKt3v7yA/youtube_BpMUCLduj4w_1920x1080_h264.mp4",
      ),
    ).toEqual("https://yadi.sk/i/v4oEo0ctFDGMJw");
  });

  test("/d/ -> mp4", async () => {
    const result = await normalize(
      "https://disk.yandex.ru/d/v5S3KvwKt3v7yA/test/%D0%9D%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%BF%D0%B0%D0%BF%D0%BA%D0%B0/ntcn.mp4",
    );
    try {
      expect(result).toStartWith(
        "https://media-proxy.toil.cc/v1/proxy/video.mp4",
      );
    } catch {
      expect(result).toEqual(
        "https://yadi.sk/d/v5S3KvwKt3v7yA/test/Новая папка/ntcn.mp4",
      );
    }
  });
});

test("ok.ru", async () => {
  const expected = "https://ok.ru/video/8003385887462";
  expect(await normalize(expected)).toEqual(expected);
});

test("googledrive", async () => {
  const expected =
    "https://drive.google.com/file/d/11TuE51IU-M4KN37fZPcLWKfd0qvba1b9";
  expect(await normalize(`${expected}/view`)).toEqual(expected);
});

describe("banned.video", () => {
  const expected = "download.assets.video";
  test("normal", async () => {
    expect(
      await normalize("https://banned.video/watch?id=65c66d0b0d63da299ea7d975"),
    ).toInclude(expected);
  });
  test("madmaxworld", async () => {
    expect(
      await normalize(
        "https://madmaxworld.tv/watch?id=65c66d0b0d63da299ea7d975",
      ),
    ).toInclude(expected);
  });
});

describe("weverse", () => {
  const expected = ".akamaized.net/c/read/v2/VOD_ALPHA/";
  test("media", async () => {
    expect(
      await normalize("https://weverse.io/redvelvet/media/4-139332911"),
    ).toInclude(expected);
  });
  test("finished live", async () => {
    expect(
      await normalize("https://weverse.io/aespa/live/3-142049908"),
    ).toInclude(expected);
  });
});

test("newgrounds", async () => {
  const expected = "https://www.newgrounds.com/portal/view/932993";
  expect(await normalize(expected)).toEqual(expected);
});

test("egghead", async () => {
  const expected =
    "https://egghead.io/lessons/javascript-find-items-from-the-end-of-the-javascript-array-using-at-findlast-and-findlastindex";
  expect(await normalize(expected)).toEqual(expected);
});

test("youku", async () => {
  const expected = "https://v.youku.com/v_show/id_XNTk1MDg3MzE2MA==";
  expect(
    await normalize(
      `${expected}.html?spm=a2hja.14919748_WEBHOME_NEW.drawer2.d_zj1_1&s=fabd799ef8f546219853&scm=20140719.rcmd.35027.show_fabd799ef8f546219853&s=fabd799ef8f546219853`,
    ),
  ).toEqual(expected);
});

describe("custom", () => {
  test(".mp4", async () => {
    const expected = "https://s3.toil.cc/vot/video.mp4";
    expect(await normalize(expected)).toEqual(expected);
  });
  test(".webm", async () => {
    const expected = "https://s3.toil.cc/vot/output444.webm";
    expect(await normalize(expected)).toEqual(expected);
  });
});

describe("kodik", () => {
  test("seria", async () => {
    expect(
      await normalize(
        "https://kodik.info/seria/864861/1f1f70ee75bbb2f1806e90db27ec151b/720p?translations=false&min_age=18",
      ),
    ).toEndWith(".mp4:hls:manifest.m3u8");
  });
  test("serial", async () => {
    expect(
      await normalize(
        "https://kodik.info/serial/31656/60a52cca719ac3447cdba400c1b80b40/720p",
      ),
    ).toEndWith(".mp4:hls:manifest.m3u8");
  });
  test("video", async () => {
    expect(
      await normalize(
        "https://kodik.biz/video/9935/313bc89421b094f6f374cc7420e00ad1/720p?translations=false&min_age=16",
      ),
    ).toEndWith(".mp4:hls:manifest.m3u8");
  });
});

test("patreon", async () => {
  expect(
    await normalize("https://www.patreon.com/posts/choose-your-66310078"),
  ).toStartWith("https://stream.mux.com");
});

describe("reddit", () => {
  const expected = "https://v.redd.it/l0wpsygl8tpc1/HLSPlaylist.m3u8";
  test("www", async () => {
    expect(
      await normalize(
        "https://www.reddit.com/r/Unexpected/comments/1bkqj2u/rookie_ninja_warrior_rises_to_the_top/",
      ),
    ).toStartWith(expected);
  });
  test("new", async () => {
    expect(
      await normalize(
        "https://new.reddit.com/r/Unexpected/comments/1bkqj2u/rookie_ninja_warrior_rises_to_the_top/",
      ),
    ).toStartWith(expected);
  });
  test("old", async () => {
    expect(
      await normalize(
        "https://old.reddit.com/r/Unexpected/comments/1bkqj2u/rookie_ninja_warrior_rises_to_the_top/",
      ),
    ).toStartWith(expected);
  });
});

describe("kick", () => {
  test("video", async () => {
    const expected =
      "https://kick.com/chopstix/videos/e8ccfbab-ff88-4e93-83a5-8f0f5e82d621";
    expect(await normalize(expected)).toEqual(expected);
  });

  test("clips", async () => {
    const expected =
      "https://kick.com/coverdiva/clips/clip_01J3K1KCNRFEDAH62QYFNX7ANM";
    expect(await normalize(expected)).toInclude(
      "clip_01J3K1KCNRFEDAH62QYFNX7ANM",
    );
  });
});

test("apple_developer", async () => {
  const normalized = await normalize(
    "https://developer.apple.com/videos/play/wwdc2024/10068/",
  );
  expect(normalized).toStartWith(
    "https://devstreaming-cdn.apple.com/videos/wwdc/2024/10068/",
  );
  expect(normalized).toEndWith("cmaf.m3u8");
});

test("epicgames", async () => {
  const normalized = await normalize(
    "https://dev.epicgames.com/community/learning/tutorials/lMr9/unreal-engine-begin-play-programming",
  );
  expect(normalized).toStartWith("https://cdn.qstv.on.epicgames.com/");
});

test("odysee", async () => {
  const normalized = await normalize(
    "https://odysee.com/@fort_boyard:b/%C3%89mission-du-mercredi-14-ao%C3%BBt-2024-en-replay---Fort-Boyard---toujours-plus-fort-!:5",
  );
  expect(normalized).toStartWith("https://player.odycdn.com/");
});

describe("coursehunterLike", () => {
  test("coursehunter", async () => {
    const normalized = await normalize(
      "https://coursehunter.net/course/intensiv-docker-2-0?lesson=3",
    );
    expect(normalized).toInclude("coursehunter.net");
    expect(normalized).toEndWith("/lesson3.mp4");
  });
  test("coursetrain", async () => {
    const normalized = await normalize(
      "https://coursetrain.net/course/uderzhanie-sostoyaniya-i-upravlenie-emociyami-emocionalnyy-intellekt-v-deystvii?lesson=1",
    );
    expect(normalized).toInclude("coursetrain.net");
    expect(normalized).toEndWith("/lesson1.mp4");
  });
});

describe("sap", () => {
  const courseUrl =
    "https://learning.sap.com/courses/opportunities-and-success-for-partners-in-sap-s-industry-cloud";
  test("course demo", async () => {
    const normalized = await normalize(courseUrl);

    expect(normalized).toInclude("kaltura.com");
    expect(normalized).toInclude(".mp4");
  });
  test("course video", async () => {
    const normalized = await normalize(
      `${courseUrl}/introduction-to-sap-s-industry-cloud-for-partners_LE_fe1cc42e-59b4-45fd-8b23-2561c6aa9331`,
    );

    expect(normalized).toInclude("kaltura.com");
    expect(normalized).toInclude(".mp4");
  });
  test("learning journey", async () => {
    const learningJourney =
      "https://learning.sap.com/learning-journeys/discovering-sap-activate-implementation-tools-and-methodology/describing-sap-activate";
    const normalized = await normalize(learningJourney);

    expect(normalized).toInclude("kaltura.com");
    expect(normalized).toInclude(".mp4");
  });
});

describe("watchporn.to", () => {
  test("watchpornto", async () => {
    const expected = "https://watchporn.to/video/80811/latinsandra-the-cuck/";
    const normalized = await normalize(expected);
    expect(normalized).toEqual(expected);
  });
  test("watchpornto", async () => {
    const expected = "https://watchporn.to/embed/80811";
    const normalized = await normalize(expected);
    expect(normalized).toEqual(expected);
  });
});

test("linkedin", async () => {
  const expected =
    "https://www.linkedin.com/learning/learning-personal-branding-2018/your-most-powerful-marketing-tool";
  const normalized = await normalize(
    `${expected}?autoplay=true&trk=course_preview&upsellOrderOrigin=default_guest_learning`,
  );
  expect(normalized).toStartWith(`https://${config.mediaProxy}`);
  expect(normalized).toIncludeRepeated(`dms.licdn.com`, 2);
});

test("incestflix", async () => {
  const normalized = await normalize(
    "http://www.incestflix.com/watch/deviant-kat-waking-mommy-up-blowjob",
  );
  expect(normalized).toStartWith(`https://${config.mediaProxy}`);
  expect(normalized).toIncludeRepeated("incestflix.net", 2);
});

test("porntn", async () => {
  const normalized = await normalize(
    "https://porntn.com/videos/23452/maimy-asmr-9-april-2025-kissing-you/",
  );
  expect(normalized).toInclude("porntn.com");
});

test("dzen", async () => {
  const expected = "https://dzen.ru/video/watch/667d9f7f73e0bf4fe67fee32";
  const normalized = await normalize(expected);
  expect(normalized).toEqual(expected);
});

describe("cloudflare stream", () => {
  test("iframe", async () => {
    const expected =
      "https://iframe.cloudflarestream.com/392348aa04e4f6a09437f43319ee6a3d?ad-url=https%3A%2F%2Fpubads.g.doubleclick.net%2Fgampad%2Flive%2Fads%3Fiu%3D%2F23018193484%2Ftcn_preroll%26tfcd%3D0%26npa%3D0%26sz%3D640x480%257C640x480%26gdfp_req%3D1%26unviewed_position_start%3D1%26output%3Dvast%26env%3Dvp%26impl%3Ds%26correlator%3D%26nofb%3D1%26vad_type%3Dlinear%26description_url%3D%252Flavrov-interview%26cust_params%3Dvideo_id%253D403&preload=metadata&autoplay=true";
    const normalized = await normalize(expected);
    expect(normalized).toEqual(expected);
  });
  test("embed", async () => {
    const expected =
      "https://embed.cloudflarestream.com/embed/iframe.fla9.9caa4cd.html?videoId=f677b46ad2860f8e716a5d9051d67ec7";
    const normalized = await normalize(expected);
    expect(normalized).toEqual(expected);
  });
  test("customer", async () => {
    const expected =
      "https://customer-k5rghq683w5sm3cf.cloudflarestream.com/08305713d67ee6e204c0435b7ae5ce7f/iframe?muted=true&preload=true&loop=true&autoplay=true&poster=https%3A%2F%2Fcustomer-k5rghq683w5sm3cf.cloudflarestream.com%2F08305713d67ee6e204c0435b7ae5ce7f%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600";
    const normalized = await normalize(expected);
    expect(normalized).toEqual(expected);
  });
});

describe("loom", () => {
  const expected =
    "https://www.loom.com/share/a0c5fd9e3e5f4beb9151b076b20f77fb";
  test("embed", async () => {
    const videoUrl =
      "https://www.loom.com/embed/a0c5fd9e3e5f4beb9151b076b20f77fb";
    const normalized = await normalize(videoUrl);
    expect(normalized).toEqual(expected);
  });
  test("customer", async () => {
    const normalized = await normalize(expected);
    expect(normalized).toEqual(expected);
  });
});

test("rt news", async () => {
  const normalized = await normalize(
    "https://www.rt.com/russia/610519-putin-attends-mass-christmas/",
  );
  expect(normalized).toInclude(".mp4");
});

test("bitview", async () => {
  const normalized = await normalize(
    "https://www.bitview.net/watch?v=0rnJ4lQr",
  );
  expect(normalized).toInclude(".mp4");
});

describe("thisvid", () => {
  test("videos", async () => {
    const expected = "https://thisvid.com/videos/any-video";
    expect(await normalize(expected)).toBe(expected);
  });
  test("embed", async () => {
    const expected = "https://thisvid.com/embed/234234324324";
    expect(await normalize(expected)).toBe(expected);
  });
});

describe("ign", () => {
  test("post video", async () => {
    const expected = "https://de.ign.com/destiny-2/146053/video/embed";
    const normalized = await normalize(expected);
    if (proxied) {
      expect(normalized).toStartWith(`https://${config.mediaProxy}`);
    } else {
      expect(normalized).toBe(expected);
    }
  });
  test("post video embed", async () => {
    const expected =
      "https://de.ign.com/destiny-2/146053/video/destiny-2-heresy-offizieller-high-heresy-cinematic-trailer";
    const normalized = await normalize(expected);
    if (proxied) {
      expect(normalized).toStartWith(`https://${config.mediaProxy}`);
    } else {
      expect(normalized).toBe(expected);
    }
  });
  test("video", async () => {
    const expected =
      "https://www.ign.com/videos/5-things-to-know-about-atomfall";
    expect(await normalize(expected)).toStartWith(
      `https://${config.mediaProxy}`,
    );
  });
});

test("bunkr", async () => {
  const normalized = await normalize("https://bunkr.cr/f/Ry0ahg2JHhCHX");
  expect(normalized).toInclude(".mp4");
});

test("imdb", async () => {
  const expected = "https://www.imdb.com/video/vi2443363097";
  const normalized = await normalize(expected);
  expect(normalized).toBe(expected);
});

test("telegram", async () => {
  const expected = "https://t.me/topor/42828";
  const normalized = await normalize(expected);
  expect(normalized).toBe(expected);
});

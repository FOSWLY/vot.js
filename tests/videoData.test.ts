import { describe, test, expect } from "bun:test";
import { getVideoData } from "../src/utils/videoData";
import config from "../src/config/config";

const normalize = async (url: string) => {
  return (await getVideoData(url))?.url;
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
});

test("raw link", async () => {
  const raw = "https://s3.toil.cc/vot/video.mp4";
  expect(await normalize(raw)).toEqual(raw);
});

describe("vk", () => {
  const expected = "https://vk.com/video?z=video-197217619_456239151";
  test("vk video", async () => {
    expect(await normalize(expected)).toEqual(expected);
  });
  test("vk video channel", async () => {
    expect(
      await normalize(
        "https://vk.com/video/@hololivepics?z=video-197217619_456239151",
      ),
    ).toEqual(expected);
  });
  test("vk video short", async () => {
    expect(await normalize("https://vk.com/video-197217619_456239151")).toEqual(
      expected,
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
  const expected = "https://vimeo.com/149640932";
  test("normal", async () => {
    expect(await normalize(expected)).toEqual(expected);
  });
  test("embed", async () => {
    expect(await normalize("https://player.vimeo.com/video/149640932")).toEqual(
      "https://player.vimeo.com/video/149640932",
    );
  });
});

test("xvideos", async () => {
  const expected = "https://www.xvideos.com/video.iulmvlvbaff/_";
  expect(await normalize(expected)).toEqual(expected);
});

describe("pornhub", () => {
  const expected =
    "https://rt.pornhub.com/view_video.php?viewkey=63fbab152b987";
  test("normal", async () => {
    expect(await normalize(expected)).toEqual(expected);
  });
  test("embed", async () => {
    expect(
      await normalize("https://rt.pornhub.com/embed/63fbab152b987"),
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
  test("normal", async () => {
    expect(await normalize("https://disk.yandex.ru/i/hbqmQQTZAWB8Mw")).toEqual(
      expected,
    );
  });
  test("short", async () => {
    expect(await normalize(expected)).toEqual(expected);
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
    expect(await normalize(expected)).toInclude(expected);
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

test("nineanimetv", async () => {
  const normalized = await normalize(
    "https://9animetv.to/watch/narenare-cheer-for-you-19220?ep=126180",
  );
  expect(normalized).toEndWith("master.m3u8");
});

test("odysee", async () => {
  const normalized = await normalize(
    "https://odysee.com/@fort_boyard:b/%C3%89mission-du-mercredi-14-ao%C3%BBt-2024-en-replay---Fort-Boyard---toujours-plus-fort-!:5",
  );
  expect(normalized).toStartWith("https://player.odycdn.com/");
});

test("coursehunter", async () => {
  const normalized = await normalize(
    "https://coursehunter.net/course/intensiv-docker-2-0?lesson=3",
  );
  expect(normalized).toInclude("coursehunter.net");
  expect(normalized).toEndWith("/lesson3.mp4");
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
  expect(normalized).toIncludeRepeated(`.mp4`, 2);
});

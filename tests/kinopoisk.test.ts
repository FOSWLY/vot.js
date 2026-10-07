import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import KinopoiskHelper, {
  isKinopoiskUrl,
} from "../packages/ext/src/helpers/kinopoisk";
import sites from "../packages/ext/src/data/sites";
import { ExtVideoService } from "../packages/ext/src/types/service";
import type { FetchFunction } from "../packages/core/src/types/providers/base";

const PAGE = new URL("https://www.kinopoisk.ru/film/6446910/");
const MASTER =
  "https://strm.yandex.ru/vod-content/test-trailer/master.m3u8?vsid=main&signature=test";
const AUDIO =
  "https://strm.yandex.ru/vod-content/test-trailer/audio.m3u8?vsid=main&signature=test";
const FILE =
  "https://strm.yandex.ru/vod-content/test-trailer/trailer.mp4?signature=test";
const VOD =
  "#EXTM3U\n#EXT-X-TARGETDURATION:10\n#EXTINF:10,\nsegment.ts\n#EXTINF:2.5,\nsegment2.ts\n#EXT-X-ENDLIST";
const HLS_MASTER = `#EXTM3U\n#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio",DEFAULT=YES,URI="${AUDIO}"\n#EXT-X-STREAM-INF:BANDWIDTH=100000,AUDIO="audio"\nvideo.m3u8`;

class TestVideo extends EventTarget {
  currentSrc = "blob:https://www.kinopoisk.ru/test";
  src = "";
  duration = 170;
  mediaKeys: unknown = null;
  isConnected = true;
  session: string | undefined = "main";
  sources: { src: string }[] = [];
  closest() {
    return this.session ? { id: `ya-video-player-${this.session}` } : null;
  }
  querySelectorAll() {
    return this.sources;
  }
}
class TestDocument extends EventTarget {
  title = "Test trailer";
  referrer = PAGE.href;
  videos: TestVideo[] = [];
  querySelectorAll() {
    return this.videos;
  }
}
let video: TestVideo;
let doc: TestDocument;
let entries: PerformanceEntry[];
let observers: PerformanceObserverCallback[];
let globals: Map<string, PropertyDescriptor | undefined>;
let responses: Map<string, string>;
let fetchFn: ReturnType<typeof mock<FetchFunction>>;

function setGlobal(name: string, value: unknown) {
  globals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
  Object.defineProperty(globalThis, name, {
    value,
    configurable: true,
    writable: true,
  });
}
function resource(url: string, time = 10) {
  const entry = {
    name: url,
    startTime: time,
    entryType: "resource",
    duration: 0,
  } as PerformanceEntry;
  entries.push(entry);
  observers.forEach((callback) =>
    callback(
      { getEntries: () => [entry] } as PerformanceObserverEntryList,
      {} as PerformanceObserver,
    ),
  );
}
function helper(withVideo = true) {
  return new KinopoiskHelper({
    video: withVideo ? (video as unknown as HTMLVideoElement) : undefined,
    fetchFn,
  });
}

beforeEach(() => {
  globals = new Map();
  video = new TestVideo();
  doc = new TestDocument();
  doc.videos = [video];
  entries = [];
  observers = [];
  responses = new Map([
    [MASTER, HLS_MASTER],
    [AUDIO, VOD],
  ]);
  fetchFn = mock(async (input: string | URL | Request) => {
    const url = String(input);
    const text = responses.get(url);
    if (text === undefined) throw new Error("Unexpected fixture request");
    return new Response(text);
  });
  setGlobal("window", { location: PAGE });
  setGlobal("document", doc);
  setGlobal("HTMLVideoElement", TestVideo);
  setGlobal("performance", { getEntriesByType: () => entries });
  setGlobal(
    "PerformanceObserver",
    class {
      constructor(callback: PerformanceObserverCallback) {
        observers.push(callback);
      }
      observe() {}
    },
  );
});
afterEach(() => {
  for (const [name, descriptor] of globals) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor);
    else Reflect.deleteProperty(globalThis, name);
  }
});

describe("Kinopoisk site matching", () => {
  test("catalogue and its iframe are registered", () => {
    const service = sites.find(
      (site) => site.host === ExtVideoService.kinopoisk,
    );
    expect(service?.needExtraData).toBe(true);
    expect(service?.needBypassCSP).toBe(true);
    const match = service?.match as (url: URL) => boolean;
    expect(match(PAGE)).toBe(true);
    expect(match(new URL("https://frontend.vh.yandex.ru/player/"))).toBe(true);
  });
  test.each([
    "https://hd.kinopoisk.ru/film/123/",
    "https://kinopoisk.ru.example.org/film/123/",
    "https://notkinopoisk.ru/film/123/",
    "http://www.kinopoisk.ru/film/123/",
  ])("declines unsupported context %s", (url) => {
    expect(isKinopoiskUrl(new URL(url), PAGE.href)).toBe(false);
  });
  test("shared Yandex iframe needs a catalogue referrer", () => {
    const frame = new URL("https://frontend.vh.yandex.ru/player/");
    expect(isKinopoiskUrl(frame, "")).toBe(false);
    expect(isKinopoiskUrl(frame, "https://hd.kinopoisk.ru/")).toBe(false);
    expect(isKinopoiskUrl(frame, "https://example.org/")).toBe(false);
    expect(isKinopoiskUrl(frame, "https://kinopoisk.ru/film/123/")).toBe(true);
  });
});

describe("Kinopoisk source extraction", () => {
  test("direct files need no playlist request", async () => {
    video.currentSrc = FILE;
    const h = helper();
    const id = await h.getVideoId(PAGE);
    expect(id).toBe("kinopoisk:test-trailer");
    const data = await h.getVideoData(id!);
    expect(data).toMatchObject({
      url: FILE,
      duration: 170,
      isStream: false,
      host: ExtVideoService.kinopoisk,
      title: doc.title,
    });
    expect(fetchFn).not.toHaveBeenCalled();
  });
  test("ID ignores signatures, sessions, CDN host and rendition", async () => {
    video.currentSrc = FILE;
    const first = await helper().getVideoId(PAGE);
    video.currentSrc =
      "https://other.strm.yandex.ru/vod-content/test-trailer/720p.mp4?vsid=another&signature=renewed";
    expect(await helper().getVideoId(PAGE)).toBe(first);
    video.currentSrc =
      "https://strm.yandex.ru/vod-content/another-trailer/trailer.mp4";
    expect(await helper().getVideoId(PAGE)).not.toBe(first);
  });
  test("binds blob resources to the correct player session", async () => {
    resource(MASTER);
    resource(
      "https://strm.yandex.ru/vod-content/advertisement/master.m3u8?vsid=ad",
      30,
    );
    resource(
      "https://strm.yandex.ru/vod-content/other-player/master.m3u8?vsid=other",
      40,
    );
    resource(AUDIO, 20);
    const h = helper();
    expect(await h.getVideoId(PAGE)).toBe("kinopoisk:test-trailer");
    const data = await h.getVideoData("kinopoisk:test-trailer");
    expect(data?.url).toBe(MASTER);
    expect(fetchFn.mock.calls.map(([url]) => String(url))).toEqual([
      MASTER,
      AUDIO,
    ]);
  });
  test("does not mistake init/segment MP4 files for complete video", async () => {
    resource(MASTER);
    for (const name of [
      "init-v1.mp4",
      "init-a1.mp4",
      "segment-1.mp4",
      "chunk2.mp4",
    ]) {
      resource(
        `https://strm.yandex.ru/vod-content/test-trailer/${name}?vsid=main`,
        100,
      );
    }
    expect((await helper().getVideoData("kinopoisk:test-trailer"))?.url).toBe(
      MASTER,
    );
  });
  test("multiple videos work only with an explicit active player", async () => {
    doc.videos.push(new TestVideo());
    resource(MASTER);
    expect(await helper(false).getVideoId(PAGE)).toBeUndefined();
    expect(await helper().getVideoId(PAGE)).toBe("kinopoisk:test-trailer");
  });
  test("declines ambiguous resources without a player session", async () => {
    video.session = undefined;
    resource(MASTER);
    resource(
      "https://strm.yandex.ru/vod-content/another-trailer/master.m3u8",
      30,
    );
    expect(await helper().getVideoId(PAGE)).toBeUndefined();
  });
  test("single unambiguous content works without a session", async () => {
    video.session = undefined;
    resource(MASTER);
    resource(AUDIO, 20);
    expect(await helper().getVideoId(PAGE)).toBe("kinopoisk:test-trailer");
  });
  test("waits for a late playlist request", async () => {
    const pending = helper().getVideoId(PAGE);
    resource(MASTER);
    expect(await pending).toBe("kinopoisk:test-trailer");
  });
  test("observer retains playlist after the timing buffer clears", async () => {
    video.currentSrc = FILE;
    await helper().getVideoId(PAGE);
    video.currentSrc = "blob:https://www.kinopoisk.ru/test";
    resource(MASTER);
    entries = [];
    expect(await helper().getVideoId(PAGE)).toBe("kinopoisk:test-trailer");
  });
  test("detached players do not keep polling", async () => {
    video.isConnected = false;
    expect(await helper().getVideoId(PAGE)).toBeUndefined();
    expect(fetchFn).not.toHaveBeenCalled();
  });
  test("rejects an ID belonging to a previous trailer", async () => {
    video.currentSrc = FILE;
    await expect(
      helper().getVideoData("kinopoisk:another-trailer"),
    ).rejects.toThrow("video changed");
    expect(fetchFn).not.toHaveBeenCalled();
  });
  test("standard SDK dispatch returns the registered host and stable ID", async () => {
    video.currentSrc = FILE;
    const { getVideoData } =
      await import("../packages/ext/src/utils/videoData");
    const service = sites.find(
      (site) => site.host === ExtVideoService.kinopoisk,
    )!;
    const data = await getVideoData(service, {
      video: video as unknown as HTMLVideoElement,
      fetchFn,
    });
    expect(data).toMatchObject({
      host: ExtVideoService.kinopoisk,
      videoId: "kinopoisk:test-trailer",
      url: FILE,
    });
  });
});

describe("Kinopoisk VOD validation", () => {
  test("uses playlist duration when DOM metadata is unavailable", async () => {
    resource(MASTER);
    video.duration = Number.NaN;
    const data = await helper().getVideoData("kinopoisk:test-trailer");
    expect(data?.duration).toBe(12.5);
    expect(data?.isStream).toBe(false);
  });
  test("METHOD=NONE is allowed for an unencrypted recording", async () => {
    video.currentSrc = AUDIO;
    responses.set(
      AUDIO,
      VOD.replace("#EXTINF:10,", "#EXT-X-KEY:METHOD=NONE\n#EXTINF:10,"),
    );
    expect((await helper().getVideoData("kinopoisk:test-trailer"))?.url).toBe(
      AUDIO,
    );
  });
  test.each([
    [
      "master encryption",
      MASTER,
      HLS_MASTER + '\n#EXT-X-SESSION-KEY:METHOD=SAMPLE-AES,URI="key"',
      "Encrypted",
    ],
    [
      "audio encryption",
      AUDIO,
      VOD + '\n#EXT-X-KEY:METHOD=AES-128,URI="key"',
      "Encrypted",
    ],
    ["live audio", AUDIO, VOD.replace("#EXT-X-ENDLIST", ""), "VOD"],
    ["invalid audio", AUDIO, "<html>expired</html>", "Invalid"],
    ["invalid master", MASTER, "not a playlist", "Invalid"],
    [
      "missing variants",
      MASTER,
      "#EXTM3U\n#EXT-X-STREAM-INF:BANDWIDTH=1000",
      "no media",
    ],
    [
      "invalid segments",
      AUDIO,
      "#EXTM3U\n#EXTINF:NaN,\nsegment.ts\n#EXT-X-ENDLIST",
      "valid segments",
    ],
  ])("rejects %s", async (_name, url, body, error) => {
    resource(MASTER);
    responses.set(url, body);
    await expect(
      helper().getVideoData("kinopoisk:test-trailer"),
    ).rejects.toThrow(error);
  });
  test("rejects unavailable signed playlists without exposing URL in error", async () => {
    video.currentSrc = MASTER;
    fetchFn = mock(async () => new Response("expired", { status: 403 }));
    await expect(
      helper().getVideoData("kinopoisk:test-trailer"),
    ).rejects.toThrow("request failed: 403");
  });
  test("rejects DRM before fetching media", async () => {
    video.currentSrc = MASTER;
    video.mediaKeys = {};
    await expect(
      helper().getVideoData("kinopoisk:test-trailer"),
    ).rejects.toThrow("DRM");
    expect(fetchFn).not.toHaveBeenCalled();
  });
  test("remembers encrypted events before mediaKeys is assigned", async () => {
    video.currentSrc = FILE;
    const h = helper();
    await h.getVideoId(PAGE);
    const event = new Event("encrypted");
    Object.defineProperty(event, "target", { value: video });
    doc.dispatchEvent(event);
    await expect(
      helper().getVideoData("kinopoisk:test-trailer"),
    ).rejects.toThrow("DRM");
  });
  test("rejects DRM appearing while the playlist is fetched", async () => {
    video.currentSrc = AUDIO;
    fetchFn = mock(async () => {
      video.mediaKeys = {};
      return new Response(VOD);
    });
    await expect(
      helper().getVideoData("kinopoisk:test-trailer"),
    ).rejects.toThrow("DRM");
  });
  test("rejects a source switch during playlist validation", async () => {
    video.currentSrc = AUDIO;
    fetchFn = mock(async () => {
      video.currentSrc = FILE;
      return new Response(VOD);
    });
    await expect(
      helper().getVideoData("kinopoisk:test-trailer"),
    ).rejects.toThrow("video changed");
  });
  test("declines DASH even if the player has not exposed mediaKeys", async () => {
    video.currentSrc =
      "https://strm.yandex.ru/vod-content/test-trailer/manifest.mpd";
    await expect(
      helper().getVideoData("kinopoisk:test-trailer"),
    ).rejects.toThrow("DASH");
    expect(fetchFn).not.toHaveBeenCalled();
  });
});

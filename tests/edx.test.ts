import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import EdxHelper from "../packages/ext/src/helpers/edx";
import { VideoHelperError } from "../packages/ext/src/helpers/base";
import { proxyMedia } from "../packages/shared/src/utils/utils";
import config from "../packages/shared/src/data/config";

const SELECTOR_RE = /^(\w+)?((?:\.[\w-]+)*)(?:\[([\w-]+)(?:="([^"]*)")?\])?$/;

class StubElement {
  children: StubElement[] = [];

  constructor(
    readonly tagName: string,
    readonly attrs: Record<string, string>,
    readonly parent?: StubElement,
  ) {}

  get id() {
    return this.attrs.id ?? "";
  }

  getAttribute(name: string) {
    return this.attrs[name] ?? null;
  }

  matches(selector: string) {
    const [, tag, classes, attr, value] = SELECTOR_RE.exec(selector) ?? [];
    const classList = (this.attrs.class ?? "").split(/\s+/);
    return (
      (!tag || tag === this.tagName) &&
      (classes ?? "")
        .split(".")
        .filter(Boolean)
        .every((name) => classList.includes(name)) &&
      (!attr ||
        (attr in this.attrs &&
          (value === undefined || this.attrs[attr] === value)))
    );
  }

  closest(selector: string): StubElement | null {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    for (let el: StubElement | undefined = this; el; el = el.parent) {
      if (el.matches(selector)) {
        return el;
      }
    }

    return null;
  }

  querySelectorAll(selector: string): StubElement[] {
    return this.children.flatMap((child) => [
      ...(child.matches(selector) ? [child] : []),
      ...child.querySelectorAll(selector),
    ]);
  }

  querySelector(selector: string) {
    return this.querySelectorAll(selector)[0] ?? null;
  }
}

async function parse(html: string) {
  const root = new StubElement("#root", {});
  let current = root;
  await new HTMLRewriter()
    .on("*", {
      element(el) {
        const node = new StubElement(
          el.tagName,
          Object.fromEntries(el.attributes),
          current,
        );
        current.children.push(node);
        current = node;
        el.onEndTag(() => {
          current = node.parent ?? root;
        });
      },
    })
    .transform(new Response(html))
    .text();
  return root;
}

const globals = globalThis as Record<string, unknown>;
const original = { window: globals.window, document: globals.document };

beforeAll(() => {
  globals.window = { location: { origin: "https://courses.edx.org" } };
});

afterAll(() => {
  globals.window = original.window;
  globals.document = original.document;
});

async function load(...html: string[]) {
  const root = await parse(html.join("\n"));
  globals.document = {
    referrer: "",
    querySelectorAll: (selector: string) => root.querySelectorAll(selector),
  };
  return root;
}

function createHelper(video?: StubElement | null) {
  return new EdxHelper({
    video: (video ?? undefined) as unknown as HTMLVideoElement | undefined,
  });
}

const pageUrl = new URL("https://courses.edx.org/xblock/vertical");

function fixture(name: string) {
  return Bun.file(
    new URL(`./fixtures/edx/${name}.html`, import.meta.url),
  ).text();
}

const attr = (name: string, value: unknown) =>
  typeof value === "string" ? ` ${name}="${value}"` : "";

function block(
  metadata: unknown,
  { usageId, blockId, video = true }: Record<string, string | boolean> = {},
) {
  return `
    <div class="xblock" data-block-type="video"${attr("data-usage-id", usageId)}>
      <div id="video_abc" class="video" data-course-id="course-v1:A+B+C"${attr("data-block-id", blockId)}
        data-metadata='${JSON.stringify(metadata)}'>
        <div class="video-wrapper"><div class="video-player">${video ? "<video></video>" : ""}</div></div>
      </div>
    </div>`;
}

const edx = (path: string) => `https://edx-video.net/${path}`;

describe("edx fixtures", () => {
  const cases: [string, string, number | undefined][] = [
    [
      "llap-hls-mp4-youtube",
      edx("28cbb307-3016-40dc-9233-a8a76822d880-mp4_720p.mp4"),
      319.594,
    ],
    [
      "cs50p-uuid-ru-transcript",
      edx("c44cf5d5-6f11-400f-a0dd-3ee7dd087f05-mp4_720p.mp4"),
      256.589,
    ],
    ["cs50t-legacy-naming", edx("HARCS50T2017-V000900_DTH.mp4"), 3543.44],
    [
      "berkeley-mp4-webm-hls",
      edx("BERGG101/BERGG101T314-V007500_100.mp4"),
      376.47,
    ],
    ["llap-youtube-only", "https://youtu.be/aZke6Va7kJU", undefined],
    [
      "tsinghua-youtube-duration-null",
      "https://youtu.be/SGotQmpbX-E",
      undefined,
    ],
    [
      "upv-fallback-mp4-youtube",
      proxyMedia(
        new URL(
          "https://media.upv.es/resources/imported/polimedia/74ba32e0-3fe0-11f1-a03d-53190adf5ac5/polimedia/polimedia-hls-presenter-720p.mp4",
        ),
      ),
      undefined,
    ],
    [
      "stanford-s3-fallback-youtube",
      proxyMedia(
        new URL(
          "https://s3-us-west-1.amazonaws.com/prod-edx/EP101/Video360p/Cold+Weekly+Check-in+%231.mp4",
        ),
      ),
      undefined,
    ],
    [
      "iscea-wistia-bin",
      proxyMedia(
        new URL(
          "https://embed-ssl.wistia.com/deliveries/67d8bd9762ba1a8a52d7a948dc9be9b10cdec00f.bin",
        ),
      ),
      undefined,
    ],
    [
      "ethx-switchtube-fallback",
      proxyMedia(new URL("https://tube.switch.ch/external/OH7OKqmmRY")),
      undefined,
    ],
  ];

  test.each(cases)("%s", async (name, url, duration) => {
    const root = await load(await fixture(name));
    const helper = createHelper(root.querySelector("video"));
    const videoId =
      (await helper.getVideoId(pageUrl)) ??
      root.querySelector(".xblock")?.getAttribute("data-usage-id");
    expect(videoId).toMatch(/^block-v1:.+\+type@video\+block@.+$/);

    const data = await helper.getVideoData(videoId!);
    expect(data?.url).toBe(url);
    expect(data?.duration).toBe(duration);
    expect(data && "duration" in data).toBe(duration !== undefined);
  });

  test("proxied urls keep the original url and point to the media proxy", async () => {
    const root = await load(await fixture("stanford-s3-fallback-youtube"));
    const helper = createHelper(root.querySelector("video"));
    const data = await helper.getVideoData((await helper.getVideoId(pageUrl))!);
    const proxied = new URL(data!.url);
    expect(proxied.host).toBe(config.mediaProxy);
    expect(atob(proxied.searchParams.get("url")!)).toBe(
      "https://s3-us-west-1.amazonaws.com/prod-edx/EP101/Video360p/Cold+Weekly+Check-in+%231.mp4",
    );
  });
});

describe("edx video id", () => {
  test("several players in one frame resolve their own block", async () => {
    const root = await load(
      await fixture("berkeley-mp4-webm-hls"),
      await fixture("cs50p-uuid-ru-transcript"),
      await fixture("cs50t-legacy-naming"),
    );
    const videos = root.querySelectorAll("video");
    expect(videos).toHaveLength(3);

    const urls: (string | undefined)[] = [];
    const ids = new Set<string | undefined>();
    for (const video of videos) {
      const helper = createHelper(video);
      const videoId = await helper.getVideoId(pageUrl);
      ids.add(videoId);
      urls.push((await helper.getVideoData(videoId!))?.url);
    }

    expect(ids.size).toBe(3);
    expect(urls).toEqual([
      edx("BERGG101/BERGG101T314-V007500_100.mp4"),
      edx("c44cf5d5-6f11-400f-a0dd-3ee7dd087f05-mp4_720p.mp4"),
      edx("HARCS50T2017-V000900_DTH.mp4"),
    ]);
  });

  test("without video the first block with a video element is used", async () => {
    await load(
      await fixture("llap-youtube-only"),
      await fixture("cs50p-uuid-ru-transcript"),
    );
    expect(await createHelper().getVideoId(pageUrl)).toBe(
      "block-v1:HarvardX+CS50P+Python+type@video+block@940c79bed904482ea9c8e7957b65bde8",
    );
  });

  test("youtube-only block without video element is skipped without errors", async () => {
    await load(await fixture("llap-youtube-only"));
    const helper = createHelper();
    expect(await helper.getVideoId(pageUrl)).toBeUndefined();
    expect(
      (
        await helper.getVideoData(
          "block-v1:BarbaraOakley_OlavSchewe+LLAP+2T2022+type@video+block@d37a8e36f1ec445bbe32efadfbfa89c7",
        )
      )?.url,
    ).toBe("https://youtu.be/aZke6Va7kJU");
  });

  test("falls back to data-block-id, then to course id and player id", async () => {
    const metadata = { sources: [edx("a.mp4")] };
    let root = await load(block(metadata, { blockId: "block-id" }));
    expect(
      await createHelper(root.querySelector("video")).getVideoId(pageUrl),
    ).toBe("block-id");

    root = await load(block(metadata));
    expect(
      await createHelper(root.querySelector("video")).getVideoId(pageUrl),
    ).toBe("course-v1:A+B+C:abc");
  });

  test("returns undefined when there is no video block", async () => {
    await load("<div></div>");
    expect(await createHelper().getVideoId(pageUrl)).toBeUndefined();
  });

  test("returns undefined for an unknown id", async () => {
    await load(block({ sources: [edx("a.mp4")] }, { usageId: "known" }));
    expect(await createHelper().getVideoData("unknown")).toBeUndefined();
  });
});

async function getUrl(metadata: unknown) {
  await load(block(metadata, { usageId: "id" }));
  return (await createHelper().getVideoData("id"))?.url;
}

describe("edx sources", () => {
  test("prefers mp4, then webm, then other formats, whatever the order", async () => {
    const hls = edx("a/a.m3u8");
    const webm = "https://cdn.example.com/a.webm";
    const other = "https://cdn.example.com/a.ogv";
    const mp4 = edx("a.mp4");
    expect(await getUrl({ sources: [hls, other, webm, mp4] })).toBe(mp4);
    expect(await getUrl({ sources: [hls, other, webm] })).toBe(
      proxyMedia(new URL(webm), "webm"),
    );
    expect(await getUrl({ sources: [hls, other] })).toBe(
      proxyMedia(new URL(other)),
    );
  });

  test("edx-video.net webm is requested directly", async () => {
    expect(await getUrl({ sources: [edx("a.webm")] })).toBe(edx("a.webm"));
  });

  test("uses the speed 1.00 youtube stream", async () => {
    expect(
      await getUrl({ sources: [], streams: "0.75:aaa,1.00:bbb,1.50:ccc" }),
    ).toBe("https://youtu.be/bbb");
  });

  test("prefers a direct source over the youtube stream", async () => {
    expect(await getUrl({ sources: [edx("a.mp4")], streams: "1.00:bbb" })).toBe(
      edx("a.mp4"),
    );
  });

  test("ignores invalid duration values", async () => {
    for (const duration of [0, -1, null, Number.NaN, "10"]) {
      await load(
        block({ sources: [edx("a.mp4")], duration }, { usageId: "id" }),
      );
      expect(await createHelper().getVideoData("id")).toEqual({
        url: edx("a.mp4"),
      });
    }
  });

  test("throws when there are no sources and no youtube stream", async () => {
    for (const metadata of [
      { sources: [], streams: "" },
      { sources: [], streams: "1.50:aaa" },
      {},
    ]) {
      await load(block(metadata, { usageId: "id" }));
      await expect(createHelper().getVideoData("id")).rejects.toThrow(
        VideoHelperError,
      );
    }
  });

  test("throws when only hls is available", async () => {
    await load(
      block({ sources: [edx("a/a.m3u8")], streams: "" }, { usageId: "id" }),
    );
    await expect(createHelper().getVideoData("id")).rejects.toThrow(
      VideoHelperError,
    );
  });
});

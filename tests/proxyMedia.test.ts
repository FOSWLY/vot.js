import { describe, expect, test } from "bun:test";

import config from "../packages/shared/src/data/config";
import { proxyMedia } from "../packages/shared/src/utils/utils";

describe("proxyMedia", () => {
  const url = "https://example.com/video.mp4";

  test("uses the default media proxy host", () => {
    expect(proxyMedia(url)).toStartWith(
      `https://${config.mediaProxy}/v1/proxy/video.mp4?`,
    );
  });

  test("uses a custom host and keeps the format", () => {
    const proxied = proxyMedia(url, "webm", "proxy.example.org:8443");
    expect(proxied).toStartWith(
      "https://proxy.example.org:8443/v1/proxy/video.webm?",
    );
    expect(proxied).toEndWith(`&url=${btoa(url)}`);
  });

  test("adds origin and referer for URL instances", () => {
    const proxied = proxyMedia(new URL(url), "mp4", "proxy.example.org");
    expect(proxied).toContain(`&url=${btoa(url)}`);
    expect(proxied).toContain("&origin=https://example.com");
    expect(proxied).toContain("&referer=https://example.com");
  });
});

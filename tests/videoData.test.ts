import { describe, test, expect } from "bun:test";
import { getVideoData } from "../packages/node/src/utils/videoData";
import config from "../packages/shared/src/data/config";

const normalize = async (url: string, referer?: string) => {
  const data = await getVideoData(url, { referer });
  // console.log(data);
  return data?.url;
};

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

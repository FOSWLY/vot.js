import VOTClient from "../packages/node";

// enum
enum CustomVideoService {
  example = "example",
  test = "test",
}
const client = new VOTClient<CustomVideoService>();
await client.translateVideo({
  videoData: {
    url: "https://example.com/123",
    host: CustomVideoService.example,
    videoId: "123",
  },
});

// literal union
type OtherVideoService = "example" | "test";
const otherClient = new VOTClient<OtherVideoService>();
await otherClient.translateVideo({
  videoData: {
    url: "https://example.com/123",
    host: "test",
    videoId: "123",
  },
});

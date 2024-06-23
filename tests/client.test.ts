import { expect, test } from "bun:test";
import VOTClient, { VOTWorkerClient } from "../src/index";

test("Translate video", async () => {
  const client = new VOTClient();

  const response = await client.translateVideo({
    url: "https://youtu.be/LK6nLR1bzpI",
  });
  // console.log(response);

  expect(response.translated).toEqual(true);
});

test("Translate video (worker)", async () => {
  const client = new VOTWorkerClient({
    host: "vot.toil.cc",
  });

  const response = await client.translateVideo({
    url: "https://youtu.be/LK6nLR1bzpI",
  });

  expect(response.translated).toEqual(true);
});

test("Translate video (with translationHelp)", async () => {
  const client = new VOTClient();

  const response = await client.translateVideo({
    url: "https://s3.toil.cc/vot/video.mp4",
    // just for example
    translationHelp: [
      {
        target: "subtitles_file_url",
        targetUrl: "https://s3.toil.cc/vot/subs.vtt",
      },
      {
        target: "video_file_url",
        targetUrl: "https://s3.toil.cc/vot/video.mp4",
      },
    ],
  });

  expect(response.translated).toEqual(true);
});

test("Get subtitles", async () => {
  const client = new VOTClient();

  const response = await client.getSubtitles({
    url: "https://youtu.be/LK6nLR1bzpI",
    requestLang: "ru",
  });
  // console.log(response);

  expect(response.waiting).toEqual(false);
});

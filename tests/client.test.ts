/* eslint-disable sonarjs/no-duplicate-string */
import { expect, test } from "bun:test";
import VOTClient, { VOTWorkerClient } from "../src/index";

const url = "https://youtu.be/LK6nLR1bzpI";

test("Translate video", async () => {
  const client = new VOTClient();

  const response = await client.translateVideo({
    url,
  });

  console.log("Translate video", response);

  expect(response.translated).not.toBeNull();
});

test("Translate video (worker)", async () => {
  const client = new VOTWorkerClient({
    host: "vot.toil.cc",
  });

  const response = await client.translateVideo({
    url,
  });

  console.log("Translate video (worker)", response);

  expect(response.translated).not.toBeNull();
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

  console.log("Translate video (with translationHelp)", response);

  expect(response.translated).not.toBeNull();
});

test("Translate video (with VOT Backend API)", async () => {
  const client = new VOTClient();

  const response = await client.translateVideo({
    url: "https://www.reddit.com/r/Unexpected/comments/1bkqj2u/rookie_ninja_warrior_rises_to_the_top/",
  });

  console.log("Translate video (with VOT Backend API)", response);

  expect(response.translated).toEqual(true);
});

test("Get subtitles", async () => {
  const client = new VOTClient();

  const response = await client.getSubtitles({
    url,
    requestLang: "ru",
  });

  console.log("Get subtitles", response);

  expect(response.waiting).toEqual(false);
});

test("Get subtitles (worker)", async () => {
  const client = new VOTWorkerClient({
    host: "vot-worker.toil.cc",
  });

  const response = await client.getSubtitles({
    url,
    requestLang: "ru",
  });

  console.log("Get subtitles", response);

  expect(response.waiting).toEqual(false);
});

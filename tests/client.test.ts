import { expect, test } from "bun:test";
import VOTClient, { VOTWorkerClient } from "../packages/node/src/index";
import { getVideoData } from "../packages/node/src/utils/videoData";
import { VideoService } from "../packages/node/src/types/service";

const url = "https://youtu.be/LK6nLR1bzpI";
const videoData = await getVideoData(url);

test("Translate video", async () => {
  const client = new VOTClient();

  const response = await client.translateVideo({
    videoData,
  });

  console.log("Translate video", response);

  expect(response.translated).not.toBeNull();
});

test("Translate video (worker)", async () => {
  const client = new VOTWorkerClient({
    host: "vot-worker.toil.cc",
  });

  const response = await client.translateVideo({
    videoData,
  });

  console.log("Translate video (worker)", response);

  expect(response.translated).not.toBeNull();
});

test("Translate video (with translationHelp)", async () => {
  const client = new VOTClient();

  const response = await client.translateVideo({
    videoData: {
      url: "https://s3.toil.cc/vot/video",
      videoId: "vot/video",
      host: VideoService.custom,
    },
    // just for example
    translationHelp: [
      // subtitles file is optional in 2025
      // {
      //   target: "subtitles_file_url",
      //   targetUrl: "https://s3.toil.cc/vot/subs.vtt",
      // },
      {
        target: "video_file_url",
        targetUrl: "https://s3.toil.cc/vot/video.mp4",
      },
    ],
  });

  console.log("Translate video (with translationHelp)", response);

  expect(response.translated).not.toBeNull();
});

test("Translate private vimeo embed (with internal translationHelp)", async () => {
  const url = "https://player.vimeo.com/video/722306580";
  const videoData = await getVideoData(url, {
    referer: "https://leetcode.com",
  });
  const client = new VOTClient();

  const response = await client.translateVideo({
    videoData,
    translationHelp: videoData.translationHelp,
  });

  console.log("Translate video", response);

  expect(response.translated).not.toBeNull();
});

test("Translate video (with VOT Backend API)", async () => {
  const client = new VOTClient();
  const videoData = await getVideoData(
    "https://www.reddit.com/r/Unexpected/comments/1bkqj2u/rookie_ninja_warrior_rises_to_the_top/",
  );

  const response = await client.translateVideo({
    videoData,
  });

  console.log("Translate video (with VOT Backend API)", response);

  expect(response.translated).toEqual(true);
});

test("Get subtitles", async () => {
  const client = new VOTClient();

  const response = await client.getSubtitles({
    videoData,
    requestLang: "ru",
  });

  console.log("Get subtitles", response);

  expect(response.waiting).toEqual(false);
});

test("Get subtitles (with VOT Backend API)", async () => {
  const client = new VOTClient();
  const videoData = await getVideoData(
    "https://www.reddit.com/r/Unexpected/comments/1bkqj2u/rookie_ninja_warrior_rises_to_the_top/",
  );

  const response = await client.getSubtitles({
    videoData,
    requestLang: "ru",
  });

  console.log("Get subtitles (with VOT Backend API)", response);

  expect(response.waiting).toEqual(false);
});

test("Get subtitles (worker)", async () => {
  const client = new VOTWorkerClient({
    host: "vot-worker.toil.cc",
  });

  const response = await client.getSubtitles({
    videoData,
    requestLang: "ru",
  });

  console.log("Get subtitles", response);

  expect(response.waiting).toEqual(false);
});

test("Translate video cache", async () => {
  const client = new VOTClient();

  const response = await client.translateVideoCache({
    videoData,
  });

  console.log("Translate video cache", response);

  expect(response).not.toBeNull();
});

import VOTClient, { VOTWorkerClient } from "../packages/node/dist/client";
import { getVideoData } from "../packages/node/dist/utils/videoData";

const client = new VOTClient();
const url = "https://youtu.be/LK6nLR1bzpI";
const videoData = await getVideoData(url);

// only link
let response = await client.translateVideo({
  videoData,
});

console.log(response);

// link + langs
response = await client.translateVideo({
  videoData,
  requestLang: "en",
  responseLang: "ru",
});

console.log(response);

const videoDataTransHelp = await getVideoData("https://s3.toil.cc/vot/video");

// link + translationHelp (just for example, this is an unsupported domain)
response = await client.translateVideo({
  videoData: videoDataTransHelp,
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

console.log(response);

// vot worker
const workerClient = new VOTWorkerClient();

response = await workerClient.translateVideo({
  videoData,
});

console.log(response);

// subs
const subs = await client.getSubtitles({
  videoData,
  requestLang: "ru",
});

console.log(subs);

// translate weverse
const videoDataWeverse = await getVideoData(
  "https://weverse.io/redvelvet/media/4-139332911",
);

response = await client.translateVideo({
  videoData: videoDataWeverse,
});

console.log(response);

// get translate video cache
const translateCache = await client.translateVideoCache({
  videoData,
});

console.log("Translate video cache", translateCache);

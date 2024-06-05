import { normalize } from "../dist";
import VOTClient, { VOTWorkerClient } from "../dist/client";

const client = new VOTClient();

// only link
let response = await client.translateVideo({
  url: "https://youtu.be/LK6nLR1bzpI",
});

console.log(response);

// link + langs
response = await client.translateVideo({
  url: "https://youtu.be/LK6nLR1bzpI",
  requestLang: "en",
  responseLang: "ru",
});

console.log(response);

// link + translationHelp
response = await client.translateVideo({
  url: "https://s3.toil.cc/vot/video",
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
  url: "https://youtu.be/LK6nLR1bzpI",
});

console.log(response);

// subs
let subs = await client.getSubtitles({
  url: "https://youtu.be/LK6nLR1bzpI",
  requestLang: "ru",
});

console.log(subs);

// translate weverse (read README.md for understand)
const normalizedLink = await normalize(
  "https://weverse.io/redvelvet/media/4-139332911",
);

response = await client.translateVideo({
  url: normalizedLink,
});

console.log(response);

import { VideoData } from "../dist";
import VOTClient, { VOTWorkerClient } from "../dist/client";

const client = new VOTClient();
const url = "https://youtu.be/LK6nLR1bzpI";

// only link
let response = await client.translateVideo({
  url,
});

console.log(response);

// link + langs
response = await client.translateVideo({
  url,
  requestLang: "en",
  responseLang: "ru",
});

console.log(response);

// link + translationHelp (just for example, this is an unsupported domain)
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
  url,
});

console.log(response);

// subs
const subs = await client.getSubtitles({
  url,
  requestLang: "ru",
});

console.log(subs);

// translate weverse (read README.md for understand)
const videoLink = (
  await VideoData.getVideoData("https://weverse.io/redvelvet/media/4-139332911")
)?.url;

response = await client.translateVideo({
  url: videoLink,
});

console.log(response);

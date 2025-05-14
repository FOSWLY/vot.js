import {
  AudioDownloadType,
  FileIdObject,
} from "../packages/core/src/types/yandex";
import VOTClient, { VOTWorkerClient } from "../packages/node/dist/client";
import { getVideoData } from "../packages/node/dist/utils/videoData";
import { config } from "../packages/shared/src";

const client = new VOTClient({
  // https://oauth.yandex.ru
  // apiToken: ""
});
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

// live voices requires Yandex auth !!!
// You can set apiToken in VOTClient constructor
// or use headers.Cookie: "Session_id=..." in request
response = await client.translateVideo({
  videoData,
  requestLang: "en",
  responseLang: "ru",
  extraOpts: {
    useLivelyVoice: true,
  },
  // alternative auth with cookie for useLivelyVoice
  headers: {
    // your yandex Sesssion_id
    Cookie: "Session_id=...",
  },
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

// Code below only for example, it doesn't have real data!
async function exampleOfSendYouTubeAudioDownload() {
  // !!! you MUST use real values !!!
  const fakeFileId = JSON.stringify({
    downloadType:
      AudioDownloadType.WEB_API_GET_ALL_GENERATING_URLS_DATA_FROM_IFRAME,
    fileSize: "10000000", // use real value
    itag: 251,
    minChunkSize: config.minChunkSize,
  } satisfies FileIdObject);

  // use real data
  const fakeAudioFile = new Uint8Array([1, 1, 1, 1, 1, 1]);

  // use real id from translation request
  const translationId = "2142134";

  // static value
  const version = 1;

  // single chunk
  await client.requestVtransAudio(url, translationId, {
    audioFile: fakeAudioFile,
    fileId: fakeFileId,
  });

  // multiple chunks
  await client.requestVtransAudio(
    url,
    translationId,
    {
      audioFile: fakeAudioFile,
      // next request chunkId: 1, and etc. For each audio chunks queue, it starts from 0
      chunkId: 0,
    },
    {
      // see how to calculate this value in https://github.com/ilyhalight/voice-over-translation/blob/dev/src/audioDownloader/index.ts (mediaPartsLength)
      audioPartsLength: 5,
      fileId: fakeFileId,
      version,
    },
  );
}

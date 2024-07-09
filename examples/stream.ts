/* eslint-disable @typescript-eslint/no-misused-promises */
import VOTClient from "../dist";
import {
  StreamTranslationResponse,
  WaitingStreamTranslationResponse,
} from "../dist/types/yandex";
import { getVideoData } from "../dist/utils/videoData";

const client = new VOTClient();
const videoData = await getVideoData("https://youtu.be/nA9UZF-SZoQ");

let response: StreamTranslationResponse;
let inter: Timer;

function isAbortedWaitingStream(
  response: StreamTranslationResponse,
): response is WaitingStreamTranslationResponse {
  return !!(response as WaitingStreamTranslationResponse).message;
}

const fn = async () => {
  response = await client.translateStream({
    videoData,
    requestLang: "en",
    responseLang: "ru",
  });

  console.log(response);
  clearTimeout(inter);
  if (!response.translated && response.interval === 10) {
    inter = setTimeout(fn, 10000);
    return;
  }

  if (isAbortedWaitingStream(response)) {
    console.log(`Stream translation aborted! Message: ${response.message}`);
    return;
  }

  await client.pingStream({
    pingId: response.pingId,
  });

  console.log(`Success! URL: ${response.result.url}`);
};

inter = setTimeout(fn, 10000);

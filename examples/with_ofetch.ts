import { ofetch } from "ofetch";
import VOTClient from "../dist/client";
import { getVideoData } from "../dist/utils/videoData";

// https://github.com/unjs/ofetch
const client = new VOTClient({
  fetchFn: ofetch.native,
});

const videoData = await getVideoData("https://youtu.be/LK6nLR1bzpI");
const response = await client.translateVideo({
  videoData,
});

console.log(response);

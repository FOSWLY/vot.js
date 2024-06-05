import { ofetch } from "ofetch";
import VOTClient from "../dist/client";

// https://github.com/unjs/ofetch
const client = new VOTClient({
  fetchFn: ofetch.native,
});

const response = await client.translateVideo({
  url: "https://youtu.be/LK6nLR1bzpI",
});

console.log(response);

import VOTClient from "../dist/client";

// you should use your own gm_fetch implementation
// e.g. https://github.com/ilyhalight/voice-over-translation/blob/315b2caa12e6d3e532afb0aa82132bcbd5714c92/src/utils/utils.js#L355
async function GM_fetch(url: string | Request | URL, opt = {}) {
  return await fetch(url, opt);
}

const client = new VOTClient({
  fetchFn: GM_fetch,
});

const response = await client.translateVideo({
  url: "https://youtu.be/LK6nLR1bzpI",
});

console.log(response);

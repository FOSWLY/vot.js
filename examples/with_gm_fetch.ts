import VOTClient from "../dist/client";

// you should use your own gm_fetch implementation
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

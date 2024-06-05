import VOTClient from "../dist";

const client = new VOTClient();

let response: any;
let inter: Timer;
let fn = async () => {
  response = await client.translateStream({
    url: "https://youtu.be/nA9UZF-SZoQ",
    requestLang: "en",
    responseLang: "ru",
  });

  console.log(response);
  clearTimeout(inter);
  if (!response.translated && response.interval === 10) {
    inter = setTimeout(fn, 10000);
    return;
  }

  client.pingStream({
    pingId: response.pingId,
  });

  console.log(
    response.interval === 0
      ? response.message
      : `Success! URL: ${response.result.url}`,
  );
};

inter = setTimeout(fn, 10000);

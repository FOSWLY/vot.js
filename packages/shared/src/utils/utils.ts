import config from "../data/config";

/**
 * not all possible languages are listed here, but only those that are supported in voice-over-translation
 * src: https://gist.github.com/jackdoe/043297c8f739c53a6865138aa1dc3fe2
 */
const iso6392to6391: Record<string, string> = {
  afr: "af",
  aka: "ak",
  alb: "sq",
  amh: "am",
  ara: "ar",
  arm: "hy",
  asm: "as",
  aym: "ay",
  aze: "az",
  baq: "eu",
  bel: "be",
  ben: "bn",
  bos: "bs",
  bul: "bg",
  bur: "my",
  cat: "ca",
  chi: "zh",
  cos: "co",
  cze: "cs",
  dan: "da",
  div: "dv",
  dut: "nl",
  eng: "en",
  epo: "eo",
  est: "et",
  ewe: "ee",
  fin: "fi",
  fre: "fr",
  fry: "fy",
  geo: "ka",
  ger: "de",
  gla: "gd",
  gle: "ga",
  glg: "gl",
  gre: "el",
  grn: "gn",
  guj: "gu",
  hat: "ht",
  hau: "ha",
  hin: "hi",
  hrv: "hr",
  hun: "hu",
  ibo: "ig",
  ice: "is",
  ind: "id",
  ita: "it",
  jav: "jv",
  jpn: "ja",
  kan: "kn",
  kaz: "kk",
  khm: "km",
  kin: "rw",
  kir: "ky",
  kor: "ko",
  kur: "ku",
  lao: "lo",
  lat: "la",
  lav: "lv",
  lin: "ln",
  lit: "lt",
  ltz: "lb",
  lug: "lg",
  mac: "mk",
  mal: "ml",
  mao: "mi",
  mar: "mr",
  may: "ms",
  mlg: "mg",
  mlt: "mt",
  mon: "mn",
  nep: "ne",
  nor: "no",
  nya: "ny",
  ori: "or",
  orm: "om",
  pan: "pa",
  per: "fa",
  pol: "pl",
  por: "pt",
  pus: "ps",
  que: "qu",
  rum: "ro",
  rus: "ru",
  san: "sa",
  sin: "si",
  slo: "sk",
  slv: "sl",
  smo: "sm",
  sna: "sn",
  snd: "sd",
  som: "so",
  sot: "st",
  spa: "es",
  srp: "sr",
  sun: "su",
  swa: "sw",
  swe: "sv",
  tam: "ta",
  tat: "tt",
  tel: "te",
  tgk: "tg",
  tha: "th",
  tir: "ti",
  tso: "ts",
  tuk: "tk",
  tur: "tr",
  uig: "ug",
  ukr: "uk",
  urd: "ur",
  uzb: "uz",
  vie: "vi",
  wel: "cy",
  xho: "xh",
  yid: "yi",
  yor: "yo",
  zul: "zu",
};

/**
 * Classic fetch with supports timeout
 */
export async function fetchWithTimeout(
  url: string | URL | Request,
  options: Record<string, any> = {
    headers: {
      "User-Agent": config.userAgent,
    },
  },
) {
  const { timeout = 3000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout as number);

  const response = await fetch(url, {
    signal: controller.signal,
    ...fetchOptions,
  });

  clearTimeout(timeoutId);

  return response;
}

/**
 * Get current timestamp in seconds
 */
export function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

/**
 * Convert lang to ISO 639-1
 */
export function normalizeLang(lang: string) {
  if (lang.length === 3) {
    return iso6392to6391[lang];
  }

  return lang.toLowerCase().split(/[_;-]/)[0].trim();
}

/**
 * Convert media .mp4/.webm link to proxied link with media proxy
 */
export function proxyMedia(url: URL | string, format: "mp4" | "webm" = "mp4") {
  const generalUrl = `https://${config.mediaProxy}/v1/proxy/video.${format}?format=base64&force=true`;
  if (!(url instanceof URL)) {
    return `${generalUrl}&url=${btoa(url)}`;
  }
  return `${generalUrl}&url=${btoa(encodeURIComponent(url.href))}&origin=${
    url.origin
  }&referer=${url.origin}`;
}

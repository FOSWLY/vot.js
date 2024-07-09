// available languages for translation (request lang)
const availableLangs = [
  "auto",
  "ru",
  "en",
  "zh",
  "ko",
  "lt",
  "lv",
  "ar",
  "fr",
  "it",
  "es",
  "de",
  "ja",
] as const;

// up-to-date list of TTS working languages (response lang)
const availableTTS = ["ru", "en", "kk"] as const;

export { availableLangs, availableTTS };

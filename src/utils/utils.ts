import config from "../config/config";

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

export function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

export function normalizeLang(lang: string) {
  // convert lang to ISO 639-1
  return lang.toLowerCase().split(/[_;-]/)[0].trim();
}

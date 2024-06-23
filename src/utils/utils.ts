import config from "../config/config";

export async function fetchWithTimeout(
  url: string | URL | Request,
  options: any = {
    headers: {
      "User-Agent": config.userAgent,
    },
  },
) {
  const { timeout = 3000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(url, {
    ...options,
    signal: controller.signal,
  });

  clearTimeout(id);

  return response;
}

export function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

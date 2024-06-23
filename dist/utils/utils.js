import config from "../config/config";
export async function fetchWithTimeout(url, options = {
    headers: {
        "User-Agent": config.userAgent,
    },
}) {
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

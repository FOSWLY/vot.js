import config from "../config/config.js";
export async function fetchWithTimeout(url, options = {
    headers: {
        "User-Agent": config.userAgent,
    },
}) {
    const { timeout = 3000, ...fetchOptions } = options;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
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

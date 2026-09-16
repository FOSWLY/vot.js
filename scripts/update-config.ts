import path from "node:path";
import crypto from "node:crypto";
import { semver } from "bun";
import { format } from "oxfmt";

import { parseFromString } from "dom-parser";

import { version } from "../package.json";
import config from "../packages/shared/src/data/config";

const CONFIG_PATH = "/packages/shared/src/data/config.ts";
const ROOT_PATH = path.join(__dirname, "..");
const CONFIG_ABS_PATH = path.join(ROOT_PATH, CONFIG_PATH);
const CACHE_PATH = path.join(ROOT_PATH, ".yabrover_cache");
const MAX_CACHE_AGE = 10 * 60 * 1000; // 10 minutes

type CachedData = {
  version: string;
  timestamp: number;
};

async function rewriteConfig(data: typeof config) {
  const formatResult = await format(
    CONFIG_ABS_PATH,
    `
    // This file is auto-generated.
    // All comments and any code are deleted when the componentVersion is updated.
    // Write comments in scripts/update-config.ts
    import type { ConfigSchema } from "../types/data";
    import type { LoggerLevel } from "../types/logger";

    export default ${JSON.stringify(data, null, 2).replace(`"loggerLevel": ${data.loggerLevel}`, `"loggerLevel": ${data.loggerLevel} as LoggerLevel`)} satisfies ConfigSchema`,
  );

  await Bun.write(CONFIG_ABS_PATH, formatResult.code);

  console.log("Successfully rewrited config");
}

async function fetchYandexRSSVersion() {
  const urlParams = new URLSearchParams({
    version,
    custo: "yes",
    manual: "yes",
    uid: crypto.randomUUID().toUpperCase(),
    os_arch: "x86_64",
  }).toString();
  const url = `https://api.browser.yandex.ru/update-info/browser/yandex/win-yandex.rss?${urlParams}`;
  console.log(`Fetching Yandex version info from "${url}"`);
  const res = await fetch(url, { headers: { "User-Agent": config.userAgent } });

  let content = await res.text();
  if (!content.startsWith("<?xml")) {
    console.error("Yandex returned an invalid XML!");
    return version;
  }

  // remove 1st selfclosed xml tag
  content = content.split("\n").slice(1).join("\n");

  const versionData = parseFromString(content);
  const versions = versionData.getElementsByTagName("version:version");
  return versions?.[0]?.textContent;
}

async function readCachedYandexVersion() {
  const file = Bun.file(CACHE_PATH);
  if (!(await file.exists())) {
    return null;
  }

  try {
    const content = (await file.json()) as CachedData;
    if (content.timestamp + MAX_CACHE_AGE < Date.now()) {
      console.log("Cached Yandex version is expired, fetching new version...");
      return null;
    }

    if (!content.version) {
      console.error(
        "Cached Yandex version is invalid, fetching new version...",
      );
      return null;
    }

    return content.version;
  } catch (err) {
    console.error("Failed to read cached Yandex version:", err);
  }

  return null;
}

async function saveCachedYandexVersion(version: string) {
  const file = Bun.file(CACHE_PATH);
  const data: CachedData = {
    version,
    timestamp: Date.now(),
  };

  try {
    await Bun.write(file, JSON.stringify(data, null, 2));
    console.log(`Saved Yandex version "${version}" to cache`);
  } catch (err) {
    console.error("Failed to save cached Yandex version:", err);
  }
}

async function getActualVersion(version: string) {
  const cachedVersion = await readCachedYandexVersion();
  if (cachedVersion) {
    console.log(`Using cached Yandex version: "${cachedVersion}"`);
    return cachedVersion;
  }

  const newVersion = await fetchYandexRSSVersion();
  await saveCachedYandexVersion(newVersion);
  const isSame = config.componentVersion === newVersion;
  if (isSame) {
    console.log(`Yandex version is up-to-date: "${newVersion}"`);
    return newVersion;
  }

  console.log(
    `Old version: "${config.componentVersion}" | New version: "${newVersion}"`,
  );

  const isNewer = semver.satisfies(newVersion, `^${version}`);
  if (!isNewer) {
    console.error(`Yandex returned old component version "${newVersion}"!`);
  }

  return isNewer ? newVersion : version;
}

const yaActualVersion = await getActualVersion(config.componentVersion);
config.componentVersion = yaActualVersion;

const chromiumRevision = yaActualVersion.split(".").at(-1);
if (chromiumRevision && chromiumRevision !== config.chromiumRevision) {
  console.log(`Updating chromiumRevision to: ${chromiumRevision}`);
  config.chromiumRevision = chromiumRevision;
}

config.version = version;
await rewriteConfig(config);

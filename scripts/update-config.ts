import path from "node:path";
import crypto from "node:crypto";
import { semver } from "bun";

import * as prettier from "prettier";
import { parseFromString } from "dom-parser";

import { version } from "../package.json";
import config from "../packages/shared/src/data/config";

const CONFIG_PATH = "/packages/shared/src/data/config.ts";
const CONFIG_ABS_PATH = path.join(__dirname, "..", CONFIG_PATH);

async function rewriteConfig(data: typeof config) {
  const rawCode = `// This file is auto-generated.
    // All comments and any code are deleted when the componentVersion is updated.
    // Write comments in scripts/update-config.ts
    import { ConfigSchema } from "../types/data";

    export default ${JSON.stringify(data, null, 2)} as ConfigSchema`;

  const code = await prettier.format(rawCode, {
    filepath: CONFIG_ABS_PATH,
  });

  await Bun.write(CONFIG_ABS_PATH, code);

  console.log("Successfully rewrited config");
}

async function getActualVersion(version: string) {
  const urlParams = new URLSearchParams({
    version,
    custo: "yes",
    reason: "browser_updater",
    uid: crypto.randomUUID().toUpperCase(),
    os_arch: "x86_64",
  }).toString();
  const res = await fetch(
    `https://api.browser.yandex.ru/update-info/browser/yandex/win-yandex.rss?${urlParams}`,
    { headers: { "User-Agent": config.userAgent } },
  );

  let content = await res.text();
  if (!content.startsWith("<?xml")) {
    console.error("Yandex returned an invalid XML!");
    return version;
  }

  // remove 1st selfclosed xml tag
  content = content.split("\n").slice(1).join("\n");

  const versionData = parseFromString(content);
  const versions = versionData.getElementsByTagName("version:version");
  const newVersion = versions?.[0]?.textContent;
  if (newVersion === "25.4.0.1971") {
    // temp fix. semver: 25.4.0.1971 > 25.4.0.1973
    return version;
  }

  const isNewer = semver.satisfies(newVersion, `^${version}`);
  if (!isNewer) {
    console.error(`Yandex returned old component version "${newVersion}"!`);
  }

  return isNewer ? newVersion : version;
}

config.componentVersion = await getActualVersion(config.componentVersion);
config.version = version;
await rewriteConfig(config);

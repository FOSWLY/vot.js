import * as path from "node:path";
import { semver } from "bun";

import { parseFromString } from "dom-parser";

import { version } from "../package.json";
import config from "../packages/shared/src/data/config";

const CONFIG_PATH = "/packages/shared/src/data/config.ts";
const CONFIG_ABS_PATH = path.join(__dirname, "..", CONFIG_PATH);

async function rewriteConfig(data: typeof config) {
  await Bun.write(
    CONFIG_ABS_PATH,
    `// This file is auto-generated.
    // All comments and any code are deleted when the componentVersion is updated.
    // Write comments in scripts/update-config.ts
    import { ConfigSchema } from "../types/data";

    export default ${JSON.stringify(data, null, 2)} as ConfigSchema`,
  );

  // prettify updated config
  const proc = Bun.spawn([
    "bunx",
    "pretty-quick",
    "--pattern",
    `".${CONFIG_PATH}"`,
  ]);
  await new Response(proc.stdout).text();
  // pretty-quick output
  // console.log(text);
  proc.kill();

  console.log("Successfully rewrited config");
}

async function getActualVersion(version: string) {
  const res = await fetch(
    "https://api.browser.yandex.ru/update-info/browser/yandex/win-yandex.rss?" +
      new URLSearchParams({
        partner: "exp_new_identity_2",
        version,
        custo: "yes",
        reason: "browser_updater",
      }).toString(),
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
  const isNewer = semver.satisfies(newVersion, `^${version}`);
  if (!isNewer) {
    console.error("Yandex returned old component version!");
  }

  return isNewer ? newVersion : version;
}

config.componentVersion = await getActualVersion(config.componentVersion);
config.version = version;
await rewriteConfig(config);

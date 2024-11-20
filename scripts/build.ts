import path from "node:path";
import { $ } from "bun";

import { version } from "../package.json";
import { generateTypebox } from "./typebox-gen";

if (!["linux", "win32"].includes(process.platform)) {
  throw new Error("Build isn't supported on this platform");
}

const currentPlatform = process.platform === "linux" ? "linux" : "win";

async function updatePackgeVersion(root: string) {
  const packageInfoPath = path.join(root, "package.json");
  const packageFile = Bun.file(packageInfoPath);
  const packageInfo = await packageFile.json();
  packageInfo.version = version;
  await Bun.write(packageInfoPath, JSON.stringify(packageInfo, null, 2));
}

async function build(packageName: string, extraScripts: string[] = []) {
  console.log(`Building @vot.js/${packageName}...`);
  const packageUrl = `./packages/${packageName}`;
  const packagePath = path.join(packageUrl);
  $.cwd(packageUrl);
  await updatePackgeVersion(packagePath);
  await $`rm -rf dist`;
  for await (const script of extraScripts) {
    await $`bun ${script}`;
  }

  await $`tsc --project tsconfig.build.json --outdir ./dist && tsc-esm-fix --tsconfig tsconfig.build.json`;
  await generateTypebox(packagePath);
  $.cwd("./");
}

await $`bun update:config`;

await build("shared", [`proto:gen-${currentPlatform}`]);
await build("core");
await build("node");
await build("ext");

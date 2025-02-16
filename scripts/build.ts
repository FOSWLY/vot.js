import path from "node:path";
import { parseArgs } from "node:util";
import { $ } from "bun";

import { version } from "../package.json";
import { GenX } from "@toil/typebox-genx";

const {
  values: { ["skip-proto"]: skipProto },
} = parseArgs({ options: { "skip-proto": { type: "boolean", short: "s" } } });

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
  const genx = new GenX({ root: packagePath });
  await $`mkdir dist/typebox`;
  await genx.generateByDir(
    path.resolve(packagePath, "src", "types"),
    path.resolve(packagePath, "dist", "typebox"),
  );

  $.cwd("./");
}

await $`bun update:config`;

await build("shared", skipProto ? undefined : [`proto:gen`]);
await build("core");
await build("node");
await build("ext");

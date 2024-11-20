import path from "node:path";
import fs from "node:fs/promises";
import fsSync from "node:fs";

import { BunFile } from "bun";

export const packagesPath = path.join(__dirname, "..", "packages");

export async function updateWorkspaceDepends(file: BunFile, version: string) {
  const packageInfo = await file.json();
  if (!Object.hasOwn(packageInfo, "dependencies")) {
    return packageInfo;
  }

  Object.keys(packageInfo.dependencies).map((key) => {
    if (key.startsWith("@vot.js/")) {
      packageInfo.dependencies[key] = version;
    }

    return packageInfo;
  });

  return packageInfo;
}

export async function getPackageJSONs() {
  const files = await fs.readdir(packagesPath, {
    withFileTypes: true,
  });

  const packagesDirs = files
    .filter(
      (file) =>
        file.isDirectory() &&
        fsSync.existsSync(path.join(packagesPath, file.name, "package.json")),
    )
    .map((file) => file.name);
  return packagesDirs;
}

export async function updatePackageVersions(newVersion: string) {
  const packagesDirs = await getPackageJSONs();

  for await (const dir of packagesDirs) {
    const packagePath = path.join(packagesPath, dir, "package.json");
    const packageFile = Bun.file(packagePath);
    const updatedPackageInfo = await updateWorkspaceDepends(
      packageFile,
      newVersion,
    );
    await Bun.write(packagePath, JSON.stringify(updatedPackageInfo, null, 2));
  }
}

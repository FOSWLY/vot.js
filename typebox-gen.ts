import { readdir } from "node:fs/promises";
import { resolve } from "path";

import * as Codegen from "@sinclair/typebox-codegen";

const TYPES_DIR = resolve(import.meta.dir, "src", "types");
const OUTPUT_DIR = resolve(import.meta.dir, "dist", "typebox");

// read all the files in the current directory
const files = await readdir(TYPES_DIR);
for (const file of files) {
  if (!file.endsWith(".ts")) continue;
  const openedFile = Bun.file(resolve(TYPES_DIR, file));
  let content = await openedFile.text();
  const imports = Array.from(content.matchAll(/import ([^;]+);/g));
  for (const importLine of imports) {
    content = content.replace(importLine[0], "");
  }

  let typeboxCode = Codegen.TypeScriptToTypeBox.Generate(content);

  const importLines = imports.map((s) => s[0]).join("\n");
  typeboxCode = importLines ? `${importLines}\n\n${typeboxCode}` : typeboxCode;

  await Bun.write(resolve(OUTPUT_DIR, file), typeboxCode);
}

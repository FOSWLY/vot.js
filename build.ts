import { resolve } from "path";
import { rmdir, exists } from "node:fs/promises";

const outPath = resolve(import.meta.dir, "dist");
if (await exists(outPath)) {
  await rmdir(outPath, {
    recursive: true,
  });
}

for await (const minify of [false, true]) {
  const outputs = await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: `./dist${minify ? "/min" : ""}`,
    target: "node",
    // splitting: true,
    minify,
    naming: `[name].[ext]`,
    external: ["crypto"],
  });

  if (!outputs.success) {
    for (const message of outputs.logs) {
      // Bun will pretty print the message object
      console.error(message);
    }
    throw new Error("Failed to build! See logs for more information");
  }

  for (const artifact of outputs.outputs) {
    console.info(
      `Successfully builded ${artifact.path} (loader: ${artifact.loader}, hash: ${artifact.hash}, minified: ${minify})`,
    );
  }
}

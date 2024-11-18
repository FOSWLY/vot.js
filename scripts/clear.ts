import fs from "node:fs/promises";
import path from "node:path";

const rootPath = path.join(__dirname, "..");

await fs.rmdir(path.join(rootPath, "dist"), { recursive: true });
await fs.rmdir(path.join(rootPath, "docs"), { recursive: true });

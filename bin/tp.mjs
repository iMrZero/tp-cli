#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Get the current directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths to the tsx CLI and your main TypeScript file
const tsxCli = join(__dirname, "..", "node_modules", "tsx", "dist", "cli.mjs");
const entryPoint = join(__dirname, "..", "src", "index.ts");

// Execute tsx, passing your source file and all CLI arguments (like 'check' or 'update pnpm')
execFileSync(process.execPath, [tsxCli, entryPoint, ...process.argv.slice(2)], {
  stdio: "inherit",
});

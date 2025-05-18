#!/usr/bin/env node
import { copyFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const templatePath = join(__dirname, "../templates/otter-store-template.js");
const targetPath = join(process.cwd(), "otter-store.js");

try {
  copyFileSync(templatePath, targetPath);
  console.log("✅ otter-store.js created successfully.");
} catch (err) {
  console.error("❌ Failed to create otter-store.js:", err);
  process.exit(1);
}

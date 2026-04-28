import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const src = readFileSync("src/index.css", "utf8");

const minified = src
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\s+/g, " ")
  .replace(/\s*([{};,])\s*/g, "$1")
  .trim();

mkdirSync("dist", { recursive: true });
writeFileSync("dist/gradient-border-plugin.css", minified + "\n");

console.log(`built dist/gradient-border-plugin.css (${minified.length} bytes)`);

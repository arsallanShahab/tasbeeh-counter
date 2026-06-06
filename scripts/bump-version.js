#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgPath = resolve(__dirname, "..", "package.json");

const VALID = new Set(["patch", "minor", "major"]);

function parseSemver(v) {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(v);
  if (!m) throw new Error(`Invalid semver in package.json: "${v}"`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function bump(current, kind) {
  const [maj, min, pat] = parseSemver(current);
  if (kind === "major") return `${maj + 1}.0.0`;
  if (kind === "minor") return `${maj}.${min + 1}.0`;
  return `${maj}.${min}.${pat + 1}`;
}

const kind = process.argv[2] || "patch";
if (!VALID.has(kind)) {
  console.error(`Unknown bump kind: "${kind}". Use one of: patch | minor | major`);
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const next = bump(pkg.version, kind);

pkg.version = next;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

console.log(`\n  Sabḥa version bumped (${kind})`);
console.log(`  → ${next}\n`);
console.log(`  Next: pnpm build && deploy. The new SW cache name and /version.json`);
console.log(`        will roll out together, prompting users to reload.\n`);

// Post-build guard: dist/ must contain nothing from raw/, curated/ or metadata/,
// and no full-resolution originals (jpg/jpeg/png). Only web/ WebP derivatives ship.
import { readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const forbiddenDirs = new Set(['raw', 'curated', 'metadata']);
const forbiddenExt = /\.(jpe?g|png|tiff?|heic|dng|cr2|nef)$/i;
const offenders = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const rel = relative(dist, p);
    if (statSync(p).isDirectory()) {
      if (forbiddenDirs.has(name)) { offenders.push(rel + '/'); continue; }
      walk(p);
    } else if (forbiddenExt.test(name)) {
      offenders.push(rel);
    }
  }
}
walk(dist);

if (offenders.length) {
  console.error('✗ dist/ contains files that must never be published:');
  for (const o of offenders) console.error('  - ' + o);
  process.exit(1);
}
const webp = [];
(function count(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) count(p);
    else if (name.endsWith('.webp')) webp.push(p);
  }
})(dist);
console.log(`✓ dist/ clean — ${webp.length} WebP derivatives, no raw/curated/metadata, no originals`);

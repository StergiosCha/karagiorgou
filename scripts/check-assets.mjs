// Manifest integrity check — runs before every build (npm run prebuild).
// Fails loudly if any photo referenced by any series is missing a 1600/800/400
// derivative under public/assets/, or if the manifest is structurally off.
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(resolve(root, 'src/data/manifest.json'), 'utf8'));
const SIZES = ['1600', '800', '400'];
const errors = [];

const photos = manifest.photos ?? {};
const series = manifest.series ?? [];

if (!Array.isArray(series) || series.length === 0) errors.push('manifest.series is empty');
if (!manifest.hero || !photos[manifest.hero]) errors.push(`site hero "${manifest.hero}" is not in manifest.photos`);

const referenced = new Set();
for (const s of series) {
  if (!s.slug) errors.push(`series without slug: ${JSON.stringify(s).slice(0, 80)}`);
  if (!photos[s.hero]) errors.push(`series "${s.slug}": hero "${s.hero}" is not in manifest.photos`);
  if (!Array.isArray(s.photos) || s.photos.length === 0) errors.push(`series "${s.slug}" has no photos`);
  for (const id of s.photos ?? []) {
    referenced.add(id);
    if (!photos[id]) errors.push(`series "${s.slug}" references unknown photo "${id}"`);
  }
}

let checked = 0;
for (const [id, p] of Object.entries(photos)) {
  if (!p.src) { errors.push(`photo "${id}" has no src`); continue; }
  for (const size of SIZES) {
    const rel = p.src[size];
    if (!rel) { errors.push(`photo "${id}" has no src[${size}]`); continue; }
    if (rel.startsWith('/') || rel.includes('..')) errors.push(`photo "${id}" src[${size}] must be relative to assets/: ${rel}`);
    const abs = resolve(root, 'public/assets', rel);
    if (!existsSync(abs)) errors.push(`missing file for "${id}" @${size}: public/assets/${rel}`);
    else checked++;
  }
  if (!(Number.isInteger(p.width) && Number.isInteger(p.height) && p.width > 0 && p.height > 0))
    errors.push(`photo "${id}" has invalid width/height`);
  if (typeof p.blur !== 'string' || !p.blur.startsWith('data:image/'))
    errors.push(`photo "${id}" blur placeholder is not a data: URI`);
}

const orphans = Object.keys(photos).filter((id) => !referenced.has(id));
if (orphans.length) console.warn(`⚠ ${orphans.length} photo(s) in manifest but in no series: ${orphans.join(', ')}`);

if (errors.length) {
  console.error(`✗ manifest integrity check FAILED (${errors.length} problem${errors.length > 1 ? 's' : ''}):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`✓ manifest OK — ${series.length} series, ${Object.keys(photos).length} photos, ${checked} derivative files present (${SIZES.join('/')})`);

// Turns whatever is dropped in inbox/ into site assets, with no terminal needed by the photographer.
//
//   inbox/<series-slug>/*.jpg|jpeg|png    -> public/assets/web/{1600,800,400}/<id>.webp + manifest entry, appended to that series
//                                            (a new slug creates a new series; its titles come from inbox/ΣΕΙΡΕΣ.txt)
//   inbox/ΣΕΙΡΕΣ.txt                       -> lines "slug | Ελληνικός τίτλος | English title" (rename or create series)
//   inbox/portrait.jpg                     -> public/assets/portrait/portrait-{1600,800,400}.webp + src/data/portrait.json
//   inbox/dark-nightmare.jpg               -> public/assets/extra/dark-nightmare-*.webp + src/data/dark-nightmare.json
//   inbox/hero.txt                         -> one photo id, becomes the home page hero
//
// Processed originals are deleted from inbox/ (they stay in git history, so upload web-size exports, not RAW).
// Runs in GitHub Actions on every push that touches inbox/ (see .github/workflows/inbox.yml). Also runnable locally: node scripts/process-inbox.mjs
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync, statSync, appendFileSync } from 'node:fs';
import { resolve, join, extname, basename } from 'node:path';
import sharp from 'sharp';

const root = resolve(new URL('..', import.meta.url).pathname);
const INBOX = join(root, 'inbox');
const WEB = join(root, 'public/assets/web');
const MANIFEST = join(root, 'src/data/manifest.json');
const LOG = join(INBOX, 'ΑΝΕΒΗΚΑΝ.txt');
const IMG = /\.(jpe?g|png|webp|tiff?)$/i;

if (!existsSync(INBOX)) { console.log('no inbox/'); process.exit(0); }
const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
let changed = false;
const log = (line) => { console.log(line); appendFileSync(LOG, `${new Date().toISOString().slice(0, 16).replace('T', ' ')}  ${line}\n`); };

const GR = { α: 'a', ά: 'a', β: 'b', γ: 'g', δ: 'd', ε: 'e', έ: 'e', ζ: 'z', η: 'i', ή: 'i', θ: 'th', ι: 'i', ί: 'i', ϊ: 'i', ΐ: 'i', κ: 'k', λ: 'l', μ: 'm', ν: 'n', ξ: 'x', ο: 'o', ό: 'o', π: 'p', ρ: 'r', σ: 's', ς: 's', τ: 't', υ: 'y', ύ: 'y', ϋ: 'y', ΰ: 'y', φ: 'f', χ: 'ch', ψ: 'ps', ω: 'o', ώ: 'o' };
const slugify = (s) => Array.from(s.toLowerCase()).map((c) => GR[c] ?? c).join('').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'x';

async function derive(file, outDir, base, sizes) {
  mkdirSync(outDir, { recursive: true });
  const img = sharp(file).rotate();           // .rotate() with no args applies EXIF orientation; output has no metadata
  const meta = await img.metadata();
  const src = {};
  let w1600 = 0, h1600 = 0;
  for (const s of sizes) {
    const target = outDir === WEB ? join(WEB, String(s), `${base}.webp`) : join(outDir, `${base}-${s}.webp`);
    mkdirSync(join(target, '..'), { recursive: true });
    const info = await sharp(file).rotate().resize({ width: s, height: s, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(target);
    if (s === sizes[0]) { w1600 = info.width; h1600 = info.height; }
    src[String(s)] = target.replace(join(root, 'public/assets') + '/', '');
  }
  const blurBuf = await sharp(file).rotate().resize({ width: 24, height: 24, fit: 'inside' }).webp({ quality: 40 }).toBuffer();
  return { src, width: w1600, height: h1600, blur: 'data:image/webp;base64,' + blurBuf.toString('base64'), orig: `${meta.width}x${meta.height}` };
}

// ---- series titles / new series -------------------------------------------------------------
const titlesFile = join(INBOX, 'ΣΕΙΡΕΣ.txt');
const titles = {};
if (existsSync(titlesFile)) {
  for (const raw of readFileSync(titlesFile, 'utf8').split('\n')) {
    const line = raw.trim(); if (!line || line.startsWith('#')) continue;
    const [slug, el = '', en = ''] = line.split('|').map((x) => x.trim());
    if (slug) titles[slug] = { el, en };
  }
  for (const [slug, tt] of Object.entries(titles)) {
    const s = manifest.series.find((x) => x.slug === slug);
    if (s && (s.title_el !== tt.el || s.title_en !== tt.en)) { s.title_el = tt.el || s.title_el; s.title_en = tt.en || s.title_en; changed = true; log(`τίτλος σειράς ${slug}: ${s.title_el} / ${s.title_en}`); }
  }
}

// ---- photos per series ---------------------------------------------------------------------------
for (const dir of readdirSync(INBOX)) {
  const p = join(INBOX, dir);
  if (!statSync(p).isDirectory()) continue;
  const slug = slugify(dir);
  const files = readdirSync(p).filter((f) => IMG.test(f) && !f.startsWith('.'));
  if (!files.length) continue;
  let series = manifest.series.find((x) => x.slug === slug);
  if (!series) {
    const tt = titles[slug] || titles[dir] || { el: dir, en: dir };
    series = { slug, title_el: tt.el || dir, title_en: tt.en || tt.el || dir, description_el: '', description_en: '', hero: '', photos: [] };
    manifest.series.push(series); changed = true; log(`νέα σειρά ${slug}: ${series.title_el}`);
  }
  for (const f of files.sort()) {
    const id = `up-${slug}-${slugify(basename(f, extname(f)))}`;
    const file = join(p, f);
    if (!manifest.photos[id]) {
      const d = await derive(file, WEB, id, [1600, 800, 400]);
      manifest.photos[id] = { src: d.src, width: d.width, height: d.height, blur: d.blur, title_el: '', title_en: '', caption: '', date: '', source_url: '' };
      series.photos.push(id);
      if (!series.hero) series.hero = id;
      changed = true; log(`+ ${slug}/${f} (${d.orig}) → ${id}`);
    }
    unlinkSync(file);
  }
}

// ---- portrait / extra images -------------------------------------------------------------------------
for (const [name, outDir, jsonPath] of [
  ['portrait', join(root, 'public/assets/portrait'), join(root, 'src/data/portrait.json')],
  ['dark-nightmare', join(root, 'public/assets/extra'), join(root, 'src/data/dark-nightmare.json')],
]) {
  const f = readdirSync(INBOX).find((x) => IMG.test(x) && basename(x, extname(x)).toLowerCase().replace(/_/g, '-') === name);
  if (!f) continue;
  const d = await derive(join(INBOX, f), outDir, name, [1600, 800, 400]);
  const prev = existsSync(jsonPath) ? JSON.parse(readFileSync(jsonPath, 'utf8')) : {};
  writeFileSync(jsonPath, JSON.stringify(name === 'portrait' ? { width: d.width, height: d.height, blur: d.blur } : { src: d.src, width: d.width, height: d.height, blur: d.blur }, null, 1));
  unlinkSync(join(INBOX, f)); changed = true; log(`νέα εικόνα ${name} (${d.orig})${prev.width ? ', αντικατέστησε την παλιά' : ''}`);
}

// ---- hero -----------------------------------------------------------------------------------------------
const heroFile = join(INBOX, 'hero.txt');
if (existsSync(heroFile)) {
  const id = readFileSync(heroFile, 'utf8').trim();
  if (manifest.photos[id] && manifest.hero !== id) { manifest.hero = id; changed = true; log(`νέο εξώφυλλο αρχικής: ${id}`); }
  else if (!manifest.photos[id]) log(`hero.txt: ο κωδικός ${id} δεν υπάρχει, αγνοήθηκε`);
}

if (changed) writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1));
console.log(changed ? 'inbox processed' : 'nothing to do');

/**
 * Journal entries are markdown files in this folder (src/journal/*.md).
 * Each file:
 *
 *   ---
 *   title_el: Ο τίτλος
 *   title_en: The title
 *   date: 2026-09-01
 *   ---
 *   Ελληνικό κείμενο σε markdown…
 *
 *   ---en---
 *
 *   English text in markdown…
 *
 * The `---en---` separator is optional; without it the same body is shown in both languages.
 * The slug is the file name (2026-09-01-first-walk.md → /journal/2026-09-01-first-walk).
 * See README.md → "Adding a journal entry".
 */
import type { Lang } from '../i18n/strings';

export interface JournalEntry {
  slug: string;
  title_el: string;
  title_en: string;
  date: string;
  body_el: string;
  body_en: string;
}

const files = import.meta.glob('./*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

function parse(path: string, raw: string): JournalEntry {
  const slug = path.replace(/^\.\//, '').replace(/\.md$/, '');
  const meta: Record<string, string> = {};
  let body = raw;
  const fm = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (fm) {
    body = raw.slice(fm[0].length);
    for (const line of fm[1].split('\n')) {
      const m = line.match(/^([\w-]+)\s*:\s*(.*)$/);
      if (m) meta[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
  const [el, en] = body.split(/\n---en---\n/);
  return {
    slug,
    title_el: meta.title_el ?? meta.title ?? slug,
    title_en: meta.title_en ?? meta.title ?? slug,
    date: meta.date ?? slug.slice(0, 10),
    body_el: (el ?? '').trim(),
    body_en: (en ?? el ?? '').trim(),
  };
}

export const journalEntries: JournalEntry[] = Object.entries(files)
  .map(([p, raw]) => parse(p, raw))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function entryTitle(e: JournalEntry, lang: Lang): string {
  return lang === 'el' ? e.title_el : e.title_en;
}
export function entryBody(e: JournalEntry, lang: Lang): string {
  return lang === 'el' ? e.body_el : e.body_en;
}

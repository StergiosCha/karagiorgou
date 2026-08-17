// Types mirror the ACTUAL schema of toumpano-assets/manifest.json (the source of truth).
import raw from './manifest.json';

export type Size = '1600' | '800' | '400';

export interface Photographer {
  name_el: string;
  name_en: string;
  instagram: string;
  flickr: string;
}

export interface Photo {
  /** relative to the assets root, e.g. "web/1600/flickr_123.webp" */
  src: Record<Size, string>;
  width: number;
  height: number;
  /** data:image/webp;base64,… placeholder */
  blur: string;
  title_el: string;
  title_en: string;
  /** may be empty; single-language when present — never machine-filled */
  caption: string;
  /** may be empty */
  date: string;
  /** canonical source (Flickr for deduped photos) */
  source_url: string;
}

export interface Series {
  slug: string;
  title_el: string;
  title_en: string;
  description_el: string;
  description_en: string;
  /** photo id */
  hero: string;
  /** ordered photo ids */
  photos: string[];
}

export interface Manifest {
  photographer: Photographer;
  /** site-wide hero photo id */
  hero: string;
  series: Series[];
  photos: Record<string, Photo>;
}

export const manifest = raw as Manifest;

export const photographer = manifest.photographer;
export const seriesList: Series[] = manifest.series;
export const photos: Record<string, Photo> = manifest.photos;

/** Fallback used only if the manifest ever ships without a hero. */
const FALLBACK_HERO = 'flickr_39126725584';
export const siteHeroId: string = manifest.hero && photos[manifest.hero] ? manifest.hero : FALLBACK_HERO;

export function getPhoto(id: string): Photo {
  const p = photos[id];
  if (!p) throw new Error(`Unknown photo id "${id}"`);
  return p;
}

export function getSeries(slug: string): Series | undefined {
  return seriesList.find((s) => s.slug === slug);
}

/** Prev/next series in manifest order, wrapping around. */
export function adjacentSeries(slug: string): { prev: Series; next: Series } {
  const i = seriesList.findIndex((s) => s.slug === slug);
  const n = seriesList.length;
  return { prev: seriesList[(i - 1 + n) % n], next: seriesList[(i + 1) % n] };
}

/** Absolute URL (under BASE_URL) for a derivative. */
export function assetUrl(rel: string): string {
  return `${import.meta.env.BASE_URL}assets/${rel.replace(/^\/+/, '')}`;
}

export function photoSrc(p: Photo, size: Size): string {
  return assetUrl(p.src[size]);
}

export function photoSrcSet(p: Photo): string {
  return (['400', '800', '1600'] as Size[]).map((s) => `${photoSrc(p, s)} ${s}w`).join(', ');
}

/** Human label for the source link: "Flickr" / "Instagram" / hostname */
export function sourceLabel(url: string): 'Flickr' | 'Instagram' | string {
  try {
    const h = new URL(url).hostname;
    if (h.includes('flickr')) return 'Flickr';
    if (h.includes('instagram')) return 'Instagram';
    return h.replace(/^www\./, '');
  } catch {
    return url;
  }
}

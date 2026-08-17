import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Hero from '../components/Hero';
import Seo from '../components/Seo';
import Picture from '../components/Picture';
import Lightbox from '../components/Lightbox';
import NotFound from './NotFound';
import { adjacentSeries, getPhoto, getSeries, type Photo } from '../data/manifest';
import { useLang } from '../i18n/LanguageContext';
import './SeriesPage.css';

/** photobook rhythm on desktop: single, pair, single, pair… (mobile is always single column) */
function groupPlates<T>(items: T[]): T[][] {
  const out: T[][] = [];
  let i = 0;
  let pair = false;
  while (i < items.length) {
    const take = pair && i + 1 < items.length ? 2 : 1;
    out.push(items.slice(i, i + take));
    i += take;
    pair = !pair;
  }
  return out;
}

export default function SeriesPage() {
  const { slug = '' } = useParams();
  const { t, pick } = useLang();
  const series = getSeries(slug);
  const [open, setOpen] = useState<number | null>(null);

  const photos: Photo[] = useMemo(() => (series ? series.photos.map(getPhoto) : []), [series]);
  const groups = useMemo(() => groupPlates(photos.map((p, i) => ({ p, i }))), [photos]);

  useEffect(() => setOpen(null), [slug]);
  const close = useCallback(() => setOpen(null), []);

  if (!series) return <NotFound message={t.series.notFound} />;

  const title = pick(series, 'title');
  const desc = pick(series, 'description');
  const { prev, next } = adjacentSeries(slug);

  return (
    <>
      <Seo title={title} description={desc || title} image={series.hero} />
      <Hero photo={getPhoto(series.hero)} alt={title} title={title} sub={desc} size="tall" />

      <section className="book wrap" aria-label={title}>
        {groups.map((g, gi) => (
          <div key={gi} className={`book__row book__row--${g.length === 2 ? 'pair' : 'single'}${gi % 4 === 2 ? ' book__row--shift' : ''}`}>
            {g.map(({ p, i }) => {
              const ptitle = pick(p, 'title') || `${title} ${String(i + 1).padStart(2, '0')}`;
              return (
                <figure key={series.photos[i]} className="plate" style={{ ['--ar' as string]: `${p.width} / ${p.height}` }}>
                  <button type="button" className="plate__btn" onClick={() => setOpen(i)} aria-label={`${t.series.openPhoto}: ${ptitle}`}>
                    <Picture
                      photo={p}
                      alt={ptitle}
                      sizes={g.length === 2 ? '(min-width: 900px) 42vw, 100vw' : '(min-width: 900px) 70vw, 100vw'}
                      decorative
                    />
                  </button>
                  {p.caption && (
                    <figcaption className="plate__cap">
                      <span className="meta plate__caption">{p.caption}</span>
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        ))}
      </section>

      <nav className="book-nav wrap" aria-label={`${t.series.prev} / ${t.series.next}`}>
        <Link to={`/series/${prev.slug}`} className="book-nav__link book-nav__link--prev">
          <span className="label label--faint">← {t.series.prev}</span>
          <span className="display book-nav__title">{pick(prev, 'title')}</span>
        </Link>
        <Link to="/portfolio" className="book-nav__all link-quiet meta">
          {t.series.backToPortfolio}
        </Link>
        <Link to={`/series/${next.slug}`} className="book-nav__link book-nav__link--next">
          <span className="label label--faint">{t.series.next} →</span>
          <span className="display book-nav__title">{pick(next, 'title')}</span>
        </Link>
      </nav>

      {open !== null && <Lightbox photos={photos} index={open} onClose={close} onIndex={setOpen} />}
    </>
  );
}

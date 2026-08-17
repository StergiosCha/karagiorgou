import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Picture from '../components/Picture';
import { getPhoto, getSeries, printablePhotos, seriesList } from '../data/manifest';
import { useLang } from '../i18n/LanguageContext';
import './Services.css';

type Key = 'wedding' | 'music' | 'prints';

/** one photograph per offer — pulled from the manifest so nothing is hard-coded to a file */
function offerPhoto(key: Key) {
  const bySlug: Record<Key, string> = { wedding: 'urban-melancholy-solitude', music: 'monochrome-silence', prints: 'fog-empty-landscapes' };
  const s = getSeries(bySlug[key]) ?? seriesList[0];
  return getPhoto(s.hero);
}

export default function Services() {
  const { t, pick } = useLang();
  const keys: Key[] = ['wedding', 'music', 'prints'];
  const prints = printablePhotos();

  return (
    <>
      <Seo title={t.services.title} description={t.services.metaDescription} />
      <header className="page-head wrap">
        <p className="label label--faint">{t.nav.services}</p>
        <h1 className="display">{t.services.title}</h1>
        <p className="lead">{t.services.lead}</p>
        <hr className="rule" />
      </header>

      <section className="wrap svc" aria-label={t.services.title}>
        {keys.map((k, i) => {
          const it = t.services.items[k];
          const photo = offerPhoto(k);
          const quoteKey = k === 'prints' ? 'print' : k;
          return (
            <article key={k} className={`svc__item${i % 2 ? ' svc__item--alt' : ''}`} id={k}>
              <div className="svc__pic">
                <Picture photo={photo} alt="" decorative sizes="(min-width: 900px) 40vw, 100vw" />
              </div>
              <div className="svc__text">
                <p className="label label--faint">{String(i + 1).padStart(2, '0')}</p>
                <h2 className="display svc__title">{it.title}</h2>
                <p className="svc__body">{it.body}</p>
                <ul className="svc__bullets meta">
                  {it.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <p className="meta svc__price">{t.services.priceOnRequest}</p>
                {it.note && <span className="placeholder-tag">{it.note}</span>}
                <Link to={`/quote?service=${quoteKey}`} className="svc__cta link-underline">
                  {t.services.cta} →
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <section className="wrap section svc__prints" aria-labelledby="prints-title">
        <p className="label label--faint">{t.services.items.prints.title}</p>
        <h2 id="prints-title" className="display svc__prints-title">
          {t.services.printsAvailableTitle}
        </h2>
        {prints.length === 0 ? (
          <p className="svc__empty">{t.services.printsAvailableEmpty}</p>
        ) : (
          <ul className="svc__grid">
            {prints.map(({ id, photo }) => (
              <li key={id}>
                <Link to={`/quote?service=print&photo=${id}`} className="svc__print">
                  <Picture photo={photo} alt={pick(photo, 'title')} sizes="(min-width: 900px) 30vw, 50vw" />
                  <span className="meta">
                    {pick(photo, 'title')}
                    {photo.print?.price_from ? ` — ${t.services.from} ${photo.print.price_from} €` : ''}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

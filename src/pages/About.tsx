import Seo from '../components/Seo';
import Picture from '../components/Picture';
import { photographer, type Photo } from '../data/manifest';
import portraitMeta from '../data/portrait.json';
import { useLang } from '../i18n/LanguageContext';
import './About.css';

/** Portrait lives in public/assets/portrait/ (WebP 1600/800/400 + blur in src/data/portrait.json). */
const portrait: Photo = {
  src: { '1600': 'portrait/portrait-1600.webp', '800': 'portrait/portrait-800.webp', '400': 'portrait/portrait-400.webp' },
  width: portraitMeta.width,
  height: portraitMeta.height,
  blur: portraitMeta.blur,
  title_el: 'Παναγιώτα Καραγιώργου',
  title_en: 'Panagiota Karagiorgou',
  caption: '',
  date: '',
  source_url: '',
};

/** Sources for the verified CV lines — kept next to the data so nobody has to trust us. */
const SOURCES: { label: string; url: string }[] = [
  { label: 'Underdogs #6 (2015)', url: 'https://www.flickr.com/photos/isagelb/21446578733' },
  { label: 'Dada Tapes (2016)', url: 'https://dadatapes.bandcamp.com/album/a-cold-kiss-for-torrid-days' },
  { label: 'Tuber — Out Of The Blue (2017)', url: 'https://tuber.bandcamp.com/album/out-of-the-blue' },
  { label: 'Discogs', url: 'https://www.discogs.com/artist/5408181-Panagiota-Karagiorgou' },
];

export default function About() {
  const { t, lang } = useLang();
  const name = lang === 'el' ? photographer.name_el : photographer.name_en;
  const cv = t.about.cv;
  const sections = [cv.publications, cv.commissions, cv.online];

  return (
    <>
      <Seo title={t.about.title} description={t.about.metaDescription} />
      <header className="page-head wrap">
        <p className="label label--faint">{t.nav.about}</p>
        <h1 className="display">{name}</h1>
        <hr className="rule" />
      </header>

      <section className="about wrap">
        <div className="about__portrait">
          <Picture photo={portrait} alt={t.about.portraitAlt} sizes="(min-width: 900px) 34vw, 100vw" priority />
        </div>
        <div className="about__text prose">
          <span className="placeholder-tag">{t.about.placeholderNote}</span>
          {t.about.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p className="meta about__links">
            <a className="link-quiet" href={photographer.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a className="link-quiet" href={photographer.flickr} target="_blank" rel="noopener noreferrer">
              Flickr
            </a>
          </p>
        </div>
      </section>

      <section className="wrap section about__cv" aria-labelledby="cv-title">
        <p className="label label--faint">CV</p>
        <h2 id="cv-title" className="display about__cv-title">
          {t.about.cvTitle}
        </h2>
        <dl className="about__cv-list">
          {sections.map((s) => (
            <div key={s.title} className="about__cv-row">
              <dt className="label label--faint">{s.title}</dt>
              <dd>
                <ul>
                  {s.items.map((it) => (
                    <li key={it} className={it.startsWith('[') ? 'about__cv-todo' : ''}>
                      {it}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
        <p className="meta about__sources">
          {lang === 'el' ? 'Πηγές: ' : 'Sources: '}
          {SOURCES.map((s, i) => (
            <span key={s.url}>
              <a className="link-quiet" href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
              {i < SOURCES.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </p>
      </section>
      <div className="section" aria-hidden="true" />
    </>
  );
}

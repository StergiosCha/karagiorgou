import Seo from '../components/Seo';
import Picture from '../components/Picture';
import { getPhoto, getSeries, photographer, seriesList } from '../data/manifest';
import { useLang } from '../i18n/LanguageContext';
import './About.css';

/**
 * PLACEHOLDER portrait: until a real portrait is supplied, the slot shows one of her
 * own photographs. To replace, drop the portrait into public/assets/portrait/ and swap
 * <Picture> for a plain <img> — see README → "About page / portrait".
 */
const PORTRAIT_PLACEHOLDER_ID = getSeries('urban-melancholy-solitude')?.hero ?? seriesList[0].hero;

/** Sources for the verified CV lines — kept next to the data so nobody has to trust us. */
const SOURCES: { label: string; url: string }[] = [
  { label: 'Underdogs #6 (2015)', url: 'https://www.flickr.com/photos/isagelb/21446578733' },
  { label: 'Phases Magazine (2018)', url: 'https://www.phasesmag.com/tpost/panagiota-karagiorgou/' },
  { label: 'Dada Tapes (2016)', url: 'https://dadatapes.bandcamp.com/album/a-cold-kiss-for-torrid-days' },
  { label: 'Tuber — Out Of The Blue (2017)', url: 'https://tuber.bandcamp.com/album/out-of-the-blue' },
  { label: 'Discogs', url: 'https://www.discogs.com/artist/5408181-Panagiota-Karagiorgou' },
];

export default function About() {
  const { t, lang } = useLang();
  const name = lang === 'el' ? photographer.name_el : photographer.name_en;
  const portrait = getPhoto(PORTRAIT_PLACEHOLDER_ID);
  const cv = t.about.cv;
  const sections = [cv.studies, cv.exhibitions, cv.publications, cv.commissions, cv.awards, cv.online];

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
          <Picture photo={portrait} alt={t.about.portraitAlt} sizes="(min-width: 900px) 34vw, 100vw" />
          <p className="label label--faint about__portrait-note">{t.about.placeholderNote}</p>
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

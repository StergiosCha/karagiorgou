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

export default function About() {
  const { t, lang } = useLang();
  const name = lang === 'el' ? photographer.name_el : photographer.name_en;
  const portrait = getPhoto(PORTRAIT_PLACEHOLDER_ID);

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
      <div className="section" aria-hidden="true" />
    </>
  );
}

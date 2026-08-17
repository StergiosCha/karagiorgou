import Seo from '../components/Seo';
import { photographer } from '../data/manifest';
import { useLang } from '../i18n/LanguageContext';
import './Contact.css';

/** PLACEHOLDER — replace with the real address (README → "Contact page"). */
const EMAIL_PLACEHOLDER = 'email@example.com';

export default function Contact() {
  const { t, lang } = useLang();
  const name = lang === 'el' ? photographer.name_el : photographer.name_en;
  return (
    <>
      <Seo title={t.contact.title} description={t.contact.metaDescription} />
      <header className="page-head wrap">
        <p className="label label--faint">{t.nav.contact}</p>
        <h1 className="display">{name}</h1>
        <hr className="rule" />
      </header>
      <section className="wrap contact">
        <dl className="contact__list">
          <div className="contact__row">
            <dt className="label label--faint">{t.contact.emailLabel}</dt>
            <dd>
              <a className="link-underline contact__email display" href={`mailto:${EMAIL_PLACEHOLDER}`}>
                {EMAIL_PLACEHOLDER}
              </a>
              <span className="placeholder-tag contact__tag">{t.contact.emailNote}</span>
            </dd>
          </div>
          <div className="contact__row">
            <dt className="label label--faint">{t.contact.elsewhere}</dt>
            <dd className="contact__social">
              <a className="link-underline" href={photographer.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a className="link-underline" href={photographer.flickr} target="_blank" rel="noopener noreferrer">
                Flickr
              </a>
            </dd>
          </div>
        </dl>
      </section>
      <div className="section" aria-hidden="true" />
    </>
  );
}

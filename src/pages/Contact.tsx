import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { photographer } from '../data/manifest';
import { site, waLink, viberLink } from '../data/site';
import { useLang } from '../i18n/LanguageContext';
import './Contact.css';

export default function Contact() {
  const { t, lang } = useLang();
  const name = lang === 'el' ? photographer.name_el : photographer.name_en;
  const c = t.contact;
  const wa = waLink(lang === 'el' ? 'Γεια σου Παναγιώτα,' : 'Hi Panagiota,');
  const vb = viberLink();

  return (
    <>
      <Seo title={c.title} description={c.metaDescription} />
      <header className="page-head wrap">
        <p className="label label--faint">{t.nav.contact}</p>
        <h1 className="display">{name}</h1>
        <hr className="rule" />
      </header>
      <section className="wrap contact">
        <dl className="contact__list">
          <div className="contact__row">
            <dt className="label label--faint">{c.emailLabel}</dt>
            <dd>
              <a className="link-underline contact__email display" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              {site.email.endsWith('example.com') && <span className="placeholder-tag contact__tag">{c.emailNote}</span>}
            </dd>
          </div>

          {(site.phone || wa || vb) && (
            <div className="contact__row">
              <dt className="label label--faint">{site.phone ? c.phoneLabel : c.messagingLabel}</dt>
              <dd className="contact__social">
                {site.phone && (
                  <a className="link-underline" href={`tel:${site.phone.replace(/\s+/g, '')}`}>
                    {site.phone}
                  </a>
                )}
                {wa && (
                  <a className="link-underline" href={wa} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                )}
                {vb && (
                  <a className="link-underline" href={vb}>
                    Viber
                  </a>
                )}
              </dd>
            </div>
          )}

          <div className="contact__row">
            <dt className="label label--faint">{t.nav.services}</dt>
            <dd className="contact__quote">
              <span>{c.quoteLead}</span>
              <Link to="/quote" className="link-underline">
                {c.quoteCta} →
              </Link>
            </dd>
          </div>

          <div className="contact__row">
            <dt className="label label--faint">{c.elsewhere}</dt>
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

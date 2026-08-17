import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { photographer } from '../data/manifest';
import './Footer.css';

export default function Footer() {
  const { t, lang } = useLang();
  const year = new Date().getFullYear();
  return (
    <footer className="ftr">
      <div className="wrap ftr__inner">
        <p className="ftr__copy meta">
          © {year} {lang === 'el' ? photographer.name_el : photographer.name_en}. {t.footer.rights}
        </p>
        <ul className="ftr__links">
          <li>
            <a className="link-quiet meta" href={photographer.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </li>
          <li>
            <a className="link-quiet meta" href={photographer.flickr} target="_blank" rel="noopener noreferrer">
              Flickr
            </a>
          </li>
          <li>
            <Link className="link-quiet meta" to="/contact">
              {t.nav.contact}
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}

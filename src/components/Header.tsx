import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import './Header.css';

export default function Header() {
  const { t, lang, toggle } = useLang();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.classList.remove('menu-open'); };
  }, [open]);
  const items: { to: string; label: string }[] = [
    { to: '/portfolio', label: t.nav.portfolio },
    { to: '/services', label: t.nav.services },
    { to: '/about', label: t.nav.about },
    { to: '/contact', label: t.nav.contact },
  ];

  return (
    <header className="hdr">
      <a href="#main" className="skip-link">
        {t.skipToContent}
      </a>
      <div className="hdr__inner wrap">
        <Link to="/" className="hdr__brand" aria-label={`${t.siteName} — ${t.nav.home}`}>
          <span className="hdr__brand-name display">{t.siteName}</span>
        </Link>
        <button type="button" className="hdr__burger" aria-expanded={open} aria-controls="site-nav" aria-label={open ? (lang === 'el' ? 'Κλείσιμο μενού' : 'Close menu') : (lang === 'el' ? 'Μενού' : 'Menu')} onClick={() => setOpen((o) => !o)}>
          <span className="hdr__burger-line" /><span className="hdr__burger-line" /><span className="hdr__burger-line" />
        </button>
        <nav id="site-nav" className={`hdr__nav${open ? ' is-open' : ''}`} aria-label={lang === 'el' ? 'Κύριο μενού' : 'Main navigation'}>
          <ul>
            {items.map((it) => (
              <li key={it.to}>
                <NavLink to={it.to} className={({ isActive }) => 'hdr__link' + (isActive ? ' is-active' : '')}>
                  {it.label}
                </NavLink>
              </li>
            ))}

          </ul>
        </nav>
        <div className="hdr__lang-item">
          <button type="button" className="hdr__lang" onClick={toggle} aria-label={t.langToggle} lang={lang === 'el' ? 'en' : 'el'}>
                <span className={lang === 'el' ? 'is-on' : ''} aria-hidden="true">
                  ΕΛ
                </span>
                <span className="hdr__lang-sep" aria-hidden="true">
                  /
                </span>
                <span className={lang === 'en' ? 'is-on' : ''} aria-hidden="true">
                  EN
                </span>
              </button>
        </div>
      </div>
    </header>
  );
}

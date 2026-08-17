import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { useLang } from '../i18n/LanguageContext';

export default function NotFound({ message }: { message?: string }) {
  const { t } = useLang();
  return (
    <>
      <Seo title={t.notFound.title} description={t.notFound.body} />
      <header className="page-head wrap">
        <p className="label label--faint">404</p>
        <h1 className="display">{t.notFound.title}</h1>
        <p className="lead">{message ?? t.notFound.body}</p>
        <hr className="rule" />
      </header>
      <section className="wrap section">
        <Link to="/" className="link-quiet meta">
          ← {t.notFound.home}
        </Link>
      </section>
    </>
  );
}

import { Link, useParams } from 'react-router-dom';
import { marked } from 'marked';
import Seo from '../components/Seo';
import NotFound from './NotFound';
import { journalEntries, entryTitle, entryBody } from '../journal/entries';
import { useLang } from '../i18n/LanguageContext';
import './Journal.css';

function formatDate(iso: string, lang: 'el' | 'en'): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(lang === 'el' ? 'el-GR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}

export function JournalIndex() {
  const { t, lang } = useLang();
  return (
    <>
      <Seo title={t.journal.title} description={t.journal.metaDescription} />
      <header className="page-head wrap">
        <p className="label label--faint">{t.nav.journal}</p>
        <h1 className="display">{t.journal.title}</h1>
        <hr className="rule" />
      </header>
      <section className="wrap wrap--narrow journal">
        {journalEntries.length === 0 ? (
          <div className="journal__empty">
            <p className="display journal__empty-title">{t.journal.empty}</p>
            <p className="journal__empty-sub">{t.journal.emptySub}</p>
            <span className="journal__empty-mark" aria-hidden="true" />
          </div>
        ) : (
          <ol className="journal__list">
            {journalEntries.map((e) => (
              <li key={e.slug} className="journal__item">
                <Link to={`/journal/${e.slug}`} className="journal__link">
                  <time className="meta" dateTime={e.date}>
                    {formatDate(e.date, lang)}
                  </time>
                  <span className="display journal__item-title">{entryTitle(e, lang)}</span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>
      <div className="section" aria-hidden="true" />
    </>
  );
}

export function JournalEntryPage() {
  const { slug = '' } = useParams();
  const { t, lang } = useLang();
  const entry = journalEntries.find((e) => e.slug === slug);
  if (!entry) return <NotFound message={t.journal.notFound} />;
  const html = marked.parse(entryBody(entry, lang), { async: false }) as string;
  return (
    <>
      <Seo title={entryTitle(entry, lang)} description={entryTitle(entry, lang)} type="article" />
      <header className="page-head wrap wrap--narrow">
        <Link to="/journal" className="label label--faint link-quiet">
          ← {t.journal.back}
        </Link>
        <h1 className="display">{entryTitle(entry, lang)}</h1>
        <p className="lead meta">
          <time dateTime={entry.date}>{formatDate(entry.date, lang)}</time>
        </p>
        <hr className="rule" />
      </header>
      <article className="wrap wrap--narrow prose" dangerouslySetInnerHTML={{ __html: html }} />
      <div className="section" aria-hidden="true" />
    </>
  );
}

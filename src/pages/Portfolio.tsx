import Seo from '../components/Seo';
import SeriesDoorway from '../components/SeriesDoorway';
import { seriesList } from '../data/manifest';
import { useLang } from '../i18n/LanguageContext';

export default function Portfolio() {
  const { t } = useLang();
  return (
    <>
      <Seo title={t.portfolio.title} description={t.portfolio.metaDescription} />
      <header className="page-head wrap">
        <p className="label label--faint">{t.nav.portfolio}</p>
        <h1 className="display">{t.portfolio.title}</h1>
        <p className="lead">{t.portfolio.lead}</p>
        <hr className="rule" />
      </header>
      <section className="wrap" aria-label={t.portfolio.title}>
        {seriesList.map((s, i) => (
          <SeriesDoorway key={s.slug} series={s} index={i} total={seriesList.length} variant="plate" />
        ))}
      </section>
      <div className="section" aria-hidden="true" />
    </>
  );
}

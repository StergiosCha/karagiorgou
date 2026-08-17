import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Seo from '../components/Seo';
import SeriesDoorway from '../components/SeriesDoorway';
import { getPhoto, seriesList, siteHeroId, photographer } from '../data/manifest';
import { useLang } from '../i18n/LanguageContext';

/** how many series doorways the home page shows (the rest live on /portfolio) */
const HOME_SERIES = 6;

export default function Home() {
  const { t, lang } = useLang();
  const hero = getPhoto(siteHeroId);
  const name = lang === 'el' ? photographer.name_el : photographer.name_en;

  return (
    <>
      <Seo description={t.home.metaDescription} image={siteHeroId} />
      <Hero photo={hero} alt={`${t.siteName} — ${name}`} title={t.siteName} sub={name} kicker={t.tagline} size="full" />
      <section className="section wrap" aria-labelledby="home-intro">
        <p id="home-intro" className="home__intro display">
          {t.home.intro}
        </p>
      </section>
      <section className="wrap" aria-label={t.home.seriesLabel}>
        {seriesList.slice(0, HOME_SERIES).map((s, i) => (
          <SeriesDoorway key={s.slug} series={s} index={i} total={seriesList.length} variant="door" />
        ))}
        <p className="home__more">
          <Link to="/portfolio" className="link-underline">
            {t.home.allSeries(seriesList.length)}
          </Link>
        </p>
      </section>
      <div className="section" aria-hidden="true" />
    </>
  );
}

import { Link } from 'react-router-dom';
import Picture from './Picture';
import { getPhoto, type Series } from '../data/manifest';
import { useLang } from '../i18n/LanguageContext';
import './SeriesDoorway.css';

interface Props {
  series: Series;
  index: number;
  total: number;
  /** 'door' = homepage doorway (image with title beside), 'plate' = portfolio entry (larger) */
  variant?: 'door' | 'plate';
}

export default function SeriesDoorway({ series, index, total, variant = 'door' }: Props) {
  const { t, pick } = useLang();
  const hero = getPhoto(series.hero);
  const title = pick(series, 'title');
  const desc = pick(series, 'description');
  const num = String(index + 1).padStart(2, '0');
  const tot = String(total).padStart(2, '0');

  return (
    <article className={`door door--${variant}${index % 2 ? ' door--alt' : ''}`}>
      <Link to={`/series/${series.slug}`} className="door__link" aria-label={`${title} — ${t.home.enter}`}>
        <div className="door__pic">
          <Picture photo={hero} alt={title} sizes={variant === 'plate' ? '(min-width: 900px) 62vw, 100vw' : '(min-width: 900px) 46vw, 100vw'} decorative />
        </div>
        <div className="door__text">
          <p className="label label--faint door__num">
            {t.home.seriesLabel} {num} / {tot}
          </p>
          <h2 className="display door__title">{title}</h2>
          {desc && <p className="door__desc">{desc}</p>}
          <p className="meta door__count">
            {series.photos.length} {t.portfolio.photos}
          </p>
        </div>
      </Link>
    </article>
  );
}

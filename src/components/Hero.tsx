import type { ReactNode } from 'react';
import Picture from './Picture';
import type { Photo } from '../data/manifest';
import './Hero.css';

interface Props {
  photo: Photo;
  alt: string;
  /** small label above the title (e.g. "Σειρά 02 / 05") */
  kicker?: string;
  title: ReactNode;
  sub?: ReactNode;
  /** 'full' = ~100vh letterboxed (home), 'tall' = ~72vh (series) */
  size?: 'full' | 'tall';
}

/** Letterboxed, full-bleed, heavily darkened hero. Title set small, in the lower third. */
export default function Hero({ photo, alt, kicker, title, sub, size = 'full' }: Props) {
  return (
    <section className={`hero hero--${size}`}>
      <div className="hero__frame">
        <Picture photo={photo} alt={alt} sizes="100vw" priority className="hero__pic" />
        <div className="hero__shade" aria-hidden="true" />
      </div>
      <div className="hero__text wrap">
        {kicker && <p className="label label--faint hero__kicker">{kicker}</p>}
        <h1 className="display hero__title">{title}</h1>
        {sub && <p className="hero__sub">{sub}</p>}
      </div>
    </section>
  );
}

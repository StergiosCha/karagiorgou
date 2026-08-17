import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { photoSrc, photoSrcSet, photos, sourceLabel, type Photo } from '../data/manifest';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import './Lightbox.css';

interface Props {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}

function photoId(p: Photo): string {
  return Object.keys(photos).find((k) => photos[k] === p) ?? '';
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Lightbox({ photos, index, onClose, onIndex }: Props) {
  const { t, pick, lang } = useLang();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [shown, setShown] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const n = photos.length;
  const photo = photos[index];
  const go = useCallback((d: number) => onIndex((index + d + n) % n), [index, n, onIndex]);

  // mount: lock scroll, inert the app, move focus in
  useEffect(() => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.classList.add('scroll-locked');
    const root = document.getElementById('root');
    root?.setAttribute('inert', '');
    root?.setAttribute('aria-hidden', 'true');
    const raf = requestAnimationFrame(() => {
      setShown(true);
      closeRef.current?.focus();
    });
    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove('scroll-locked');
      root?.removeAttribute('inert');
      root?.removeAttribute('aria-hidden');
      restoreRef.current?.focus?.();
    };
  }, []);

  // keys: Esc, arrows, Tab trap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      } else if (e.key === 'Tab' && dialogRef.current) {
        const els = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
        if (!els.length) return;
        const first = els[0];
        const last = els[els.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  // reset load state when photo changes
  useEffect(() => setImgLoaded(false), [index]);

  // preload neighbours
  useEffect(() => {
    [1, -1].forEach((d) => {
      const p = photos[(index + d + n) % n];
      const im = new Image();
      im.src = photoSrc(p, '1600');
    });
  }, [index, n, photos]);

  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  };

  const title = pick(photo, 'title');
  const src = sourceLabel(photo.source_url);

  return createPortal(
    <div
      className={`lb${shown ? ' is-shown' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={t.lightbox.dialogLabel}
      ref={dialogRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="lb__backdrop" onClick={onClose} aria-hidden="true" />

      <div className="lb__bar">
        <span className="meta lb__counter" aria-live="polite">
          {t.lightbox.counter(index + 1, n)}
        </span>
        <button ref={closeRef} type="button" className="lb__btn lb__close" onClick={onClose} aria-label={t.lightbox.close}>
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <figure className="lb__fig" key={index}>
        <div className="lb__stage" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
          <span className="lb__blur" style={{ backgroundImage: `url("${photo.blur}")`, opacity: imgLoaded ? 0 : 1 }} aria-hidden="true" />
          <img
            className="lb__img"
            src={photoSrc(photo, '1600')}
            srcSet={photoSrcSet(photo)}
            sizes="(min-width: 900px) 88vw, 100vw"
            width={photo.width}
            height={photo.height}
            alt={title || t.lightbox.dialogLabel}
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            style={{ opacity: imgLoaded ? 1 : 0 }}
            draggable={false}
          />
        </div>
        <figcaption className="lb__cap">
          {title && <span className="lb__title">{title}</span>}
          {photo.caption && <span className="lb__caption">{photo.caption}</span>}
          {photo.print?.available && (
            <span className="meta lb__print">
              {t.lightbox.printAvailable}
              {photo.print.price_from ? ` · ${t.lightbox.printFrom} ${photo.print.price_from} €` : ''}
              {' — '}
              <Link className="link-underline" to={`/quote?service=print&photo=${encodeURIComponent(photoId(photo))}`} onClick={onClose}>
                {t.lightbox.printAsk}
              </Link>
            </span>
          )}
          <span className="lb__row">
            {photo.source_url && (
              <a className="link-quiet meta" href={photo.source_url} target="_blank" rel="noopener noreferrer">
                {t.lightbox.viewOn} {src} ↗
              </a>
            )}
            <span className="meta lb__copy">© {lang === 'el' ? 'Παναγιώτα Καραγιώργου' : 'Panagiota Karagiorgou'}</span>
          </span>
        </figcaption>
      </figure>

      <button type="button" className="lb__btn lb__nav lb__nav--prev" onClick={() => go(-1)} aria-label={t.lightbox.prev}>
        <span aria-hidden="true">←</span>
      </button>
      <button type="button" className="lb__btn lb__nav lb__nav--next" onClick={() => go(1)} aria-label={t.lightbox.next}>
        <span aria-hidden="true">→</span>
      </button>
    </div>,
    document.body,
  );
}

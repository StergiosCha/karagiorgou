import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { photoSrc, photoSrcSet, type Photo } from '../data/manifest';
import './Picture.css';

interface Props {
  photo: Photo;
  alt: string;
  /** the `sizes` attribute — how wide the image renders */
  sizes: string;
  /** eager for above-the-fold (hero) */
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
  /** true when the image is decorative (alt="") */
  decorative?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
}

/**
 * Blur-up image: the manifest's base64 WebP placeholder is painted immediately,
 * the real image dissolves in over it once decoded. Width/height reserve the box.
 */
export default function Picture({ photo, alt, sizes, priority, className, style, decorative, fetchPriority }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <span
      className={`pic${loaded ? ' is-loaded' : ''}${className ? ' ' + className : ''}`}
      style={{ ...style, aspectRatio: `${photo.width} / ${photo.height}` }}
    >
      <span className="pic__blur" style={{ backgroundImage: `url("${photo.blur}")` }} aria-hidden="true" />
      <img
        ref={ref}
        className="pic__img"
        src={photoSrc(photo, '800')}
        srcSet={photoSrcSet(photo)}
        sizes={sizes}
        width={photo.width}
        height={photo.height}
        alt={decorative ? '' : alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        // @ts-expect-error — fetchpriority is valid HTML, React 18 types lag behind
        fetchpriority={fetchPriority ?? (priority ? 'high' : 'auto')}
        onLoad={() => setLoaded(true)}
        draggable={false}
      />
    </span>
  );
}

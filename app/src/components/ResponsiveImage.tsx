import { buildResponsivePicture, getImageMeta } from '@/lib/images';

type ResponsiveImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  width?: number;
  height?: number;
  /** Fill a positioned parent (absolute inset-0) — use inside fixed aspect-ratio frames */
  fill?: boolean;
};

export function ResponsiveImage({
  src,
  alt,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 800px',
  loading = 'lazy',
  fetchPriority,
  width,
  height,
  fill = false,
}: ResponsiveImageProps) {
  const meta = getImageMeta(src);
  const w = width ?? meta.width;
  const h = height ?? meta.height;
  const { webpSrcSet, fallbackSrcSet } = buildResponsivePicture(src);

  const pictureClass = fill
    ? 'absolute inset-0 block h-full w-full'
    : 'block w-full h-full';
  const imgClass = fill
    ? `absolute inset-0 h-full w-full object-cover object-center ${className}`.trim()
    : className;

  return (
    <picture className={pictureClass}>
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <source type="image/jpeg" srcSet={fallbackSrcSet} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        className={imgClass}
        loading={loading}
        fetchPriority={fetchPriority}
        width={fill ? undefined : w}
        height={fill ? undefined : h}
        decoding="async"
      />
    </picture>
  );
}
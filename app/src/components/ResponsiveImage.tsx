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
}: ResponsiveImageProps) {
  const meta = getImageMeta(src);
  const w = width ?? meta.width;
  const h = height ?? meta.height;
  const { webpSrcSet, fallbackSrcSet } = buildResponsivePicture(src);

  return (
    <picture>
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <source type="image/jpeg" srcSet={fallbackSrcSet} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        fetchPriority={fetchPriority}
        width={w}
        height={h}
        decoding="async"
      />
    </picture>
  );
}
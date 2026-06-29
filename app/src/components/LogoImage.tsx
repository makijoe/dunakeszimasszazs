type LogoImageProps = {
  size: 40 | 56;
  className?: string;
};

const SIZES: Record<LogoImageProps['size'], { src: string; width: number; height: number }> = {
  40: { src: '/images/logo-96w.webp', width: 40, height: 40 },
  56: { src: '/images/logo-128w.webp', width: 56, height: 56 },
};

export function LogoImage({ size, className = '' }: LogoImageProps) {
  const meta = SIZES[size];
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`/images/logo-96w.webp 96w, /images/logo-128w.webp 128w, /images/logo-192w.webp 192w`}
        sizes={`${size}px`}
      />
      <img
        src={meta.src}
        alt="Dunakeszi Masszázs Logo"
        className={className}
        width={meta.width}
        height={meta.height}
        decoding="async"
      />
    </picture>
  );
}
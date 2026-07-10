/** Natural dimensions for layout / aspect-ratio (from image metadata). */
export const IMAGE_META: Record<string, { width: number; height: number }> = {
  '/images/szalon-1.jpeg': { width: 1600, height: 900 },
  '/images/szalon-2.jpeg': { width: 1600, height: 1200 },
  '/images/szalon-3.jpeg': { width: 1600, height: 900 },
  '/images/szalon-4.jpeg': { width: 1600, height: 1200 },
  '/images/edina.jpeg': { width: 1200, height: 1599 },
  '/images/professional-products.jpeg': { width: 1600, height: 1200 },
  '/images/organo-kave.jpeg': { width: 1152, height: 2048 },
  '/images/organo-zoldtea.jpeg': { width: 1152, height: 2048 },
  '/images/logo.png': { width: 128, height: 128 },
  '/images/indiai-fejmasszazs.jpeg': { width: 1024, height: 1536 },
  '/images/kineziologia.jpeg': { width: 867, height: 1300 },
  '/images/kineziologia-card.jpeg': { width: 1600, height: 1000 },
  '/images/ultrahangos-zsirbontas.jpeg': { width: 1630, height: 1588 },
  '/images/bemer-1.jpeg': { width: 1080, height: 1350 },
  '/images/bemer-2.jpeg': { width: 1080, height: 1350 },
  '/images/bemer-3.jpeg': { width: 1080, height: 1620 },
  '/images/arany-before-1.jpeg': { width: 1200, height: 1600 },
  '/images/arany-after-1.jpeg': { width: 1200, height: 1600 },
  '/images/arany-before-2.jpeg': { width: 1200, height: 1600 },
  '/images/arany-after-2.jpeg': { width: 1200, height: 1600 },
};

const RESPONSIVE_WIDTHS = [480, 800, 1200] as const;

export function getImageMeta(src: string) {
  return IMAGE_META[src] ?? { width: 1200, height: 900 };
}

/** CSS aspect-ratio value matching intrinsic dimensions (fixes CLS + Lighthouse aspect checks). */
export function getImageAspectRatio(src: string): string {
  const { width, height } = getImageMeta(src);
  return `${width} / ${height}`;
}

export function buildResponsiveSrcSet(src: string): string | undefined {
  const base = src.replace(/\.[^/.]+$/, '');
  const parts = RESPONSIVE_WIDTHS.map((w) => `${base}-${w}w.webp ${w}w`);
  return parts.length ? parts.join(', ') : undefined;
}

export function buildResponsivePicture(src: string) {
  const base = src.replace(/\.[^/.]+$/, '');
  const meta = getImageMeta(src);
  // Only advertise widths the generator could produce (skip oversized slots for narrow sources).
  // Always keep at least 480 + 800 so cards have a usable candidate.
  const widths = RESPONSIVE_WIDTHS.filter(
    (w) => w <= Math.max(meta.width, 800) || w === 480 || w === 800
  );
  const unique = [...new Set(widths)].sort((a, b) => a - b);
  return {
    webpSrcSet: unique.map((w) => `${base}-${w}w.webp ${w}w`).join(', '),
    fallbackSrcSet: unique.map((w) => `${base}-${w}w.jpeg ${w}w`).join(', '),
  };
}
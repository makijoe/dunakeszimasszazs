import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { GOOGLE_MAPS_URL } from '@/lib/seo';

const MAP_EMBED_URL =
  'https://www.google.com/maps?q=47.637494,19.124045&hl=hu&z=16&output=embed';

export function MapEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '120px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-[#3D342C]">
      {shouldLoad ? (
        <iframe
          title="Angyali Szalon helye Dunakeszin – térkép"
          src={MAP_EMBED_URL}
          className="w-full h-56 sm:h-64 border-0 block"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="w-full min-h-48 sm:min-h-56 flex flex-col items-center justify-center gap-3 text-white px-4 py-6">
          <MapPin className="w-10 h-10 text-[#D4854A]" />
          <span className="font-medium">Térkép betöltése…</span>
          <span className="text-sm text-white/90">2120 Dunakeszi, Kolonics György utca 2/B</span>
        </div>
      )}
      <a
        href={GOOGLE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center min-h-12 w-full px-6 py-3 text-sm font-medium text-[#F5D4A8] hover:text-white hover:underline transition-colors"
      >
        Megnyitás Google Térképen →
      </a>
    </div>
  );
}
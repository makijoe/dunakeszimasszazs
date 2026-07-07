import { MapPin } from 'lucide-react';
import { GOOGLE_MAPS_URL } from '@/lib/seo';

/** OpenStreetMap embed — works without Google iframe CSP issues */
const MAP_EMBED_URL =
  'https://www.openstreetmap.org/export/embed.html?bbox=19.114045%2C47.627494%2C19.134045%2C47.647494&layer=mapnik&marker=47.637494%2C19.124045';

export function MapEmbed() {
  return (
    <div className="w-full bg-[#3D342C]">
      <iframe
        title="Angyali Szalon helye Dunakeszin – térkép"
        src={MAP_EMBED_URL}
        className="w-full h-56 sm:h-64 border-0 block"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a
        href={GOOGLE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 min-h-12 w-full px-6 py-3 text-sm font-medium text-[#F5D4A8] hover:text-white hover:underline transition-colors"
      >
        <MapPin className="w-4 h-4 shrink-0" />
        Útvonaltervezés Google Térképen →
      </a>
    </div>
  );
}
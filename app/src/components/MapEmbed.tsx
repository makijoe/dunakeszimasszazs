import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { GOOGLE_MAPS_URL } from '@/lib/seo';

export function MapEmbed() {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <iframe
        title="Angyali Szalon helye Dunakeszin – térkép"
        src="https://maps.google.com/maps?q=Angyali+Szalon+Dunakeszi+Masszázs,Kolonics+György+utca+2%2FB,Dunakeszi&hl=hu&z=15&output=embed"
        className="w-full h-56 sm:h-64 border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      className="w-full h-56 sm:h-64 bg-[#3D342C] flex flex-col items-center justify-center gap-3 text-white/90 hover:bg-[#4A3F35] transition-colors"
      aria-label="Térkép betöltése – Angyali Szalon Dunakeszi"
    >
      <MapPin className="w-10 h-10 text-[#D4854A]" />
      <span className="font-medium">Koppints a térkép megjelenítéséhez</span>
      <span className="text-sm text-white/75">2120 Dunakeszi, Kolonics György utca 2/B</span>
      <a
        href={GOOGLE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-[#E8B88A] hover:underline mt-1"
        onClick={(e) => e.stopPropagation()}
      >
        Megnyitás Google Térképen →
      </a>
    </button>
  );
}
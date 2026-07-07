import { useEffect } from 'react';

export const SITE_URL = 'https://www.dunakeszimasszazs.hu';
export const SITE_NAME = 'Dunakeszi Masszázs - Angyali Szalon';
export const SITE_TAGLINE = 'Makra Edina Masszőr';
export const GBP_URL = 'https://share.google/Wm7nkRpmnz966J4Qh';
/** Google Maps listing — use for “view on map” and schema sameAs */
export const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Dunakeszi+Masszázs+Angyali+Szalon&query=47.637494,19.124045';
/** Direct review link from Google Business Profile → További értékelések */
export const GOOGLE_WRITE_REVIEW_URL = GBP_URL;
export const OG_IMAGE = `${SITE_URL}/images/szalon-1.jpeg`;
export const PHONE = '+36 30 487 7883';
export const PHONE_TEL = '+36304877883';
import { getEmailAddress } from '@/lib/email';

/** @deprecated Prefer EmailLink / getMailtoHref — avoids embedding plaintext in bundles when possible */
export const EMAIL = getEmailAddress();
export const ADDRESS = '2120 Dunakeszi, Kolonics György utca 2/B';
export const ADDRESS_STREET = 'Kolonics György utca 2/B';
export const GOOGLE_REVIEW_COUNT = 28;
export const GOOGLE_RATING = 4.9;

export function formatGoogleRating(rating = GOOGLE_RATING): string {
  return rating.toLocaleString('hu-HU', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export type SeoConfig = {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
  ogImage?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
};

export const META_DESCRIPTION =
  'Makra Edina masszőr az Angyali Szalonban, Dunakeszin. Relaxáló és terápiás masszázs, nyirokmasszázs, kineziológia és BEMER kezelés. RTL & TV2 szereplések. Foglalj időpontot online!';

export const HOME_SEO: SeoConfig = {
  title: `${SITE_NAME} | ${SITE_TAGLINE}`,
  description: META_DESCRIPTION,
  canonical: `${SITE_URL}/`,
};

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertJsonLd(data?: SeoConfig['jsonLd']) {
  const id = 'dynamic-json-ld';
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  if (!data) return;

  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export function applySeo(config: SeoConfig) {
  document.title = config.title;
  upsertMeta('name', 'description', config.description);
  upsertMeta('name', 'robots', config.noindex ? 'noindex, nofollow' : 'index, follow');

  const canonical = config.canonical || SITE_URL;
  upsertLink('canonical', canonical);

  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:site_name', SITE_NAME);
  upsertMeta('property', 'og:locale', 'hu_HU');
  upsertMeta('property', 'og:title', config.title);
  upsertMeta('property', 'og:description', config.description);
  upsertMeta('property', 'og:url', canonical);
  upsertMeta('property', 'og:image', config.ogImage || OG_IMAGE);

  upsertMeta('property', 'twitter:card', 'summary_large_image');
  upsertMeta('property', 'twitter:title', config.title);
  upsertMeta('property', 'twitter:description', config.description);
  upsertMeta('property', 'twitter:image', config.ogImage || OG_IMAGE);

  upsertJsonLd(config.jsonLd);
}

export function useSeo(config: SeoConfig) {
  useEffect(() => {
    applySeo(config);
  }, [config.title, config.description, config.canonical, config.noindex, config.ogImage]);
}

export const FAQ_ITEMS = [
  {
    question: 'Mennyibe kerül egy masszázs Dunakeszin az Angyali Szalonban?',
    answer:
      'A legtöbb 60 perces kezelés 15 000 Ft, az arany kollagén arckezelés 30 000 Ft. A BEMER kezelés 20 perces változata 7 500 Ft, a 40 perces 15 000 Ft. Online foglaláskor 3 000 Ft foglalási díj szükséges.',
  },
  {
    question: 'Hol található a Dunakeszi Masszázs – Angyali Szalon?',
    answer:
      '2120 Dunakeszi, Kolonics György utca 2/B. Kapucsengő: 1/43. Az Auchan Dunakeszi közelében, jól megközelíthető helyen.',
  },
  {
    question: 'Hogyan foglalhatok időpontot?',
    answer:
      'A weboldalon az Időpontfoglalás menüpontban választhatod ki a kezelést, dátumot és időpontot. Fizetés bankkártyával (Stripe) vagy banki átutalással lehetséges.',
  },
  {
    question: 'Mikor kell lemondani az időpontot?',
    answer:
      'Kérjük, legalább 24 órával a kezelés előtt jelezd lemondásodat e-mailben vagy telefonon, hogy az időpont másnak is elérhető legyen.',
  },
  {
    question: 'Milyen kezeléseket kínál Makra Edina?',
    answer:
      'Frissítő, nepáli, nyirokmasszázs, aromamasszázs, indiai fejmasszázs, nehézfém-kivezetés, kineziológia, arany kollagén arckezelés, ultrahangos zsírbontás, metamorf masszázs és BEMER kezelés.',
  },
  {
    question: 'Hogyan írhatok Google értékelést az Angyali Szalonról?',
    answer:
      'A weboldalon a Google Vélemények szekcióban kattints az „Írj Google értékelést” gombra, vagy keresd meg a Google Térképen: Dunakeszi Masszázs – Angyali Szalon. Google-fiókkal tudsz csillagos értékelést és szöveges véleményt írni.',
  },
];

export function buildLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    '@id': `${SITE_URL}/#business`,
    name: SITE_NAME,
    alternateName: ['Angyali Szalon', SITE_TAGLINE],
    description: HOME_SEO.description,
    url: SITE_URL,
    telephone: PHONE_TEL,
    image: OG_IMAGE,
    priceRange: '15000-30000 HUF',
    address: {
      '@type': 'PostalAddress',
      streetAddress: ADDRESS_STREET,
      addressLocality: 'Dunakeszi',
      postalCode: '2120',
      addressCountry: 'HU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 47.637494,
      longitude: 19.124045,
    },
    hasMap: GOOGLE_MAPS_URL,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '08:30',
        closes: '18:30',
      },
    ],
    sameAs: [
      'https://www.facebook.com/61577273747405',
      GOOGLE_MAPS_URL,
      GBP_URL,
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(GOOGLE_RATING),
      reviewCount: String(GOOGLE_REVIEW_COUNT),
      bestRating: '5',
      worstRating: '1',
    },
  };
}

export function buildFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildServiceSchema(service: {
  name: string;
  description: string;
  price: number;
  slug: string;
  image: string;
  duration: string;
}) {
  const url = `${SITE_URL}/kezelesek/${service.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${service.name} Dunakeszin`,
    description: service.description,
    url,
    image: service.image.startsWith('http') ? service.image : `${SITE_URL}${service.image}`,
    provider: { '@id': `${SITE_URL}/#business` },
    areaServed: {
      '@type': 'City',
      name: 'Dunakeszi',
    },
    offers: {
      '@type': 'Offer',
      price: service.price,
      priceCurrency: 'HUF',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/#idopont`,
    },
    serviceType: service.name,
  };
}

export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
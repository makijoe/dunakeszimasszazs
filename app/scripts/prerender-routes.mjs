import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildHomeStaticHtml,
  buildPrivacyStaticHtml,
  buildServiceStaticHtml,
  injectRootContent,
  services as serviceBodies,
} from './seo-static-content.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

const SITE_URL = 'https://www.dunakeszimasszazs.hu';
const OG_IMAGE = `${SITE_URL}/images/szalon-1.jpeg`;

const services = [
  ['frissito', 'Frissítő masszázs Dunakeszin | Angyali Szalon', 'Frissítő masszázs Dunakeszin Makra Edinától. 60 perces, lazító testmasszázs az Angyali Szalonban. Online időpontfoglalás.'],
  ['nepali', 'Nepáli masszázs Dunakeszin | Angyali Szalon', 'Nepáli masszázs Dunakeszin – mély stresszoldó kezelés Makra Edinától. 60 perc, 15 000 Ft. Foglalj időpontot online.'],
  ['nyirok', 'Nyirokmasszázs Dunakeszin | Gépi nyirokmasszázs', 'Nyirokmasszázs Dunakeszin az Angyali Szalonban. Gépi nyirokmasszázs 60 perc, 15 000 Ft. Könnyedebb lábak, jobb keringés.'],
  ['aroma', 'Aromamasszázs Dunakeszin | Illóolajos masszázs', 'Aromamasszázs Dunakeszin – illóolajos relaxáló kezelés Makra Edinától. 60 perc, 15 000 Ft. Online foglalás.'],
  ['indiai', 'Indiai fejmasszázs Dunakeszin | Angyali Szalon', 'Indiai fejmasszázs Dunakeszin – fej-, nyak- és vállmasszázs stressz és fejfájás ellen. Makra Edina, Angyali Szalon.'],
  ['nehezfem', 'Nehézfém-kivezetés Dunakeszin | Méregtelenítő kezelés', 'Nehézfém-kivezetés Dunakeszin az Angyali Szalonban. Harmonizáló, méregtelenítő kezelés Makra Edinától. 60 perc, 15 000 Ft.'],
  ['kineziologia', 'Kineziológia Dunakeszin | Makra Edina', 'Kineziológia Dunakeszin – blokkoldó, lelki egyensúlyt teremtő kezelés Makra Edinától. Angyali Szalon, online foglalás.'],
  ['kollagen', 'Arany kollagén arckezelés Dunakeszin | Arcfiatalítás', 'Arany kollagén arckezelés Dunakeszin – prémium arcfiatalítás Makra Edinától. 60–90 perc, 30 000 Ft. Angyali Szalon.'],
  ['zsirbontas', 'Ultrahangos zsírbontás Dunakeszin | Testkontúr', 'Ultrahangos zsírbontás Dunakeszin – egy testterület kezelése 15 000 Ft-ért. Angyali Szalon, Makra Edina.'],
  ['metamorf', 'Metamorf masszázs Dunakeszin | Angyali Szalon', 'Metamorf masszázs Dunakeszin – gyengéd, mély hatású testi-lelki kezelés Makra Edinától. 60 perc, 15 000 Ft.'],
  ['bemer', 'BEMER kezelés Dunakeszin | Mikrokeringés', 'BEMER kezelés Dunakeszin az Angyali Szalonban. Mikrokeringés-javító matrackezelés 20 vagy 40 percben. Makra Edina.'],
];

const serviceBodyBySlug = Object.fromEntries(
  serviceBodies.map(([slug, name, body]) => [slug, { name, body }])
);

const routes = [
  {
    dir: null,
    title: 'Dunakeszi Masszázs - Angyali Szalon | Makra Edina Masszőr',
    description:
      'Makra Edina masszőr az Angyali Szalonban, Dunakeszin. Relaxáló és terápiás kezelések, nyirokmasszázs, kineziológia. RTL & TV2. Foglalj online!',
    canonical: `${SITE_URL}/`,
    robots: 'index, follow',
    staticHtml: buildHomeStaticHtml(),
  },
  {
    dir: 'adatvedelem',
    title: 'Adatvédelmi tájékoztató | Dunakeszi Masszázs - Angyali Szalon',
    description:
      'Adatvédelmi tájékoztató a Dunakeszi Masszázs – Angyali Szalon online foglalási rendszeréhez. Makra Edina, Dunakeszi.',
    canonical: `${SITE_URL}/adatvedelem`,
    robots: 'index, follow',
    staticHtml: buildPrivacyStaticHtml(),
  },
  ...services.map(([slug, title, description]) => {
    const meta = serviceBodyBySlug[slug];
    return {
      dir: `kezelesek/${slug}`,
      title,
      description,
      canonical: `${SITE_URL}/kezelesek/${slug}`,
      robots: 'index, follow',
      staticHtml: buildServiceStaticHtml(
        slug,
        title,
        description,
        meta?.name || slug,
        meta?.body || description
      ),
    };
  }),
];

function patchHtml(baseHtml, { title, description, canonical, robots, staticHtml }) {
  let html = baseHtml;
  html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${description}" />`
  );
  html = html.replace(
    /<meta name="robots" content="[^"]*"\s*\/>/,
    `<meta name="robots" content="${robots}" />`
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${canonical}" />`
  );

  const ogReplacements = [
    ['og:title', title],
    ['og:description', description],
    ['og:url', canonical],
    ['og:image', OG_IMAGE],
    ['twitter:title', title],
    ['twitter:description', description],
    ['twitter:image', OG_IMAGE],
  ];

  for (const [key, value] of ogReplacements) {
    const attr = key.startsWith('twitter:') ? 'property' : 'property';
    const regex = new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/>`);
    html = html.replace(regex, `<meta ${attr}="${key}" content="${value}" />`);
  }

  if (staticHtml) {
    html = injectRootContent(html, staticHtml);
  }

  return html;
}

if (!fs.existsSync(indexPath)) {
  console.error('dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexPath, 'utf8');

for (const route of routes) {
  const html = patchHtml(baseHtml, route);
  if (route.dir === null) {
    fs.writeFileSync(indexPath, html);
    console.log('Prerendered / (homepage)');
    continue;
  }

  const outDir = path.join(distDir, route.dir);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  console.log(`Prerendered /${route.dir}`);
}

console.log(`Done. ${routes.length} routes generated.`);
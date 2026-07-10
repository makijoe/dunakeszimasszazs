import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_URL = 'https://www.dunakeszimasszazs.hu';
const SITE_NAME = 'Dunakeszi Masszázs - Angyali Szalon';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const blogPosts = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../src/data/blog-posts.json'), 'utf8')
);

export const services = [
  ['frissito', 'Frissítő masszázs', 'Könnyed, lazító masszázs, amely oldja a mindennapi feszültségeket és javítja a vérkeringést.'],
  ['nepali', 'Nepáli masszázs', 'Mélyebb lazítást biztosító kezelés, amely hatékonyan oldja a mélyebben fekvő izomfeszültségeket.'],
  ['nyirok', 'Nyirokmasszázs', 'Könnyed lábak, jobb keringés. Támogatja a nyirokkeringést és segít a méregtelenítésben.'],
  ['aroma', 'Aromamasszázs', 'Illóolajos, relaxáló kezelés, amely a természetes illatok erejével harmonizálja testet és lelket.'],
  ['indiai', 'Indiai fejmasszázs', 'Ősi, rendkívül pihentető technika a fej, nyak és váll feszültségének oldására.'],
  ['nehezfem', 'Nehézfém-kivezetés', 'Gyengéd, harmonizáló módszer a szervezet természetes méregtelenítő folyamataihoz.'],
  ['kineziologia', 'Kineziológia', 'Blokkoldó, lelki egyensúlyt teremtő kezelés érzelmi blokkok feloldására.'],
  ['kollagen', 'Arany kollagén arckezelés', 'Luxus arckezelés arany kollagén terápiával, intenzív feszesítéssel és hidratálással.'],
  ['zsirbontas', 'Ultrahangos zsírbontás', 'Egy testterület kezelése ultrahangos technológiával a zsírsejtek csökkentésére.'],
  ['metamorf', 'Metamorf masszázs', 'Gyengéd, mély hatású testi-lelki kezelés a gerinc energetikai pontjain keresztül.'],
  ['bemer', 'BEMER kezelés', 'Mikrokeringés-javító matrackezelés sejtszintű támogatással, 20 vagy 40 percben.'],
];

function serviceLinks() {
  return services
    .map(
      ([slug, name]) =>
        `<li><a href="${SITE_URL}/kezelesek/${slug}">${name} Dunakeszin</a></li>`
    )
    .join('\n          ');
}

function blogIndexLinks() {
  return blogPosts
    .map(
      (post) =>
        `<li><a href="${SITE_URL}/blog/${post.slug}">${escapeHtml(post.title)}</a> – ${escapeHtml(post.excerpt)}</li>`
    )
    .join('\n          ');
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderBlogBlocks(blocks) {
  return blocks
    .map((block) => {
      if (block.type === 'h2') return `<h2>${escapeHtml(block.text)}</h2>`;
      if (block.type === 'ul') {
        const items = block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('\n          ');
        return `<ul>\n          ${items}\n        </ul>`;
      }
      return `<p>${escapeHtml(block.text)}</p>`;
    })
    .join('\n        ');
}

export function buildHomeStaticHtml() {
  return `<main id="seo-prerender" lang="hu">
      <header>
        <p><a href="${SITE_URL}/">${SITE_NAME}</a> · Makra Edina masszőr</p>
        <nav aria-label="Fő navigáció">
          <ul>
            <li><a href="${SITE_URL}/#kezelesek">Kezelések</a></li>
            <li><a href="${SITE_URL}/blog">Blog</a></li>
            <li><a href="${SITE_URL}/#rolam">Rólam</a></li>
            <li><a href="${SITE_URL}/#idopont">Időpontfoglalás</a></li>
            <li><a href="${SITE_URL}/#kapcsolat">Kapcsolat</a></li>
            <li><a href="${SITE_URL}/adatvedelem">Adatvédelem</a></li>
          </ul>
        </nav>
      </header>

      <article>
        <h1>Masszázs Dunakeszin – testi-lelki feltöltődés</h1>
        <p>
          A masszázs Dunakeszin az Angyali Szalonban a testi-lelki feltöltődés helye: nyugodt környezet,
          személyre szabott kezelések és odafigyelő szakember. Makra Edina masszőr frissítő, relaxáló
          és terápiás masszázskezelésekkel vár az Auchan közelében, a Kolonics György utca 2/B alatt.
        </p>
        <p>
          Nyugtató, harmonizáló masszázs Dunakeszin – legyen szó mindennapi stresszről, merev vállról
          vagy a tudatos pihenés igényéről. A testi-lelki feltöltődés nálunk nem luxuscímke, hanem
          gyakorlati élmény: RTL és TV2 szereplések, több mint 28 Google-értékelés, átlagosan 4,9 csillag.
        </p>
        <p>
          Makra Edina masszőrként frissítő masszázst, nepáli masszázst, nyirokmasszázst, aromamasszázst,
          indiai fejmasszázst, kineziológiát, BEMER kezelést és prémium arckezeléseket kínál.
          Online időpontfoglalás bankkártyával vagy átutalással – a masszázs Dunakeszin így előre
          tervezhető, a testi-lelki feltöltődés pedig egy kattintással közelebb van.
        </p>

        <h2>Masszázs kezelések Dunakeszin</h2>
        <p>
          Válassz a személyre szabott kezelések közül a masszázs Dunakeszin kínálatából, vagy foglalj
          időpontot közvetlenül a weboldalon. Minden kezelés a testi-lelki feltöltődést szolgálja.
        </p>
        <ul>
          ${serviceLinks()}
        </ul>

        <h2>Blog – tippek masszázshoz és feltöltődéshez</h2>
        <p>
          A blogon részletesebben is olvashatsz a kezelésekről, az első masszázsról és az online
          foglalásról. A masszázs Dunakeszin tudatosabbá válik, ha megérted, melyik technika illik hozzád.
        </p>
        <ul>
          ${blogPosts
            .slice(0, 6)
            .map(
              (post) =>
                `<li><a href="${SITE_URL}/blog/${post.slug}">${escapeHtml(post.title)}</a></li>`
            )
            .join('\n          ')}
        </ul>
        <p><a href="${SITE_URL}/blog">Összes blogcikk</a></p>

        <h2>Angyali Szalon – helyszín és elérhetőség</h2>
        <p>
          Cím: 2120 Dunakeszi, Kolonics György utca 2/B (kapucsengő: 1/43).
          Telefon: <a href="tel:+36304877883">+36 30 487 7883</a>.
          E-mail: <a href="${SITE_URL}/#kapcsolat">kapcsolatfelvétel a weboldalon</a>.
          Masszázs Dunakeszin az Angyali Szalonban – várunk szeretettel a testi-lelki feltöltődésre.
        </p>
        <p>
          <a href="https://www.facebook.com/61577273747405" rel="noopener noreferrer">Facebook oldal</a> ·
          <a href="https://www.google.com/maps/search/?api=1&amp;query=Dunakeszi+Masszázs+Angyali+Szalon&amp;query=47.637494,19.124045" rel="noopener noreferrer">Google Térkép</a> ·
          <a href="https://share.google/Wm7nkRpmnz966J4Qh" rel="noopener noreferrer">Google értékelés írása</a>
        </p>

        <h2>Időpontfoglalás</h2>
        <p>
          A legtöbb 60 perces kezelés 15 000 Ft, az arany kollagén arckezelés 30 000 Ft.
          Online foglaláskor 3 000 Ft foglalási díj szükséges. Kérjük, legalább 24 órával a kezelés előtt
          jelezd lemondásodat e-mailben vagy telefonon. A masszázs Dunakeszin élménye online foglalással indul.
        </p>
        <p><a href="${SITE_URL}/#idopont">Időpontfoglalás indítása</a></p>
      </article>
    </main>`;
}

export function buildBlogIndexStaticHtml() {
  return `<main id="seo-prerender" lang="hu">
      <header>
        <p><a href="${SITE_URL}/">${SITE_NAME}</a></p>
        <nav aria-label="Blog navigáció">
          <ul>
            <li><a href="${SITE_URL}/">Főoldal</a></li>
            <li><a href="${SITE_URL}/blog">Blog</a></li>
            <li><a href="${SITE_URL}/#kezelesek">Kezelések</a></li>
            <li><a href="${SITE_URL}/#idopont">Időpontfoglalás</a></li>
          </ul>
        </nav>
      </header>
      <article>
        <h1>Blog – masszázs Dunakeszin és testi-lelki feltöltődés</h1>
        <p>
          Gyakorlati cikkek a masszázs Dunakeszin élményről, kezelésekről, foglalásról és a
          testi-lelki feltöltődésről az Angyali Szalonban. Makra Edina tippjei és útmutatói.
        </p>
        <ul>
          ${blogIndexLinks()}
        </ul>
        <p><a href="${SITE_URL}/#idopont">Időpontfoglalás</a></p>
      </article>
    </main>`;
}

export function buildBlogPostStaticHtml(post) {
  const serviceLink = post.serviceId
    ? `<p>Kapcsolódó kezelés: <a href="${SITE_URL}/kezelesek/${post.serviceId}">kezelés részletei</a>.</p>`
    : '';

  return `<main id="seo-prerender" lang="hu">
      <header>
        <p><a href="${SITE_URL}/">${SITE_NAME}</a></p>
        <nav aria-label="Cikk navigáció">
          <ul>
            <li><a href="${SITE_URL}/">Főoldal</a></li>
            <li><a href="${SITE_URL}/blog">Blog</a></li>
            <li><a href="${SITE_URL}/#idopont">Időpontfoglalás</a></li>
          </ul>
        </nav>
      </header>
      <article>
        <h1>${escapeHtml(post.title)}</h1>
        <p><time datetime="${escapeHtml(post.date)}">${escapeHtml(post.date)}</time></p>
        <p>${escapeHtml(post.excerpt)}</p>
        ${renderBlogBlocks(post.blocks)}
        ${serviceLink}
        <p>
          Masszázs Dunakeszin az Angyali Szalonban – <a href="${SITE_URL}/#idopont">időpontfoglalás</a>.
          Telefon: <a href="tel:+36304877883">+36 30 487 7883</a>.
        </p>
        <p><a href="${SITE_URL}/blog">Vissza a bloghoz</a></p>
      </article>
    </main>`;
}

export function buildServiceStaticHtml(slug, title, description, serviceName, serviceBody) {
  const otherServices = services
    .filter(([s]) => s !== slug)
    .slice(0, 6)
    .map(
      ([s, name]) =>
        `<li><a href="${SITE_URL}/kezelesek/${s}">${name}</a></li>`
    )
    .join('\n          ');

  return `<main id="seo-prerender" lang="hu">
      <header>
        <p><a href="${SITE_URL}/">${SITE_NAME}</a></p>
        <nav aria-label="Szolgáltatás navigáció">
          <ul>
            <li><a href="${SITE_URL}/">Főoldal</a></li>
            <li><a href="${SITE_URL}/#kezelesek">Összes kezelés</a></li>
            <li><a href="${SITE_URL}/#idopont">Időpontfoglalás</a></li>
            <li><a href="${SITE_URL}/adatvedelem">Adatvédelem</a></li>
          </ul>
        </nav>
      </header>

      <article>
        <h1>${serviceName} Dunakeszin</h1>
        <p>${description}</p>
        <p>${serviceBody}</p>
        <p>
          Angyali Szalon, 2120 Dunakeszi, Kolonics György utca 2/B.
          Foglalj online: <a href="${SITE_URL}/#idopont">időpontfoglalás</a>.
          Telefon: <a href="tel:+36304877883">+36 30 487 7883</a>.
        </p>

        <h2>További kezelések</h2>
        <ul>
          ${otherServices}
        </ul>

        <p>
          <a href="https://www.facebook.com/61577273747405" rel="noopener noreferrer">Facebook</a> ·
          <a href="https://www.google.com/maps/search/?api=1&amp;query=Dunakeszi+Masszázs+Angyali+Szalon&amp;query=47.637494,19.124045" rel="noopener noreferrer">Google Térkép</a> ·
          <a href="https://share.google/Wm7nkRpmnz966J4Qh" rel="noopener noreferrer">Google értékelés</a>
        </p>
      </article>
    </main>`;
}

export function buildPrivacyStaticHtml() {
  return `<main id="seo-prerender" lang="hu">
      <header>
        <p><a href="${SITE_URL}/">${SITE_NAME}</a></p>
        <nav aria-label="Jogi navigáció">
          <ul>
            <li><a href="${SITE_URL}/">Főoldal</a></li>
            <li><a href="${SITE_URL}/#idopont">Időpontfoglalás</a></li>
            <li><a href="${SITE_URL}/#kapcsolat">Kapcsolat</a></li>
          </ul>
        </nav>
      </header>

      <article>
        <h1>Adatvédelmi tájékoztató</h1>
        <p>
          A Dunakeszi Masszázs – Angyali Szalon online foglalási rendszere Makra Edina masszőr
          adatkezelési tájékoztatója. Az oldal cookie-kat és Google Analytics mérést használhat.
          Személyes adatokat kizárólag időpontfoglalás és kapcsolattartás céljából kezelünk.
        </p>
        <p>
          Adatkezelő: Makra Edina, 2120 Dunakeszi, Kolonics György utca 2/B.
          Kapcsolat: <a href="${SITE_URL}/#kapcsolat">e-mail a Kapcsolat szekcióban</a>,
          <a href="tel:+36304877883">+36 30 487 7883</a>.
        </p>
        <p><a href="${SITE_URL}/">Vissza a főoldalra</a></p>
      </article>
    </main>`;
}

export function injectRootContent(html, bodyContent) {
  return html.replace(
    /<div id="root">[\s\S]*?<\/div>/,
    `<div id="root">\n    ${bodyContent}\n  </div>`
  );
}
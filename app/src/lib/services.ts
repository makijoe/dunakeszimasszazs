export type ServiceItem = {
  id: string;
  name: string;
  duration: string;
  price: number;
  shortDescription: string;
  description: string;
  benefits: string[];
  image: string;
  beforeAfter?: Array<{ before: string; after: string }>;
  seoTitle?: string;
  seoDescription?: string;
};

export const services: ServiceItem[] = [
  {
    id: 'frissito',
    name: 'Frissítő masszázs',
    duration: 'kb. 60 perc',
    price: 15000,
    shortDescription: 'Könnyed, lazító masszázs, amely oldja a mindennapi feszültségeket és javítja a vérkeringést.',
    description:
      'A frissítő masszázs egy kellemes, könnyed kezelés, amely átmozgatja az egész testet, oldja az izmok feszességét és segít lelassítani a mindennapi rohanást. Finom, ritmikus fogásokkal dolgozom a hát, vállak és végtagok területén, hogy a tested fokozatosan megkönnyebbüljön.',
    benefits: ['Ellazult izmok', 'Csökkent feszültség', 'Jobb közérzet', 'Könnyedség a hátban'],
    image: '/images/szalon-3.jpeg',
    seoTitle: 'Frissítő masszázs Dunakeszin | Stresszoldás, hátfájás | Angyali Szalon',
    seoDescription:
      'Frissítő masszázs Dunakeszin – stresszoldás, hátfájdalom, vállak lazítása. Makra Edina, 60 perc, 15 000 Ft. Online foglalás bankkártyával.',
  },
  {
    id: 'nepali',
    name: 'Nepáli masszázs',
    duration: 'kb. 60 perc',
    price: 15000,
    shortDescription: 'Mélyebb lazítást biztosító kezelés, amely hatékonyan oldja a mélyebben fekvő izomfeszültségeket.',
    description:
      'A nepáli masszázs egy gyengéd, mégis hatékony stresszoldó kezelés, amely segít lecsendesíteni az elmét, ellazítani a testet és helyreállítani a belső egyensúlyt. Különösen ajánlott azoknak, akik sok feszültséget, szorongást vagy kimerültséget élnek meg a mindennapokban.',
    benefits: ['Mély izomlazítás', 'Energiarendszer harmonizálása', 'Testi-lelki egyensúly', 'Belső nyugalom'],
    image: '/images/szalon-2.jpeg',
    seoTitle: 'Nepáli masszázs Dunakeszin | Mély stresszoldás, szorongás | Angyali Szalon',
    seoDescription:
      'Nepáli masszázs Dunakeszin – mély stresszoldó kezelés szorongás és kimerültség ellen. Makra Edina, 60 perc, 15 000 Ft. Online foglalás.',
  },
  {
    id: 'nyirok',
    name: 'Nyirokmasszázs',
    duration: '60 perc',
    price: 15000,
    shortDescription: 'Könnyed lábak, jobb keringés. Támogatja a nyirokkeringést és segít a méregtelenítésben.',
    description:
      'A nyirokmasszázs egy gyengéd, lassú ritmusú kezelés, amely a nyirokkeringés támogatásával segíti a szervezet természetes tisztulási folyamatait, csökkentheti a pangó folyadékot és könnyedségérzetet adhat a testnek.',
    benefits: ['Könnyedebb lábak', 'Csökkent ödéma', 'Jobb keringés', 'Méregtelenítés'],
    image: '/images/szalon-4.jpeg',
    seoTitle: 'Nyirokmasszázs Dunakeszin | Ödéma, nehéz lábak kezelése | Angyali Szalon',
    seoDescription:
      'Gépi nyirokmasszázs Dunakeszin – ödéma, nehéz lábak, vízvisszatartás kezelése. Makra Edina, 60 perc, 15 000 Ft. Online foglalás.',
  },
  {
    id: 'aroma',
    name: 'Aromamasszázs',
    duration: '60 perc',
    price: 15000,
    shortDescription: 'Illóolajos, relaxáló kezelés, amely a természetes illatok erejével harmonizálja testet és lelket.',
    description:
      'Az aromamasszázs illóolajos, relaxáló kezelés, amely a természetes illatok erejével harmonizálja testet és lelket. A válogatott illóolajok mély relaxációt és stresszoldást biztosítanak.',
    benefits: ['Mély relaxáció', 'Stresszoldás', 'Aromaterápiás hatás', 'Érzelmi egyensúly'],
    image: '/images/szalon-1.jpeg',
    seoTitle: 'Aromamasszázs Dunakeszin | Illóolajos relaxáció, stresszoldás',
    seoDescription:
      'Aromamasszázs Dunakeszin – illóolajos relaxáció, stresszoldás, érzelmi egyensúly. Makra Edina, 60 perc, 15 000 Ft. Online foglalás bankkártyával.',
  },
  {
    id: 'indiai',
    name: 'Indiai fejmasszázs',
    duration: 'kb. 30-40 perc',
    price: 15000,
    shortDescription: 'Ősi, rendkívül pihentető technika, amely a fejen, nyakon és vállakon felhalmozódott feszültséget oldja.',
    description:
      'Az indiai fejmasszázs egy ősi, gyengéd és rendkívül megnyugtató technika, amely segít oldani a fejben, nyakban és vállakban felhalmozódott feszültséget. Tökéletes választás stressz, túlterheltség vagy fejfájás esetén.',
    benefits: ['Fejfájás csökkentése', 'Mentális frissesség', 'Stresszoldás', 'Jobb koncentráció'],
    image: '/images/indiai-fejmasszazs.jpeg',
    seoTitle: 'Indiai fejmasszázs Dunakeszin | Fejfájás, nyak, váll | Angyali Szalon',
    seoDescription:
      'Indiai fejmasszázs Dunakeszin – fejfájás, nyak- és vállstressz kezelése. Makra Edina, 30–40 perc, 15 000 Ft. Online foglalás bankkártyával.',
  },
  {
    id: 'nehezfem',
    name: 'Nehézfém-kivezetés',
    duration: 'kb. 60 perc',
    price: 15000,
    shortDescription: 'Gyengéd, harmonizáló módszer, amely támogatja a szervezet természetes méregtelenítő folyamatait.',
    description:
      'A nehézfém-kivezetés gyengéd, harmonizáló módszer, amely támogatja a szervezet természetes méregtelenítő folyamatait. A kezelés segít a szervezetnek megszabadulni a felhalmozódott méreganyagoktól.',
    benefits: ['Méregtelenítés', 'Nyirokkeringés támogatása', 'Belső tehermentesítés', 'Energia növekedés'],
    image: '/images/szalon-2.jpeg',
    seoTitle: 'Nehézfém-kivezetés Dunakeszin | Méregtelenítés, harmonizálás | Angyali Szalon',
    seoDescription:
      'Nehézfém-kivezetés Dunakeszin – gyengéd méregtelenítő, harmonizáló kezelés. Makra Edina, 60 perc, 15 000 Ft. Angyali Szalon, online foglalás.',
  },
  {
    id: 'kineziologia',
    name: 'Kineziológia',
    duration: '60-75 perc',
    price: 15000,
    shortDescription: 'Blokkoldó, lelki egyensúlyt teremtő kezelés, amely segít feloldani a testben tárolt érzelmi blokkokat.',
    description:
      'A kineziológia egy gyengéd, érintésen alapuló módszer, amely segít feltárni és oldani a testben, elmében és érzelmekben megbújó blokkokat. A kezelés célja a belső harmónia helyreállítása, a stressz csökkentése és a természetes energiaáramlás támogatása.',
    benefits: ['Lelki egyensúly', 'Blokkoldás', 'Stresszkezelés', 'Belső erő'],
    image: '/images/kineziologia.jpeg',
    seoTitle: 'Kineziológia Dunakeszin | Blokkoldás, stresszoldás | Makra Edina kineziológus',
    seoDescription:
      'Kineziológia Dunakeszin – blokkoldó, lelki egyensúlyt teremtő kezelés okleveles kineziológustól. Makra Edina, 60–75 perc, 15 000 Ft. Online foglalás.',
  },
  {
    id: 'kollagen',
    name: 'Arany kollagén arckezelés',
    duration: 'kb. 60-90 perc',
    price: 30000,
    shortDescription: 'Bőrbe olvadó fiatalítás. Luxus arckezelés arany kollagén terápiával.',
    description:
      'Már elérhető a teljesen új, bőrbe olvadó arany kollagén terápia – két különleges változatban, intenzív feszesítéssel és mély hidratálással. Összehangolva nyirokmasszázzsal a látványosabb, tartósabb eredményért.',
    benefits: ['Bőrfiatalítás', 'Ragyogó bőr', 'Ránccsökkentés', 'Feszesebb bőr', 'Kollagéntermelés'],
    image: '/images/professional-products.jpeg',
    beforeAfter: [
      { before: '/images/arany-after-1.jpeg', after: '/images/arany-before-1.jpeg' },
      { before: '/images/arany-after-2.jpeg', after: '/images/arany-before-2.jpeg' },
    ],
    seoTitle: 'Arany kollagén arckezelés Dunakeszin | Arcfiatalítás, ránccsökkentés',
    seoDescription:
      'Arany kollagén arckezelés Dunakeszin – prémium arcfiatalítás, ránccsökkentés, bőrfeszesítés. Makra Edina, 60–90 perc, 30 000 Ft. Online foglalás.',
  },
  {
    id: 'zsirbontas',
    name: 'Ultrahangos zsírbontás',
    duration: 'kb. 45-60 perc',
    price: 15000,
    shortDescription: 'Egy testterület kezelése ultrahangos technológiával a zsírsejtek csökkentésére.',
    description:
      'Az ultrahangos zsírbontás egy testterület kezelése ultrahangos technológiával a zsírsejtek csökkentésére. A kezelés segít javítani a testkontúrt és csökkenti a cellulitot.',
    benefits: ['Zsírsejt csökkentés', 'Testkontúr javítás', 'Cellulit kezelés', 'Bőrfeszesítés'],
    image: '/images/ultrahangos-zsirbontas.jpeg',
    seoTitle: 'Ultrahangos zsírbontás Dunakeszin | Cellulit, testkontúr kezelés',
    seoDescription:
      'Ultrahangos zsírbontás Dunakeszin – cellulit kezelés, testkontúr javítása, bőrfeszesítés. 45–60 perc, 15 000 Ft/testterület. Makra Edina, online foglalás.',
  },
  {
    id: 'metamorf',
    name: 'Metamorf masszázs',
    duration: 'kb. 60 perc',
    price: 15000,
    shortDescription: 'Belső átalakulás gyengéd érintéssel. Gerinc energetikai pontjain keresztül.',
    description:
      'A metamorf masszázs egy finom, mégis mély hatású kezelés, amely a gerinc energetikai pontjain keresztül segíti a testi-lelki oldódást. Ajánlott stressz, belső feszültség és lelki elakadások esetén.',
    benefits: ['Belső átalakulás', 'Régi feszültségek oldása', 'Lelki elakadások feloldása', 'Teljes ellazulás'],
    image: '/images/szalon-3.jpeg',
    seoTitle: 'Metamorf masszázs Dunakeszin | Lelki elakadás, belső átalakulás',
    seoDescription:
      'Metamorf masszázs Dunakeszin – lelki elakadások, régi feszültségek feloldása. Makra Edina, 60 perc, 15 000 Ft. Angyali Szalon, online foglalás.',
  },
  {
    id: 'bemer',
    name: 'BEMER Kezelés',
    duration: '20 vagy 40 perc',
    price: 15000,
    shortDescription: 'A mikroerek pacemakere. Sejtszintű támogatás a mikrokeringés javításával.',
    description:
      'A BEMER matrac a mikroerek pacemakere. A szervezet legapróbb hajszálereire hat, ott támogatja a keringést. Külön választható kezelésként (20 perc: 7 500 Ft, 40 perc: 15 000 Ft), illetve bármely masszázs mellé ajánlott.',
    benefits: ['Jobb oxigénellátás', 'Regeneráció gyorsítása', 'Mikrokeringés támogatása', 'Megelőzés'],
    image: '/images/bemer-1.jpeg',
    seoTitle: 'BEMER kezelés Dunakeszin | Mikrokeringés, regeneráció | Angyali Szalon',
    seoDescription:
      'BEMER kezelés Dunakeszin – mikrokeringés-javítás, jobb oxigénellátás, regeneráció. 20 perc 7 500 Ft / 40 perc 15 000 Ft. Makra Edina, online foglalás.',
  },
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return services.find((service) => service.id === slug);
}

export function getServicePath(slug: string): string {
  return `/kezelesek/${slug}`;
}
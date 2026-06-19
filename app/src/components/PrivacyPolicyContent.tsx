import { EMAIL, PHONE } from '@/lib/seo';

export function PrivacyPolicyContent() {
  return (
    <div className="space-y-5 text-sm text-[#4A3F35] leading-relaxed">
      <p className="text-[#8B7355]">Hatályos: 2024. január 1-től</p>

      <div>
        <h2 className="font-semibold text-base mb-2">1. Adatkezelő</h2>
        <p>
          Makra Edina (Angyali Szalon), 2120 Dunakeszi, Kolonics György utca 2/B.
          <br />
          E-mail:{' '}
          <a href={`mailto:${EMAIL}`} className="text-[#D4854A] hover:underline">
            {EMAIL}
          </a>
          <br />
          Telefon: {PHONE}
        </p>
      </div>

      <div>
        <h2 className="font-semibold text-base mb-2">2. Kezelt személyes adatok</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Teljes név</li>
          <li>E-mail cím</li>
          <li>Telefonszám</li>
          <li>Foglalási adatok (időpont, kezelés típusa)</li>
          <li>Esetleges megjegyzések, egészségügyi preferenciák</li>
        </ul>
      </div>

      <div>
        <h2 className="font-semibold text-base mb-2">3. Az adatkezelés célja és jogalapja</h2>
        <p>
          Az adatokat kizárólag az időpontfoglalás kezelése, visszaigazolása és a kezelés megszervezése céljából
          kezeljük. Az adatkezelés jogalapja a szerződés teljesítése (GDPR 6. cikk (1) bekezdés b) pont).
        </p>
      </div>

      <div>
        <h2 className="font-semibold text-base mb-2">4. Adatmegőrzési idő</h2>
        <p>
          A személyes adatokat a foglalás teljesítésétől számított 5 évig őrizzük meg, a számviteli kötelezettségeknek
          megfelelően.
        </p>
      </div>

      <div>
        <h2 className="font-semibold text-base mb-2">5. Az érintett jogai</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Hozzáférés joga: kérheti a tárolt adatairól szóló tájékoztatást</li>
          <li>Helyesbítés joga: kérheti a pontatlan adatok javítását</li>
          <li>Törlés joga: kérheti adatai törlését</li>
          <li>Tiltakozás joga: tiltakozhat az adatkezelés ellen</li>
        </ul>
        <p className="mt-2">
          Kéréseit az{' '}
          <a href={`mailto:${EMAIL}`} className="text-[#D4854A] hover:underline">
            {EMAIL}
          </a>{' '}
          e-mail címre küldheti.
        </p>
      </div>

      <div>
        <h2 className="font-semibold text-base mb-2">6. Adatbiztonság</h2>
        <p>
          Az adatokat biztonságos, titkosított csatornákon (HTTPS) továbbítjuk. Harmadik félnek csak a foglalás
          feldolgozásához szükséges mértékben (pl. fizetési szolgáltató: Stripe) adjuk át az adatokat.
        </p>
      </div>

      <div>
        <h2 className="font-semibold text-base mb-2">7. Jogorvoslat</h2>
        <p>
          Panasszal a Nemzeti Adatvédelmi és Információszabadság Hatósághoz fordulhat:
          <br />
          <a href="https://www.naih.hu" target="_blank" rel="noopener noreferrer" className="text-[#D4854A] hover:underline">
            www.naih.hu
          </a>{' '}
          · 1055 Budapest, Falk Miksa utca 9–11.
        </p>
      </div>
    </div>
  );
}
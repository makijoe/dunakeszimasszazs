import type { ComponentType } from 'react';
import { ArrowLeft, ArrowRight, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ADDRESS,
  buildBreadcrumbSchema,
  buildServiceSchema,
  SITE_NAME,
  SITE_URL,
  useSeo,
} from '@/lib/seo';
import { getServiceBySlug, getServicePath, services, type ServiceItem } from '@/lib/services';
import { navigateTo } from '@/lib/navigation';

type ServiceLandingPageProps = {
  slug: string;
  Navigation: ComponentType;
  Footer: ComponentType;
};

function RelatedServices({ current }: { current: ServiceItem }) {
  const related = services.filter((service) => service.id !== current.id).slice(0, 3);
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {related.map((service) => (
        <a
          key={service.id}
          href={getServicePath(service.id)}
          onClick={(e) => {
            e.preventDefault();
            navigateTo(getServicePath(service.id));
          }}
          className="bg-white rounded-2xl border border-[#E8D4C0]/60 p-4 hover:border-[#D4854A]/40 transition-colors"
        >
          <p className="font-semibold text-[#4A3F35]">{service.name}</p>
          <p className="text-sm text-[#8B7355] mt-1">{service.price.toLocaleString('hu-HU')} Ft</p>
        </a>
      ))}
    </div>
  );
}

export function ServiceLandingPage({ slug, Navigation, Footer }: ServiceLandingPageProps) {
  const service = getServiceBySlug(slug);
  const canonical = `${SITE_URL}${service ? getServicePath(service.id) : `/kezelesek/${slug}`}`;

  useSeo(
    service
      ? {
          title: service.seoTitle || `${service.name} Dunakeszin | ${SITE_NAME}`,
          description: service.seoDescription || service.shortDescription,
          canonical,
          ogImage: service.image.startsWith('http') ? service.image : `${SITE_URL}${service.image}`,
          jsonLd: [
            buildServiceSchema({
              name: service.name,
              description: service.description,
              price: service.price,
              slug: service.id,
              image: service.image,
              duration: service.duration,
            }),
            buildBreadcrumbSchema([
              { name: 'Főoldal', url: `${SITE_URL}/` },
              { name: 'Kezelések', url: `${SITE_URL}/#kezelesek` },
              { name: service.name, url: canonical },
            ]),
          ],
        }
      : {
          title: `Kezelés nem található | ${SITE_NAME}`,
          description: 'A keresett kezelés nem található. Tekintsd meg az összes masszázs kezelést Dunakeszin.',
          canonical,
          noindex: true,
        }
  );

  if (!service) {
    return (
      <div className="min-h-screen bg-[#FFFBF7]">
        <Navigation />
        <main className="max-w-3xl mx-auto px-4 py-28 text-center">
          <h1 className="text-3xl font-bold text-[#4A3F35] mb-4">Kezelés nem található</h1>
          <Button onClick={() => navigateTo('/#kezelesek')} className="bg-[#D4854A] hover:bg-[#B87333] text-white">
            Összes kezelés
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const goToBooking = () => {
    navigateTo('/#idopont');
    window.setTimeout(() => {
      document.querySelector('#idopont')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navigation />
      <main>
        <section className="pt-28 pb-12 bg-gradient-hero">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm text-[#8B7355] mb-6" aria-label="Breadcrumb">
              <a href="/" onClick={(e) => { e.preventDefault(); navigateTo('/'); }} className="hover:text-[#D4854A]">
                Főoldal
              </a>
              <span className="mx-2">/</span>
              <a href="/#kezelesek" onClick={(e) => { e.preventDefault(); navigateTo('/#kezelesek'); }} className="hover:text-[#D4854A]">
                Kezelések
              </a>
              <span className="mx-2">/</span>
              <span className="text-[#4A3F35]">{service.name}</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-block px-4 py-2 bg-white/80 rounded-full text-sm font-medium text-[#D4854A] mb-4">
                  Dunakeszi · Angyali Szalon
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#4A3F35] mb-4">
                  {service.name} Dunakeszin
                </h1>
                <p className="text-lg text-[#8B7355] leading-relaxed mb-6">{service.shortDescription}</p>
                <div className="flex flex-wrap gap-4 text-sm text-[#4A3F35] mb-8">
                  <span className="inline-flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full">
                    <Clock className="w-4 h-4 text-[#D4854A]" />
                    {service.duration}
                  </span>
                  <span className="inline-flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full font-semibold">
                    {service.price.toLocaleString('hu-HU')} Ft
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={goToBooking} className="bg-[#D4854A] hover:bg-[#B87333] text-white rounded-full px-8 py-6">
                    <Calendar className="w-5 h-5 mr-2" />
                    Időpontfoglalás
                  </Button>
                  <a
                    href="/#kezelesek"
                    onClick={(e) => { e.preventDefault(); navigateTo('/#kezelesek'); }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D4854A] text-[#D4854A] hover:bg-[#D4854A] hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Összes kezelés
                  </a>
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden shadow-warm-lg">
                <img
                  src={service.image}
                  alt={`${service.name} – Makra Edina masszázs Dunakeszin`}
                  className="w-full h-[320px] lg:h-[420px] object-cover"
                  loading="eager"
                  width={800}
                  height={600}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="bg-white rounded-3xl border border-[#E8D4C0]/50 p-6 sm:p-8 shadow-warm">
              <h2 className="text-2xl font-bold text-[#4A3F35] mb-4">A kezelésről</h2>
              <p className="text-[#4A3F35] leading-relaxed">{service.description}</p>
            </div>

            <div className="bg-white rounded-3xl border border-[#E8D4C0]/50 p-6 sm:p-8 shadow-warm">
              <h2 className="text-2xl font-bold text-[#4A3F35] mb-4">Előnyök</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2 text-[#4A3F35]">
                    <CheckCircle2 className="w-5 h-5 text-[#8B9A7C] shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {service.beforeAfter && (
              <div className="bg-white rounded-3xl border border-[#E8D4C0]/50 p-6 sm:p-8 shadow-warm">
                <h2 className="text-2xl font-bold text-[#4A3F35] mb-4">Előtte / utána</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {service.beforeAfter.map((pair, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2">
                      <img src={pair.before} alt={`${service.name} előtte`} className="rounded-xl object-cover h-40 w-full" loading="lazy" />
                      <img src={pair.after} alt={`${service.name} utána`} className="rounded-xl object-cover h-40 w-full" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-[#FFF3E8] rounded-3xl border border-[#F5D5B8]/70 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-[#4A3F35] mb-3">Foglalj időpontot Dunakeszin</h2>
              <p className="text-[#8B7355] mb-4">
                {ADDRESS} · Makra Edina · Online foglalás bankkártyával vagy átutalással.
              </p>
              <Button onClick={goToBooking} className="bg-[#D4854A] hover:bg-[#B87333] text-white">
                Tovább a foglaláshoz
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#4A3F35] mb-4">További kezelések</h2>
              <RelatedServices current={service} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
import type { ComponentType } from 'react';
import { ArrowLeft } from 'lucide-react';
import { PrivacyPolicyContent } from '@/components/PrivacyPolicyContent';
import { SITE_NAME, SITE_URL, useSeo } from '@/lib/seo';
import { navigateTo } from '@/lib/navigation';

type PrivacyPageProps = {
  Navigation: ComponentType;
  Footer: ComponentType;
};

export function PrivacyPage({ Navigation, Footer }: PrivacyPageProps) {
  useSeo({
    title: `Adatvédelmi tájékoztató | ${SITE_NAME}`,
    description:
      'Adatvédelmi tájékoztató a Dunakeszi Masszázs – Angyali Szalon online foglalási rendszeréhez. Makra Edina, Dunakeszi.',
    canonical: `${SITE_URL}/adatvedelem`,
  });

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('/');
          }}
          className="inline-flex items-center gap-2 text-sm text-[#635241] hover:text-[#D4854A] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Vissza a főoldalra
        </a>
        <h1 className="text-3xl font-bold text-[#4A3F35] mb-6">Adatvédelmi tájékoztató</h1>
        <div className="bg-white rounded-3xl shadow-warm border border-[#E8D4C0]/50 p-6 sm:p-8">
          <PrivacyPolicyContent />
        </div>
      </main>
      <Footer />
    </div>
  );
}
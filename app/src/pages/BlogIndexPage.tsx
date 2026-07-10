import { useLayoutEffect, type ComponentType } from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import {
  BLOG_INDEX_PATH,
  getBlogPath,
  getBlogPostsSorted,
} from '@/lib/blog-posts';
import { navigateTo, scrollToTop } from '@/lib/navigation';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import {
  buildBreadcrumbSchema,
  SITE_NAME,
  SITE_URL,
  useSeo,
} from '@/lib/seo';

/** Fixed crop for all blog cards so the grid stays even */
const CARD_IMAGE_ASPECT = '16 / 10';

type BlogIndexPageProps = {
  Navigation: ComponentType;
  Footer: ComponentType;
};

function formatHuDate(iso: string): string {
  try {
    return new Date(iso + 'T12:00:00').toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function BlogIndexPage({ Navigation, Footer }: BlogIndexPageProps) {
  const posts = getBlogPostsSorted();
  const canonical = `${SITE_URL}${BLOG_INDEX_PATH}`;

  useLayoutEffect(() => {
    scrollToTop();
    requestAnimationFrame(scrollToTop);
  }, []);

  useSeo({
    title: `Blog | Masszázs Dunakeszin – ${SITE_NAME}`,
    description:
      'Masszázs Dunakeszin blog: kezelésútmutatók, frissítő és nyirokmasszázs, foglalási tippek, testi-lelki feltöltődés az Angyali Szalonban.',
    canonical,
    jsonLd: [
      buildBreadcrumbSchema([
        { name: 'Főoldal', url: `${SITE_URL}/` },
        { name: 'Blog', url: canonical },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: `${SITE_NAME} Blog`,
        url: canonical,
        description:
          'Cikkek masszázsról, kezelésekről és a testi-lelki feltöltődésről Dunakeszin.',
        blogPost: posts.map((post) => ({
          '@type': 'BlogPosting',
          headline: post.title,
          url: `${SITE_URL}${getBlogPath(post.slug)}`,
          datePublished: post.date,
          description: post.excerpt,
        })),
      },
    ],
  });

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navigation />
      <main>
        <section className="pt-28 pb-12 bg-gradient-hero">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm text-[#635241] mb-6" aria-label="Breadcrumb">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/');
                }}
                className="hover:text-[#D4854A]"
              >
                Főoldal
              </a>
              <span className="mx-2">/</span>
              <span className="text-[#4A3F35]">Blog</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#4A3F35] mb-4">
              Blog – masszázs Dunakeszin és testi-lelki feltöltődés
            </h1>
            <p className="text-lg text-[#635241] max-w-3xl leading-relaxed">
              Gyakorlati cikkek a kezelésekről, az első masszázsról, az online foglalásról és arról,
              hogyan hozd ki a legtöbbet az Angyali Szalon élményéből. Masszázs Dunakeszin – tudatosan,
              nyugodt tempóban.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="group bg-white rounded-3xl border border-[#E8D4C0]/60 overflow-hidden shadow-warm hover:border-[#D4854A]/40 hover:shadow-md transition-all flex flex-col h-full"
                >
                  <a
                    href={getBlogPath(post.slug)}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo(getBlogPath(post.slug));
                    }}
                    className="relative block shrink-0 overflow-hidden bg-[#F5E6D8]"
                    style={{ aspectRatio: CARD_IMAGE_ASPECT }}
                    aria-label={post.title}
                  >
                    <ResponsiveImage
                      src={post.image}
                      alt={post.title}
                      fill
                      className="transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </a>

                  <div className="p-5 flex flex-col flex-1 min-h-0">
                    <p className="text-xs text-[#635241] flex items-center gap-1.5 mb-2 shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-[#D4854A] shrink-0" />
                      {formatHuDate(post.date)}
                    </p>
                    <h2 className="text-lg font-bold text-[#4A3F35] mb-2 leading-snug line-clamp-2 min-h-[3.25rem]">
                      <a
                        href={getBlogPath(post.slug)}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo(getBlogPath(post.slug));
                        }}
                        className="hover:text-[#D4854A] transition-colors"
                      >
                        {post.title}
                      </a>
                    </h2>
                    <p className="text-sm text-[#635241] leading-relaxed line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <a
                      href={getBlogPath(post.slug)}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(getBlogPath(post.slug));
                      }}
                      className="inline-flex items-center gap-1 mt-4 pt-1 text-sm font-semibold text-[#D4854A] hover:text-[#B87333] shrink-0"
                    >
                      Tovább olvasom
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

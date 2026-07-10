import { useLayoutEffect, type ComponentType } from 'react';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import {
  BLOG_INDEX_PATH,
  getBlogPath,
  getBlogPostBySlug,
  getRelatedBlogPosts,
  type BlogPost,
} from '@/lib/blog-posts';
import { getServiceBySlug, getServicePath } from '@/lib/services';
import { navigateTo, navigateToSection, scrollToTop } from '@/lib/navigation';
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  SITE_NAME,
  SITE_URL,
  useSeo,
} from '@/lib/seo';

type BlogPostPageProps = {
  slug: string;
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

function BlogBody({ post }: { post: BlogPost }) {
  return (
    <div className="prose-none space-y-5 text-[#4A3F35] leading-relaxed">
      {post.blocks.map((block, index) => {
        if (block.type === 'h2') {
          return (
            <h2 key={index} className="text-2xl font-bold text-[#4A3F35] pt-4">
              {block.text}
            </h2>
          );
        }
        if (block.type === 'ul') {
          return (
            <ul key={index} className="list-disc pl-5 space-y-2 text-[#4A3F35]">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index} className="text-[#4A3F35] text-base sm:text-lg">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

export function BlogPostPage({ slug, Navigation, Footer }: BlogPostPageProps) {
  const post = getBlogPostBySlug(slug);
  const canonical = `${SITE_URL}${post ? getBlogPath(post.slug) : `${BLOG_INDEX_PATH}/${slug}`}`;
  const related = post ? getRelatedBlogPosts(post, 3) : [];
  const service = post?.serviceId ? getServiceBySlug(post.serviceId) : undefined;

  useLayoutEffect(() => {
    scrollToTop();
    requestAnimationFrame(scrollToTop);
  }, [slug]);

  useSeo(
    post
      ? {
          title: post.seoTitle || `${post.title} | ${SITE_NAME}`,
          description: post.seoDescription || post.excerpt,
          canonical,
          ogImage: post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`,
          ogType: 'article',
          jsonLd: [
            buildArticleSchema({
              title: post.title,
              description: post.seoDescription || post.excerpt,
              slug: post.slug,
              image: post.image,
              datePublished: post.date,
            }),
            buildBreadcrumbSchema([
              { name: 'Főoldal', url: `${SITE_URL}/` },
              { name: 'Blog', url: `${SITE_URL}${BLOG_INDEX_PATH}` },
              { name: post.title, url: canonical },
            ]),
          ],
        }
      : {
          title: `Cikk nem található | ${SITE_NAME}`,
          description: 'A keresett blogbejegyzés nem található.',
          canonical,
          noindex: true,
        }
  );

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FFFBF7]">
        <Navigation />
        <main className="max-w-3xl mx-auto px-4 py-28 text-center">
          <h1 className="text-3xl font-bold text-[#4A3F35] mb-4">Cikk nem található</h1>
          <Button
            onClick={() => navigateTo(BLOG_INDEX_PATH)}
            className="bg-[#D4854A] hover:bg-[#B87333] text-white"
          >
            Összes cikk
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navigation />
      <main>
        <article>
          <header className="pt-28 pb-10 bg-gradient-hero">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <a
                  href={BLOG_INDEX_PATH}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(BLOG_INDEX_PATH);
                  }}
                  className="hover:text-[#D4854A]"
                >
                  Blog
                </a>
                <span className="mx-2">/</span>
                <span className="text-[#4A3F35] line-clamp-1">{post.title}</span>
              </nav>

              <p className="text-sm text-[#635241] flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-[#D4854A]" />
                {formatHuDate(post.date)}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#4A3F35] mb-4 leading-tight">
                {post.title}
              </h1>
              <p className="text-lg text-[#635241] leading-relaxed">{post.excerpt}</p>
            </div>
          </header>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-10">
            <div
              className="relative rounded-3xl overflow-hidden shadow-warm-lg w-full bg-[#F5E6D8]"
              style={{ aspectRatio: '16 / 10' }}
            >
              <ResponsiveImage
                src={post.image}
                alt={post.title}
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="bg-white rounded-3xl border border-[#E8D4C0]/50 p-6 sm:p-10 shadow-warm">
              <BlogBody post={post} />
            </div>

            <div className="mt-8 bg-[#FFF3E8] rounded-3xl border border-[#F5D5B8]/70 p-6 sm:p-8">
              <p className="text-xl font-bold text-[#4A3F35] mb-2">Foglalj időpontot Dunakeszin</p>
              <p className="text-[#635241] mb-4">
                Masszázs és kezelések az Angyali Szalonban – online foglalás bankkártyával vagy
                átutalással.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => navigateToSection('#idopont')}
                  className="bg-[#D4854A] hover:bg-[#B87333] text-white"
                >
                  Időpontfoglalás
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                {service && (
                  <Button
                    variant="outline"
                    onClick={() => navigateTo(getServicePath(service.id))}
                    className="border-[#D4854A] text-[#D4854A] hover:bg-[#D4854A] hover:text-white"
                  >
                    {service.name} részletei
                  </Button>
                )}
              </div>
            </div>

            {related.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-bold text-[#4A3F35] mb-4">Kapcsolódó cikkek</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {related.map((item) => (
                    <a
                      key={item.slug}
                      href={getBlogPath(item.slug)}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(getBlogPath(item.slug));
                      }}
                      className="bg-white rounded-2xl border border-[#E8D4C0]/60 p-4 hover:border-[#D4854A]/40 transition-colors"
                    >
                      <p className="font-semibold text-[#4A3F35] text-sm leading-snug">{item.title}</p>
                      <p className="text-xs text-[#635241] mt-2 line-clamp-2">{item.excerpt}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 mb-16">
              <a
                href={BLOG_INDEX_PATH}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(BLOG_INDEX_PATH);
                }}
                className="inline-flex items-center gap-2 text-sm text-[#635241] hover:text-[#D4854A]"
              >
                <ArrowLeft className="w-4 h-4" />
                Vissza a bloghoz
              </a>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

import { lazy, Suspense, useEffect, useState, useRef } from 'react';
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Star,
  Heart,
  Sparkles,
  CheckCircle2,
  Play,
  Facebook,
  ArrowRight,
  ChevronDown,
  User,
  MessageSquare,
  X as XIcon,
  CreditCard,
  Lock,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getAppRoute, navigateTo, ROUTES, type AppRoute } from '@/lib/navigation';
import { services, getServicePath } from '@/lib/services';
import {
  FAQ_ITEMS,
  GOOGLE_MAPS_URL,
  GOOGLE_REVIEW_COUNT,
  GOOGLE_WRITE_REVIEW_URL,
  formatGoogleRating,
  HOME_SEO,
  useSeo,
} from '@/lib/seo';
import {
  addDaysToDateStr,
  addMonthsToDateStr,
  BOOKING_MAX_MONTHS_AHEAD,
  getTodayInBudapest,
} from '@/lib/utils';
import { MapEmbed } from '@/components/MapEmbed';
import { PrivacyPolicyContent } from '@/components/PrivacyPolicyContent';
import { LogoImage } from '@/components/LogoImage';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import { getImageMeta } from '@/lib/images';
import { BANK_ACCOUNT, SCRIPT_URL } from '@/lib/script-api';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { ServiceLandingPage } from '@/pages/ServiceLandingPage';

const ManageBookingsPage = lazy(() =>
  import('@/pages/portal-pages').then((m) => ({ default: m.ManageBookingsPage }))
);
const AdminPage = lazy(() =>
  import('@/pages/portal-pages').then((m) => ({ default: m.AdminPage }))
);
const BookingBankPendingPage = lazy(() =>
  import('@/pages/portal-pages').then((m) => ({ default: m.BookingBankPendingPage }))
);
const BookingSuccessPage = lazy(() =>
  import('@/pages/portal-pages').then((m) => ({ default: m.BookingSuccessPage }))
);
const BookingCancelPage = lazy(() =>
  import('@/pages/portal-pages').then((m) => ({ default: m.BookingCancelPage }))
);

function RouteFallback() {
  return (
    <div className="min-h-screen bg-[#FFFBF7] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#D4854A] animate-spin" aria-label="Betöltés" />
    </div>
  );
}

// Navigation Component
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#fooldal', label: 'Főoldal' },
    { href: '#kezelesek', label: 'Kezelések' },
    { href: '#arlista', label: 'Árlista' },
    { href: '#gyik', label: 'GYIK' },
    { href: '#tv-szereplesek', label: 'TV Szereplések' },
    { href: '#idopont', label: 'Időpontfoglalás' },
    { href: '#kapcsolat', label: 'Kapcsolat' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      aria-label="Fő navigáció"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled || isMobileMenuOpen
        ? 'bg-white/95 backdrop-blur-md shadow-warm py-3'
        : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#fooldal"
            onClick={(e) => { e.preventDefault(); scrollToSection('#fooldal'); }}
            className="flex items-center gap-2 group"
          >
            <LogoImage size={56} className="w-14 h-14 rounded-full object-cover" />
            <div className="hidden sm:block">
              <span className="block font-semibold text-lg leading-tight text-[#4A3F35]">
                Dunakeszi Masszázs
              </span>
              <span className="block text-xs text-[#635241]">
                Angyali Szalon - Makra Edina
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${link.href === '#idopont'
                  ? 'bg-[#D4854A] text-white hover:bg-[#B87333]'
                  : 'text-[#4A3F35] hover:bg-[#F5E6D8] hover:text-[#D4854A]'
                  }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href={ROUTES.manage}
              onClick={(e) => { e.preventDefault(); navigateTo(ROUTES.manage); }}
              className="px-4 py-2 rounded-full text-sm font-medium text-[#4A3F35] hover:bg-[#F5E6D8] hover:text-[#D4854A] transition-all duration-300 flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              Foglalásaim
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Menü bezárása' : 'Menü megnyitása'}
            aria-expanded={isMobileMenuOpen}
            className="lg:hidden p-2 rounded-lg hover:bg-[#F5E6D8] transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-[#4A3F35]" />
            ) : (
              <Menu className="w-6 h-6 text-[#4A3F35]" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-[#E8D4C0] pt-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${link.href === '#idopont'
                    ? 'bg-[#D4854A] text-white'
                    : 'text-[#4A3F35] hover:bg-[#F5E6D8]'
                    }`}
                >
                  {link.label}
                </a>
              ))}
              <a
                href={ROUTES.manage}
                onClick={(e) => { e.preventDefault(); navigateTo(ROUTES.manage); }}
                className="px-4 py-3 rounded-xl text-sm font-medium text-[#4A3F35] hover:bg-[#F5E6D8] flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#D4854A]" />
                Foglalásaim kezelése
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Hero Section
function HeroSection() {
  const [isVisible] = useState(true);

  const scrollToBooking = () => {
    const element = document.querySelector('#idopont');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.querySelector('#kezelesek');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="fooldal" className="relative min-h-screen bg-gradient-hero overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#D4854A]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#E8D4C0]/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
              <Sparkles className="w-4 h-4 text-[#D4854A]" />
              <span className="text-sm font-medium text-[#635241]">RTL & TV2 szereplések</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#4A3F35] leading-tight">
                Masszázs Dunakeszin – testi-lelki feltöltődés
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#B87333]">
                Angyali Szalon · Makra Edina masszőr
              </p>

              <p className="text-base sm:text-lg text-[#635241] max-w-lg leading-relaxed mt-2">
                Nyugtató, harmonizáló kezelések egy békés, biztonságos környezetben az
                <span className="font-semibold text-[#D4854A]"> Angyali Szalonban</span>.
                Személyre szabott masszázskezelésekkel várlak szeretettel.
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-4">
              {[
                'Stresszoldó kezelések',
                'Kíméletes technikák',
                'Nyugodt légkör'
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#8B9A7C]" />
                  <span className="text-sm text-[#4A3F35]">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={scrollToBooking}
                className="bg-[#B87333] hover:bg-[#9A5A28] text-white px-8 py-6 rounded-full text-base font-semibold shadow-warm hover:shadow-warm-lg transition-all duration-300 hover:-translate-y-1"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Időpontot szeretnék
              </Button>
              <Button
                onClick={scrollToServices}
                variant="outline"
                className="border-2 border-[#9A5A28] text-[#7A4420] hover:bg-[#B87333] hover:border-[#B87333] hover:text-white px-8 py-6 rounded-full text-base font-semibold transition-all duration-300"
              >
                Kezelések megtekintése
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Contact Quick Info */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <a
                href="tel:+36304877883"
                className="flex items-center gap-2 text-[#635241] hover:text-[#D4854A] transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">+36 30 487 7883</span>
              </a>
              <div className="flex items-center gap-2 text-[#635241]">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Dunakeszi, Kolonics György utca 2/B (kapucsengő: 1/43)</span>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-warm-lg">
                <ResponsiveImage
                  src="/images/szalon-1.jpeg"
                  alt="Relaxáló masszázs környezet az Angyali Szalonban, Dunakeszi"
                  className="w-full h-[500px] lg:h-[600px] object-cover"
                  loading="eager"
                  fetchPriority="high"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 600px"
                  width={1600}
                  height={900}
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#4A3F35]/30 via-transparent to-transparent" />
              </div>

              {/* Floating Cards — tap to open Google */}
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="Google vélemények megtekintése"
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-warm animate-float hover:shadow-warm-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#8B9A7C]/20 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-[#8B9A7C]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#4A3F35]">{GOOGLE_REVIEW_COUNT}</p>
                    <p className="text-sm text-[#635241]">Google vélemény</p>
                  </div>
                </div>
              </a>

              <a
                href={GOOGLE_WRITE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="Google értékelés írása"
                className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-warm animate-float hover:shadow-warm-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                style={{ animationDelay: '1s' }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-[#D4854A] text-[#D4854A]" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-[#4A3F35]">{formatGoogleRating()}</span>
                </div>
                <p className="text-xs text-[#635241] mt-1">Google értékelés · koppints</p>
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-[#635241]" />
        </div>
      </div>
    </section>
  );
}

// Benefits Section
function BenefitsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      icon: Heart,
      title: 'Stresszcsökkentés',
      description: 'A gyengéd, ritmikus fogások segítenek lelassítani, elengedni a mindennapi feszültséget, és megteremteni a belső nyugalom érzését.'
    },
    {
      icon: Sparkles,
      title: 'Izomlazítás',
      description: 'A letapadt, feszes izmok fellazulnak, ezáltal csökkenhet a hát-, nyak- és vállfájdalom, könnyebb lesz a mozgás.'
    },
    {
      icon: CheckCircle2,
      title: 'Jobb keringés',
      description: 'A masszázs serkenti a vér- és nyirokkeringést, támogatja a szervezet természetes regenerációs folyamatait.'
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-[#FFFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4A3F35] mb-4">
            Miért jó a masszázs a testednek és a lelkednek?
          </h2>
          <p className="text-lg text-[#635241]">
            A rendszeres masszázs segíthet enyhíteni a fájdalmat, csökkenteni a stresszt,
            javítani a keringést és támogatni a mélyebb alvást.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`group bg-white rounded-3xl p-8 shadow-warm hover:shadow-warm-lg transition-all duration-500 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#D4854A]/20 to-[#E8D4C0] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="w-8 h-8 text-[#D4854A]" />
              </div>
              <h3 className="text-xl font-semibold text-[#4A3F35] mb-3">
                {benefit.title}
              </h3>
              <p className="text-[#635241] leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Service Detail Modal Component
function ServiceModal({ service, isOpen, onClose }: { service: typeof services[0] | null; isOpen: boolean; onClose: () => void }) {
  if (!service || !isOpen) return null;

  const scrollToBooking = () => {
    onClose();
    setTimeout(() => {
      const element = document.querySelector('#idopont');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
        >
          <XIcon className="w-5 h-5 text-[#4A3F35]" />
        </button>

        {/* Image */}
        <div className="relative h-64 sm:h-80">
          <ResponsiveImage
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
            loading="lazy"
            width={getImageMeta(service.image).width}
            height={getImageMeta(service.image).height}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {service.name}
            </h2>
            <div className="flex items-center gap-2 text-white/90">
              <Clock className="w-5 h-5" />
              <span>{service.duration}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <p className="text-[#4A3F35] leading-relaxed mb-6 text-base sm:text-lg">
            {service.description}
          </p>

          <div className="mb-6">
            <h3 className="font-semibold text-[#4A3F35] mb-3 text-lg">Előnyök:</h3>
            <div className="flex flex-wrap gap-2">
              {service.benefits.map((benefit, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-[#F5E6D8] text-[#4A3F35] rounded-full text-sm font-medium"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>

          {/* Before/After Photos */}
          {service.beforeAfter && service.beforeAfter.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-[#4A3F35] mb-4 text-lg">Eredmények – Előtte & Utána:</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {service.beforeAfter.map((pair, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <img
                          src={pair.before}
                          alt="Előtte"
                          className="w-full h-32 object-cover rounded-lg"
                          loading="lazy"
                          width={320}
                          height={128}
                        />
                        <span className="absolute bottom-2 left-2 bg-[#8B9A7C]/80 text-white text-xs px-2 py-1 rounded">Utána</span>
                      </div>
                      <div className="relative">
                        <img
                          loading="lazy"
                          src={pair.after}
                          alt="Utána"
                          className="w-full h-32 object-cover rounded-lg"
                          width={320}
                          height={128}
                        />
                        <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Előtte</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => {
                onClose();
                navigateTo(getServicePath(service.id));
              }}
              variant="outline"
              className="flex-1 border-[#D4854A] text-[#D4854A] hover:bg-[#D4854A] hover:text-white py-4 rounded-xl"
            >
              Teljes kezelés oldal
            </Button>
            <Button
              onClick={scrollToBooking}
              className="flex-1 bg-[#D4854A] hover:bg-[#B87333] text-white py-4 rounded-xl text-lg font-medium shadow-warm hover:shadow-warm-lg transition-all duration-300"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Időpontfoglalás
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Services Section
function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const openModal = (service: typeof services[0]) => {
    setSelectedService(service);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
    setTimeout(() => setSelectedService(null), 300);
  };

  return (
    <section id="kezelesek" ref={sectionRef} className="py-20 bg-gradient-to-b from-[#FFFBF7] to-[#F9F1EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block px-4 py-2 bg-[#D4854A]/10 rounded-full text-sm font-medium text-[#D4854A] mb-4">
            Személyre szabott kezelések
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4A3F35] mb-4">
            Kiemelt kezelések Dunakeszin
          </h2>
          <p className="text-lg text-[#635241]">
            A kezeléseket mindig a vendég aktuális állapotához, igényeihez igazítom az Angyali Szalonban.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`group bg-white rounded-2xl overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-500 hover:-translate-y-2 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => navigateTo(getServicePath(service.id))}
            >
              <div className="relative h-48 overflow-hidden">
                <ResponsiveImage
                  src={service.image}
                  alt={`${service.name} – masszázs Dunakeszin`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  sizes="(max-width: 768px) 90vw, 400px"
                  width={getImageMeta(service.image).width}
                  height={getImageMeta(service.image).height}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#4A3F35]/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#4A3F35] mb-2 group-hover:text-[#D4854A] transition-colors">
                  {service.name}
                </h3>
                <p className="text-[#635241] text-sm line-clamp-2 mb-4">
                  {service.shortDescription}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center text-[#D4854A] text-sm font-medium">
                    <span>Részletek</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(service);
                    }}
                    className="text-xs text-[#635241] hover:text-[#D4854A] underline min-h-11 min-w-11 inline-flex items-center justify-center px-2"
                  >
                    Gyors áttekintés
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Modal */}
      <ServiceModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
}

// FAQ Section
function FAQSection() {
  return (
    <section id="gyik" className="py-20 bg-[#F9F1EA]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4A3F35] mb-4">Gyakran ismételt kérdések</h2>
          <p className="text-lg text-[#635241]">Masszázs Dunakeszin – hasznos információk az Angyali Szalonban.</p>
        </div>
        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group bg-white rounded-2xl border border-[#E8D4C0]/60 p-5 shadow-warm open:shadow-warm-lg"
            >
              <summary className="cursor-pointer font-semibold text-[#4A3F35] list-none flex items-center justify-between gap-4">
                {item.question}
                <ChevronDown className="w-5 h-5 text-[#D4854A] group-open:rotate-180 transition-transform shrink-0" />
              </summary>
              <p className="mt-4 text-[#4A3F35] leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// Pricing Section
function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const prices: Array<{ name: string; duration: string; price: string; slug?: string }> = [
    { name: 'Frissítő masszázs', duration: 'kb. 60 perc', price: '15 000', slug: 'frissito' },
    { name: 'Nepáli masszázs', duration: 'kb. 60 perc', price: '15 000', slug: 'nepali' },
    { name: 'Nyirokmasszázs', duration: '60 perc', price: '15 000', slug: 'nyirok' },
    { name: 'Aromamasszázs', duration: '60 perc', price: '15 000', slug: 'aroma' },
    { name: 'Indiai fejmasszázs', duration: 'kb. 30-40 perc', price: '15 000', slug: 'indiai' },
    { name: 'Nehézfém-kivezetés', duration: 'kb. 60 perc', price: '15 000', slug: 'nehezfem' },
    { name: 'Kineziológia', duration: '60-75 perc', price: '15 000', slug: 'kineziologia' },
    { name: 'Ultrahangos zsírbontás', duration: 'kb. 45-60 perc', price: '15 000', slug: 'zsirbontas' },
    { name: 'Arany kollagén arckezelés', duration: 'kb. 60-90 perc', price: '30 000', slug: 'kollagen' },
    { name: 'Metamorf masszázs', duration: 'kb. 60 perc', price: '15 000', slug: 'metamorf' },
    { name: 'BEMER Kezelés (20 perc)', duration: 'kb. 20 perc', price: '7 500', slug: 'bemer' },
    { name: 'BEMER Kezelés (40 perc)', duration: 'kb. 40 perc', price: '15 000', slug: 'bemer' },
  ];

  return (
    <section id="arlista" ref={sectionRef} className="py-20 bg-[#FFFBF7]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block px-4 py-2 bg-[#D4854A]/10 rounded-full text-sm font-medium text-[#D4854A] mb-4">
            Átlátható árazás
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4A3F35] mb-4">
            Masszázs Árlista Dunakeszi
          </h2>
          <p className="text-lg text-[#635241]">
            Az alábbi árak forintban értendők, alkalmanként fizetendők.
            A kezeléseket minden esetben a vendég aktuális állapotához és igényeihez igazítom.
          </p>
        </div>

        <div className={`bg-white rounded-3xl shadow-warm overflow-hidden transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="divide-y divide-[#E8D4C0]">
            {prices.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-6 hover:bg-[#F9F1EA] transition-colors"
              >
                <div className="flex-1">
                  {item.slug ? (
                    <a
                      href={getServicePath(item.slug)}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(getServicePath(item.slug!));
                      }}
                      className="font-semibold text-[#4A3F35] text-lg hover:text-[#D4854A] transition-colors"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <h3 className="font-semibold text-[#4A3F35] text-lg">{item.name}</h3>
                  )}
                  <p className="text-sm text-[#635241]">{item.duration}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#D4854A]">{item.price}</span>
                  <span className="text-[#635241] ml-1">Ft</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-[#F9F1EA]">
            <p className="text-sm text-[#635241] text-center">
              Az árak tájékoztató jellegűek, a változtatás jogát fenntartom.
              Több kezelés kombinálásáról vagy egyéni igényről szívesen egyeztetek személyesen vagy telefonon.
            </p>
          </div>
        </div>

        <div className={`mt-8 text-center transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Button
            onClick={() => {
              const element = document.querySelector('#idopont');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-[#D4854A] hover:bg-[#B87333] text-white px-8 py-6 rounded-full text-base font-medium shadow-warm hover:shadow-warm-lg transition-all duration-300 hover:-translate-y-1"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Időpontot kérek
          </Button>
        </div>
      </div>
    </section>
  );
}

// TV Appearances Section
function TVSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="tv-szereplesek" ref={sectionRef} className="py-20 bg-gradient-to-b from-[#F9F1EA] to-[#FFFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block px-4 py-2 bg-[#D4854A]/10 rounded-full text-sm font-medium text-[#D4854A] mb-4">
            Országos tévécsatornákon
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4A3F35] mb-4">
            Masszázs a TV-ben
          </h2>
          <p className="text-lg text-[#635241]">
            Nagy megtiszteltetés számomra, hogy munkámat országos televíziós csatornák is bemutatták.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* TV2 Video */}
          <div
            className={`bg-white rounded-3xl overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
          >
            <div className="relative aspect-video">
              <YouTubeEmbed videoId="F8xyJXDlgNM" title="TV2 Szereplés" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#D4854A] to-[#B87333] rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#4A3F35]">TV2</h3>
                  <p className="text-[#635241]">Mokka műsor · 2024</p>
                </div>
              </div>
              <p className="text-[#4A3F35] leading-relaxed">
                A TV2-ben készült összeállításban arról esik szó, hogyan segíthet a masszázs a rohanó, feszültséggel teli mindennapokban.
              </p>
            </div>
          </div>

          {/* RTL Video */}
          <div
            className={`bg-white rounded-3xl overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            style={{ transitionDelay: '1s' }}
          >
            <div className="relative aspect-video">
              <YouTubeEmbed videoId="AbujjtXl-E0" title="RTL Szereplés" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#D4854A] to-[#B87333] rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#4A3F35]">RTL Klub</h3>
                  <p className="text-[#635241]">Reggeli műsor · 2024</p>
                </div>
              </div>
              <p className="text-[#4A3F35] leading-relaxed">
                Ebben a riportban a masszázs jótékony hatásairól, a mindennapi stressz oldásáról és a természetes regeneráció fontosságáról beszélek.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const testimonials = [
    {
      text: 'Nagyon ajánlom Edina masszázsát. Többször is voltam nála, mindig figyelmes, kedves és profin végzi a munkáját. Igazi kikapcsolódás, masszázs közben teljesen ellazulok.',
      author: 'Judit Derzsényi',
      source: 'Google',
      date: '2025. március'
    },
    {
      text: 'Egy hely az igazi kikapcsolódásra és feltöltődésre. Edina a munkájában felkészült, nagy szakmai tapasztalattal rendelkezik, nagyon kedves, udvarias, kommunikatív. Csak ajánlani tudom!',
      author: 'Maria Lutring Moser',
      source: 'Google',
      date: '2025. január'
    },
    {
      text: 'Edinánál voltam masszázson, és egyszerűen fantasztikus élmény volt! Nagyon profi, kedves és figyelmes – azonnal érezni lehetett, hogy ért a szakmájához.',
      author: 'Zoltán',
      source: 'Google',
      date: '2024. november'
    },
    {
      text: 'Minden alkalommal feltöltődve, megújulva távozom. Nem csak a szakértelme kiemelkedő, de a kedvessége és figyelmessége is lenyűgöző.',
      author: 'Xavér Szalai',
      source: 'Google',
      date: '2025. február'
    },
    {
      text: 'Edina egy nagyon tapasztalt és figyelmes masszőr. A kezelés alatt teljesen el tudtam lazulni, és elmúltak a panaszaim. Minden szempontból feltöltő élmény volt – biztosan visszatérek.',
      author: 'Ildikó H.',
      source: 'Google',
      date: '2025. április'
    },
    {
      text: 'Gépi nyirokmasszázson és kineziológiai tanácsadáson vettem részt, és csak a legjobbakat tudom mondani! A nyirokmasszázs rendkívül kellemes és hatékony volt.',
      author: 'Judit Spisák',
      source: 'Google',
      date: '2024. december'
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-[#FFFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block px-4 py-2 bg-[#8B9A7C]/10 rounded-full text-sm font-medium text-[#8B9A7C] mb-4">
            Google Vélemények
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4A3F35] mb-4">
            Mit mondanak a vendégek?
          </h2>

          {/* Google Rating Badge */}
          <div className={`flex flex-col items-center gap-4 mb-8 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-warm hover:shadow-warm-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-1">
                <span className="text-3xl font-bold text-[#4A3F35]">{formatGoogleRating()}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-[#D4854A] text-[#D4854A]" />
                  ))}
                </div>
              </div>
              <div className="w-px h-8 bg-[#E8D4C0]" />
              <div className="text-left">
                <p className="text-sm text-[#635241]">Google értékelés</p>
                <p className="text-sm font-medium text-[#4A3F35]">{GOOGLE_REVIEW_COUNT} vélemény alapján</p>
              </div>
              <svg className="w-6 h-6 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </a>
            <p className="text-sm text-[#635241]">
              Kattints a badge-re az összes vélemény megtekintéséhez
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-6 shadow-warm hover:shadow-warm-lg transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Quote Icon */}
              <div className="absolute -top-3 left-6 w-6 h-6 bg-[#D4854A] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-serif">"</span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-[#D4854A] text-[#D4854A]" />
                  ))}
                </div>
                <span className="text-xs text-[#635241] bg-[#F5E6D8] px-2 py-1 rounded-full">
                  {testimonial.source}
                </span>
              </div>

              <p className="text-[#4A3F35] leading-relaxed mb-4 text-sm line-clamp-4">
                "{testimonial.text}"
              </p>

              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#4A3F35]">
                  — {testimonial.author}
                </p>
                {testimonial.date && (
                  <p className="text-xs text-[#635241]">{testimonial.date}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Review CTAs */}
        <div className={`text-center mt-10 space-y-4 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-sm text-[#635241] max-w-xl mx-auto">
            Elégedett voltál a kezeléssel? Egy rövid Google értékelés sokat segít másoknak — és nekünk is. Köszönjük!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={GOOGLE_WRITE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4854A] text-white rounded-full font-semibold hover:bg-[#B87333] transition-all duration-300 shadow-warm"
            >
              <Star className="w-4 h-4 fill-white" />
              <span>Írj Google értékelést</span>
            </a>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#E8D4C0] rounded-full text-[#4A3F35] hover:bg-[#F5E6D8] hover:border-[#D4854A] transition-all duration-300"
            >
              <span>Összes vélemény megtekintése</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Organo Coffee Section
function OrganoCoffeeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-[#F9F1EA] to-[#FFFBF7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block px-4 py-2 bg-[#8B4513]/10 rounded-full text-sm font-medium text-[#8B4513] mb-4">
            Különleges kínálat
          </span>
          <p className="text-3xl sm:text-4xl font-bold text-[#4A3F35] mb-4" role="doc-subtitle">
            Organo Prémium Kávé & Zöld Tea
          </p>
        </div>

        <div className={`bg-white rounded-3xl shadow-warm-lg p-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left side - Text content */}
            <div className="space-y-6">
              <p className="text-[#4A3F35] leading-relaxed text-lg">
                Az általam végzett kezelések során minden kedves vendégemet szeretettel kínálom a prémium minőségű <span className="font-semibold text-[#8B4513]">Organo kávéval és zöld teával</span>, amelyek ganoderma spórát és oroszlánsörény gombát (Hericium erinaceus) tartalmaznak.
              </p>

              <p className="text-[#635241] leading-relaxed">
                Ez a különleges összetétel hozzájárulhat a kiegyensúlyozott közérzethez és a szervezet harmonikus működéséhez.
              </p>

              {/* Coffee Varieties */}
              <div className="space-y-3">
                <h3 className="font-semibold text-[#4A3F35]">Kávé választék:</h3>
                <ul className="space-y-2">
                  {['Fekete kávé', 'Gourmet Latte', 'Mocha Cappuccino', 'Forró csokoládé'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-[#635241]">
                      <span className="w-1.5 h-1.5 bg-[#8B4513] rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Green Tea */}
              <div className="space-y-3">
                <h3 className="font-semibold text-[#4A3F35]">Zöld tea:</h3>
                <p className="text-[#635241] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#4A7C59] rounded-full"></span>
                  Reishi Ganoderma zöld tea
                </p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-[#F9F1EA] rounded-xl">
                <div className="w-12 h-12 bg-[#8B4513]/10 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#8B4513]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#4A3F35]">Helyszíni vásárlás</p>
                  <p className="text-sm text-[#635241]">A termékek a helyszínen is megvásárolhatók</p>
                </div>
              </div>

              <p className="text-[#635241] text-sm">
                Így vendégeim otthonukban is élvezhetik jótékony hatásait.
              </p>
            </div>

            {/* Right side - Images */}
            <div className="space-y-6">
              {/* Coffee Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-warm">
                <ResponsiveImage
                  loading="lazy"
                  src="/images/organo-kave.jpeg"
                  alt="Organo kávé választék - Fekete kávé, Gourmet Latte, Mocha Cappuccino, Forró csokoládé"
                  className="w-full h-64 object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  width={1152}
                  height={2048}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white font-semibold">Organo Kávé Választék</p>
                </div>
              </div>

              {/* Green Tea Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-warm">
                <ResponsiveImage
                  loading="lazy"
                  src="/images/organo-zoldtea.jpeg"
                  alt="Organo Reishi Ganoderma zöld tea"
                  className="w-full h-64 object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  width={1152}
                  height={2048}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white font-semibold">Organo Reishi Ganoderma Zöld Tea</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-[#F9F1EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="relative rounded-3xl overflow-hidden shadow-warm-lg">
              <ResponsiveImage
                loading="lazy"
                src="/images/edina.jpeg"
                alt="Makra Edina - Masszőr, kineziológus"
                className="w-full h-[400px] lg:h-[500px] object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                width={1200}
                height={1599}
              />
            </div>

            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#D4854A]/20 rounded-full blur-2xl" />
          </div>

          {/* Content */}
          <div className={`space-y-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <span className="inline-block px-4 py-2 bg-[#D4854A]/10 rounded-full text-sm font-medium text-[#D4854A]">
              Rólam
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#4A3F35]">
              Figyelem, törődés, nyugalom
            </h2>

            <div className="space-y-4 text-[#4A3F35] leading-relaxed">
              <p>
                Számomra a masszázs több, mint egy kezelés. Lehetőség arra, hogy a vendég
                végre megálljon egy kicsit, letegye a mindennapi terheket, és biztonságos,
                nyugodt környezetben töltődjön fel az <span className="font-semibold text-[#D4854A]">Angyali Szalonban</span>.
              </p>
              <p>
                Minden alkalommal röviden átbeszéljük, milyen panaszaid, igényeid vannak,
                majd ehhez igazítom a fogásokat és az érintés erősségét. Fontosnak tartom,
                hogy a masszázs ne legyen fájdalmas, mégis hatékonyan segítsen a feszültség
                oldásában és a testi-lelki egyensúly megtalálásában.
              </p>
              <p>
                A kezelések célja mindig az, hogy úgy állj fel a masszázs végén,
                hogy könnyebbnek, nyugodtabbnak és energikusabbnak érezd magad.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {['Okleveles masszőr', 'Kineziológus', 'Gépi nyirokmasszázs', 'BEMER terapeuta', 'TV2 & RTL szereplő'].map((badge) => (
                <span key={badge} className="px-3 py-1 bg-[#D4854A]/10 text-[#D4854A] text-xs font-medium rounded-full">
                  {badge}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4854A] to-[#B87333] rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#4A3F35]">Makra Edina</p>
                <p className="text-sm text-[#635241]">Masszőr · Kineziológus · Angyali Szalon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Salon Gallery Section
function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const images = [
    { src: '/images/szalon-1.jpeg', alt: 'Angyali Szalon - belső tér', aspect: 'aspect-video' },
    { src: '/images/szalon-2.jpeg', alt: 'Angyali Szalon - kezelőhelyiség', aspect: 'aspect-[4/3]' },
    { src: '/images/szalon-3.jpeg', alt: 'Angyali Szalon - nyugodt környezet', aspect: 'aspect-video' },
    { src: '/images/szalon-4.jpeg', alt: 'Angyali Szalon - külső megjelenés', aspect: 'aspect-[4/3]' },
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-[#F9F1EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block px-4 py-2 bg-[#D4854A]/10 rounded-full text-sm font-medium text-[#D4854A] mb-4">
            Galéria
          </span>
          <p className="text-3xl sm:text-4xl font-bold text-[#4A3F35] mb-4" role="doc-subtitle">
            Az Angyali Szalon
          </p>
          <p className="text-lg text-[#635241]">
            Egy békés, nyugodt környezet Dunakeszin, ahol feltöltődhetsz és kikapcsolódhatsz.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative group overflow-hidden rounded-2xl shadow-warm transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={`${image.aspect} overflow-hidden`}>
                <ResponsiveImage
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  width={getImageMeta(image.src).width}
                  height={getImageMeta(image.src).height}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A3F35]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Professional Products Section
function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-[#FFFBF7] to-[#F9F1EA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block px-4 py-2 bg-[#D4854A]/10 rounded-full text-sm font-medium text-[#D4854A] mb-4">
            Professzionális termékek
          </span>
          <p className="text-3xl sm:text-4xl font-bold text-[#4A3F35] mb-4" role="doc-subtitle">
            Prémium minőségű kozmetikumok
          </p>
          <p className="text-lg text-[#635241]">
            Az Angyali Szalonban kizárólag professzionális, prémium minőségű termékekkel dolgozom, hogy a legjobb eredményt érjük el.
          </p>
        </div>

        <div className={`grid lg:grid-cols-2 gap-8 items-center transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Product Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-warm-lg">
            <ResponsiveImage
              loading="lazy"
              src="/images/professional-products.jpeg"
              alt="Professzionális kozmetikai termékek - Magic brand"
              className="w-full h-auto object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              width={1600}
              height={1200}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4A3F35]/30 to-transparent" />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-warm">
              <h3 className="text-xl font-bold text-[#4A3F35] mb-4">Magic Professional</h3>
              <p className="text-[#635241] leading-relaxed mb-4">
                A kezelések során kizárólag professzionális, prémium minőségű Magic termékeket használok. Ezek a termékek kifejezetten szakemberek számára készülnek, és garantálják a látványos, tartós eredményt.
              </p>
              <ul className="space-y-2">
                {[
                  'Magic Drops – Intenzív szérumok',
                  'Magic Cream – Tápláló krémek',
                  'Tonic Magic – Frissítő tonikok',
                  'Professzionális tisztítók',
                  'Speciális maszkok és pakolások'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-[#4A3F35]">
                    <span className="w-2 h-2 bg-[#D4854A] rounded-full flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#8B9A7C]/10 rounded-2xl p-6">
              <p className="text-[#8B9A7C] font-medium text-center">
                "Csak a legjobbat használom vendégeimnek – a minőség nem kompromisszum!"
              </p>
              <p className="text-[#635241] text-center text-sm mt-2">
                – Makra Edina
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Custom Booking System with Payment
function BookingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    time: '',
    notes: '',
    recurring: false,
    recurringType: 'weekly', // 'weekly', 'biweekly', 'monthly'
    recurringCount: 4 // default 4 sessions
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [slotsForDate, setSlotsForDate] = useState<Record<string, boolean> | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const loadSlotsForDate = async (date: string) => {
    if (!date) { setSlotsForDate(null); return; }
    setIsLoadingSlots(true);
    try {
      const res = await fetch(`${SCRIPT_URL}?action=getSlotsForDate&date=${date}`);
      const data = await res.json();
      if (data.success && data.data?.slots) setSlotsForDate(data.data.slots);
      else setSlotsForDate(null);
    } catch { setSlotsForDate(null); }
    finally { setIsLoadingSlots(false); }
  };

  const servicesList = [
    { name: 'Frissítő masszázs', price: 15000 },
    { name: 'Nepáli masszázs', price: 15000 },
    { name: 'Nyirokmasszázs', price: 15000 },
    { name: 'Aromamasszázs', price: 15000 },
    { name: 'Indiai fejmasszázs', price: 15000 },
    { name: 'Nehézfém-kivezetés', price: 15000 },
    { name: 'Kineziológia', price: 15000 },
    { name: 'Arany kollagén arckezelés', price: 30000 },
    { name: 'Ultrahangos zsírbontás', price: 15000 },
    { name: 'Metamorf masszázs', price: 15000 },
    { name: 'BEMER Kezelés', price: 15000 },
    { name: 'BEMER Kezelés (20 perc)', price: 7500 },
    { name: 'BEMER Kezelés (40 perc)', price: 15000 }
  ];

  // Time slots with 75-minute intervals (60 min session + 15 min break)
  // First: 8:30, Last: 18:30 (finishes by 19:30)
  const timeSlots = [
    '08:30', '09:45', '11:00', '12:15', '13:30', '14:45', '16:00', '17:15', '18:30'
  ];

  const getSelectedServicePrice = () => {
    // 1. Try to find in servicesList (used by the booking select menu)
    const slItem = servicesList.find(s => s.name === formData.service);
    if (slItem) return slItem.price;

    // 2. Try to find in services (used by the service cards/modals)
    const sItem = services.find(s => s.name === formData.service);
    if (sItem && typeof (sItem as any).price === 'number') return (sItem as any).price;

    // 3. Robust fallbacks for BEMER case
    if (formData.service?.includes('BEMER')) {
      if (formData.service.includes('20')) return 7500;
      return 15000;
    }

    // 4. Ultimate fallback to avoid 175 Ft error (minimum amount)
    // If no service is selected or found, default to a standard session price
    return 15000;
  };

  // Discount system for multiple sessions
  const getDiscountPercent = () => {
    if (!formData.recurring) return 0;
    const count = formData.recurringCount;
    if (count >= 6) return 15; // 15% for 6+ sessions
    if (count >= 4) return 10; // 10% for 4-5 sessions
    if (count >= 2) return 5;  // 5% for 2-3 sessions
    return 0;
  };

  const getDiscountAmount = () => {
    const basePrice = getSelectedServicePrice();
    const count = formData.recurring ? formData.recurringCount : 1;
    const totalPrice = basePrice * count;
    const discountPercent = getDiscountPercent();
    return Math.round(totalPrice * (discountPercent / 100));
  };

  const getTotalPriceWithDiscount = () => {
    const basePrice = getSelectedServicePrice();
    const count = formData.recurring ? formData.recurringCount : 1;
    const totalPrice = basePrice * count;
    return totalPrice - getDiscountAmount();
  };

  const getFinalDepositAmount = () => {
    // Deposit is 20% of the discounted total price
    const deposit = Math.round(getTotalPriceWithDiscount() * 0.2);
    // STAGE 0 SAFETY: Never return 0 or low value
    if (deposit < 175) return 3000;
    return deposit;
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.time) {
      toast.error('Kérlek válassz időpontot!');
      return;
    }
    if (!acceptedTerms) {
      toast.error('Kérlek, fogadd el az általános szerződési feltételeket');
      return;
    }
    setStep('payment');
  };

  const submitBookingRequest = async (action: 'createStripeCheckout' | 'createBankTransferBooking') => {
    setIsSubmitting(true);

    try {
      let depositAmount = Number(getFinalDepositAmount());

      // Safety check: Stripe minimum for HUF is 175 Fortint.
      // Force minimum 3000 Ft (20% of cheapest service 15000 Ft)
      if (!depositAmount || depositAmount < 175 || isNaN(depositAmount)) {
        depositAmount = 3000;
        console.warn('Calculating deposit failed or was too low, using fallback of 3000 Ft');
      }

      // Double-check: ensure minimum 3000 Ft
      if (depositAmount < 3000) {
        depositAmount = 3000;
      }

      const serviceName = formData.service || 'Masszázs kezelés';

      console.log('Sending payment amount:', depositAmount, 'Ft');

      // Use fetch to call Google Apps Script, read the Stripe URL from the
      // JSON response, then redirect the user to Stripe Checkout.
      const params = new URLSearchParams();
      params.append('action', action);
      params.append('name', formData.name);
      params.append('email', formData.email);
      params.append('phone', formData.phone || '');
      params.append('service', serviceName);
      params.append('date', formData.date);
      params.append('time', formData.time);
      params.append('notes', formData.notes || '');
      params.append('recurring', formData.recurring ? 'yes' : 'no');
      params.append('recurringType', formData.recurringType);
      params.append('recurringCount', String(formData.recurringCount));
      params.append('amount', String(depositAmount));
      params.append('successUrl', window.location.origin + '/booking-success');
      params.append('cancelUrl', window.location.origin + '/booking-cancel');

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: params,
        redirect: 'follow',
      });

      const result = await response.json();

      if (action === 'createStripeCheckout') {
        if (result.success && result.data?.url) {
          window.location.href = result.data.url;
          return;
        }
        throw new Error(result.message || 'Ismeretlen hiba a fizetési folyamatban');
      }

      if (result.success && result.data?.referenceId) {
        sessionStorage.setItem('bankTransferBooking', JSON.stringify({
          referenceId: result.data.referenceId,
          amount: result.data.amount,
          name: formData.name,
          service: formData.service,
          date: formData.date,
          time: formData.time,
          bankAccount: result.data.bankAccount || BANK_ACCOUNT,
        }));
        navigateTo('/', '#booking-bank-pending');
        return;
      }

      throw new Error(result.message || 'Ismeretlen hiba a foglalás rögzítésekor');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Hiba történt: ' + (error instanceof Error ? error.message : 'Ismeretlen hiba'));
      setIsSubmitting(false);
    }
  };

  const handleBankTransfer = () => submitBookingRequest('createBankTransferBooking');
  const handlePayment = () => submitBookingRequest('createStripeCheckout');

  const today = getTodayInBudapest();
  const minDate = addDaysToDateStr(today, 1);
  const maxDateStr = addMonthsToDateStr(today, BOOKING_MAX_MONTHS_AHEAD);

  return (
    <section id="idopont" ref={sectionRef} className="py-20 bg-gradient-to-b from-[#FFFBF7] to-[#F5E6D8]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block px-4 py-2 bg-[#D4854A]/10 rounded-full text-sm font-medium text-[#D4854A] mb-4">
            Foglalj időpontot
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4A3F35] mb-4">
            Online Időpontfoglalás
          </h2>
          <p className="text-lg text-[#635241]">
            Válaszd ki a számodra megfelelő kezelést és időpontot.
            <span className="block text-sm mt-1">Foglalható: holnaptól {BOOKING_MAX_MONTHS_AHEAD} hónapra előre.</span>
          </p>
        </div>

        {/* Booking Form */}
        <div className={`bg-white rounded-3xl shadow-warm-lg p-6 sm:p-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {step === 'payment' ? (
            // Payment Step
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-[#4A3F35] mb-2">Foglalási díj befizetése</h3>
                <p className="text-[#635241]">A foglalás véglegesítéséhez kérjük a foglalási díj befizetését</p>
              </div>

              {/* Booking Summary */}
              <div className="bg-[#F9F1EA] rounded-2xl p-6 space-y-3">
                <h3 className="font-semibold text-[#4A3F35]">Foglalás összegzése</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#635241]">Kezelés:</span>
                    <span className="text-[#4A3F35] font-medium">{formData.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#635241]">Dátum:</span>
                    <span className="text-[#4A3F35]">{formData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#635241]">Időpont:</span>
                    <span className="text-[#4A3F35]">{formData.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#635241]">Név:</span>
                    <span className="text-[#4A3F35]">{formData.name}</span>
                  </div>
                  {formData.recurring && (
                    <div className="bg-[#D4854A]/10 rounded-lg p-3 mt-2">
                      <div className="flex justify-between">
                        <span className="text-[#635241]">Ismétlődés:</span>
                        <span className="text-[#4A3F35] font-medium">
                          {formData.recurringType === 'weekly' && 'Minden héten'}
                          {formData.recurringType === 'biweekly' && 'Kéthetente'}
                          {formData.recurringType === 'monthly' && 'Minden hónapban'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#635241]">Alkalom száma:</span>
                        <span className="text-[#4A3F35] font-medium">{formData.recurringCount} alkalom</span>
                      </div>
                    </div>
                  )}
                  <div className="border-t border-[#E8D4C0] pt-4 mt-4">
                    {/* Price Breakdown */}
                    <div className="space-y-3">
                      {/* Service Price */}
                      <div className="flex justify-between items-center">
                        <span className="text-[#635241] text-base">Kezelés ára:</span>
                        <span className="text-[#4A3F35] text-lg font-medium">{getSelectedServicePrice().toLocaleString()} Ft / alkalom</span>
                      </div>

                      {formData.recurring && (
                        <>
                          {/* Quantity */}
                          <div className="flex justify-between items-center">
                            <span className="text-[#635241] text-base">Alkalom száma:</span>
                            <span className="text-[#4A3F35] text-lg font-medium">{formData.recurringCount} × {getSelectedServicePrice().toLocaleString()} Ft</span>
                          </div>

                          {/* Total Before Discount - BIG */}
                          <div className="flex justify-between items-center bg-[#F9F1EA] rounded-lg px-4 py-3">
                            <span className="text-[#4A3F35] text-lg font-semibold">Teljes ár kedvezmény előtt:</span>
                            <span className="text-[#4A3F35] text-2xl font-bold">{(getSelectedServicePrice() * formData.recurringCount).toLocaleString()} Ft</span>
                          </div>

                          {/* Discount */}
                          {getDiscountPercent() > 0 && (
                            <div className="flex justify-between items-center bg-[#8B9A7C]/10 rounded-lg px-4 py-2">
                              <span className="text-[#8B9A7C] text-lg font-semibold">Kedvezmény ({getDiscountPercent()}%):</span>
                              <span className="text-[#8B9A7C] text-xl font-bold">-{getDiscountAmount().toLocaleString()} Ft</span>
                            </div>
                          )}

                          {/* Discounted Price */}
                          <div className="flex justify-between items-center">
                            <span className="text-[#4A3F35] text-base font-medium">Kedvezményes ár:</span>
                            <span className="text-[#4A3F35] text-xl font-bold">{getTotalPriceWithDiscount().toLocaleString()} Ft</span>
                          </div>
                        </>
                      )}

                      {/* Deposit - BIGGEST */}
                      <div className="flex justify-between items-center bg-[#D4854A]/10 rounded-xl px-4 py-4 mt-4 border-2 border-[#D4854A]/30">
                        <div>
                          <span className="text-[#D4854A] text-lg font-bold block">Foglalási díj (20%):</span>
                          <span className="text-[#635241] text-sm">A teljes összeg befizetése a kezelésnél</span>
                        </div>
                        <span className="text-4xl font-black text-[#D4854A]">{getFinalDepositAmount().toLocaleString()} Ft</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                <p className="text-sm text-[#635241] text-center">Válassz fizetési módot:</p>

                {/* Bank Transfer - PRIMARY (most used) */}
                <Button
                  onClick={handleBankTransfer}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#8B9A7C] to-[#6B7F5E] hover:from-[#6B7F5E] hover:to-[#8B9A7C] text-white py-5 rounded-xl text-xl font-bold shadow-warm-lg hover:shadow-warm-xl transition-all duration-300 disabled:opacity-50 border-2 border-[#8B9A7C]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                      Foglalás rögzítése...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-6 h-6 mr-3" />
                      {getFinalDepositAmount().toLocaleString()} Ft - Banki átutalással foglalok
                    </>
                  )}
                </Button>

                <div className="bg-[#F9F1EA] rounded-xl p-4 text-sm">
                  <p className="text-[#4A3F35] font-medium mb-2">Banki átutalás lépései:</p>
                  <ol className="list-decimal list-inside space-y-1 text-[#635241]">
                    <li>Kattints a gombra – kapsz egy egyedi <strong>közlemény azonosítót</strong></li>
                    <li>Utald át a foglalási díjat a megadott számlára</li>
                    <li>A közleménybe írd be pontosan az azonosítót</li>
                    <li>Emailben értesítünk, amint megérkezett a befizetés</li>
                  </ol>
                </div>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E8D4C0]"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-sm text-[#635241]">vagy</span>
                  </div>
                </div>

                {/* Stripe Payment */}
                <Button
                  onClick={handlePayment}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#D4854A] to-[#B87333] hover:from-[#B87333] hover:to-[#D4854A] text-white py-5 rounded-xl text-xl font-bold shadow-warm-lg hover:shadow-warm-xl transition-all duration-300 disabled:opacity-50 border-2 border-[#D4854A]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                      Átirányítás a Stripe-hoz...
                    </>
                  ) : (
                    <>
                      <Lock className="w-6 h-6 mr-3" />
                      {getFinalDepositAmount().toLocaleString()} Ft - Bankkártyás fizetés (Stripe)
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-[#635241] flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  256-bit SSL titkosítás - Stripe biztonságos fizetés
                </p>

                <Button
                  onClick={() => setStep('form')}
                  variant="outline"
                  className="w-full border-[#E8D4C0] text-[#635241] hover:bg-[#F9F1EA]"
                >
                  Vissza a foglaláshoz
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleContinueToPayment} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#4A3F35]">
                    Név <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#635241]" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Add meg a neved"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="pl-10 border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#4A3F35]">
                    Telefonszám
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#635241]" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+36 30 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10 border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#4A3F35]">
                    Email cím <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#635241]" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@pelda.hu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="pl-10 border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                </div>

                {/* Service - Fixed Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="service" className="text-[#4A3F35]">
                    Kezelés <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <select
                      id="service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      required
                      className="w-full h-10 pl-3 pr-12 border border-[#E8D4C0] rounded-md focus:border-[#D4854A] focus:ring-1 focus:ring-[#D4854A] bg-white text-[#4A3F35] appearance-none cursor-pointer text-sm"
                    >
                      <option value="">Válassz kezelést</option>
                      {servicesList.map((service) => (
                        <option key={service.name} value={service.name}>
                          {service.name} - {service.price.toLocaleString()} Ft
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#635241] pointer-events-none" />
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-[#4A3F35]">
                    Dátum <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#635241]" />
                    <Input
                      id="date"
                      type="date"
                      min={minDate}
                      max={maxDateStr}
                      value={formData.date}
                      onChange={(e) => {
                        setFormData({ ...formData, date: e.target.value, time: '' });
                        loadSlotsForDate(e.target.value);
                      }}
                      required
                      className="pl-10 border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                </div>

                {/* Time - Live Slot Availability */}
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[#4A3F35]">
                    Időpont <span className="text-red-500">*</span>
                  </Label>
                  {!formData.date ? (
                    <p className="text-sm text-[#635241] py-2 italic">Először válassz dátumot az elérhető időpontok megtekintéséhez.</p>
                  ) : isLoadingSlots ? (
                    <div className="flex items-center gap-2 text-[#635241] py-2">
                      <div className="w-4 h-4 border-2 border-[#D4854A]/30 border-t-[#D4854A] rounded-full animate-spin" />
                      <span className="text-sm">Szabad időpontok betöltése...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {timeSlots.map(slot => {
                        const available = slotsForDate ? slotsForDate[slot] !== false : true;
                        const selected = formData.time === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={!available}
                            onClick={() => available && setFormData({ ...formData, time: slot })}
                            className={`py-2 px-1 rounded-lg text-sm font-medium border-2 transition-all ${
                              selected
                                ? 'bg-[#D4854A] border-[#D4854A] text-white shadow-warm'
                                : available
                                  ? 'bg-white border-[#E8D4C0] text-[#4A3F35] hover:border-[#D4854A] hover:text-[#D4854A]'
                                  : 'bg-[#F5E6D8]/50 border-[#E8D4C0] text-[#635241]/40 cursor-not-allowed line-through'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {formData.date && !isLoadingSlots && (
                    <p className="text-xs text-[#635241] flex items-center gap-1">
                      <span className="inline-block w-3 h-3 rounded border-2 border-[#E8D4C0] bg-[#F5E6D8]/50" />
                      Áthúzott időpont = már foglalt
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-[#4A3F35]">
                  Megjegyzés
                </Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-[#635241]" />
                  <Textarea
                    id="notes"
                    placeholder="Írd ide, ha van különleges kérésed vagy panaszod..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="pl-10 min-h-[100px] border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                </div>
              </div>

              {/* Recurring Booking Option */}
              <div className="bg-[#F9F1EA] rounded-xl p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={formData.recurring}
                    onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded border-[#E8D4C0] text-[#D4854A] focus:ring-[#D4854A]"
                  />
                  <div>
                    <label htmlFor="recurring" className="text-[#4A3F35] font-medium">
                      Ismétlődő foglalás
                    </label>
                    <p className="text-sm text-[#635241]">
                      Ugyanabban az időpontban minden héten/hónapban
                    </p>
                  </div>
                </div>

                {formData.recurring && (
                  <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-[#E8D4C0]">
                    <div className="space-y-2">
                      <Label className="text-[#4A3F35]">Gyakoriság</Label>
                      <div className="relative">
                        <select
                          value={formData.recurringType}
                          onChange={(e) => setFormData({ ...formData, recurringType: e.target.value })}
                          className="w-full h-10 pl-3 pr-10 border border-[#E8D4C0] rounded-md focus:border-[#D4854A] focus:ring-1 focus:ring-[#D4854A] bg-white text-[#4A3F35] appearance-none cursor-pointer"
                        >
                          <option value="weekly">Minden héten</option>
                          <option value="biweekly">Kéthetente</option>
                          <option value="monthly">Minden hónapban</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#635241] pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#4A3F35]">Alkalom száma</Label>
                      <div className="relative">
                        <select
                          value={formData.recurringCount}
                          onChange={(e) => setFormData({ ...formData, recurringCount: parseInt(e.target.value) })}
                          className="w-full h-10 pl-3 pr-10 border border-[#E8D4C0] rounded-md focus:border-[#D4854A] focus:ring-1 focus:ring-[#D4854A] bg-white text-[#4A3F35] appearance-none cursor-pointer"
                        >
                          {[2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                            <option key={num} value={num}>{num} alkalom</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#635241] pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="bg-[#F9F1EA] rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-[#E8D4C0] text-[#D4854A] focus:ring-[#D4854A]"
                  />
                  <div className="text-sm">
                    <label htmlFor="terms" className="text-[#4A3F35]">
                      Elolvastam és elfogadom az{' '}
                      <button
                        type="button"
                        onClick={() => setShowTerms(true)}
                        className="text-[#D4854A] underline hover:text-[#B87333]"
                      >
                        általános szerződési feltételeket
                      </button>
                      . Tudomásul veszem, hogy a foglalási díj (20%) a kezelés előtt 24 órán belüli lemondás esetén nem visszatéríthető. 24 óra előtt az időpont ingyenesen módosítható.
                    </label>
                  </div>
                </div>
              </div>

              {/* Deposit Info */}
              {formData.service && (
                <div className="bg-[#D4854A]/10 rounded-xl p-5 text-center border-2 border-[#D4854A]/30">
                  {formData.recurring && (
                    <div className="mb-3 pb-3 border-b border-[#D4854A]/20">
                      <p className="text-sm text-[#635241]">Teljes ár kedvezmény előtt:</p>
                      <p className="text-xl font-bold text-[#4A3F35]">{(getSelectedServicePrice() * formData.recurringCount).toLocaleString()} Ft</p>
                      {getDiscountPercent() > 0 && (
                        <p className="text-sm text-[#8B9A7C] font-medium mt-1">
                          Kedvezmény ({getDiscountPercent()}%): -{getDiscountAmount().toLocaleString()} Ft
                        </p>
                      )}
                    </div>
                  )}
                  <p className="text-base text-[#635241] mb-1">
                    {formData.recurring
                      ? `Foglalási díj (${formData.recurringCount} alkalom × 20%)`
                      : 'Foglalási díj (20%)'}
                  </p>
                  <p className="text-4xl font-black text-[#D4854A] my-2">{getFinalDepositAmount().toLocaleString()} Ft</p>
                  <p className="text-sm text-[#635241]">
                    {formData.recurring
                      ? `Kedvezményes ár összesen: ${getTotalPriceWithDiscount().toLocaleString()} Ft`
                      : `Kezelés ára: ${getSelectedServicePrice().toLocaleString()} Ft`}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !acceptedTerms}
                className="w-full bg-[#D4854A] hover:bg-[#B87333] text-white py-6 rounded-xl text-lg font-medium shadow-warm hover:shadow-warm-lg transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Feldolgozás...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Tovább a fizetéshez
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Terms Modal */}
        {showTerms && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowTerms(false)} />
            <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
              <button
                onClick={() => setShowTerms(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F9F1EA] flex items-center justify-center hover:bg-[#E8D4C0]"
              >
                <X className="w-5 h-5 text-[#4A3F35]" />
              </button>
              <h3 className="text-xl font-bold text-[#4A3F35] mb-4">Általános Szerződési Feltételek</h3>
              <div className="space-y-4 text-sm text-[#4A3F35]">
                <p><strong>1. Foglalási díj:</strong> A kezelés árának 20%-a, amely online fizetéssel vagy banki átutalással esedékes a foglaláskor.</p>
                <p><strong>2. Lemondási feltételek:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>24 órán belül:</strong> A foglalási díj nem visszatéríthető</li>
                  <li><strong>24 óra előtt:</strong> Az időpont ingyenesen módosítható</li>
                </ul>
                <p><strong>3. Megjelenés:</strong> A kezelés időpontjában a fennmaradó 80% a helyszínen fizetendő.</p>
                <p><strong>4. Késés:</strong> 15 percet meghaladó késés esetén a kezelés időtartama rövidülhet.</p>
              </div>
              <Button
                onClick={() => setShowTerms(false)}
                className="w-full mt-6 bg-[#D4854A] hover:bg-[#B87333] text-white"
              >
                Bezárás
              </Button>
            </div>
          </div>
        )}

        {/* Alternative Contact Methods */}
        <div className={`mt-8 grid md:grid-cols-2 gap-6 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white rounded-2xl p-6 shadow-warm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#D4854A]/10 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-[#D4854A]" />
              </div>
              <div>
                <p className="text-sm text-[#635241]">Telefonon</p>
                <a
                  href="tel:+36304877883"
                  className="text-lg font-semibold text-[#4A3F35] hover:text-[#D4854A] transition-colors"
                >
                  +36 30 487 7883
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-warm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#8B9A7C]/10 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-[#8B9A7C]" />
              </div>
              <div>
                <p className="text-sm text-[#635241]">Emailben</p>
                <a
                  href="mailto:dunakeszimasszor@gmail.com"
                  className="text-lg font-semibold text-[#4A3F35] hover:text-[#8B9A7C] transition-colors break-all"
                >
                  dunakeszimasszor@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Privacy Policy Modal
function PrivacyPolicyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-[#E8D4C0] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#4A3F35]">Adatvédelmi tájékoztató</h2>
          <button onClick={onClose} aria-label="Bezárás" className="p-2 rounded-full hover:bg-[#F5E6D8] transition-colors">
            <X className="w-5 h-5 text-[#4A3F35]" />
          </button>
        </div>
        <div className="px-6 py-6">
          <PrivacyPolicyContent />
          <a
            href={ROUTES.privacy}
            onClick={(e) => {
              e.preventDefault();
              onClose();
              navigateTo(ROUTES.privacy);
            }}
            className="inline-block mt-4 text-sm text-[#D4854A] hover:underline"
          >
            Teljes adatvédelmi oldal megnyitása →
          </a>
        </div>
      </div>
    </div>
  );
}

// Footer/Contact Section
function FooterSection() {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="kapcsolat" className="bg-[#4A3F35] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4854A] to-[#B87333] rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Dunakeszi Masszázs</h2>
                <p className="text-sm text-white/80">Angyali Szalon - Makra Edina</p>
              </div>
            </div>
            <p className="text-white/85 leading-relaxed">
              Nyugtató, harmonizáló kezelések egy békés, biztonságos környezetben az Angyali Szalonban.
              Személyre szabott masszázskezelésekkel várlak szeretettel Dunakeszin.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Gyors linkek</h3>
            <ul className="space-y-2">
              {([
                { href: '#fooldal', label: 'Főoldal' },
                { href: '#kezelesek', label: 'Kezelések' },
                { href: '#arlista', label: 'Árlista' },
                { href: '#gyik', label: 'GYIK' },
                { href: '#idopont', label: 'Időpontfoglalás' },
                { href: ROUTES.privacy, label: 'Adatvédelem', route: true },
              ] as const).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      if ('route' in link && link.route) {
                        navigateTo(link.href);
                        return;
                      }
                      const element = document.querySelector(link.href);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="inline-flex items-center min-h-11 py-2 text-white hover:text-[#F5D4A8] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Kapcsolat</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+36304877883"
                  className="flex items-center gap-3 min-h-11 py-1 text-white/95 hover:text-[#F5D4A8] transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>+36 30 487 7883</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:dunakeszimasszor@gmail.com"
                  className="flex items-center gap-3 min-h-11 py-1 text-white/95 hover:text-[#F5D4A8] transition-colors break-all"
                >
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span className="break-all">dunakeszimasszor@gmail.com</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/85">
                <MapPin className="w-5 h-5" />
                <span>Dunakeszi, Kolonics György utca 2/B, 2120<br /><small>Kapucsengő: 1/43</small></span>
              </li>
              <li className="flex items-center gap-3 text-white/85">
                <Clock className="w-5 h-5 flex-shrink-0" />
                <span>Hétfő–Vasárnap: 8:30–18:30</span>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-white/80 mb-3">Kövess minket</h4>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/61577273747405"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D4854A] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D4854A] transition-colors"
                  aria-label="Google Térkép és értékelések"
                  title="Google Térkép és értékelések"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl overflow-hidden border border-white/10 shadow-warm">
          <MapEmbed />
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 mt-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-white/80 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Dunakeszi Masszázs - Angyali Szalon – Makra Edina | Minden jog fenntartva
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
              <a
                href={ROUTES.privacy}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(ROUTES.privacy);
                }}
                className="inline-flex items-center min-h-11 px-3 text-white hover:text-[#F5D4A8] transition-colors text-sm"
              >
                Adatvédelmi tájékoztató
              </a>
              <button
                type="button"
                onClick={() => setShowPrivacyPolicy(true)}
                className="inline-flex items-center min-h-11 px-3 text-white/90 hover:text-[#F5D4A8] transition-colors text-sm"
              >
                Gyors nézet
              </button>
              <a
                href={ROUTES.admin}
                onClick={(e) => { e.preventDefault(); navigateTo(ROUTES.admin); }}
                className="inline-flex items-center min-h-11 px-3 text-white hover:text-[#F5D4A8] transition-colors text-sm"
              >
                Admin
              </a>
              <button
                onClick={scrollToTop}
                aria-label="Vissza a tetejére"
                className="inline-flex items-center gap-2 min-h-11 px-3 text-white/90 hover:text-[#F5D4A8] transition-colors text-sm"
              >
                <span>Vissza a tetejére</span>
                <ChevronDown className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {showPrivacyPolicy && <PrivacyPolicyModal onClose={() => setShowPrivacyPolicy(false)} />}
    </footer>
  );
}

function HomeSite() {
  useSeo(HOME_SEO);

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <Navigation />
      <main>
        <HeroSection />
        <BenefitsSection />
        <ServicesSection />
        <PricingSection />
        <TVSection />
        <TestimonialsSection />
        <AboutSection />
        <GallerySection />
        <ProductsSection />
        <OrganoCoffeeSection />
        <BookingSection />
        <FAQSection />
      </main>
      <FooterSection />
    </div>
  );
}

// Main App Component
function App() {
  const [route, setRoute] = useState<AppRoute>(getAppRoute);

  useEffect(() => {
    const onRouteChange = () => setRoute(getAppRoute());
    window.addEventListener('hashchange', onRouteChange);
    window.addEventListener('popstate', onRouteChange);
    return () => {
      window.removeEventListener('hashchange', onRouteChange);
      window.removeEventListener('popstate', onRouteChange);
    };
  }, []);

  if (route === 'admin') {
    return (
      <Suspense fallback={<RouteFallback />}>
        <AdminPage />
      </Suspense>
    );
  }

  if (route === 'manage') {
    return (
      <Suspense fallback={<RouteFallback />}>
        <ManageBookingsPage />
      </Suspense>
    );
  }

  if (route === 'privacy') {
    return <PrivacyPage Navigation={Navigation} Footer={FooterSection} />;
  }

  if (route.startsWith('service:')) {
    return (
      <ServiceLandingPage
        slug={route.slice('service:'.length)}
        Navigation={Navigation}
        Footer={FooterSection}
      />
    );
  }

  if (route === 'booking-bank-pending') {
    return (
      <Suspense fallback={<RouteFallback />}>
        <BookingBankPendingPage />
      </Suspense>
    );
  }

  if (route === 'booking-success') {
    return (
      <Suspense fallback={<RouteFallback />}>
        <BookingSuccessPage />
      </Suspense>
    );
  }

  if (route === 'booking-cancel') {
    return (
      <Suspense fallback={<RouteFallback />}>
        <BookingCancelPage />
      </Suspense>
    );
  }

  return <HomeSite />;
}

export default App;

import { useEffect, useState, useRef } from 'react';
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
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Google Apps Script URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyNNnfTYIlEcuJFD2DaHJcPkv-ErX34TRaxmuc3mFxLVksuoYqs4_GLhilMxHmS3Eg/exec';

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
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
            <img src="/images/logo.png" alt="Dunakeszi Masszázs Logo" className="w-10 h-10 rounded-full object-cover" />
            <div className="hidden sm:block">
              <p className={`font-semibold text-lg leading-tight transition-colors ${isScrolled ? 'text-[#4A3F35]' : 'text-[#4A3F35]'}`}>
                Dunakeszi Masszázs
              </p>
              <p className={`text-xs transition-colors ${isScrolled ? 'text-[#8B7355]' : 'text-[#8B7355]'}`}>
                Angyali Szalon - Makra Edina
              </p>
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
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Hero Section
function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
              <span className="text-sm font-medium text-[#8B7355]">RTL & TV2 szereplések</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#4A3F35] leading-tight">
                Masszázs <span className="text-gradient">Dunakeszin</span>
                <br />
                <span className="text-xl sm:text-2xl lg:text-5xl font-medium">Testi-Lelki Feltöltődés</span>
              </h1>

              <p className="text-base sm:text-lg text-[#8B7355] max-w-lg leading-relaxed mt-2">
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
                className="bg-[#D4854A] hover:bg-[#B87333] text-white px-8 py-6 rounded-full text-base font-medium shadow-warm hover:shadow-warm-lg transition-all duration-300 hover:-translate-y-1"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Időpontot szeretnék
              </Button>
              <Button
                onClick={scrollToServices}
                variant="outline"
                className="border-[#D4854A] text-[#D4854A] hover:bg-[#D4854A] hover:text-white px-8 py-6 rounded-full text-base font-medium transition-all duration-300"
              >
                Kezelések megtekintése
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Contact Quick Info */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <a
                href="tel:+36304877883"
                className="flex items-center gap-2 text-[#8B7355] hover:text-[#D4854A] transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">+36 30 487 7883</span>
              </a>
              <div className="flex items-center gap-2 text-[#8B7355]">
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
                <img
                  src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=1000&fit=crop"
                  alt="Relaxáló masszázs környezet az Angyali Szalonban"
                  className="w-full h-[500px] lg:h-[600px] object-cover"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#4A3F35]/30 via-transparent to-transparent" />
              </div>

              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-warm animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#8B9A7C]/20 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-[#8B9A7C]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#4A3F35]">5000+</p>
                    <p className="text-sm text-[#8B7355]">Elégedett vendég</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-warm animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-[#D4854A] text-[#D4854A]" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-[#4A3F35]">5.0</span>
                </div>
                <p className="text-xs text-[#8B7355] mt-1">Vendég értékelések</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-[#8B7355]" />
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
          <p className="text-lg text-[#8B7355]">
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
              <p className="text-[#8B7355] leading-relaxed">
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
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
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
            <h4 className="font-semibold text-[#4A3F35] mb-3 text-lg">Előnyök:</h4>
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
              <h4 className="font-semibold text-[#4A3F35] mb-4 text-lg">Eredmények – Előtte & Utána:</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {service.beforeAfter.map((pair, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <img
                          src={pair.before}
                          alt="Előtte"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <span className="absolute bottom-2 left-2 bg-[#8B9A7C]/80 text-white text-xs px-2 py-1 rounded">Utána</span>
                      </div>
                      <div className="relative">
                        <img
                          src={pair.after}
                          alt="Utána"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Előtte</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={scrollToBooking}
            className="w-full bg-[#D4854A] hover:bg-[#B87333] text-white py-4 rounded-xl text-lg font-medium shadow-warm hover:shadow-warm-lg transition-all duration-300"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Időpontot foglalok erre a kezelésre
          </Button>
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
          <p className="text-lg text-[#8B7355]">
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
              onClick={() => openModal(service)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                <p className="text-[#8B7355] text-sm line-clamp-2 mb-4">
                  {service.shortDescription}
                </p>
                <div className="flex items-center text-[#D4854A] text-sm font-medium">
                  <span>Részletek</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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

// Services Data
const services = [
  {
    id: 'frissito',
    name: 'Frissítő masszázs',
    duration: 'kb. 60 perc',
    shortDescription: 'Könnyed, lazító masszázs, amely oldja a mindennapi feszültségeket és javítja a vérkeringést.',
    description: 'A frissítő masszázs egy kellemes, könnyed kezelés, amely átmozgatja az egész testet, oldja az izmok feszességét és segít lelassítani a mindennapi rohanást. Finom, ritmikus fogásokkal dolgozom a hát, vállak és végtagok területén, hogy a tested fokozatosan megkönnyebbüljön.',
    benefits: ['Ellazult izmok', 'Csökkent feszültség', 'Jobb közérzet', 'Könnyedség a hátban'],
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&h=400&fit=crop'
  },
  {
    id: 'nepali',
    name: 'Nepáli masszázs',
    duration: 'kb. 60 perc',
    shortDescription: 'Mélyebb lazítást biztosító kezelés, amely hatékonyan oldja a mélyebben fekvő izomfeszültségeket.',
    description: 'A nepáli masszázs egy gyengéd, mégis hatékony stresszoldó kezelés, amely segít lecsendesíteni az elmét, ellazítani a testet és helyreállítani a belső egyensúlyt. Különösen ajánlott azoknak, akik sok feszültséget, szorongást vagy kimerültséget élnek meg a mindennapokban.',
    benefits: ['Mély izomlazítás', 'Energiarendszer harmonizálása', 'Testi-lelki egyensúly', 'Belső nyugalom'],
    image: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=600&h=400&fit=crop'
  },
  {
    id: 'nyirok',
    name: 'Nyirokmasszázs',
    duration: '60 perc',
    shortDescription: 'Könnyed lábak, jobb keringés. Támogatja a nyirokkeringést és segít a méregtelenítésben.',
    description: 'A nyirokmasszázs egy gyengéd, lassú ritmusú kezelés, amely a nyirokkeringés támogatásával segíti a szervezet természetes tisztulási folyamatait, csökkentheti a pangó folyadékot és könnyedségérzetet adhat a testnek.',
    benefits: ['Könnyedebb lábak', 'Csökkent ödéma', 'Jobb keringés', 'Méregtelenítés'],
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop'
  },
  {
    id: 'aroma',
    name: 'Aromamasszázs',
    duration: '60 perc',
    shortDescription: 'Illóolajos, relaxáló kezelés, amely a természetes illatok erejével harmonizálja testet és lelket.',
    description: 'Az aromamasszázs illóolajos, relaxáló kezelés, amely a természetes illatok erejével harmonizálja testet és lelket. A válogatott illóolajok mély relaxációt és stresszoldást biztosítanak.',
    benefits: ['Mély relaxáció', 'Stresszoldás', 'Aromaterápiás hatás', 'Érzelmi egyensúly'],
    image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=600&h=400&fit=crop'
  },
  {
    id: 'indiai',
    name: 'Indiai fejmasszázs',
    duration: 'kb. 30-40 perc',
    shortDescription: 'Ősi, rendkívül pihentető technika, amely a fejen, nyakon és vállakon felhalmozódott feszültséget oldja.',
    description: 'Az indiai fejmasszázs egy ősi, gyengéd és rendkívül megnyugtató technika, amely segít oldani a fejben, nyakban és vállakban felhalmozódott feszültséget. Tökéletes választás stressz, túlterheltség vagy fejfájás esetén.',
    benefits: ['Fejfájás csökkentése', 'Mentális frissesség', 'Stresszoldás', 'Jobb koncentráció'],
    image: '/images/indiai-fejmasszazs.png'
  },
  {
    id: 'nehezfem',
    name: 'Nehézfém-kivezetés',
    duration: 'kb. 60 perc',
    shortDescription: 'Gyengéd, harmonizáló módszer, amely támogatja a szervezet természetes méregtelenítő folyamatait.',
    description: 'A nehézfém-kivezetés gyengéd, harmonizáló módszer, amely támogatja a szervezet természetes méregtelenítő folyamatait. A kezelés segít a szervezetnek megszabadulni a felhalmozódott méreganyagoktól.',
    benefits: ['Méregtelenítés', 'Nyirokkeringés támogatása', 'Belső tehermentesítés', 'Energia növekedés'],
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop'
  },
  {
    id: 'kineziologia',
    name: 'Kineziológia',
    duration: '60-75 perc',
    shortDescription: 'Blokkoldó, lelki egyensúlyt teremtő kezelés, amely segít feloldani a testben tárolt érzelmi blokkokat.',
    description: 'A kineziológia egy gyengéd, érintésen alapuló módszer, amely segít feltárni és oldani a testben, elmében és érzelmekben megbújó blokkokat. A kezelés célja a belső harmónia helyreállítása, a stressz csökkentése és a természetes energiaáramlás támogatása.',
    benefits: ['Lelki egyensúly', 'Blokkoldás', 'Stresszkezelés', 'Belső erő'],
    image: '/images/kineziologia.jpeg'
  },
  {
    id: 'kollagen',
    name: 'Arany kollagén arckezelés',
    duration: 'kb. 60-90 perc',
    shortDescription: 'Bőrbe olvadó fiatalítás. Luxus arckezelés arany kollagén terápiával.',
    description: 'Már elérhető a teljesen új, bőrbe olvadó arany kollagén terápia – két különleges változatban, intenzív feszesítéssel és mély hidratálással. Összehangolva nyirokmasszázzsal a látványosabb, tartósabb eredményért. Az aranyszálas kezelés egy komplex, prémium arcszépítő protokoll, amely a bőr természetes megújulását indítja el. Őssejt szérumokkal dolgozunk, amelyek vegyszermentesek, a bőrrel abszolút azonos összetételűek és mélyen támogatják a bőr regenerációját. Aranyszál + potenciált adó sejtszál alkalmazás kétféle technikával vihető be az arcba, elindítja a természetes kollagéntermelést, feszesít, tölt és fiatalít. A kezelés feltölti az arcot, javítja a krátereket, hegeket, bőrhibákat, egységesíti a bőrfelszínt és ragyogó, élettel teli arcképet ad. Teljes, tudatos protokoll része: professzionális arctisztítás, bőrtípushoz igazított peelingek, csodálatos hámasztó, nyugtató, regeneráló anyagok, rétegről rétegre felépített kezelés.',
    benefits: ['Bőrfiatalítás', 'Ragyogó bőr', 'Ránccsökkentés', 'Feszesebb bőr', 'Kollagéntermelés'],
    image: '/images/professional-products.jpeg',
    beforeAfter: [
      { before: '/images/arany-before-1.jpeg', after: '/images/arany-after-1.jpeg' },
      { before: '/images/arany-before-2.jpeg', after: '/images/arany-after-2.jpeg' }
    ]
  },
  {
    id: 'zsirbontas',
    name: 'Ultrahangos zsírbontás',
    duration: 'kb. 45-60 perc',
    shortDescription: 'Egy testterület kezelése ultrahangos technológiával a zsírsejtek csökkentésére.',
    description: 'Az ultrahangos zsírbontás egy testterület kezelése ultrahangos technológiával a zsírsejtek csökkentésére. A kezelés segít javítani a testkontúrt és csökkenti a cellulitot.',
    benefits: ['Zsírsejt csökkentés', 'Testkontúr javítás', 'Cellulit kezelés', 'Bőrfeszesítés'],
    image: '/images/ultrahangos-zsirbontas.jpeg'
  },
  {
    id: 'metamorf',
    name: 'Metamorf masszázs',
    duration: 'kb. 60 perc',
    shortDescription: 'Belső átalakulás gyengéd érintéssel. Gerinc energetikai pontjain keresztül.',
    description: 'A metamorf masszázs egy finom, mégis mély hatású kezelés, amely a gerinc energetikai pontjain keresztül segíti a testi-lelki oldódást. A kezelés során enyhe nyomással haladunk végig a lábfejen és a kézfejen található gerincpontokon, melyek reflexkapcsolatban állnak a teljes gerinccel és idegrendszerrel. Ez a módszer tulajdonképpen egy különleges gerincmasszázs, amely nem közvetlenül a gerincet érinti, hanem annak kivetülésein dolgozik. A gyengéd érintések segítenek oldani a régi feszültségeket, berögzült mintákat, és támogatják a szervezet természetes egyensúlyát. Ajánlott stressz, belső feszültség esetén, lelki elakadásoknál, túlterheltség, kimerültség idején, amikor "jólesne egy belső újrahangolás". A metamorf masszázs kortól függetlenül alkalmazható, teljes ellazulást és mély megnyugvást hozhat.',
    benefits: ['Belső átalakulás', 'Régi feszültségek oldása', 'Lelki elakadások feloldása', 'Belső újrahangolás', 'Teljes ellazulás'],
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop'
  },
  {
    id: 'bemer',
    name: 'BEMER matrac',
    duration: '20 vagy 40 perc',
    shortDescription: 'A mikroerek pacemakere. Sejtszintű támogatás a mikrokeringés javításával.',
    description: 'A BEMER matrac a mikroerek pacemakere. A szervezet legapróbb hajszálereire hat, ott támogatja a keringést, ahol már az orvos, a gyógyszer és a gépek fizikailag nem tudnak "bejutni". A mikroerek felelősek azért, hogy a sejtek megfelelő mennyiségű oxigénhez és tápanyaghoz jussanak, valamint hogy a salakanyagok kiürüljenek. Ha a mikrokeringés nem működik optimálisan, a sejtek regenerációja lelassul, a szervezet terheltebbé válik. A BEMER terápia segíti a mikrokeringés támogatását, így hozzájárul a jobb oxigénellátáshoz, a sejtek hatékonyabb működéséhez, a regeneráció gyorsításához és a szervezet természetes egyensúlyának fenntartásához. Kiemelten fontos szerepe van a megelőzésben is, hiszen a megfelelő mikrokeringés az egészséges működés alapja. A BEMER matrac külön választható kezelésként is igénybe vehető (20 perc: 7 500 Ft, 40 perc: 15 000 Ft), illetve bármely kezelés mellé ajánljuk kiegészítésként. Alkalmazható a kezelések előtt, alatt vagy után is – a páciens döntése alapján. Ez egy lehetőség azok számára, akik mélyebb, sejtszintű támogatást szeretnének adni a testüknek, és tudatosan tesznek az egészségük megőrzéséért.',
    benefits: ['Jobb oxigénellátás', 'Sejtek hatékonyabb működése', 'Regeneráció gyorsítása', 'Szervezet egyensúlyának fenntartása', 'Megelőzés támogatása'],
    image: '/images/bemer-1.jpeg'
  }
];

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

  const prices = [
    { name: 'Frissítő masszázs', duration: 'kb. 60 perc', price: '15 000' },
    { name: 'Nepáli masszázs', duration: 'kb. 60 perc', price: '15 000' },
    { name: 'Nyirokmasszázs', duration: '60 perc', price: '15 000' },
    { name: 'Aromamasszázs', duration: '60 perc', price: '15 000' },
    { name: 'Indiai fejmasszázs', duration: 'kb. 30-40 perc', price: '15 000' },
    { name: 'Nehézfém-kivezetés', duration: 'kb. 60 perc', price: '15 000' },
    { name: 'Kineziológia', duration: '60-75 perc', price: '15 000' },
    { name: 'Ultrahangos zsírbontás', duration: 'kb. 45-60 perc', price: '15 000' },
    { name: 'Arany kollagén arckezelés', duration: 'kb. 60-90 perc', price: '30 000' },
    { name: 'Metamorf masszázs', duration: 'kb. 60 perc', price: '15 000' },
    { name: 'BEMER matrac (20 perc)', duration: 'kb. 20 perc', price: '7 500' },
    { name: 'BEMER matrac (40 perc)', duration: 'kb. 40 perc', price: '15 000' },
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
          <p className="text-lg text-[#8B7355]">
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
                  <h3 className="font-semibold text-[#4A3F35] text-lg">{item.name}</h3>
                  <p className="text-sm text-[#8B7355]">{item.duration}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#D4854A]">{item.price}</span>
                  <span className="text-[#8B7355] ml-1">Ft</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-[#F9F1EA]">
            <p className="text-sm text-[#8B7355] text-center">
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
          <p className="text-lg text-[#8B7355]">
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
              <iframe
                src="https://www.youtube.com/embed/F8xyJXDlgNM"
                title="TV2 Szereplés"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#D4854A] to-[#B87333] rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#4A3F35]">TV2</h3>
                  <p className="text-[#8B7355]">Mokka műsor</p>
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
              <iframe
                src="https://www.youtube.com/embed/AbujjtXl-E0"
                title="RTL Szereplés"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#D4854A] to-[#B87333] rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#4A3F35]">RTL Klub</h3>
                  <p className="text-[#8B7355]">Reggeli műsor</p>
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
      source: 'Google'
    },
    {
      text: 'Egy hely az igazi kikapcsolódásra és feltöltődésre. Edina a munkájában felkészült, nagy szakmai tapasztalattal rendelkezik, nagyon kedves, udvarias, kommunikatív. Csak ajánlani tudom!',
      author: 'Maria Lutring Moser',
      source: 'Google'
    },
    {
      text: 'Edinánál voltam masszázson, és egyszerűen fantasztikus élmény volt! Nagyon profi, kedves és figyelmes – azonnal érezni lehetett, hogy ért a szakmájához.',
      author: 'Zoltán',
      source: 'Google'
    },
    {
      text: 'Minden alkalommal feltöltődve, megújulva távozom. Nem csak a szakértelme kiemelkedő, de a kedvessége és figyelmessége is lenyűgöző.',
      author: 'Xavér Szalai',
      source: 'Google'
    },
    {
      text: 'Edina egy nagyon tapasztalt és figyelmes masszőr. A kezelés alatt teljesen el tudtam lazulni, és elmúltak a panaszaim. Minden szempontból feltöltő élmény volt – biztosan visszatérek.',
      author: 'Ildikó H.',
      source: 'Google'
    },
    {
      text: 'Gépi nyirokmasszázson és kineziológiai tanácsadáson vettem részt, és csak a legjobbakat tudom mondani! A nyirokmasszázs rendkívül kellemes és hatékony volt.',
      author: 'Judit Spisák',
      source: 'Google'
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
              href="https://share.google/bUlkHfnNUJpZeq2Tw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-warm hover:shadow-warm-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-1">
                <span className="text-3xl font-bold text-[#4A3F35]">5,0</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-[#D4854A] text-[#D4854A]" />
                  ))}
                </div>
              </div>
              <div className="w-px h-8 bg-[#E8D4C0]" />
              <div className="text-left">
                <p className="text-sm text-[#8B7355]">Google értékelés</p>
                <p className="text-sm font-medium text-[#4A3F35]">21 vélemény alapján</p>
              </div>
              <svg className="w-6 h-6 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </a>
            <p className="text-sm text-[#8B7355]">
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
                <span className="text-xs text-[#8B7355] bg-[#F5E6D8] px-2 py-1 rounded-full">
                  {testimonial.source}
                </span>
              </div>

              <p className="text-[#4A3F35] leading-relaxed mb-4 text-sm line-clamp-4">
                "{testimonial.text}"
              </p>

              <p className="text-sm font-medium text-[#4A3F35]">
                — {testimonial.author}
              </p>
            </div>
          ))}
        </div>

        {/* View All Reviews CTA */}
        <div className={`text-center mt-10 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <a
            href="https://share.google/bUlkHfnNUJpZeq2Tw"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#E8D4C0] rounded-full text-[#4A3F35] hover:bg-[#F5E6D8] hover:border-[#D4854A] transition-all duration-300"
          >
            <span>Összes vélemény megtekintése</span>
            <ArrowRight className="w-4 h-4" />
          </a>
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
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4A3F35] mb-4">
            Organo Prémium Kávé & Zöld Tea
          </h2>
        </div>

        <div className={`bg-white rounded-3xl shadow-warm-lg p-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left side - Text content */}
            <div className="space-y-6">
              <p className="text-[#4A3F35] leading-relaxed text-lg">
                Az általam végzett kezelések során minden kedves vendégemet szeretettel kínálom a prémium minőségű <span className="font-semibold text-[#8B4513]">Organo kávéval és zöld teával</span>, amelyek ganoderma spórát és oroszlánsörény gombát (Hericium erinaceus) tartalmaznak.
              </p>

              <p className="text-[#8B7355] leading-relaxed">
                Ez a különleges összetétel hozzájárulhat a kiegyensúlyozott közérzethez és a szervezet harmonikus működéséhez.
              </p>

              {/* Coffee Varieties */}
              <div className="space-y-3">
                <h4 className="font-semibold text-[#4A3F35]">Kávé választék:</h4>
                <ul className="space-y-2">
                  {['Fekete kávé', 'Gourmet Latte', 'Mocha Cappuccino', 'Forró csokoládé'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-[#8B7355]">
                      <span className="w-1.5 h-1.5 bg-[#8B4513] rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Green Tea */}
              <div className="space-y-3">
                <h4 className="font-semibold text-[#4A3F35]">Zöld tea:</h4>
                <p className="text-[#8B7355] flex items-center gap-2">
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
                  <p className="text-sm text-[#8B7355]">A termékek a helyszínen is megvásárolhatók</p>
                </div>
              </div>

              <p className="text-[#8B7355] text-sm">
                Így vendégeim otthonukban is élvezhetik jótékony hatásait.
              </p>
            </div>

            {/* Right side - Images */}
            <div className="space-y-6">
              {/* Coffee Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-warm">
                <img
                  src="/images/organo-kave.jpeg"
                  alt="Organo kávé választék - Fekete kávé, Gourmet Latte, Mocha Cappuccino, Forró csokoládé"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white font-semibold">Organo Kávé Választék</p>
                </div>
              </div>

              {/* Green Tea Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-warm">
                <img
                  src="/images/organo-zoldtea.jpeg"
                  alt="Organo Reishi Ganoderma zöld tea"
                  className="w-full h-64 object-cover"
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
              <img
                src="/images/edina.jpeg"
                alt="Makra Edina - Masszőr, kineziológus"
                className="w-full h-[400px] lg:h-[500px] object-cover"
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

            <div className="flex items-center gap-4 pt-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4854A] to-[#B87333] rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#4A3F35]">Makra Edina</p>
                <p className="text-sm text-[#8B7355]">Masszőr, kineziológus - Angyali Szalon</p>
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
    { src: '/images/szalon-1.jpeg', alt: 'Angyali Szalon - belső tér' },
    { src: '/images/szalon-2.jpeg', alt: 'Angyali Szalon - kezelőhelyiség' },
    { src: '/images/szalon-3.jpeg', alt: 'Angyali Szalon - nyugodt környezet' },
    { src: '/images/szalon-4.jpeg', alt: 'Angyali Szalon - külső megjelenés' },
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-[#F9F1EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block px-4 py-2 bg-[#D4854A]/10 rounded-full text-sm font-medium text-[#D4854A] mb-4">
            Galéria
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4A3F35] mb-4">
            Az Angyali Szalon
          </h2>
          <p className="text-lg text-[#8B7355]">
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
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4A3F35] mb-4">
            Prémium minőségű kozmetikumok
          </h2>
          <p className="text-lg text-[#8B7355]">
            Az Angyali Szalonban kizárólag professzionális, prémium minőségű termékekkel dolgozom, hogy a legjobb eredményt érjük el.
          </p>
        </div>

        <div className={`grid lg:grid-cols-2 gap-8 items-center transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Product Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-warm-lg">
            <img
              src="/images/professional-products.jpeg"
              alt="Professzionális kozmetikai termékek - Magic brand"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4A3F35]/30 to-transparent" />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-warm">
              <h3 className="text-xl font-bold text-[#4A3F35] mb-4">Magic Professional</h3>
              <p className="text-[#8B7355] leading-relaxed mb-4">
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
              <p className="text-[#8B7355] text-center text-sm mt-2">
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
    { name: 'Metamorf masszázs', price: 15000 }
  ];

  // Time slots with 75-minute intervals (60 min session + 15 min break)
  // First: 8:30, Last: 18:30 (finishes by 19:30)
  const timeSlots = [
    '08:30', '09:45', '11:00', '12:15', '13:30', '14:45', '16:00', '17:15', '18:30'
  ];

  const getSelectedServicePrice = () => {
    const service = servicesList.find(s => s.name === formData.service);
    return service ? service.price : 0;
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
    return Math.round(getTotalPriceWithDiscount() * 0.2);
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      toast.error('Kérlek, fogadd el az általános szerződési feltételeket');
      return;
    }
    setStep('payment');
  };

  const handlePayment = async () => {
    setIsSubmitting(true);

    try {
      const depositAmount = getFinalDepositAmount();
      const serviceName = formData.service || 'Masszázs kezelés';

      // Create a hidden form to submit to Google Apps Script
      // This avoids CORS issues
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = SCRIPT_URL;
      form.target = '_blank';
      form.style.display = 'none';

      const addField = (name: string, value: string) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };

      addField('action', 'createStripeCheckout');
      addField('name', formData.name);
      addField('email', formData.email);
      addField('phone', formData.phone || '');
      addField('service', serviceName);
      addField('date', formData.date);
      addField('time', formData.time);
      addField('notes', formData.notes || '');
      addField('recurring', formData.recurring ? 'yes' : 'no');
      addField('recurringType', formData.recurringType);
      addField('recurringCount', String(formData.recurringCount));
      addField('amount', String(depositAmount));
      addField('successUrl', window.location.origin + '/#booking-success');
      addField('cancelUrl', window.location.origin + '/#booking-cancel');

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      // Show message to user
      toast.success('Fizetési oldal megnyitva új ablakban. A foglalás a fizetés után válik véglegessé.');

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Hiba történt a fizetés során: ' + (error instanceof Error ? error.message : 'Ismeretlen hiba'));
      setIsSubmitting(false);
    }
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Get maximum date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

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
          <p className="text-lg text-[#8B7355]">
            Válaszd ki a számodra megfelelő kezelést és időpontot.
          </p>
        </div>

        {/* Booking Form */}
        <div className={`bg-white rounded-3xl shadow-warm-lg p-6 sm:p-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {step === 'payment' ? (
            // Payment Step
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-[#4A3F35] mb-2">Foglalási díj befizetése</h3>
                <p className="text-[#8B7355]">A foglalás véglegesítéséhez kérjük a foglalási díj befizetését</p>
              </div>

              {/* Booking Summary */}
              <div className="bg-[#F9F1EA] rounded-2xl p-6 space-y-3">
                <h4 className="font-semibold text-[#4A3F35]">Foglalás összegzése</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#8B7355]">Kezelés:</span>
                    <span className="text-[#4A3F35] font-medium">{formData.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8B7355]">Dátum:</span>
                    <span className="text-[#4A3F35]">{formData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8B7355]">Időpont:</span>
                    <span className="text-[#4A3F35]">{formData.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8B7355]">Név:</span>
                    <span className="text-[#4A3F35]">{formData.name}</span>
                  </div>
                  {formData.recurring && (
                    <div className="bg-[#D4854A]/10 rounded-lg p-3 mt-2">
                      <div className="flex justify-between">
                        <span className="text-[#8B7355]">Ismétlődés:</span>
                        <span className="text-[#4A3F35] font-medium">
                          {formData.recurringType === 'weekly' && 'Minden héten'}
                          {formData.recurringType === 'biweekly' && 'Kéthetente'}
                          {formData.recurringType === 'monthly' && 'Minden hónapban'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8B7355]">Alkalom száma:</span>
                        <span className="text-[#4A3F35] font-medium">{formData.recurringCount} alkalom</span>
                      </div>
                    </div>
                  )}
                  <div className="border-t border-[#E8D4C0] pt-4 mt-4">
                    {/* Price Breakdown */}
                    <div className="space-y-3">
                      {/* Service Price */}
                      <div className="flex justify-between items-center">
                        <span className="text-[#8B7355] text-base">Kezelés ára:</span>
                        <span className="text-[#4A3F35] text-lg font-medium">{getSelectedServicePrice().toLocaleString()} Ft / alkalom</span>
                      </div>

                      {formData.recurring && (
                        <>
                          {/* Quantity */}
                          <div className="flex justify-between items-center">
                            <span className="text-[#8B7355] text-base">Alkalom száma:</span>
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
                          <span className="text-[#8B7355] text-sm">A teljes összeg befizetése a kezelésnél</span>
                        </div>
                        <span className="text-4xl font-black text-[#D4854A]">{getFinalDepositAmount().toLocaleString()} Ft</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                <p className="text-sm text-[#8B7355] text-center">Válassz fizetési módot:</p>

                {/* Stripe Payment Button - PRIMARY */}
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
                      {getFinalDepositAmount().toLocaleString()} Ft - Biztonságos fizetés
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-[#8B7355] flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  256-bit SSL titkosítás - Stripe biztonságos fizetés
                </p>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E8D4C0]"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-sm text-[#8B7355]">vagy</span>
                  </div>
                </div>

                {/* Bank Transfer Option - SECONDARY */}
                <div className="bg-[#F9F1EA] rounded-xl p-4">
                  <h4 className="font-semibold text-[#4A3F35] mb-3 text-base">Banki átutalás</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#8B7355]">Számlatulajdonos:</span>
                      <span className="text-[#4A3F35] font-medium">Makra Edina</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8B7355]">Számlaszám:</span>
                      <span className="text-[#4A3F35] font-medium font-mono text-xs">10700581-730554012-511100005</span>
                    </div>
                    <div className="flex justify-between items-center bg-white rounded-lg px-3 py-2">
                      <span className="text-[#8B7355]">Összeg:</span>
                      <span className="text-[#D4854A] text-xl font-bold">{getFinalDepositAmount().toLocaleString()} Ft</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#8B7355] mt-3 bg-white/50 rounded-lg p-2">
                    <strong>Fontos:</strong> A foglalás a befizetés beérkezése után válik véglegessé.
                  </p>
                </div>

                <Button
                  onClick={() => setStep('form')}
                  variant="outline"
                  className="w-full border-[#E8D4C0] text-[#8B7355] hover:bg-[#F9F1EA]"
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
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355]" />
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
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355]" />
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
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355]" />
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
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355] pointer-events-none" />
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-[#4A3F35]">
                    Dátum <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative max-w-[200px]">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355]" />
                    <Input
                      id="date"
                      type="date"
                      min={minDate}
                      max={maxDateStr}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                      className="pl-10 border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                </div>

                {/* Time - Fixed Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-[#4A3F35]">
                    Időpont <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <select
                      id="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                      className="w-full h-10 pl-3 pr-12 border border-[#E8D4C0] rounded-md focus:border-[#D4854A] focus:ring-1 focus:ring-[#D4854A] bg-white text-[#4A3F35] appearance-none cursor-pointer"
                    >
                      <option value="">Válassz időpontot</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355] pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-[#4A3F35]">
                  Megjegyzés
                </Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-[#8B7355]" />
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
                    <p className="text-sm text-[#8B7355]">
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
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355] pointer-events-none" />
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
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355] pointer-events-none" />
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
                      <p className="text-sm text-[#8B7355]">Teljes ár kedvezmény előtt:</p>
                      <p className="text-xl font-bold text-[#4A3F35]">{(getSelectedServicePrice() * formData.recurringCount).toLocaleString()} Ft</p>
                      {getDiscountPercent() > 0 && (
                        <p className="text-sm text-[#8B9A7C] font-medium mt-1">
                          Kedvezmény ({getDiscountPercent()}%): -{getDiscountAmount().toLocaleString()} Ft
                        </p>
                      )}
                    </div>
                  )}
                  <p className="text-base text-[#8B7355] mb-1">
                    {formData.recurring
                      ? `Foglalási díj (${formData.recurringCount} alkalom × 20%)`
                      : 'Foglalási díj (20%)'}
                  </p>
                  <p className="text-4xl font-black text-[#D4854A] my-2">{getFinalDepositAmount().toLocaleString()} Ft</p>
                  <p className="text-sm text-[#8B7355]">
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
              <h3 className="text-xl font-bold text-[#4A3F35] mb-4">Általános Szerződési Feltételek</h2>
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
                <p className="text-sm text-[#8B7355]">Telefonon</p>
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
                <p className="text-sm text-[#8B7355]">Emailben</p>
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

// Footer/Contact Section
function FooterSection() {
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
                <h3 className="font-bold text-lg">Dunakeszi Masszázs</h3>
                <p className="text-sm text-white/60">Angyali Szalon - Makra Edina</p>
              </div>
            </div>
            <p className="text-white/70 leading-relaxed">
              Nyugtató, harmonizáló kezelések egy békés, biztonságos környezetben az Angyali Szalonban.
              Személyre szabott masszázskezelésekkel várlak szeretettel Dunakeszin.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Gyors linkek</h4>
            <ul className="space-y-2">
              {[
                { href: '#fooldal', label: 'Főoldal' },
                { href: '#kezelesek', label: 'Kezelések' },
                { href: '#arlista', label: 'Árlista' },
                { href: '#idopont', label: 'Időpontfoglalás' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.querySelector(link.href);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-white/70 hover:text-[#D4854A] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Kapcsolat</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+36304877883"
                  className="flex items-center gap-3 text-white/70 hover:text-[#D4854A] transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>+36 30 487 7883</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:dunakeszimasszor@gmail.com"
                  className="flex items-center gap-3 text-white/70 hover:text-[#D4854A] transition-colors break-all"
                >
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span className="break-all">dunakeszimasszor@gmail.com</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <MapPin className="w-5 h-5" />
                <span>Dunakeszi, Kolonics György utca 2/B, 2120<br /><small>Kapucsengő: 1/43</small></span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <svg className="w-5 h-5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Bankszámla:<br />10700581-730554012-511100005</span>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="mt-6">
              <h5 className="text-sm font-medium text-white/50 mb-3">Kövess minket</h5>
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
                  href="https://share.google/bUlkHfnNUJpZeq2Tw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D4854A] transition-colors"
                  aria-label="Google Business"
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

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Dunakeszi Masszázs - Angyali Szalon – Makra Edina | Minden jog fenntartva
            </p>
            <div className="flex items-center gap-6">
              <a
                href="/#admin"
                className="text-white/50 hover:text-[#D4854A] transition-colors text-sm"
              >
                Admin
              </a>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 text-white/50 hover:text-[#D4854A] transition-colors text-sm"
              >
                <span>Vissza a tetejére</span>
                <ChevronDown className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Admin Page Component - Enhanced with Customer Management & P&L
function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'customers' | 'packages' | 'pnl' | 'cancel' | 'notify'>('dashboard');
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    appointmentDate: '',
    appointmentTime: '',
    service: '',
    reason: '',
    newDate: '',
    newTime: ''
  });
  const [packageForm, setPackageForm] = useState({
    customerEmail: '',
    customerName: '',
    customerPhone: '',
    service: '',
    sessions: 12,
    originalPrice: 180000,
    depositPaid: 36000,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [pnlData, setPnlData] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchEmail, setSearchEmail] = useState('');
  const [customerProfile, setCustomerProfile] = useState<any>(null);

  const ADMIN_PASSWORD = 'Edina2025!';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success('Sikeres bejelentkezés!');
      loadDashboardData();
    } else {
      toast.error('Hibás jelszó!');
    }
  };

  const loadDashboardData = async () => {
    try {
      const response = await fetch(`${SCRIPT_URL}?action=dashboard`);
      const data = await response.json();
      if (data.success) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const loadPnLData = async () => {
    try {
      const response = await fetch(`${SCRIPT_URL}?action=pnl&month=${selectedMonth}&year=${selectedYear}`);
      const data = await response.json();
      if (data.success) {
        setPnlData(data.data);
      }
    } catch (error) {
      console.error('Error loading P&L:', error);
    }
  };

  const searchCustomer = async () => {
    if (!searchEmail) return;
    try {
      const response = await fetch(`${SCRIPT_URL}?action=customer&email=${searchEmail}`);
      const data = await response.json();
      if (data.success) {
        setCustomerProfile(data.data);
      } else {
        toast.error('Vásárló nem található');
      }
    } catch (error) {
      toast.error('Hiba a keresés során');
    }
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'purchasePackage',
          email: packageForm.customerEmail,
          name: packageForm.customerName,
          phone: packageForm.customerPhone,
          service: packageForm.service,
          sessions: packageForm.sessions,
          originalPrice: packageForm.originalPrice,
          depositPaid: packageForm.depositPaid,
          notes: packageForm.notes
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Bérlet sikeresen létrehozva!');
        setPackageForm({
          customerEmail: '',
          customerName: '',
          customerPhone: '',
          service: '',
          sessions: 12,
          originalPrice: 180000,
          depositPaid: 36000,
          notes: ''
        });
        loadDashboardData();
      } else {
        toast.error(data.message || 'Hiba történt');
      }
    } catch (error) {
      toast.error('Hiba a bérlet létrehozása során');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel',
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime,
          service: formData.service,
          reason: formData.reason
        })
      });

      toast.success('Lemondási értesítés elküldve!');
      setFormData({
        clientName: '',
        clientEmail: '',
        appointmentDate: '',
        appointmentTime: '',
        service: '',
        reason: '',
        newDate: '',
        newTime: ''
      });
    } catch (error) {
      toast.error('Hiba történt az értesítés küldése közben.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotifyChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change',
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime,
          service: formData.service,
          newDate: formData.newDate,
          newTime: formData.newTime
        })
      });

      toast.success('Módosítási értesítés elküldve!');
      setFormData({
        clientName: '',
        clientEmail: '',
        appointmentDate: '',
        appointmentTime: '',
        service: '',
        reason: '',
        newDate: '',
        newTime: ''
      });
    } catch (error) {
      toast.error('Hiba történt az értesítés küldése közben.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate discount for package form
  const getPackageDiscount = () => {
    const count = packageForm.sessions;
    if (count >= 6) return 15;
    if (count >= 4) return 10;
    if (count >= 2) return 5;
    return 0;
  };

  const getPackageFinalPrice = () => {
    const discount = getPackageDiscount();
    return Math.round(packageForm.originalPrice * (1 - discount / 100));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F1EA] to-[#FFFBF7] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-warm-lg p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#D4854A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#D4854A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#4A3F35]">Admin Bejelentkezés</h1>
            <p className="text-[#8B7355] mt-2">Dunakeszi Masszázs - Angyali Szalon</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="admin-password" className="text-[#4A3F35]">Jelszó</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Add meg a jelszót"
                className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#D4854A] hover:bg-[#B87333] text-white py-3 rounded-xl font-medium"
            >
              Bejelentkezés
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" onClick={() => window.location.hash = ''} className="text-[#8B7355] hover:text-[#D4854A] text-sm">
              ← Vissza a főoldalra
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F1EA] to-[#FFFBF7]">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D4854A]/10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-[#D4854A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#4A3F35]">Admin Felület</h1>
              <p className="text-sm text-[#8B7355]">Dunakeszi Masszázs - Angyali Szalon</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://calendar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#8B9A7C]/10 text-[#8B9A7C] rounded-lg hover:bg-[#8B9A7C]/20 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Google Naptár</span>
            </a>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-[#8B7355] hover:text-[#D4854A]"
            >
              Kijelentkezés
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-[#E8D4C0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Áttekintés', icon: '📊' },
              { id: 'customers', label: 'Vásárlók', icon: '👥' },
              { id: 'packages', label: 'Bérletek', icon: '🎫' },
              { id: 'pnl', label: 'P&L', icon: '💰' },
              { id: 'cancel', label: 'Lemondás', icon: '❌' },
              { id: 'notify', label: 'Módosítás', icon: '📝' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                    ? 'text-[#D4854A] border-b-2 border-[#D4854A]'
                    : 'text-[#8B7355] hover:text-[#4A3F35]'
                  }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#4A3F35]">Áttekintés</h2>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-warm">
                <div className="w-12 h-12 bg-[#8B9A7C]/10 rounded-xl flex items-center justify-center mb-4">
                  <User className="w-6 h-6 text-[#8B9A7C]" />
                </div>
                <p className="text-[#8B7355] text-sm">Összes vásárló</p>
                <p className="text-3xl font-bold text-[#4A3F35]">{dashboardData?.customerCount || 0}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-warm">
                <div className="w-12 h-12 bg-[#D4854A]/10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#D4854A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <p className="text-[#8B7355] text-sm">Aktív bérletek</p>
                <p className="text-3xl font-bold text-[#4A3F35]">{dashboardData?.activePackages || 0}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-warm">
                <div className="w-12 h-12 bg-[#4A7C59]/10 rounded-xl flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-[#4A7C59]" />
                </div>
                <p className="text-[#8B7355] text-sm">Hátralévő alkalmak</p>
                <p className="text-3xl font-bold text-[#4A3F35]">{dashboardData?.totalSessionsRemaining || 0}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-warm">
                <div className="w-12 h-12 bg-[#8B4513]/10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#8B4513]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-[#8B7355] text-sm">Havi bevétel</p>
                <p className="text-3xl font-bold text-[#4A3F35]">{dashboardData?.monthlyPnL?.totalIncome?.toLocaleString() || 0} Ft</p>
              </div>
            </div>

            {/* Today's Bookings */}
            <div className="bg-white rounded-2xl shadow-warm p-6">
              <h3 className="font-semibold text-[#4A3F35] mb-4">Mai foglalások</h3>
              {dashboardData?.todaysBookings?.length > 0 ? (
                <div className="space-y-2">
                  {dashboardData.todaysBookings.map((booking: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-[#F9F1EA] rounded-lg">
                      <div>
                        <p className="font-medium text-[#4A3F35]">{booking.customer}</p>
                        <p className="text-sm text-[#8B7355]">{booking.service}</p>
                      </div>
                      <span className="text-[#D4854A] font-medium">{booking.time}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#8B7355]">Nincs foglalás mára</p>
              )}
            </div>

            {/* Quick Links */}
            <div className="grid md:grid-cols-3 gap-4">
              <a
                href="https://calendar.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl p-6 shadow-warm hover:shadow-warm-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-[#8B9A7C]/10 rounded-xl flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-[#8B9A7C]" />
                </div>
                <h3 className="font-semibold text-[#4A3F35]">Google Naptár</h3>
                <p className="text-sm text-[#8B7355]">Foglalások kezelése</p>
              </a>

              <a
                href="mailto:dunakeszimasszor@gmail.com"
                className="bg-white rounded-2xl p-6 shadow-warm hover:shadow-warm-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-[#D4854A]/10 rounded-xl flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-[#D4854A]" />
                </div>
                <h3 className="font-semibold text-[#4A3F35]">Gmail</h3>
                <p className="text-sm text-[#8B7355]">Emailek kezelése</p>
              </a>

              <a
                href="/"
                onClick={() => window.location.hash = ''}
                className="bg-white rounded-2xl p-6 shadow-warm hover:shadow-warm-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-[#4A3F35]/10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#4A3F35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#4A3F35]">Weboldal</h3>
                <p className="text-sm text-[#8B7355]">Vissza a főoldalra</p>
              </a>
            </div>
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#4A3F35]">Vásárló keresése</h2>

            <div className="bg-white rounded-2xl shadow-warm p-6">
              <div className="flex gap-4">
                <Input
                  type="email"
                  placeholder="Vásárló email címe"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="flex-1 border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                />
                <Button
                  onClick={searchCustomer}
                  className="bg-[#D4854A] hover:bg-[#B87333] text-white"
                >
                  Keresés
                </Button>
              </div>
            </div>

            {customerProfile && (
              <div className="bg-white rounded-2xl shadow-warm p-6 space-y-6">
                <div className="border-b border-[#E8D4C0] pb-4">
                  <h3 className="text-xl font-bold text-[#4A3F35]">{customerProfile.customer?.name}</h3>
                  <p className="text-[#8B7355]">{customerProfile.customer?.email}</p>
                  <p className="text-[#8B7355]">{customerProfile.customer?.phone}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-[#F9F1EA] rounded-xl p-4 text-center">
                    <p className="text-[#8B7355] text-sm">Vásárolt alkalmak</p>
                    <p className="text-2xl font-bold text-[#4A3F35]">{customerProfile.customer?.totalSessionsPurchased || 0}</p>
                  </div>
                  <div className="bg-[#F9F1EA] rounded-xl p-4 text-center">
                    <p className="text-[#8B7355] text-sm">Felhasznált alkalmak</p>
                    <p className="text-2xl font-bold text-[#4A3F35]">{customerProfile.customer?.totalSessionsUsed || 0}</p>
                  </div>
                  <div className="bg-[#8B9A7C]/10 rounded-xl p-4 text-center">
                    <p className="text-[#8B9A7C] text-sm">Hátralévő alkalmak</p>
                    <p className="text-2xl font-bold text-[#8B9A7C]">{customerProfile.customer?.totalSessionsRemaining || 0}</p>
                  </div>
                </div>

                {customerProfile.activePackages?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-[#4A3F35] mb-3">Aktív bérletek</h4>
                    <div className="space-y-2">
                      {customerProfile.activePackages.map((pkg: any, i: number) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-[#F9F1EA] rounded-lg">
                          <div>
                            <p className="font-medium text-[#4A3F35]">{pkg.serviceType}</p>
                            <p className="text-sm text-[#8B7355]">Vásárolva: {pkg.purchaseDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[#8B9A7C] font-medium">{pkg.sessionsRemaining} / {pkg.sessionsPurchased} alkalom</p>
                            {pkg.discountPercent > 0 && (
                              <p className="text-xs text-[#D4854A]">{pkg.discountPercent}% kedvezmény</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {customerProfile.recentBookings?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-[#4A3F35] mb-3">Legutóbbi foglalások</h4>
                    <div className="space-y-2">
                      {customerProfile.recentBookings.map((booking: any, i: number) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-[#F9F1EA] rounded-lg">
                          <div>
                            <p className="font-medium text-[#4A3F35]">{booking.service}</p>
                            <p className="text-sm text-[#8B7355]">{booking.date} {booking.time}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${booking.status === 'Confirmed'
                              ? 'bg-[#8B9A7C]/20 text-[#8B9A7C]'
                              : 'bg-red-100 text-red-600'
                            }`}>
                            {booking.status === 'Confirmed' ? 'Megerősítve' : 'Lemondva'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* PACKAGES TAB */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#4A3F35]">Új bérlet létrehozása</h2>

            <div className="bg-white rounded-2xl shadow-warm p-6">
              <form onSubmit={handleCreatePackage} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Vásárló neve *</Label>
                    <Input
                      value={packageForm.customerName}
                      onChange={(e) => setPackageForm({ ...packageForm, customerName: e.target.value })}
                      placeholder="Pl.: Kovács Anna"
                      required
                      className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Email cím *</Label>
                    <Input
                      type="email"
                      value={packageForm.customerEmail}
                      onChange={(e) => setPackageForm({ ...packageForm, customerEmail: e.target.value })}
                      placeholder="anna@pelda.hu"
                      required
                      className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Telefonszám</Label>
                    <Input
                      value={packageForm.customerPhone}
                      onChange={(e) => setPackageForm({ ...packageForm, customerPhone: e.target.value })}
                      placeholder="+36 30 123 4567"
                      className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Kezelés típusa</Label>
                    <select
                      value={packageForm.service}
                      onChange={(e) => setPackageForm({ ...packageForm, service: e.target.value })}
                      className="w-full h-10 pl-3 pr-10 border border-[#E8D4C0] rounded-md focus:border-[#D4854A] focus:ring-1 focus:ring-[#D4854A] bg-white text-[#4A3F35] appearance-none cursor-pointer"
                    >
                      <option value="">Bármely kezelés</option>
                      <option value="Frissítő masszázs">Frissítő masszázs</option>
                      <option value="Nepáli masszázs">Nepáli masszázs</option>
                      <option value="Nyirokmasszázs">Nyirokmasszázs</option>
                      <option value="Aromamasszázs">Aromamasszázs</option>
                      <option value="Indiai fejmasszázs">Indiai fejmasszázs</option>
                      <option value="Kineziológia">Kineziológia</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Alkalmak száma *</Label>
                    <select
                      value={packageForm.sessions}
                      onChange={(e) => setPackageForm({ ...packageForm, sessions: parseInt(e.target.value) })}
                      className="w-full h-10 pl-3 pr-10 border border-[#E8D4C0] rounded-md focus:border-[#D4854A] focus:ring-1 focus:ring-[#D4854A] bg-white text-[#4A3F35] appearance-none cursor-pointer"
                    >
                      {[2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                        <option key={num} value={num}>{num} alkalom</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Eredeti ár (Ft)</Label>
                    <Input
                      type="number"
                      value={packageForm.originalPrice}
                      onChange={(e) => setPackageForm({ ...packageForm, originalPrice: parseInt(e.target.value) })}
                      className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Foglaló befizetve (Ft)</Label>
                    <Input
                      type="number"
                      value={packageForm.depositPaid}
                      onChange={(e) => setPackageForm({ ...packageForm, depositPaid: parseInt(e.target.value) })}
                      className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[#4A3F35]">Megjegyzés</Label>
                    <Textarea
                      value={packageForm.notes}
                      onChange={(e) => setPackageForm({ ...packageForm, notes: e.target.value })}
                      placeholder="Opcionális megjegyzés..."
                      className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-[#F9F1EA] rounded-xl p-4">
                  <h4 className="font-semibold text-[#4A3F35] mb-3">Árösszegzés</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#8B7355]">Eredeti ár:</span>
                      <span className="text-[#4A3F35]">{packageForm.originalPrice.toLocaleString()} Ft</span>
                    </div>
                    {getPackageDiscount() > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[#8B9A7C]">Kedvezmény ({getPackageDiscount()}%):</span>
                        <span className="text-[#8B9A7C]">-{Math.round(packageForm.originalPrice * getPackageDiscount() / 100).toLocaleString()} Ft</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium">
                      <span className="text-[#4A3F35]">Fizetendő:</span>
                      <span className="text-[#4A3F35]">{getPackageFinalPrice().toLocaleString()} Ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8B7355]">Foglaló:</span>
                      <span className="text-[#4A3F35]">{packageForm.depositPaid.toLocaleString()} Ft</span>
                    </div>
                    <div className="flex justify-between text-[#D4854A]">
                      <span>Hátralék:</span>
                      <span>{(getPackageFinalPrice() - packageForm.depositPaid).toLocaleString()} Ft</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#D4854A] hover:bg-[#B87333] text-white py-4 rounded-xl font-medium"
                >
                  {isSubmitting ? 'Létrehozás...' : 'Bérlet létrehozása'}
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* P&L TAB */}
        {activeTab === 'pnl' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#4A3F35]">P&L Kimutatás</h2>
              <div className="flex gap-4">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="h-10 pl-3 pr-10 border border-[#E8D4C0] rounded-md focus:border-[#D4854A] bg-white text-[#4A3F35]"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}. hónap</option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="h-10 pl-3 pr-10 border border-[#E8D4C0] rounded-md focus:border-[#D4854A] bg-white text-[#4A3F35]"
                >
                  {[2024, 2025, 2026].map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <Button
                  onClick={loadPnLData}
                  className="bg-[#D4854A] hover:bg-[#B87333] text-white"
                >
                  Betöltés
                </Button>
              </div>
            </div>

            {pnlData && (
              <>
                {/* Summary Cards */}
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl p-6 shadow-warm">
                    <p className="text-[#8B7355] text-sm">Összes bevétel</p>
                    <p className="text-2xl font-bold text-[#4A3F35]">{pnlData.totalIncome?.toLocaleString() || 0} Ft</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-warm">
                    <p className="text-[#8B7355] text-sm">Foglalók</p>
                    <p className="text-2xl font-bold text-[#D4854A]">{pnlData.totalDeposits?.toLocaleString() || 0} Ft</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-warm">
                    <p className="text-[#8B7355] text-sm">Hátralék</p>
                    <p className="text-2xl font-bold text-red-500">{pnlData.outstanding?.toLocaleString() || 0} Ft</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-warm">
                    <p className="text-[#8B7355] text-sm">Kezelések száma</p>
                    <p className="text-2xl font-bold text-[#8B9A7C]">{pnlData.sessionsCompleted || 0}</p>
                  </div>
                </div>

                {/* Transactions Table */}
                {pnlData.transactions?.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-warm p-6">
                    <h3 className="font-semibold text-[#4A3F35] mb-4">Tranzakciók</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#E8D4C0]">
                            <th className="text-left py-2 text-[#8B7355] font-medium">Dátum</th>
                            <th className="text-left py-2 text-[#8B7355] font-medium">Típus</th>
                            <th className="text-left py-2 text-[#8B7355] font-medium">Vásárló</th>
                            <th className="text-left py-2 text-[#8B7355] font-medium">Leírás</th>
                            <th className="text-right py-2 text-[#8B7355] font-medium">Összeg</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pnlData.transactions.map((txn: any, i: number) => (
                            <tr key={i} className="border-b border-[#F9F1EA]">
                              <td className="py-3 text-[#4A3F35]">{txn.date}</td>
                              <td className="py-3">
                                <span className={`px-2 py-1 rounded text-xs ${txn.type === 'Income' || txn.type === 'Payment'
                                    ? 'bg-[#8B9A7C]/20 text-[#8B9A7C]'
                                    : 'bg-[#D4854A]/20 text-[#D4854A]'
                                  }`}>
                                  {txn.type === 'Income' ? 'Bevétel' : txn.type === 'Payment' ? 'Fizetés' : 'Foglaló'}
                                </span>
                              </td>
                              <td className="py-3 text-[#4A3F35]">{txn.customer}</td>
                              <td className="py-3 text-[#8B7355]">{txn.description}</td>
                              <td className="py-3 text-right font-medium text-[#4A3F35]">{txn.amount?.toLocaleString()} Ft</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* CANCEL TAB */}
        {activeTab === 'cancel' && (
          <div className="bg-white rounded-2xl shadow-warm-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-[#4A3F35] mb-6">Időpont Lemondása</h2>
            <form onSubmit={handleCancelAppointment} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[#4A3F35]">Vendég neve *</Label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Pl.: Kovács Anna"
                    required
                    className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#4A3F35]">Vendég email címe *</Label>
                  <Input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    placeholder="anna@pelda.hu"
                    required
                    className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#4A3F35]">Eredeti dátum *</Label>
                  <Input
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    required
                    className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#4A3F35]">Eredeti időpont *</Label>
                  <Input
                    type="time"
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                    required
                    className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[#4A3F35]">Kezelés *</Label>
                  <Input
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    placeholder="Pl.: Frissítő masszázs"
                    required
                    className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[#4A3F35]">Lemondás oka</Label>
                  <Textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Opcionális: lemondás oka..."
                    className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                </div>
              </div>

              <div className="bg-[#F9F1EA] rounded-xl p-4">
                <p className="text-sm text-[#8B7355]">
                  <strong className="text-[#4A3F35]">Fontos:</strong> A lemondás után ne felejtsd el törölni az időpontot a Google Naptárból is!
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-medium"
              >
                {isSubmitting ? 'Küldés...' : 'Lemondási értesítés küldése'}
              </Button>
            </form>
          </div>
        )}

        {/* NOTIFY TAB */}
        {activeTab === 'notify' && (
          <div className="bg-white rounded-2xl shadow-warm-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-[#4A3F35] mb-6">Időpont Módosítása</h2>
            <form onSubmit={handleNotifyChange} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[#4A3F35]">Vendég neve *</Label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Pl.: Kovács Anna"
                    required
                    className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#4A3F35]">Vendég email címe *</Label>
                  <Input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    placeholder="anna@pelda.hu"
                    required
                    className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#4A3F35]">Eredeti dátum *</Label>
                  <Input
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    required
                    className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#4A3F35]">Eredeti időpont *</Label>
                  <Input
                    type="time"
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                    required
                    className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[#4A3F35]">Kezelés *</Label>
                  <Input
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    placeholder="Pl.: Frissítő masszázs"
                    required
                    className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#4A3F35]">Új dátum *</Label>
                  <Input
                    type="date"
                    value={formData.newDate}
                    onChange={(e) => setFormData({ ...formData, newDate: e.target.value })}
                    required
                    className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#4A3F35]">Új időpont *</Label>
                  <Input
                    type="time"
                    value={formData.newTime}
                    onChange={(e) => setFormData({ ...formData, newTime: e.target.value })}
                    required
                    className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                </div>
              </div>

              <div className="bg-[#F9F1EA] rounded-xl p-4">
                <p className="text-sm text-[#8B7355]">
                  <strong className="text-[#4A3F35]">Fontos:</strong> A módosítás után ne felejtsd el frissíteni az időpontot a Google Naptárból is!
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#8B9A7C] hover:bg-[#7A8B6B] text-white py-4 rounded-xl font-medium"
              >
                {isSubmitting ? 'Küldés...' : 'Módosítási értesítés küldése'}
              </Button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

// Main App Component
function App() {
  // Check if we're on the admin page using hash routing for static deployment
  const isAdminPage = window.location.hash === '#admin' || window.location.search.includes('admin');

  if (isAdminPage) {
    return <AdminPage />;
  }

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
      </main>
      <FooterSection />
    </div>
  );
}

export default App;

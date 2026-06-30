export type AppRoute =
  | 'home'
  | 'admin'
  | 'manage'
  | 'booking-success'
  | 'booking-cancel'
  | 'booking-bank-pending'
  | 'privacy'
  | `service:${string}`;

export const ROUTES = {
  admin: '/admin',
  manage: '/foglalasaim',
  home: '/',
  privacy: '/adatvedelem',
} as const;

const navListeners = new Set<() => void>();

/** Stop the browser from restoring scroll position on SPA navigations. */
if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

export function onNavigate(listener: () => void) {
  navListeners.add(listener);
  return () => navListeners.delete(listener);
}

function notifyNavigate() {
  navListeners.forEach((listener) => listener());
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function scrollToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function getServiceSlugFromPath(path: string): string | null {
  const match = path.match(/^\/kezelesek\/([^/]+)/);
  return match ? match[1] : null;
}

export function normalizePath(path: string): string {
  return path.replace(/\/$/, '') || '/';
}

export function getAppRoute(): AppRoute {
  const path = normalizePath(window.location.pathname);
  const hash = window.location.hash;

  const serviceSlug = getServiceSlugFromPath(path);
  if (serviceSlug) return `service:${serviceSlug}`;

  if (path === ROUTES.admin || hash === '#admin') return 'admin';
  if (path === ROUTES.manage || hash === '#foglalaskezeles') return 'manage';
  if (path === ROUTES.privacy) return 'privacy';
  if (path === '/booking-success' || hash === '#booking-success') return 'booking-success';
  if (path === '/booking-cancel' || hash === '#booking-cancel') return 'booking-cancel';
  if (hash === '#booking-bank-pending') return 'booking-bank-pending';

  return 'home';
}

export function isHomePath(): boolean {
  return normalizePath(window.location.pathname) === '/';
}

export function homeSectionHref(section: string): string {
  const sectionId = section.startsWith('#') ? section : `#${section}`;
  return `/${sectionId}`;
}

export function navigateTo(path: string, hash = '') {
  const oldPath = normalizePath(window.location.pathname);
  const url = hash ? `${path}${hash}` : path;

  window.history.pushState({}, '', url);
  notifyNavigate();

  const newPath = normalizePath(window.location.pathname);
  if (oldPath !== newPath) {
    scrollToTop();
    requestAnimationFrame(scrollToTop);
  }
}

/** Scroll to a homepage section; from sub-pages always returns to / first. */
export function navigateToSection(section: string) {
  const sectionId = section.startsWith('#') ? section : `#${section}`;

  if (!isHomePath()) {
    navigateTo('/', sectionId);
    return;
  }

  const element =
    document.querySelector(`#home-site ${sectionId}`) ?? document.querySelector(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  navigateTo('/', sectionId);
}

/** Scroll to a hash on the homepage after the home view has mounted. */
export function scrollToHomeHash(hash: string, maxAttempts = 20) {
  const sectionId = hash.startsWith('#') ? hash : `#${hash}`;
  let attempts = 0;

  const tryScroll = () => {
    const el =
      document.querySelector(`#home-site ${sectionId}`) ?? document.querySelector(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (attempts < maxAttempts) {
      attempts += 1;
      window.setTimeout(tryScroll, 50);
    }
  };

  window.setTimeout(tryScroll, 0);
}
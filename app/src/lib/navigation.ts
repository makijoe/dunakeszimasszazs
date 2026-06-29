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

export function getServiceSlugFromPath(path: string): string | null {
  const match = path.match(/^\/kezelesek\/([^/]+)/);
  return match ? match[1] : null;
}

export function getAppRoute(): AppRoute {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
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
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  return path === '/' && !getServiceSlugFromPath(path);
}

/** Scroll to a homepage section, navigating home first when on a sub-page. */
export function navigateToSection(section: string) {
  const sectionId = section.startsWith('#') ? section : `#${section}`;

  if (!isHomePath()) {
    navigateTo('/', sectionId);
    return;
  }

  const element = document.querySelector(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  } else {
    navigateTo('/', sectionId);
  }
}

export function navigateTo(path: string, hash = '') {
  const oldPath = window.location.pathname;
  const url = hash ? `${path}${hash}` : path;
  window.history.pushState({}, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));

  // Reset scroll when switching pages (e.g. home → service detail).
  if (oldPath !== window.location.pathname) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
}
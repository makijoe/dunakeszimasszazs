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

export function navigateTo(path: string, hash = '') {
  const url = hash ? `${path}${hash}` : path;
  window.history.pushState({}, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
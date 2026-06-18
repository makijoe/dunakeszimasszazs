export type AppRoute =
  | 'home'
  | 'admin'
  | 'manage'
  | 'booking-success'
  | 'booking-cancel'
  | 'booking-bank-pending';

export const ROUTES = {
  admin: '/admin',
  manage: '/foglalasaim',
  home: '/',
} as const;

export function getAppRoute(): AppRoute {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const hash = window.location.hash;

  if (path === ROUTES.admin || hash === '#admin') return 'admin';
  if (path === ROUTES.manage || hash === '#foglalaskezeles') return 'manage';
  if (hash === '#booking-success') return 'booking-success';
  if (hash === '#booking-cancel') return 'booking-cancel';
  if (hash === '#booking-bank-pending') return 'booking-bank-pending';

  return 'home';
}

export function navigateTo(path: string, hash = '') {
  const url = hash ? `${path}${hash}` : path;
  window.history.pushState({}, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
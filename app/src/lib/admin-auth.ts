const STORAGE_KEY = 'dm_admin_session_v1';
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function fingerprint(password: string): string {
  let hash = 5381;
  for (let i = 0; i < password.length; i++) {
    hash = ((hash << 5) + hash) ^ password.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

type StoredSession = {
  expires: number;
  fp: string;
};

export function saveAdminSession(password: string): void {
  const session: StoredSession = {
    expires: Date.now() + SESSION_TTL_MS,
    fp: fingerprint(password),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function hasValidAdminSession(password: string): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw) as StoredSession;
    if (!session.expires || !session.fp) {
      clearAdminSession();
      return false;
    }
    if (Date.now() > session.expires) {
      clearAdminSession();
      return false;
    }
    if (session.fp !== fingerprint(password)) {
      clearAdminSession();
      return false;
    }
    return true;
  } catch {
    clearAdminSession();
    return false;
  }
}

export function clearAdminSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}
export const SCRIPT_URL =
  import.meta.env.VITE_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbyNNnfTYIlEcuJFD2DaHJcPkv-ErX34TRaxmuc3mFxLVksuoYqs4_GLhilMxHmS3Eg/exec';

export const BANK_ACCOUNT = {
  holder: 'Makra Edina',
  account: '10700581-73054012-51100005',
};

function parseScriptResponse(text: string) {
  try {
    return JSON.parse(text) as { success?: boolean; message?: string; data?: Record<string, unknown> };
  } catch {
    if (text.includes('<!DOCTYPE') || text.includes('<HTML')) {
      throw new Error(
        'A foglalási szerver jelenleg nem elérhető. Kérjük hívj: +36 30 487 7883, vagy írj: dunakeszimasszor@gmail.com'
      );
    }
    throw new Error(
      'A szerver nem érvényes választ adott. Telepítsd újra a Google Script legújabb verzióját (Deploy → New version).'
    );
  }
}

/** GAS web app: GET requests work reliably; POST loses the body on Google’s redirect. */
export async function callScriptAction(
  action: string,
  params: Record<string, string | number | undefined> = {}
) {
  const url = new URL(SCRIPT_URL);
  url.searchParams.set('action', action);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && String(value) !== '') {
      url.searchParams.set(key, String(value));
    }
  }
  const response = await fetch(url.toString());
  const result = parseScriptResponse(await response.text());
  if (result.success === false && result.message) {
    throw new Error(result.message);
  }
  return result;
}
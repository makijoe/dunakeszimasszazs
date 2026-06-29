export const SCRIPT_URL =
  import.meta.env.VITE_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbyNNnfTYIlEcuJFD2DaHJcPkv-ErX34TRaxmuc3mFxLVksuoYqs4_GLhilMxHmS3Eg/exec';

export const BANK_ACCOUNT = {
  holder: 'Makra Edina',
  account: '10700581-73054012-51100005',
};

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
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      'A szerver nem érvényes választ adott. Telepítsd újra a Google Script legújabb verzióját (Deploy → New version).'
    );
  }
}
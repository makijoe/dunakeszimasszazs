import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const BUDAPEST = 'Europe/Budapest'

/** Today's date as YYYY-MM-DD in Budapest (matches salon timezone). */
export function getTodayInBudapest(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: BUDAPEST })
}

/** Build a tel: href for Hungarian phone numbers. */
export function formatPhoneLink(phone: unknown): string | null {
  if (phone === null || phone === undefined || phone === '') return null
  const digits = String(phone).replace(/\D/g, '')
  if (!digits) return null
  if (digits.startsWith('36')) return `tel:+${digits}`
  if (digits.startsWith('06')) return `tel:+36${digits.slice(1)}`
  if (digits.length === 9) return `tel:+36${digits}`
  return `tel:+${digits}`
}

/** Human-readable phone display for admin tables. */
export function formatPhoneDisplay(phone: unknown): string {
  if (phone === null || phone === undefined || phone === '') return '–'
  const raw = String(phone).trim()
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('36') && digits.length >= 11) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`.trim()
  }
  if (digits.length === 9) {
    return `+36 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`
  }
  return raw
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format booking dates from API / Google Sheets (ISO, Date, or YYYY-MM-DD). */
export function formatBookingDate(value: unknown): string {
  if (value === null || value === undefined || value === '') return '–'

  const str = String(value).trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    })
  }

  const date = new Date(str)
  if (Number.isNaN(date.getTime())) return str

  return date.toLocaleDateString('hu-HU', {
    timeZone: BUDAPEST,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  })
}

/** Format booking times from API / Google Sheets (HH:MM or 1899-12-30 ISO quirk). */
export function formatBookingTime(value: unknown): string {
  if (value === null || value === undefined || value === '') return '–'

  const str = String(value).trim()
  if (/^\d{1,2}:\d{2}/.test(str) && !str.includes('T')) {
    const [h, m] = str.split(':')
    return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`
  }

  const date = new Date(str)
  if (Number.isNaN(date.getTime())) return str

  if (str.includes('1899-12-30') || str.startsWith('1899')) {
    return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`
  }

  return date.toLocaleTimeString('hu-HU', {
    timeZone: BUDAPEST,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

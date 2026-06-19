import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const BUDAPEST = 'Europe/Budapest'

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

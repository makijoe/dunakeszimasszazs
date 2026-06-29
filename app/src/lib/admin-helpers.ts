import { formatBookingDate, formatBookingTime, getTodayInBudapest } from '@/lib/utils';

export function buildPhoneByEmail(
  entries: Array<{ email?: string; phone?: string | number }>
): Record<string, string> {
  const map: Record<string, string> = {};
  [...entries].reverse().forEach((entry) => {
    const email = String(entry.email || '').toLowerCase();
    if (email && entry.phone) {
      map[email] = String(entry.phone);
    }
  });
  return map;
}

export function enrichBookingsWithPhones(bookings: any[], phoneByEmail: Record<string, string>) {
  return bookings.map((booking) => ({
    ...booking,
    customerPhone: booking.customerPhone || phoneByEmail[String(booking.customerEmail || '').toLowerCase()] || '',
  }));
}

export function enrichCustomersWithBookings(customers: any[], bookings: any[]) {
  const today = getTodayInBudapest();
  return customers.map((customer) => {
    const email = String(customer.email || '').toLowerCase();
    const upcoming = bookings.filter(
      (b) =>
        String(b.customerEmail || '').toLowerCase() === email &&
        (b.status === 'Confirmed' || b.status === 'ChangeRequested') &&
        String(b.date || '') >= today
    );
    upcoming.sort((a, b) => {
      const dateCmp = String(a.date).localeCompare(String(b.date));
      if (dateCmp !== 0) return dateCmp;
      return String(a.time || '').localeCompare(String(b.time || ''));
    });
    const next = upcoming[0];
    return {
      ...customer,
      activeBookings: customer.activeBookings ?? upcoming.length,
      nextBookingDate: customer.nextBookingDate || next?.date || '',
      nextBookingTime: customer.nextBookingTime || next?.time || '',
    };
  });
}

export function formatGuestNextBooking(guest: {
  activeBookings?: number;
  nextBookingDate?: string;
  nextBookingTime?: string;
}): string {
  if (!guest.activeBookings) return '–';
  const time = guest.nextBookingTime ? formatBookingTime(guest.nextBookingTime) : '';
  const countSuffix = guest.activeBookings > 1 ? ` (+${guest.activeBookings - 1})` : '';
  if (guest.nextBookingDate) {
    const today = getTodayInBudapest();
    if (guest.nextBookingDate === today) {
      return `Ma ${time}${countSuffix}`;
    }
    return `${formatBookingDate(guest.nextBookingDate)} ${time}${countSuffix}`.trim();
  }
  return String(guest.activeBookings);
}
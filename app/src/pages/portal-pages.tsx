import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  Clock,
  CreditCard,
  Mail,
  Sparkles,
  Star,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { LogoImage } from '@/components/LogoImage';
import { navigateTo, ROUTES } from '@/lib/navigation';
import { GOOGLE_WRITE_REVIEW_URL, SITE_NAME, SITE_URL, useSeo } from '@/lib/seo';
import {
  addMonthsToDateStr,
  BOOKING_MAX_MONTHS_AHEAD,
  formatBookingDate,
  formatBookingTime,
  getTodayInBudapest,
  getBookingStatusDisplay,
  isActiveBookingStatus,
  isBookingUpcoming,
} from '@/lib/utils';
import { services } from '@/lib/services';
import { SCRIPT_URL, callScriptAction } from '@/lib/script-api';
import { PhoneLink } from '@/components/PhoneLink';
import { AdminTabLoader } from '@/components/AdminTabLoader';
import {
  buildPhoneByEmail,
  enrichBookingsWithPhones,
  enrichCustomersWithBookings,
  formatGuestNextBooking,
} from '@/lib/admin-helpers';
import { clearAdminSession, hasValidAdminSession, saveAdminSession } from '@/lib/admin-auth';

export function ManageBookingsPage() {
  useSeo({
    title: `Foglalásaim | ${SITE_NAME}`,
    description: 'Saját foglalások megtekintése, lemondása vagy módosítása – Dunakeszi Masszázs.',
    canonical: `${SITE_URL}/foglalasaim`,
    noindex: true,
  });

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [actionType, setActionType] = useState<'cancel' | 'change' | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [changeNotes, setChangeNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slotsForDate, setSlotsForDate] = useState<Record<string, boolean> | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const loadSlotsForDate = async (date: string) => {
    if (!date) { setSlotsForDate(null); return; }
    setIsLoadingSlots(true);
    setNewTime('');
    try {
      const res = await fetch(`${SCRIPT_URL}?action=getSlotsForDate&date=${date}`);
      const data = await res.json();
      if (data.success && data.data?.slots) setSlotsForDate(data.data.slots);
      else setSlotsForDate(null);
    } catch { setSlotsForDate(null); }
    finally { setIsLoadingSlots(false); }
  };

  const timeSlots = ['08:30', '09:45', '11:00', '12:15', '13:30', '14:45', '16:00', '17:15', '18:30'];

  const loadBookings = async (e?: React.FormEvent, forEmail?: string) => {
    if (e) e.preventDefault();
    const targetEmail = forEmail || email;
    if (!targetEmail) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${SCRIPT_URL}?action=myBookings&email=${encodeURIComponent(targetEmail)}`);
      const data = await response.json();
      if (data.success) {
        setMyBookings(data.data.bookings || []);
        setCustomerName(data.data.customerName || '');
        setHasLoaded(true);
      } else {
        toast.error(data.message || 'Nem találtunk foglalást ezzel az email-lel.');
      }
    } catch {
      toast.error('Hiba a foglalások betöltésekor. Próbáld újra!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    setIsSubmitting(true);
    try {
      const params = new URLSearchParams();
      params.append('action', 'selfCancel');
      params.append('bookingId', selectedBooking.bookingId);
      params.append('email', email);
      params.append('reason', cancelReason);
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: params
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Foglalásod sikeresen lemondva! Visszaigazolást küldtünk.');
        setSelectedBooking(null);
        setActionType(null);
        setCancelReason('');
        await loadBookings(undefined, email);
      } else {
        toast.error(result.message || 'Hiba a lemondás során');
      }
    } catch {
      toast.error('Hiba a lemondás során');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !newDate || !newTime) {
      toast.error('Kérjük add meg az új időpontot!');
      return;
    }
    setIsSubmitting(true);
    try {
      const params = new URLSearchParams();
      params.append('action', 'selfChange');
      params.append('bookingId', selectedBooking.bookingId);
      params.append('email', email);
      params.append('service', selectedBooking.service);
      params.append('currentDate', selectedBooking.date);
      params.append('currentTime', selectedBooking.time);
      params.append('newDate', newDate);
      params.append('newTime', newTime);
      params.append('notes', changeNotes);
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: params
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Időpontod sikeresen módosítva! Visszaigazolást küldtünk.');
        setSelectedBooking(null);
        setActionType(null);
        setNewDate('');
        setNewTime('');
        setChangeNotes('');
        setSlotsForDate(null);
        // Reload so list is fresh
        await loadBookings(undefined, email);
      } else {
        toast.error(result.message || 'Hiba a kérelem küldésekor');
      }
    } catch {
      toast.error('Hiba a kérelem küldésekor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
    } catch { return dateStr; }
  };

  const minDateStr = (() => {
    const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10);
  })();

  const closeModal = () => { setSelectedBooking(null); setActionType(null); setCancelReason(''); setNewDate(''); setNewTime(''); setChangeNotes(''); setSlotsForDate(null); };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F1EA] to-[#FFFBF7]">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <a href={ROUTES.home} onClick={(e) => { e.preventDefault(); navigateTo(ROUTES.home); }} className="flex items-center gap-2">
            <LogoImage size={40} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="font-semibold text-[#4A3F35] text-sm">Dunakeszi Masszázs</p>
              <p className="text-xs text-[#635241]">Angyali Szalon</p>
            </div>
          </a>
          <a href={ROUTES.home} onClick={(e) => { e.preventDefault(); navigateTo(ROUTES.home); }} className="text-sm text-[#635241] hover:text-[#D4854A] transition-colors">
            ← Főoldalra
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#D4854A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-[#D4854A]" />
          </div>
          <h1 className="text-3xl font-bold text-[#4A3F35]">Foglalásaim</h1>
          <p className="text-[#635241] mt-2">Tekintsd meg, módosítsd vagy mond le közelgő foglalásaidat</p>
        </div>

        {/* Email form */}
        <div className="bg-white rounded-2xl shadow-warm p-6 mb-6">
          <form onSubmit={loadBookings}>
            <Label className="text-[#4A3F35] font-medium">Foglaláshoz használt email-cím</Label>
            <div className="flex gap-3 mt-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pelda@email.hu"
                required
                className="flex-1 border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
              />
              <Button type="submit" disabled={isLoading} className="bg-[#D4854A] hover:bg-[#B87333] text-white whitespace-nowrap">
                {isLoading ? 'Betöltés...' : 'Megjelenítés'}
              </Button>
            </div>
          </form>
        </div>

        {/* Bookings list */}
        {hasLoaded && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-[#635241]">
              {customerName ? `Közelgő foglalások — ${customerName}` : 'Közelgő foglalások'}
            </p>

            {myBookings.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-warm p-10 text-center">
                <Calendar className="w-12 h-12 text-[#E8D4C0] mx-auto mb-4" />
                <p className="text-[#635241] font-medium">Nincs közelgő aktív foglalásod.</p>
                <a
                  href="/#idopont"
                  onClick={(e) => { e.preventDefault(); window.location.href = '/#idopont'; }}
                  className="inline-block mt-4 text-[#D4854A] hover:underline text-sm font-medium"
                >
                  Foglalj új időpontot →
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {myBookings.map((booking: any) => (
                  <div key={booking.bookingId} className="bg-white rounded-2xl shadow-warm p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-[#4A3F35] text-lg">{booking.service}</p>
                          {booking.status === 'ChangeRequested' && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">⏳ Módosítás kérve</span>
                          )}
                        </div>
                        <p className="text-[#D4854A] font-medium mt-0.5">
                          {formatDisplayDate(typeof booking.date === 'string' ? booking.date.slice(0, 10) : new Date(booking.date).toISOString().slice(0, 10))}
                        </p>
                        <p className="text-[#635241] text-sm mt-0.5">⏰ {typeof booking.time === 'string' ? booking.time.slice(0, 5) : booking.time}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setSelectedBooking(booking); setActionType('change'); }}
                          className="border-[#8B9A7C] text-[#4A7C59] hover:bg-[#8B9A7C]/10 text-xs font-medium"
                        >
                          📅 Módosítás
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setSelectedBooking(booking); setActionType('cancel'); }}
                          className="border-red-200 text-red-500 hover:bg-red-50 text-xs font-medium"
                        >
                          ❌ Lemondás
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="text-center text-sm text-[#635241] mt-10">
          Kérdésed van? Hívj bátran:{' '}
          <a href="tel:+36304877883" className="text-[#D4854A] font-medium">+36 30 487 7883</a>
        </p>
      </main>

      {/* Cancel Modal */}
      {selectedBooking && actionType === 'cancel' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#4A3F35] mb-4">Foglalás lemondása</h3>
            <div className="bg-[#FFF8F2] border border-[#E8D4C0] rounded-xl p-4 mb-5">
              <p className="font-semibold text-[#4A3F35]">{selectedBooking.service}</p>
              <p className="text-[#D4854A] font-medium mt-0.5">
                {formatDisplayDate(typeof selectedBooking.date === 'string' ? selectedBooking.date.slice(0, 10) : new Date(selectedBooking.date).toISOString().slice(0, 10))}
              </p>
              <p className="text-[#635241] text-sm">⏰ {typeof selectedBooking.time === 'string' ? selectedBooking.time.slice(0, 5) : selectedBooking.time}</p>
            </div>
            <form onSubmit={handleCancel} className="space-y-4">
              <div>
                <Label className="text-[#4A3F35] text-sm font-medium">Lemondás oka (opcionális)</Label>
                <Textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Pl.: Beteg lettem, megváltozott a munkarendem..."
                  rows={3}
                  className="mt-1.5 border-[#E8D4C0] focus:border-[#D4854A] text-sm"
                />
              </div>
              <p className="text-xs text-[#635241] bg-orange-50 border border-orange-100 p-3 rounded-lg">
                ⚠️ Lemondás legkésőbb <b>24 órával korábban</b> lehetséges. A befizetett foglaló nem kerül visszatérítésre.
              </p>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={closeModal} className="flex-1 border-[#E8D4C0]">
                  Mégsem
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
                  {isSubmitting ? 'Lemondás...' : 'Lemondás megerősítése'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Modal */}
      {selectedBooking && actionType === 'change' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#4A3F35] mb-4">Időpont módosítása</h3>
            <div className="bg-[#FFF8F2] border border-[#E8D4C0] rounded-xl p-4 mb-5">
              <p className="text-xs text-[#635241] mb-1">Jelenlegi időpont:</p>
              <p className="font-semibold text-[#4A3F35]">{selectedBooking.service}</p>
              <p className="text-[#D4854A] font-medium mt-0.5">
                {formatDisplayDate(typeof selectedBooking.date === 'string' ? selectedBooking.date.slice(0, 10) : new Date(selectedBooking.date).toISOString().slice(0, 10))}
              </p>
              <p className="text-[#635241] text-sm">⏰ {typeof selectedBooking.time === 'string' ? selectedBooking.time.slice(0, 5) : selectedBooking.time}</p>
            </div>
            <form onSubmit={handleChangeRequest} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label className="text-[#4A3F35] text-sm font-medium">Új dátum *</Label>
                  <Input
                    type="date"
                    value={newDate}
                    onChange={(e) => { setNewDate(e.target.value); loadSlotsForDate(e.target.value); }}
                    min={minDateStr}
                    required
                    className="mt-1.5 border-[#E8D4C0] focus:border-[#D4854A]"
                  />
                </div>
              </div>
              {/* Slot availability grid */}
              {newDate && (
                <div>
                  <Label className="text-[#4A3F35] text-sm font-medium mb-2 block">Új időpont kiválasztása *</Label>
                  {isLoadingSlots ? (
                    <div className="flex items-center justify-center py-6 text-[#635241] text-sm">
                      <div className="w-4 h-4 border-2 border-[#D4854A]/30 border-t-[#D4854A] rounded-full animate-spin mr-2" />
                      Időpontok betöltése...
                    </div>
                  ) : slotsForDate ? (
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map(slot => {
                        const available = slotsForDate[slot];
                        const selected = newTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={!available}
                            onClick={() => available && setNewTime(slot)}
                            className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                              !available
                                ? 'bg-gray-50 border-gray-200 text-gray-300 line-through cursor-not-allowed'
                                : selected
                                  ? 'bg-[#D4854A] border-[#D4854A] text-white shadow-md'
                                  : 'bg-white border-[#E8D4C0] text-[#4A3F35] hover:border-[#D4854A] hover:bg-[#FFF8F2] cursor-pointer'
                            }`}
                          >
                            {slot}
                            {available && !selected && <span className="block text-xs text-[#8B9A7C] font-normal">✓ szabad</span>}
                            {!available && <span className="block text-xs text-gray-300 font-normal">foglalt</span>}
                            {selected && <span className="block text-xs text-white/80 font-normal">✓ kiválasztva</span>}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-red-500 py-3">Nem sikerült betölteni az időpontokat. Kérlek próbáld újra.</p>
                  )}
                </div>
              )}
              <div>
                <Label className="text-[#4A3F35] text-sm font-medium">Megjegyzés</Label>
                <Textarea
                  value={changeNotes}
                  onChange={(e) => setChangeNotes(e.target.value)}
                  placeholder="Pl.: Csak délelőtt érek rá..."
                  rows={2}
                  className="mt-1.5 border-[#E8D4C0] focus:border-[#D4854A] text-sm"
                />
              </div>
              <p className="text-xs text-[#635241] bg-orange-50 border border-orange-100 p-3 rounded-lg">
                ℹ️ A módosítás <b>azonnal érvényes</b> – visszaigazolást küldünk emailben. Módosítás legkésőbb <b>24 órával korábban</b> kérhető.
              </p>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={closeModal} className="flex-1 border-[#E8D4C0]">
                  Mégsem
                </Button>
                <Button type="submit" disabled={isSubmitting || !newTime || isLoadingSlots} className="flex-1 bg-[#D4854A] hover:bg-[#B87333] text-white">
                  {isSubmitting ? 'Módosítás...' : 'Módosítás megerősítése'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Admin Page Component - Enhanced with Customer Management & P&L
export function AdminPage() {
  useSeo({
    title: `Admin | ${SITE_NAME}`,
    description: 'Admin felület – belső használatra.',
    canonical: `${SITE_URL}/admin`,
    noindex: true,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'addbooking' | 'bookings' | 'pending' | 'customers' | 'packages' | 'pnl' | 'cancel' | 'notify' | 'blockslot'>('dashboard');
  const [tabLoading, setTabLoading] = useState(false);
  const [tabLoadingLabel, setTabLoadingLabel] = useState('');
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    appointmentDate: '',
    appointmentTime: '',
    service: '',
    reason: '',
    newDate: '',
    newTime: ''
  });
  const [packageForm, setPackageForm] = useState({
    customerEmail: '',
    customerName: '',
    customerPhone: '',
    service: '',
    sessions: 12,
    originalPrice: 180000,
    depositPaid: 36000,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [pnlData, setPnlData] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [cancelSearch, setCancelSearch] = useState('');
  const [guestFilter, setGuestFilter] = useState('');
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [guestForm, setGuestForm] = useState({ name: '', email: '', phone: '' });
  const [isSavingGuest, setIsSavingGuest] = useState(false);
  const [deletingGuestId, setDeletingGuestId] = useState<string | null>(null);
  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const [customerProfile, setCustomerProfile] = useState<any>(null);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [allPackages, setAllPackages] = useState<any[]>([]);
  const ADMIN_TIME_SLOTS = ['08:30', '09:45', '11:00', '12:15', '13:30', '14:45', '16:00', '17:15', '18:30'];
  const ADMIN_BOOKING_SERVICES = [
    ...services.map((s) => ({ name: s.name, price: s.price })),
    { name: 'BEMER Kezelés (20 perc)', price: 7500 },
    { name: 'BEMER Kezelés (40 perc)', price: 15000 },
  ];
  const [addBookingForm, setAddBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    notes: '',
    sendConfirmationEmail: true,
  });
  const [addBookingSlots, setAddBookingSlots] = useState<Record<string, boolean> | null>(null);
  const [isLoadingAddBookingSlots, setIsLoadingAddBookingSlots] = useState(false);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const WEEKDAY_OPTIONS = [
    { value: 'MONDAY', label: 'Hétfő' },
    { value: 'TUESDAY', label: 'Kedd' },
    { value: 'WEDNESDAY', label: 'Szerda' },
    { value: 'THURSDAY', label: 'Csütörtök' },
    { value: 'FRIDAY', label: 'Péntek' },
    { value: 'SATURDAY', label: 'Szombat' },
    { value: 'SUNDAY', label: 'Vasárnap' },
  ];
  const EDINA_WEEKLY_PRESET = [
    { dayOfWeek: 'FRIDAY', startTime: '08:30', endTime: '10:30', label: 'Foglalt – heti' },
    { dayOfWeek: 'MONDAY', startTime: '08:30', endTime: '11:00', label: 'Foglalt – heti' },
    { dayOfWeek: 'THURSDAY', startTime: '11:00', endTime: '12:00', label: 'Foglalt – heti' },
    { dayOfWeek: 'THURSDAY', startTime: '17:00', endTime: '20:00', label: 'Foglalt – heti' },
  ];
  const [blockMode, setBlockMode] = useState<'single' | 'multi' | 'recurring'>('single');
  const [blockSlotForm, setBlockSlotForm] = useState({ date: '', time: '', label: '', duration: '75' });
  const [multiSlotForm, setMultiSlotForm] = useState({ date: '', times: [] as string[], label: '', duration: '75' });
  const [recurringBlocks, setRecurringBlocks] = useState(EDINA_WEEKLY_PRESET);
  const [recurringWeeks, setRecurringWeeks] = useState('52');
  const [isBlockingSlot, setIsBlockingSlot] = useState(false);
  const [blockedSlotStats, setBlockedSlotStats] = useState<{ future: number; total: number } | null>(null);
  const [deleteBlockLabel, setDeleteBlockLabel] = useState('Foglalt');
  const [isDeletingBlocks, setIsDeletingBlocks] = useState(false);

  const handleBlockSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBlockingSlot(true);
    try {
      const params = new URLSearchParams();
      params.append('action', 'blockSlot');
      params.append('date', blockSlotForm.date);
      params.append('time', blockSlotForm.time);
      params.append('label', blockSlotForm.label || 'Zárolt időpont');
      params.append('duration', blockSlotForm.duration);
      const res = await fetch(SCRIPT_URL, { method: 'POST', body: params });
      const result = await res.json();
      if (result.success) {
        toast.success('Időpont zárolva: ' + blockSlotForm.date + ' ' + blockSlotForm.time);
        setBlockSlotForm({ date: '', time: '', label: '', duration: '75' });
      } else {
        toast.error(result.message || 'Hiba a zárolás során');
      }
    } catch { toast.error('Hiba a zárolás során'); }
    finally { setIsBlockingSlot(false); }
  };

  const handleBlockMultipleSlots = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!multiSlotForm.times.length) {
      toast.error('Válassz legalább egy időpontot!');
      return;
    }
    setIsBlockingSlot(true);
    try {
      const params = new URLSearchParams();
      params.append('action', 'blockMultipleSlots');
      params.append('date', multiSlotForm.date);
      params.append('times', JSON.stringify(multiSlotForm.times));
      params.append('label', multiSlotForm.label || 'Zárolt időpont');
      params.append('duration', multiSlotForm.duration);
      const res = await fetch(SCRIPT_URL, { method: 'POST', body: params });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message || 'Időpontok zárolva');
        setMultiSlotForm({ date: '', times: [], label: '', duration: '75' });
      } else {
        toast.error(result.message || 'Hiba a zárolás során');
      }
    } catch { toast.error('Hiba a zárolás során'); }
    finally { setIsBlockingSlot(false); }
  };

  const handleBlockRecurringSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recurringBlocks.length) {
      toast.error('Adj meg legalább egy heti zárolást!');
      return;
    }
    setIsBlockingSlot(true);
    try {
      const params = new URLSearchParams();
      params.append('action', 'blockRecurringSchedule');
      params.append('blocks', JSON.stringify(recurringBlocks));
      params.append('weeks', recurringWeeks);
      const res = await fetch(SCRIPT_URL, { method: 'POST', body: params });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message || 'Heti zárolások létrehozva', { duration: 6000 });
      } else {
        toast.error(result.message || 'Hiba a zárolás során');
      }
    } catch { toast.error('Hiba a zárolás során'); }
    finally { setIsBlockingSlot(false); }
  };

  const loadBlockedSlotStats = async (label = deleteBlockLabel) => {
    try {
      const params = new URLSearchParams();
      params.append('action', 'countBlockedSlots');
      params.append('futureOnly', 'true');
      if (label.trim()) params.append('label', label.trim());
      const res = await fetch(SCRIPT_URL, { method: 'POST', body: params });
      const result = await res.json();
      if (result.success && result.data) {
        setBlockedSlotStats({ future: result.data.future || 0, total: result.data.total || 0 });
      }
    } catch {
      setBlockedSlotStats(null);
    }
  };

  const handleDeleteBlockedSlots = async (options: { allFuture?: boolean; labelOnly?: boolean }) => {
    const label = options.labelOnly ? deleteBlockLabel.trim() : '';
    const countHint = blockedSlotStats?.future ?? '?';
    const msg = options.labelOnly
      ? `Törlöd az összes jövőbeli 🔒 zárolást, ami tartalmazza: "${label}"?\n\nKb. ${countHint} esemény.`
      : `Törlöd az ÖSSZES jövőbeli 🔒 zárolást a naptárból?\n\nKb. ${countHint} esemény.`;
    if (!confirm(msg)) return;

    setIsDeletingBlocks(true);
    try {
      const params = new URLSearchParams();
      params.append('action', 'deleteBlockedSlots');
      params.append('futureOnly', 'true');
      if (label) params.append('label', label);
      const res = await fetch(SCRIPT_URL, { method: 'POST', body: params });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message || 'Zárolások törölve');
        await loadBlockedSlotStats(label);
      } else {
        toast.error(result.message || 'Hiba a törlés során');
      }
    } catch {
      toast.error('Hiba a törlés során');
    } finally {
      setIsDeletingBlocks(false);
    }
  };

  const toggleMultiSlotTime = (time: string) => {
    setMultiSlotForm((prev) => ({
      ...prev,
      times: prev.times.includes(time)
        ? prev.times.filter((t) => t !== time)
        : [...prev.times, time].sort(),
    }));
  };

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Edina2025!';

  useEffect(() => {
    const restoreSession = async () => {
      if (hasValidAdminSession(ADMIN_PASSWORD)) {
        setIsAuthenticated(true);
        setTabLoading(true);
        setTabLoadingLabel('Áttekintés betöltése…');
        try {
          await loadAdminBundle();
        } finally {
          setTabLoading(false);
          setTabLoadingLabel('');
        }
      }
      setIsRestoringSession(false);
    };
    restoreSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      saveAdminSession(ADMIN_PASSWORD);
      setIsAuthenticated(true);
      setPassword('');
      toast.success('Sikeres bejelentkezés!');
      setTabLoading(true);
      setTabLoadingLabel('Áttekintés betöltése…');
      try {
        await loadAdminBundle();
      } finally {
        setTabLoading(false);
        setTabLoadingLabel('');
      }
    } else {
      toast.error('Hibás jelszó!');
    }
  };

  const applyAdminBundleData = (bundle: {
    dashboard?: any;
    bookings?: any[];
    pending?: any[];
  }) => {
    if (bundle.dashboard) {
      setDashboardData(bundle.dashboard);
      setPendingCount(bundle.dashboard.pendingCount ?? bundle.pending?.length ?? 0);
    }
    const phoneByEmail = buildPhoneByEmail([
      ...(bundle.pending || []),
      ...(bundle.bookings || []),
    ]);
    if (bundle.bookings) {
      const bookings = enrichBookingsWithPhones(bundle.bookings, phoneByEmail);
      setAllBookings(bookings);
      setAllCustomers((prev) => enrichCustomersWithBookings(prev, bookings));
    }
    if (bundle.pending) {
      setPendingBookings(bundle.pending);
      if (!bundle.dashboard) setPendingCount(bundle.pending.length);
    }
  };

  const loadAdminBundle = async (force = false) => {
    try {
      const today = getTodayInBudapest();
      const response = await fetch(
        `${SCRIPT_URL}?action=adminBundle&today=${today}${force ? '&force=1' : ''}`
      );
      const data = await response.json();
      if (data.success) {
        applyAdminBundleData(data.data || {});
      }
    } catch (error) {
      console.error('Error loading admin bundle:', error);
    }
  };

  const loadDashboardData = async () => {
    try {
      const today = getTodayInBudapest();
      const response = await fetch(`${SCRIPT_URL}?action=dashboard&today=${today}`);
      const data = await response.json();
      if (data.success) {
        setDashboardData(data.data);
        setPendingCount(data.data?.pendingCount ?? pendingCount);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const runWithTabLoading = async (label: string, task: () => Promise<void>) => {
    if (tabLoading) return;
    setTabLoading(true);
    setTabLoadingLabel(label);
    try {
      await task();
    } finally {
      setTabLoading(false);
      setTabLoadingLabel('');
    }
  };

  const switchTab = async (tabId: typeof activeTab) => {
    if (tabLoading) return;
    setActiveTab(tabId);

    const loaders: Partial<Record<typeof activeTab, { label: string; run: () => Promise<void> }>> = {
      dashboard: { label: 'Áttekintés betöltése…', run: () => loadAdminBundle() },
      bookings: {
        label: 'Foglalások betöltése…',
        run: async () => {
          if (allBookings.length === 0) await loadAllBookings();
        },
      },
      pending: { label: 'Függő foglalások betöltése…', run: () => loadPendingBookings() },
      customers: { label: 'Vendégek betöltése…', run: loadAllCustomers },
      packages: { label: 'Bérletek betöltése…', run: loadAllPackages },
      pnl: { label: 'Bevétel betöltése…', run: () => loadPnLData() },
      cancel: {
        label: 'Foglalások betöltése…',
        run: async () => {
          if (allBookings.length === 0) await loadAllBookings();
        },
      },
      blockslot: {
        label: 'Zárolások betöltése…',
        run: async () => { await loadBlockedSlotStats(); },
      },
    };

    const loader = loaders[tabId];
    if (!loader) return;

    setTabLoading(true);
    setTabLoadingLabel(loader.label);
    try {
      await loader.run();
    } finally {
      setTabLoading(false);
      setTabLoadingLabel('');
    }
  };

  const loadPnLData = async (month = selectedMonth, year = selectedYear) => {
    try {
      const url = `${SCRIPT_URL}?action=pnl&mode=month&month=${month}&year=${year}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) setPnlData(data.data);
    } catch (error) {
      console.error('Error loading P&L:', error);
    }
  };

  const loadAllBookings = async () => {
    try {
      const bookingsRes = await fetch(`${SCRIPT_URL}?action=allBookings`);
      const data = await bookingsRes.json();
      if (data.success) {
        const phoneByEmail = buildPhoneByEmail([
          ...pendingBookings,
          ...(data.data?.bookings || []),
        ]);
        const bookings = enrichBookingsWithPhones(data.data.bookings || [], phoneByEmail);
        setAllBookings(bookings);
        setAllCustomers((prev) => enrichCustomersWithBookings(prev, bookings));
        if (customerProfile?.customer?.email) {
          const email = String(customerProfile.customer.email).toLowerCase();
          const upcoming = bookings.filter(
            (b: any) =>
              String(b.customerEmail || '').toLowerCase() === email &&
              isActiveBookingStatus(b.status) &&
              isBookingUpcoming(b.date, b.time)
          );
          upcoming.sort((a: any, b: any) => String(a.date).localeCompare(String(b.date)));
          const next = upcoming[0];
          setCustomerProfile((prev: any) =>
            prev
              ? {
                  ...prev,
                  customer: {
                    ...prev.customer,
                    phone: prev.customer?.phone || phoneByEmail[email] || '',
                    activeBookings: upcoming.length,
                    nextBookingDate: next?.date || '',
                    nextBookingTime: next?.time || '',
                  },
                }
              : prev
          );
        }
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const loadPendingBookings = async (force = false) => {
    try {
      const response = await fetch(
        `${SCRIPT_URL}?action=pendingBookings${force ? '&force=1' : ''}`
      );
      const data = await response.json();
      if (data.success) {
        const bookings = data.data.bookings || [];
        setPendingBookings(bookings);
        setPendingCount(bookings.length);
      }
    } catch (error) {
      console.error('Error loading pending bookings:', error);
    }
  };

  const [pendingCount, setPendingCount] = useState(0);
  const [confirmingReference, setConfirmingReference] = useState<string | null>(null);
  const [confirmedReferences, setConfirmedReferences] = useState<Set<string>>(new Set());
  const [deletingPendingKey, setDeletingPendingKey] = useState<string | null>(null);
  const [deletingBookingId, setDeletingBookingId] = useState<string | null>(null);


  useEffect(() => {
    if (!isAuthenticated) return;
    if (activeTab !== 'dashboard' && activeTab !== 'pending') return;
    const interval = setInterval(() => {
      loadPendingBookings();
    }, 120000);
    return () => clearInterval(interval);
  }, [isAuthenticated, activeTab]);

  const confirmBankTransfer = async (referenceId: string, customerName: string) => {
    if (!referenceId || confirmedReferences.has(referenceId)) return;
    if (!confirm(`Megerősíted, hogy megérkezett a banki átutalás?\n\nÜgyfél: ${customerName}\nKözlemény: ${referenceId}\n\nEz létrehozza a naptárbejegyzést és elküldi a visszaigazoló emailt.`)) {
      return;
    }
    setConfirmingReference(referenceId);
    try {
      const result = await callScriptAction('confirmBankTransfer', { referenceId });
      if (result.success) {
        setConfirmedReferences((prev) => new Set(prev).add(referenceId));
        setPendingBookings((prev) => prev.filter((b) => b.referenceId !== referenceId));
        setPendingCount((prev) => Math.max(0, prev - 1));
        toast.success('Befizetés megerősítve! Foglalás létrehozva és email elküldve.');
        loadPendingBookings();
        loadAllBookings();
        loadDashboardData();
      } else {
        toast.error(result.message || 'Hiba a megerősítés során');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Hiba a megerősítés során. Próbáld újra!');
    } finally {
      setConfirmingReference(null);
    }
  };

  const deletePendingBooking = async (booking: { rowIndex?: number; referenceId?: string; name: string }) => {
    const key = String(booking.rowIndex || booking.referenceId || '');
    if (!key) return;
    if (!confirm(`Törlöd ezt a függő foglalást?\n\nÜgyfél: ${booking.name}\n\nEz felszabadítja az időpontot, de nem küld emailt.`)) {
      return;
    }
    setDeletingPendingKey(key);
    try {
      const result = await callScriptAction('adminDeletePending', {
        rowIndex: booking.rowIndex,
        referenceId: booking.referenceId,
      });
      if (result.success) {
        setPendingBookings((prev) => prev.filter((b) => b.rowIndex !== booking.rowIndex && b.referenceId !== booking.referenceId));
        setPendingCount((prev) => Math.max(0, prev - 1));
        toast.success('Függő foglalás törölve.');
        loadPendingBookings();
      } else {
        toast.error(result.message || 'Hiba a törlés során');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Hiba a törlés során');
    } finally {
      setDeletingPendingKey(null);
    }
  };

  const deleteBooking = async (booking: { bookingId: string; customerName: string; date?: string; time?: string; service?: string }) => {
    if (!booking.bookingId) return;
    const when = [formatBookingDate(booking.date), formatBookingTime(booking.time)].filter((v) => v !== '–').join(' ');
    if (!confirm(`Törlöd ezt a foglalást?\n\nÜgyfél: ${booking.customerName}${when ? `\nIdőpont: ${when}` : ''}\n\nA naptárbejegyzés is törlődik.`)) {
      return;
    }
    setDeletingBookingId(booking.bookingId);
    try {
      const result = await callScriptAction('adminDeleteBooking', { bookingId: booking.bookingId });
      if (result.success) {
        setAllBookings((prev) =>
          prev.map((b) => (b.bookingId === booking.bookingId ? { ...b, status: 'Cancelled' } : b))
        );
        toast.success('Foglalás törölve.');
        loadAllBookings();
        loadDashboardData();
        loadPnLData();
      } else {
        toast.error(result.message || 'Hiba a törlés során');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Hiba a törlés során');
    } finally {
      setDeletingBookingId(null);
    }
  };

  const getPendingStatusLabel = (booking: { status: string; paymentMethod?: string }) => {
    if (booking.status === 'awaiting_bank_transfer') return '🏦 Átutalásra vár';
    if (booking.status === 'paid') return '✓ Stripe fizetve';
    if (booking.paymentMethod === 'bank_transfer') return '🏦 Banki átutalás';
    return '⏳ Stripe függőben';
  };

  const loadAllPackages = async () => {
    try {
      const response = await fetch(`${SCRIPT_URL}?action=allPackages`);
      const data = await response.json();
      if (data.success) {
        setAllPackages(data.data?.packages || []);
      } else {
        toast.error('Bérletek betöltése sikertelen: ' + (data.message || 'Kérjük frissítsd az oldalt'));
      }
    } catch (error) {
      console.error('Error loading packages:', error);
      toast.error('Bérletek betöltése sikertelen. Ellenőrizd a kapcsolatot és próbáld újra.');
    }
  };

  const handleUseSession = async (packageId: string, customerName: string) => {
    if (!confirm(`Biztosan levonsz 1 alkalmat? Vásárló: ${customerName}`)) return;
    try {
      const params = new URLSearchParams();
      params.append('action', 'useSession');
      params.append('packageId', packageId);
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: params
      });
      const result = await response.json();
      if (result.success) {
        toast.success(`Alkalom felhasználva! Maradék: ${result.data?.sessionsRemaining ?? '?'} alkalom`);
        loadAllPackages();
        loadDashboardData();
      } else {
        toast.error(result.message || 'Hiba történt');
      }
    } catch (error) {
      toast.error('Hiba az alkalom felhasználása során');
    }
  };

  const loadAllCustomers = async () => {
    try {
      let bookings = allBookings;
      if (bookings.length === 0) {
        const bookingsRes = await fetch(`${SCRIPT_URL}?action=allBookings`);
        const bookingsData = await bookingsRes.json();
        if (bookingsData.success) {
          const phoneByEmail = buildPhoneByEmail([
            ...pendingBookings,
            ...(bookingsData.data?.bookings || []),
          ]);
          bookings = enrichBookingsWithPhones(bookingsData.data?.bookings || [], phoneByEmail);
          setAllBookings(bookings);
        }
      }
      const customersRes = await fetch(`${SCRIPT_URL}?action=allCustomers`);
      const data = await customersRes.json();
      if (data.success) {
        const phoneByEmail = buildPhoneByEmail([
          ...pendingBookings,
          ...bookings,
        ]);
        const customers = (data.data?.customers || []).map((customer: any) => ({
          ...customer,
          phone: customer.phone || phoneByEmail[String(customer.email || '').toLowerCase()] || '',
        }));
        setAllCustomers(enrichCustomersWithBookings(customers, bookings));
      }
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const openGuestProfile = async (email: string) => {
    if (!email) return;
    try {
      const response = await fetch(`${SCRIPT_URL}?action=customer&email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (data.success) {
        const profile = data.data;
        const email = String(profile?.customer?.email || '').toLowerCase();
        const phoneByEmail = buildPhoneByEmail([
          ...pendingBookings,
          ...allBookings,
          { email: profile?.customer?.email, phone: profile?.customer?.phone },
        ]);
        const bookings = enrichCustomersWithBookings(
          [{ email: profile?.customer?.email, ...profile?.customer }],
          allBookings
        )[0];
        setCustomerProfile({
          ...profile,
          customer: {
            ...profile.customer,
            phone: profile.customer?.phone || phoneByEmail[email] || '',
            activeBookings: bookings.activeBookings,
            nextBookingDate: bookings.nextBookingDate,
            nextBookingTime: bookings.nextBookingTime,
          },
        });
      } else {
        toast.error('Vendég nem található');
      }
    } catch {
      toast.error('Hiba a vendég betöltésekor');
    }
  };

  const loadAddBookingSlots = async (date: string) => {
    if (!date) {
      setAddBookingSlots(null);
      return;
    }
    setIsLoadingAddBookingSlots(true);
    setAddBookingForm((prev) => ({ ...prev, time: '' }));
    try {
      const res = await fetch(`${SCRIPT_URL}?action=getSlotsForDate&date=${date}`);
      const data = await res.json();
      if (data.success && data.data?.slots) setAddBookingSlots(data.data.slots);
      else setAddBookingSlots(null);
    } catch {
      setAddBookingSlots(null);
    } finally {
      setIsLoadingAddBookingSlots(false);
    }
  };

  const resetAddBookingForm = () => {
    setAddBookingForm({
      name: '',
      email: '',
      phone: '',
      service: '',
      date: '',
      time: '',
      notes: '',
      sendConfirmationEmail: true,
    });
    setAddBookingSlots(null);
  };

  const handleCreateAdminBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addBookingForm.time) {
      toast.error('Kérlek válassz egy szabad időpontot!');
      return;
    }
    setIsCreatingBooking(true);
    try {
      const result = await callScriptAction('adminCreateBooking', {
        name: addBookingForm.name,
        email: addBookingForm.email,
        phone: addBookingForm.phone || '',
        service: addBookingForm.service,
        date: addBookingForm.date,
        time: addBookingForm.time,
        notes: addBookingForm.notes || '',
        sendConfirmationEmail: addBookingForm.sendConfirmationEmail ? 'true' : 'false',
      });
      if (result.success) {
        toast.success(
          addBookingForm.sendConfirmationEmail
            ? 'Foglalás rögzítve – visszaigazoló email elküldve.'
            : 'Foglalás rögzítve (email nélkül).'
        );
        resetAddBookingForm();
        await loadAdminBundle(true);
        if (allBookings.length > 0) await loadAllBookings();
      } else {
        toast.error(result.message || 'Hiba a foglalás rögzítésekor');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Hiba a foglalás rögzítésekor');
    } finally {
      setIsCreatingBooking(false);
    }
  };

  const handleCreateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGuest(true);
    try {
      const result = await callScriptAction('adminCreateCustomer', {
        name: guestForm.name,
        email: guestForm.email,
        phone: guestForm.phone,
      });
      if (result.success) {
        toast.success('Vendég hozzáadva');
        setGuestForm({ name: '', email: '', phone: '' });
        setShowAddGuest(false);
        loadAllCustomers();
        loadDashboardData();
      } else {
        toast.error(result.message || 'Hiba a vendég létrehozásakor');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Hiba a vendég létrehozásakor');
    } finally {
      setIsSavingGuest(false);
    }
  };

  const deleteGuest = async (guest: { customerId?: string; email?: string; name?: string }) => {
    if (!confirm(`Biztosan törlöd ezt a vendéget?\n\n${guest.name || ''}`)) return;
    setDeletingGuestId(guest.customerId || guest.email || null);
    try {
      const result = await callScriptAction('adminDeleteCustomer', {
        customerId: guest.customerId,
        email: guest.email,
      });
      if (result.success) {
        toast.success('Vendég törölve');
        if (customerProfile?.customer?.email === guest.email) {
          setCustomerProfile(null);
        }
        loadAllCustomers();
        loadDashboardData();
      } else {
        toast.error(result.message || 'Hiba a törlés során');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Hiba a törlés során');
    } finally {
      setDeletingGuestId(null);
    }
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const params = new URLSearchParams();
      params.append('action', 'purchasePackage');
      params.append('email', packageForm.customerEmail);
      params.append('name', packageForm.customerName);
      params.append('phone', packageForm.customerPhone);
      params.append('service', packageForm.service);
      params.append('sessions', String(packageForm.sessions));
      params.append('originalPrice', String(packageForm.originalPrice));
      params.append('depositPaid', String(packageForm.depositPaid));
      params.append('notes', packageForm.notes);
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: params
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Bérlet sikeresen létrehozva!');
        setPackageForm({
          customerEmail: '',
          customerName: '',
          customerPhone: '',
          service: '',
          sessions: 12,
          originalPrice: 180000,
          depositPaid: 36000,
          notes: ''
        });
        loadDashboardData();
      } else {
        toast.error(data.message || 'Hiba történt');
      }
    } catch (error) {
      toast.error('Hiba a bérlet létrehozása során');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const params = new URLSearchParams();
      params.append('action', 'cancel');
      params.append('clientName', formData.clientName);
      params.append('clientEmail', formData.clientEmail);
      params.append('appointmentDate', formData.appointmentDate);
      params.append('appointmentTime', formData.appointmentTime);
      params.append('service', formData.service);
      params.append('reason', formData.reason);
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: params
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Hiba a lemondás küldésekor');

      toast.success('Lemondási értesítés elküldve!');
      setFormData({
        clientName: '',
        clientEmail: '',
        appointmentDate: '',
        appointmentTime: '',
        service: '',
        reason: '',
        newDate: '',
        newTime: ''
      });
    } catch (error) {
      toast.error('Hiba történt az értesítés küldése közben.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotifyChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const params = new URLSearchParams();
      params.append('action', 'change');
      params.append('clientName', formData.clientName);
      params.append('clientEmail', formData.clientEmail);
      params.append('appointmentDate', formData.appointmentDate);
      params.append('appointmentTime', formData.appointmentTime);
      params.append('service', formData.service);
      params.append('newDate', formData.newDate);
      params.append('newTime', formData.newTime);
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: params
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Hiba a módosítás küldésekor');

      toast.success('Módosítási értesítés elküldve!');
      setFormData({
        clientName: '',
        clientEmail: '',
        appointmentDate: '',
        appointmentTime: '',
        service: '',
        reason: '',
        newDate: '',
        newTime: ''
      });
    } catch (error) {
      toast.error('Hiba történt az értesítés küldése közben.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate discount for package form
  const getPackageDiscount = () => {
    const count = packageForm.sessions;
    if (count >= 6) return 15;
    if (count >= 4) return 10;
    if (count >= 2) return 5;
    return 0;
  };

  const getPackageFinalPrice = () => {
    const discount = getPackageDiscount();
    return Math.round(packageForm.originalPrice * (1 - discount / 100));
  };

  const upcomingActiveBookings = allBookings
    .filter((b: any) => isActiveBookingStatus(b.status) && isBookingUpcoming(b.date, b.time))
    .sort((a: any, b: any) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  const historyBookings = allBookings
    .filter((b: any) => !(isActiveBookingStatus(b.status) && isBookingUpcoming(b.date, b.time)))
    .sort((a: any, b: any) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

  const renderBookingsTable = (bookings: any[], emptyMessage: string) => {
    if (bookings.length === 0) {
      return <div className="p-8 text-center text-[#635241]">{emptyMessage}</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F9F1EA]">
            <tr>
              {['Név', 'Email', 'Telefon', 'Kezelés', 'Dátum', 'Időpont', 'Státusz', 'Létrehozva', 'Művelet'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[#4A3F35] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((b: any, i: number) => (
              <tr key={`${b.bookingId || i}-${b.date}-${b.time}`} className="border-t border-[#F5E6D8] hover:bg-[#FFFBF7]">
                <td className="px-4 py-3 font-medium text-[#4A3F35]">{b.customerName}</td>
                <td className="px-4 py-3 text-[#635241] text-xs break-all">{b.customerEmail || '–'}</td>
                <td className="px-4 py-3 text-xs">
                  <PhoneLink phone={b.customerPhone} />
                </td>
                <td className="px-4 py-3 text-[#635241]">{b.service}</td>
                <td className="px-4 py-3 text-[#635241] whitespace-nowrap">{formatBookingDate(b.date)}</td>
                <td className="px-4 py-3 text-[#635241] whitespace-nowrap">{formatBookingTime(b.time)}</td>
                <td className="px-4 py-3">
                  {(() => {
                    const display = getBookingStatusDisplay(b.status, b.date, b.time);
                    return (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${display.className}`}>
                        {display.label}
                      </span>
                    );
                  })()}
                </td>
                <td className="px-4 py-3 text-[#635241] text-xs whitespace-nowrap">{formatBookingDate(b.createdDate)}</td>
                <td className="px-4 py-3">
                  {isActiveBookingStatus(b.status) && isBookingUpcoming(b.date, b.time) ? (
                    <button
                      type="button"
                      onClick={() => deleteBooking({
                        bookingId: b.bookingId,
                        customerName: b.customerName,
                        date: b.date,
                        time: b.time,
                        service: b.service,
                      })}
                      disabled={deletingBookingId === b.bookingId}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold disabled:opacity-50 whitespace-nowrap"
                    >
                      {deletingBookingId === b.bookingId ? 'Törlés...' : '🗑 Törlés'}
                    </button>
                  ) : (
                    <span className="text-xs text-[#B5A08A]">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (isRestoringSession) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F1EA] to-[#FFFBF7] flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-[#D4854A]/30 border-t-[#D4854A] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F1EA] to-[#FFFBF7] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-warm-lg p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#D4854A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#D4854A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#4A3F35]">Admin Bejelentkezés</h1>
            <p className="text-[#635241] mt-2">Dunakeszi Masszázs - Angyali Szalon</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="admin-password" className="text-[#4A3F35]">Jelszó</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Add meg a jelszót"
                className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#D4854A] hover:bg-[#B87333] text-white py-3 rounded-xl font-medium"
            >
              Bejelentkezés
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" onClick={() => window.location.hash = ''} className="text-[#635241] hover:text-[#D4854A] text-sm">
              ← Vissza a főoldalra
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F1EA] to-[#FFFBF7]">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D4854A]/10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-[#D4854A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#4A3F35]">Admin Felület</h1>
              <p className="text-sm text-[#635241]">Dunakeszi Masszázs - Angyali Szalon</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://calendar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#8B9A7C]/10 text-[#8B9A7C] rounded-lg hover:bg-[#8B9A7C]/20 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Google Naptár</span>
            </a>
            <button
              type="button"
              onClick={() => {
                clearAdminSession();
                setIsAuthenticated(false);
                toast.success('Kijelentkezve');
              }}
              className="text-[#635241] hover:text-[#D4854A]"
            >
              Kijelentkezés
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-[#E8D4C0]">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Áttekintés', icon: '📊' },
              { id: 'addbooking', label: 'Új foglalás', icon: '➕' },
              { id: 'bookings', label: 'Foglálások', icon: '📅' },
              { id: 'pending', label: 'Függőben', icon: '⏳' },
              { id: 'customers', label: 'Vendégek', icon: '👥' },
              { id: 'packages', label: 'Bérletek', icon: '🎫' },
              { id: 'pnl', label: 'P&L', icon: '💰' },
              { id: 'cancel', label: 'Lemondás', icon: '❌' },
              { id: 'notify', label: 'Módosítás', icon: '📝' },
              { id: 'blockslot', label: 'Zárolás', icon: '🔒' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                disabled={tabLoading}
                onClick={() => switchTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors disabled:opacity-60 ${activeTab === tab.id
                  ? 'text-[#D4854A] border-b-2 border-[#D4854A]'
                  : 'text-[#635241] hover:text-[#4A3F35]'
                  }`}
              >
                <span>{tab.icon}</span>
                <span className="relative inline-flex items-center gap-1.5">
                  {tab.label}
                  {tab.id === 'pending' && pendingCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[10px] font-bold text-white bg-[#D4854A] rounded-full leading-none">
                      {pendingCount > 99 ? '99+' : pendingCount}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </nav>
        </div>
        <AdminTabLoader active={tabLoading} label={tabLoadingLabel} />
      </div>

      {/* Main Content */}
      <main className={`max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-opacity duration-200 ${tabLoading ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (() => {
          const monthlyDeposits = Math.max(0, Number(dashboardData?.monthlyPnL?.depositsReceived ?? dashboardData?.monthlyPnL?.totalIncome ?? 0));
          const monthlyBookings = dashboardData?.monthlyPnL?.activeBookings ?? dashboardData?.monthlyPnL?.sessionsCompleted ?? 0;
          const expectedRevenue = Math.max(0, Number(dashboardData?.monthlyPnL?.estimatedFullRevenue ?? 0));
          const todayStr = getTodayInBudapest();
          const todayLabel = new Date().toLocaleDateString('hu-HU', { timeZone: 'Europe/Budapest', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
          const normalizeBookingDay = (dateVal: unknown) => {
            if (!dateVal) return '';
            const s = String(dateVal);
            if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
            if (s.includes('T')) {
              return new Date(s).toLocaleDateString('sv-SE', { timeZone: 'Europe/Budapest' });
            }
            return s.slice(0, 10);
          };
          const todaysBookingsList = (() => {
            const apiToday = dashboardData?.todaysBookings || [];
            const fromUpcoming = (dashboardData?.upcomingBookings || []).filter((b: { date?: string }) =>
              normalizeBookingDay(b.date) === todayStr
            );
            const merged = [...apiToday, ...fromUpcoming];
            const seen = new Set<string>();
            return merged.filter((b: { customer?: string; time?: string }) => {
              const key = `${b.customer}|${b.time}`;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });
          })();

          return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#4A3F35]">Áttekintés</h2>
                <p className="text-sm text-[#635241] mt-1 capitalize">{todayLabel}</p>
              </div>
              <button
                type="button"
                disabled={tabLoading}
                onClick={() => runWithTabLoading('Frissítés…', () => loadAdminBundle(true))}
                className="px-4 py-2 bg-[#D4854A] hover:bg-[#B87333] text-white rounded-lg text-sm font-medium self-start disabled:opacity-60"
              >
                Frissítés
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-gradient-to-br from-[#D4854A] to-[#B87333] rounded-2xl p-6 sm:p-8 text-white shadow-warm-lg">
                <p className="text-white/80 text-sm mb-1">Beérkezett foglalók · {new Date().toLocaleDateString('hu-HU', { month: 'long', year: 'numeric' })}</p>
                <p className="text-4xl sm:text-5xl font-bold tracking-tight">{monthlyDeposits.toLocaleString('hu-HU')} Ft</p>
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
                  <div>
                    <p className="text-white/70 text-xs">Aktív foglalás (hónap)</p>
                    <p className="text-2xl font-bold mt-1">{monthlyBookings}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-xs">Várható bevétel</p>
                    <p className="text-2xl font-bold mt-1">{expectedRevenue.toLocaleString('hu-HU')} Ft</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-xs">Függőben</p>
                    <p className="text-2xl font-bold mt-1">{dashboardData?.pendingCount ?? pendingCount}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Vendégek', value: dashboardData?.customerCount || 0, icon: <User className="w-5 h-5 text-[#8B9A7C]" />, bg: 'bg-[#8B9A7C]/10' },
                  { label: 'Aktív foglalás', value: dashboardData?.activeBookingsTotal || 0, icon: <Calendar className="w-5 h-5 text-[#D4854A]" />, bg: 'bg-[#D4854A]/10' },
                  { label: 'Bérletek', value: dashboardData?.activePackages || 0, icon: <CreditCard className="w-5 h-5 text-[#4A7C59]" />, bg: 'bg-[#4A7C59]/10' },
                  { label: 'Alkalmak', value: dashboardData?.totalSessionsRemaining || 0, icon: <Sparkles className="w-5 h-5 text-[#635241]" />, bg: 'bg-[#F5E6D8]' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-warm border border-[#E8D4C0]/50">
                    <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                      {stat.icon}
                    </div>
                    <p className="text-[#635241] text-xs">{stat.label}</p>
                    <p className="text-2xl font-bold text-[#4A3F35] mt-0.5">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-warm p-6 border border-[#E8D4C0]/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#4A3F35]">Mai foglalások</h3>
                  <span className="text-xs font-medium text-[#D4854A] bg-[#D4854A]/10 px-2.5 py-1 rounded-full">
                    {todaysBookingsList.length} db
                  </span>
                </div>
                {todaysBookingsList.length > 0 ? (
                  <div className="space-y-3">
                    {todaysBookingsList.map((booking: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-[#FFF8F2] border border-[#F5E6D8] rounded-xl">
                        <div>
                          <p className="font-semibold text-[#4A3F35]">{booking.customer}</p>
                          <p className="text-sm text-[#635241] mt-0.5">{booking.service}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 text-[#D4854A] font-semibold">
                            <Clock className="w-4 h-4" />
                            {formatBookingTime(booking.time)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 px-4 bg-[#FFFBF7] rounded-xl border border-dashed border-[#E8D4C0]">
                    <Calendar className="w-10 h-10 text-[#D4854A]/40 mx-auto mb-3" />
                    <p className="text-[#4A3F35] font-medium">Ma nincs foglalás</p>
                    <p className="text-sm text-[#635241] mt-1">Szabad nap — pihenj vagy foglalj be magadnak időt!</p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-warm p-6 border border-[#E8D4C0]/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#4A3F35]">Következő foglalások</h3>
                  <button
                    type="button"
                    onClick={() => switchTab('bookings')}
                    className="text-xs text-[#D4854A] hover:underline font-medium"
                  >
                    Összes →
                  </button>
                </div>
                {dashboardData?.upcomingBookings?.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.upcomingBookings.map((booking: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-[#FFFBF7] border border-[#F5E6D8] rounded-xl">
                        <div className="min-w-0">
                          <p className="font-semibold text-[#4A3F35] truncate">{booking.customer}</p>
                          <p className="text-sm text-[#635241] truncate">{booking.service}</p>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <p className="text-sm font-medium text-[#4A3F35]">{formatBookingDate(booking.date)}</p>
                          <p className="text-sm text-[#D4854A] font-semibold">{formatBookingTime(booking.time)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 px-4 bg-[#FFFBF7] rounded-xl border border-dashed border-[#E8D4C0]">
                    <p className="text-[#635241]">Nincs közelgő foglalás</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { href: 'https://calendar.google.com', external: true, icon: <Calendar className="w-6 h-6 text-[#8B9A7C]" />, bg: 'bg-[#8B9A7C]/10', title: 'Google Naptár', desc: 'Foglalások kezelése' },
                { href: 'https://mail.google.com/mail/u/0/#inbox', external: true, icon: <Mail className="w-6 h-6 text-[#D4854A]" />, bg: 'bg-[#D4854A]/10', title: 'Gmail', desc: 'Bejövő levelek megnyitása' },
                { href: '/', external: false, onClick: () => { window.location.hash = ''; }, icon: (
                  <svg className="w-6 h-6 text-[#4A3F35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                ), bg: 'bg-[#4A3F35]/10', title: 'Weboldal', desc: 'Vissza a főoldalra' },
              ].map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  onClick={link.onClick}
                  className="group bg-white rounded-2xl p-5 shadow-warm border border-[#E8D4C0]/50 hover:border-[#D4854A]/40 hover:shadow-warm-lg transition-all flex items-center gap-4"
                >
                  <div className={`w-12 h-12 ${link.bg} rounded-xl flex items-center justify-center shrink-0`}>
                    {link.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#4A3F35] group-hover:text-[#D4854A] transition-colors">{link.title}</h3>
                    <p className="text-sm text-[#635241]">{link.desc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#D4854A]/0 group-hover:text-[#D4854A] transition-colors shrink-0" />
                </a>
              ))}
            </div>
          </div>
          );
        })()}

        {/* ADD BOOKING TAB */}
        {activeTab === 'addbooking' && (() => {
          const today = getTodayInBudapest();
          const minBookingDate = today;
          const maxBookingDate = addMonthsToDateStr(today, BOOKING_MAX_MONTHS_AHEAD);

          return (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#4A3F35]">Új foglalás</h2>
                <p className="text-sm text-[#635241] mt-1">
                  Ugyanaz az időpont-választó, mint a weboldalon – fizetés nélkül, közvetlenül a naptárba kerül.
                </p>
              </div>

              <form onSubmit={handleCreateAdminBooking} className="bg-white rounded-2xl shadow-warm-lg p-6 sm:p-8 space-y-6 border border-[#E8D4C0]/60">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Vendég neve *</Label>
                    <Input
                      value={addBookingForm.name}
                      onChange={(e) => setAddBookingForm({ ...addBookingForm, name: e.target.value })}
                      placeholder="Pl.: Kovács Anna"
                      required
                      className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Telefonszám</Label>
                    <Input
                      type="tel"
                      value={addBookingForm.phone}
                      onChange={(e) => setAddBookingForm({ ...addBookingForm, phone: e.target.value })}
                      placeholder="+36 30 123 4567"
                      className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[#4A3F35]">Email cím *</Label>
                    <Input
                      type="email"
                      value={addBookingForm.email}
                      onChange={(e) => setAddBookingForm({ ...addBookingForm, email: e.target.value })}
                      placeholder="anna@pelda.hu"
                      required
                      className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[#4A3F35]">Kezelés *</Label>
                    <select
                      value={addBookingForm.service}
                      onChange={(e) => setAddBookingForm({ ...addBookingForm, service: e.target.value })}
                      required
                      className="w-full h-10 pl-3 pr-10 border border-[#E8D4C0] rounded-md focus:border-[#D4854A] focus:ring-1 focus:ring-[#D4854A] bg-white text-[#4A3F35] cursor-pointer text-sm"
                    >
                      <option value="">Válassz kezelést</option>
                      {ADMIN_BOOKING_SERVICES.map((service) => (
                        <option key={service.name} value={service.name}>
                          {service.name} – {service.price.toLocaleString('hu-HU')} Ft
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Dátum *</Label>
                    <Input
                      type="date"
                      min={minBookingDate}
                      max={maxBookingDate}
                      value={addBookingForm.date}
                      onChange={(e) => {
                        setAddBookingForm({ ...addBookingForm, date: e.target.value, time: '' });
                        loadAddBookingSlots(e.target.value);
                      }}
                      required
                      className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[#4A3F35]">Időpont *</Label>
                    {!addBookingForm.date ? (
                      <p className="text-sm text-[#635241] py-2 italic">Először válassz dátumot a szabad időpontok megtekintéséhez.</p>
                    ) : isLoadingAddBookingSlots ? (
                      <div className="flex items-center gap-2 text-[#635241] py-2">
                        <div className="w-4 h-4 border-2 border-[#D4854A]/30 border-t-[#D4854A] rounded-full animate-spin" />
                        <span className="text-sm">Szabad időpontok betöltése...</span>
                      </div>
                    ) : addBookingSlots ? (
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {ADMIN_TIME_SLOTS.map((slot) => {
                          const available = addBookingSlots[slot] !== false;
                          const selected = addBookingForm.time === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={!available}
                              onClick={() => available && setAddBookingForm({ ...addBookingForm, time: slot })}
                              className={`py-2.5 px-1 rounded-xl text-sm font-medium border-2 transition-all ${
                                selected
                                  ? 'bg-[#D4854A] border-[#D4854A] text-white shadow-md'
                                  : available
                                    ? 'bg-white border-[#E8D4C0] text-[#4A3F35] hover:border-[#D4854A] hover:bg-[#FFF8F2]'
                                    : 'bg-gray-50 border-gray-200 text-gray-300 line-through cursor-not-allowed'
                              }`}
                            >
                              {slot}
                              {available && !selected && <span className="block text-xs text-[#8B9A7C] font-normal">szabad</span>}
                              {!available && <span className="block text-xs text-gray-300 font-normal">foglalt</span>}
                              {selected && <span className="block text-xs text-white/80 font-normal">kiválasztva</span>}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-red-500 py-3">Nem sikerült betölteni az időpontokat. Próbáld újra.</p>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[#4A3F35]">Megjegyzés</Label>
                    <Textarea
                      value={addBookingForm.notes}
                      onChange={(e) => setAddBookingForm({ ...addBookingForm, notes: e.target.value })}
                      placeholder="Belső megjegyzés vagy vendég kérése..."
                      rows={2}
                      className="border-[#E8D4C0] focus:border-[#D4854A] text-sm"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 bg-[#F9F1EA] rounded-xl p-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addBookingForm.sendConfirmationEmail}
                    onChange={(e) => setAddBookingForm({ ...addBookingForm, sendConfirmationEmail: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded border-[#E8D4C0] text-[#D4854A] focus:ring-[#D4854A]"
                  />
                  <span className="text-sm text-[#635241]">
                    <strong className="text-[#4A3F35]">Visszaigazoló email küldése</strong> a vendégnek
                    (fizetés a kezelésen – nincs online foglaló)
                  </span>
                </label>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetAddBookingForm}
                    className="flex-1 border-[#E8D4C0] text-[#635241]"
                  >
                    Űrlap törlése
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreatingBooking || !addBookingForm.time || isLoadingAddBookingSlots}
                    className="flex-1 bg-[#D4854A] hover:bg-[#B87333] text-white py-4 rounded-xl font-medium"
                  >
                    {isCreatingBooking ? 'Rögzítés...' : 'Foglalás rögzítése'}
                  </Button>
                </div>
              </form>
            </div>
          );
        })()}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl font-bold text-[#4A3F35]">Foglalások</h2>
                {allBookings.length > 0 && (
                  <p className="text-sm text-[#635241] mt-0.5">
                    {upcomingActiveBookings.length} közelgő aktív · {historyBookings.filter((b: any) => b.status === 'Cancelled').length} lemondva · {historyBookings.filter((b: any) => isActiveBookingStatus(b.status) && !isBookingUpcoming(b.date, b.time)).length} kész
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => switchTab('addbooking')}
                  className="px-4 py-2 bg-[#8B9A7C] text-white rounded-lg text-sm hover:bg-[#7A8B6B]"
                >
                  ➕ Új foglalás
                </button>
                <button type="button" disabled={tabLoading} onClick={() => runWithTabLoading('Foglalások betöltése…', loadAllBookings)} className="px-4 py-2 bg-[#D4854A] text-white rounded-lg text-sm hover:bg-[#B87333] disabled:opacity-60">Frissítés</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-warm overflow-hidden border border-[#8B9A7C]/20">
              <div className="px-5 py-4 bg-[#8B9A7C]/10 border-b border-[#E8D4C0] flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#4A3F35]">Közelgő aktív foglalások</h3>
                  <p className="text-sm text-[#635241]">Csak a még el nem végzett, jövőbeli időpontok</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#8B9A7C]/15 text-[#4A7C59] text-sm font-semibold">
                  {upcomingActiveBookings.length}
                </span>
              </div>
              {renderBookingsTable(upcomingActiveBookings, 'Nincs közelgő aktív foglalás.')}
            </div>

            <div className="bg-white rounded-2xl shadow-warm overflow-hidden">
              <div className="px-5 py-4 bg-[#F9F1EA] border-b border-[#E8D4C0] flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#4A3F35]">Korábbi és lemondott foglalások</h3>
                  <p className="text-sm text-[#635241]">Elmúlt időpontok, lemondások és régi státuszok</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#E8D4C0]/50 text-[#635241] text-sm font-semibold">
                  {historyBookings.length}
                </span>
              </div>
              {allBookings.length === 0
                ? <div className="p-8 text-center text-[#635241]">Még nincs foglalás rögzítve.</div>
                : renderBookingsTable(historyBookings, 'Nincs korábbi vagy lemondott foglalás.')}
            </div>
          </div>
        )}

        {/* PENDING TAB */}
        {activeTab === 'pending' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#4A3F35]">Függőben lévő foglalások</h2>
              <button type="button" disabled={tabLoading} onClick={() => runWithTabLoading('Függő foglalások betöltése…', () => loadPendingBookings(true))} className="px-4 py-2 bg-[#D4854A] text-white rounded-lg text-sm hover:bg-[#B87333] disabled:opacity-60">Frissítés</button>
            </div>
            <p className="text-sm text-[#635241]">
              Banki átutalások: amikor megérkezik a befizetés a bankszámlára, kattints a <strong>Befizetés megerősítése</strong> gombra.
              Stripe foglalások automatikusan megerősülnek fizetés után.
            </p>
            <div className="bg-white rounded-2xl shadow-warm overflow-hidden border border-[#E8D4C0]/60">
              {pendingBookings.length === 0 ? (
                <div className="p-8 text-center text-[#635241]">Nincs függőben lévő foglalás.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[1080px]">
                    <thead className="bg-[#F3EBE2]">
                      <tr>
                        {[
                          { label: 'Ügyfél', className: 'pl-6' },
                          { label: 'Időpont', className: '' },
                          { label: 'Kezelés', className: '' },
                          { label: 'Fizetés', className: '' },
                          { label: 'Közlemény', className: '' },
                          { label: 'Státusz', className: '' },
                          { label: 'Művelet', className: 'pr-6' },
                        ].map((h) => (
                          <th
                            key={h.label}
                            className={`px-5 py-3.5 text-left text-[#4A3F35] font-semibold text-xs uppercase tracking-wide ${h.className}`}
                          >
                            {h.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pendingBookings.map((b: any, i: number) => (
                        <tr
                          key={i}
                          className="border-t border-[#E8D4C0]/70 even:bg-[#FFFBF7]/70 hover:bg-[#FFF6EE] transition-colors"
                        >
                          <td className="px-6 py-4 align-top border-r border-[#F0E6DA]/80">
                            <div className="font-semibold text-[#4A3F35] text-[15px] leading-snug">{b.name}</div>
                            <div className="text-xs text-[#635241] mt-1 break-all">{b.email}</div>
                            {b.phone && (
                              <div className="text-xs mt-0.5">
                                <PhoneLink phone={b.phone} />
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-4 align-top border-r border-[#F0E6DA]/80 whitespace-nowrap">
                            <div className="font-semibold text-[#4A3F35]">{formatBookingDate(b.date)}</div>
                            <div className="inline-flex items-center gap-1.5 mt-1.5 text-[#D4854A] font-semibold">
                              <Clock className="w-3.5 h-3.5 shrink-0" />
                              {formatBookingTime(b.time)}
                            </div>
                          </td>
                          <td className="px-5 py-4 align-top border-r border-[#F0E6DA]/80 text-[#4A3F35] font-medium">
                            {b.service}
                          </td>
                          <td className="px-5 py-4 align-top border-r border-[#F0E6DA]/80 whitespace-nowrap">
                            <div className="font-medium text-[#4A3F35]">
                              {b.paymentMethod === 'bank_transfer' ? '🏦 Banki átutalás' : '💳 Stripe'}
                            </div>
                            <div className="text-[#635241] mt-1">
                              {b.amount ? `${Number(b.amount).toLocaleString('hu-HU')} Ft` : '–'}
                            </div>
                          </td>
                          <td className="px-5 py-4 align-top border-r border-[#F0E6DA]/80">
                            {b.referenceId ? (
                              <span className="inline-block font-mono text-sm text-[#D4854A] font-bold tracking-wide bg-[#FFF3E8] border border-[#F5D5B8] rounded-lg px-2.5 py-1">
                                {b.referenceId}
                              </span>
                            ) : (
                              <span className="text-[#B5A08A]">—</span>
                            )}
                          </td>
                          <td className="px-5 py-4 align-top">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                              b.status === 'paid' ? 'bg-[#8B9A7C]/15 text-[#4A7C59]' :
                              b.status === 'awaiting_bank_transfer' ? 'bg-amber-100 text-amber-900' :
                              'bg-orange-100 text-orange-800'
                            }`}>{getPendingStatusLabel(b)}</span>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <div className="flex flex-col gap-2 items-start">
                              {confirmedReferences.has(b.referenceId) ? (
                                <span className="inline-flex px-3 py-1.5 bg-[#8B9A7C]/15 text-[#4A7C59] rounded-lg text-xs font-semibold whitespace-nowrap">
                                  ✓ Megerősítve
                                </span>
                              ) : b.status === 'awaiting_bank_transfer' && b.referenceId ? (
                                <button
                                  type="button"
                                  onClick={() => confirmBankTransfer(b.referenceId, b.name)}
                                  disabled={confirmingReference === b.referenceId}
                                  className="px-3.5 py-2 bg-[#8B9A7C] hover:bg-[#6B7F5E] text-white rounded-lg text-xs font-semibold disabled:opacity-50 whitespace-nowrap"
                                >
                                  {confirmingReference === b.referenceId ? 'Megerősítés...' : '✓ Befizetés megerősítése'}
                                </button>
                              ) : (
                                <span className="text-xs text-[#B5A08A]">Automatikus</span>
                              )}
                              <button
                                type="button"
                                onClick={() => deletePendingBooking({
                                  rowIndex: b.rowIndex,
                                  referenceId: b.referenceId,
                                  name: b.name,
                                })}
                                disabled={deletingPendingKey === String(b.rowIndex || b.referenceId)}
                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold disabled:opacity-50 whitespace-nowrap"
                              >
                                {deletingPendingKey === String(b.rowIndex || b.referenceId) ? 'Törlés...' : '🗑 Törlés'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'customers' && (() => {
          const filteredGuests = allCustomers.filter((c: any) => {
            if (!guestFilter.trim()) return true;
            const q = guestFilter.toLowerCase();
            return (
              String(c.name || '').toLowerCase().includes(q) ||
              String(c.email || '').toLowerCase().includes(q) ||
              String(c.phone || '').toLowerCase().includes(q)
            );
          });

          return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-[#4A3F35]">Vendégek</h2>
                <p className="text-sm text-[#635241] mt-1">{allCustomers.length} vendég rögzítve</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddGuest((v) => !v)}
                  className="px-4 py-2 bg-[#8B9A7C] text-white rounded-lg text-sm hover:bg-[#6B7F5E]"
                >
                  {showAddGuest ? 'Mégse' : '+ Új vendég'}
                </button>
                <button type="button" disabled={tabLoading} onClick={() => runWithTabLoading('Vendégek betöltése…', loadAllCustomers)} className="px-4 py-2 bg-[#D4854A] text-white rounded-lg text-sm hover:bg-[#B87333] disabled:opacity-60">Frissítés</button>
              </div>
            </div>

            {showAddGuest && (
              <form onSubmit={handleCreateGuest} className="bg-white rounded-2xl shadow-warm p-5 border border-[#E8D4C0]/50 space-y-4">
                <h3 className="font-semibold text-[#4A3F35]">Új vendég hozzáadása</h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  <Input
                    required
                    placeholder="Név"
                    value={guestForm.name}
                    onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                    className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                  <Input
                    required
                    type="email"
                    placeholder="Email"
                    value={guestForm.email}
                    onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
                    className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                  <Input
                    placeholder="Telefon"
                    value={guestForm.phone}
                    onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })}
                    className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSavingGuest}
                  className="px-4 py-2 bg-[#D4854A] text-white rounded-lg text-sm hover:bg-[#B87333] disabled:opacity-50"
                >
                  {isSavingGuest ? 'Mentés...' : 'Vendég mentése'}
                </button>
              </form>
            )}

            <div className="bg-white rounded-2xl shadow-warm p-4 border border-[#E8D4C0]/50">
              <Input
                type="search"
                placeholder="Keresés név, email vagy telefon alapján..."
                value={guestFilter}
                onChange={(e) => setGuestFilter(e.target.value)}
                className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
              />
            </div>

            <div className="bg-white rounded-2xl shadow-warm overflow-hidden border border-[#E8D4C0]/50">
              {filteredGuests.length === 0 ? (
                <div className="p-8 text-center text-[#635241]">
                  {allCustomers.length === 0 ? 'Vendégek betöltése...' : 'Nincs találat.'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#F9F1EA]">
                      <tr>
                        {['Név', 'Email', 'Telefon', 'Következő foglalás', 'Bérlet', ''].map((h) => (
                          <th key={h || 'actions'} className="px-5 py-3 text-left text-[#4A3F35] font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGuests.map((guest: any, i: number) => (
                        <tr
                          key={guest.customerId || i}
                          onClick={() => openGuestProfile(guest.email)}
                          className={`border-t border-[#F5E6D8] cursor-pointer transition-colors ${
                            customerProfile?.customer?.email === guest.email ? 'bg-[#FFF3E8]' : 'hover:bg-[#FFFBF7]'
                          }`}
                        >
                          <td className="px-5 py-3 font-semibold text-[#4A3F35]">{guest.name}</td>
                          <td className="px-5 py-3 text-[#635241] text-xs break-all">{guest.email || '–'}</td>
                          <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                            <PhoneLink phone={guest.phone} />
                          </td>
                          <td className="px-5 py-3 text-[#4A3F35] font-medium whitespace-nowrap">
                            {formatGuestNextBooking(guest)}
                          </td>
                          <td className="px-5 py-3 text-[#8B9A7C] font-medium">
                            {guest.totalSessionsRemaining ? `${guest.totalSessionsRemaining} alkalom` : '–'}
                          </td>
                          <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => deleteGuest(guest)}
                              disabled={deletingGuestId === (guest.customerId || guest.email)}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold disabled:opacity-50 whitespace-nowrap"
                            >
                              {deletingGuestId === (guest.customerId || guest.email) ? 'Törlés...' : '🗑 Törlés'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {customerProfile && (
              <div className="bg-white rounded-2xl shadow-warm p-6 space-y-6 border border-[#E8D4C0]/50">
                <div className="border-b border-[#E8D4C0] pb-4">
                  <h3 className="text-xl font-bold text-[#4A3F35]">{customerProfile.customer?.name}</h3>
                  <p className="text-[#635241] mt-1">{customerProfile.customer?.email}</p>
                  <p className="mt-1">
                    <PhoneLink phone={customerProfile.customer?.phone} className="text-base" />
                  </p>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-[#FFF3E8] rounded-xl p-4 text-center border border-[#F5D5B8]/60">
                    <p className="text-[#635241] text-sm">Aktív foglalás</p>
                    <p className="text-lg font-bold text-[#D4854A]">
                      {formatGuestNextBooking(customerProfile.customer || {})}
                    </p>
                  </div>
                  <div className="bg-[#F9F1EA] rounded-xl p-4 text-center">
                    <p className="text-[#635241] text-sm">Vásárolt alkalmak</p>
                    <p className="text-2xl font-bold text-[#4A3F35]">{customerProfile.customer?.totalSessionsPurchased || 0}</p>
                  </div>
                  <div className="bg-[#F9F1EA] rounded-xl p-4 text-center">
                    <p className="text-[#635241] text-sm">Felhasznált alkalmak</p>
                    <p className="text-2xl font-bold text-[#4A3F35]">{customerProfile.customer?.totalSessionsUsed || 0}</p>
                  </div>
                  <div className="bg-[#8B9A7C]/10 rounded-xl p-4 text-center">
                    <p className="text-[#8B9A7C] text-sm">Bérlet – hátralévő</p>
                    <p className="text-2xl font-bold text-[#8B9A7C]">{customerProfile.customer?.totalSessionsRemaining || 0}</p>
                  </div>
                </div>

                {customerProfile.activePackages?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-[#4A3F35] mb-3">Aktív bérletek</h4>
                    <div className="space-y-2">
                      {customerProfile.activePackages.map((pkg: any, i: number) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-[#F9F1EA] rounded-lg">
                          <div>
                            <p className="font-medium text-[#4A3F35]">{pkg.serviceType}</p>
                            <p className="text-sm text-[#635241]">Vásárolva: {pkg.purchaseDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[#8B9A7C] font-medium">{pkg.sessionsRemaining} / {pkg.sessionsPurchased} alkalom</p>
                            {pkg.discountPercent > 0 && (
                              <p className="text-xs text-[#D4854A]">{pkg.discountPercent}% kedvezmény</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {customerProfile.recentBookings?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-[#4A3F35] mb-3">Legutóbbi foglalások</h4>
                    <div className="space-y-2">
                      {customerProfile.recentBookings.map((booking: any, i: number) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-[#F9F1EA] rounded-lg">
                          <div>
                            <p className="font-medium text-[#4A3F35]">{booking.service}</p>
                            <p className="text-sm text-[#635241]">
                              {formatBookingDate(booking.date)} · {formatBookingTime(booking.time)}
                            </p>
                          </div>
                          {(() => {
                            const display = getBookingStatusDisplay(booking.status, booking.date, booking.time);
                            return (
                              <span className={`px-2 py-1 rounded text-xs ${display.className}`}>
                                {display.label}
                              </span>
                            );
                          })()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          );
        })()}

        {/* PACKAGES TAB */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#4A3F35]">Bérletek</h2>
              <button type="button" disabled={tabLoading} onClick={() => runWithTabLoading('Bérletek betöltése…', loadAllPackages)} className="px-4 py-2 bg-[#D4854A] text-white rounded-lg text-sm hover:bg-[#B87333] disabled:opacity-60">Frissítés</button>
            </div>

            {/* Active Packages List */}
            {allPackages.filter((p: any) => p.status === 'Active').length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#4A3F35]">Aktív bérletek</h3>
                {allPackages.filter((p: any) => p.status === 'Active').map((pkg: any, i: number) => (
                  <div key={i} className="bg-white rounded-2xl shadow-warm p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-[#4A3F35]">{pkg.customerName}</span>
                          <span className="px-2 py-0.5 bg-[#8B9A7C]/15 text-[#4A7C59] rounded-full text-xs font-medium">Aktív</span>
                        </div>
                        <p className="text-sm text-[#635241]">{pkg.serviceType || 'Általános bérlet'}</p>
                        <p className="text-xs text-[#635241] mt-0.5">Vásárolva: {pkg.purchaseDate ? (typeof pkg.purchaseDate === 'string' ? pkg.purchaseDate.slice(0, 10) : new Date(pkg.purchaseDate).toLocaleDateString('hu-HU')) : '–'}</p>
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-[#635241] mb-1">
                            <span>Alkalmak: {pkg.sessionsUsed} / {pkg.sessionsPurchased} felhasználva</span>
                            <span className="font-medium text-[#4A3F35]">{pkg.sessionsRemaining} maradt</span>
                          </div>
                          <div className="w-full bg-[#F5E6D8] rounded-full h-2">
                            <div
                              className="bg-[#D4854A] h-2 rounded-full transition-all"
                              style={{ width: `${Math.min(100, ((pkg.sessionsUsed || 0) / (pkg.sessionsPurchased || 1)) * 100)}%` }}
                            />
                          </div>
                        </div>
                        {pkg.finalPrice > 0 && (
                          <div className="mt-2 flex gap-4 text-xs">
                            <span className="text-[#635241]">Fizetendő: <b className="text-[#4A3F35]">{Number(pkg.finalPrice).toLocaleString()} Ft</b></span>
                            <span className="text-[#635241]">Foglaló: <b className="text-[#8B9A7C]">{Number(pkg.depositPaid).toLocaleString()} Ft</b></span>
                            <span className="text-[#635241]">Hátralék: <b className="text-[#D4854A]">{(Number(pkg.finalPrice) - Number(pkg.depositPaid)).toLocaleString()} Ft</b></span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleUseSession(pkg.packageId, pkg.customerName)}
                        disabled={pkg.sessionsRemaining <= 0}
                        className="px-4 py-2 bg-[#4A7C59] text-white rounded-xl text-sm font-medium hover:bg-[#3d6849] disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        ✓ Alkalom felhasználása
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Completed/other packages */}
            {allPackages.filter((p: any) => p.status !== 'Active').length > 0 && (
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-[#635241] hover:text-[#4A3F35] list-none flex items-center gap-2">
                  <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
                  Lezárt bérletek ({allPackages.filter((p: any) => p.status !== 'Active').length} db)
                </summary>
                <div className="mt-3 space-y-2">
                  {allPackages.filter((p: any) => p.status !== 'Active').map((pkg: any, i: number) => (
                    <div key={i} className="bg-white rounded-xl shadow-warm p-4 opacity-70">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium text-[#4A3F35]">{pkg.customerName}</span>
                          <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">{pkg.status}</span>
                          <p className="text-sm text-[#635241]">{pkg.serviceType}</p>
                        </div>
                        <span className="text-sm text-[#635241]">{pkg.sessionsUsed} / {pkg.sessionsPurchased} alkalom</span>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            )}

            {allPackages.length === 0 && (
              <div className="bg-white rounded-2xl shadow-warm p-8 text-center text-[#635241]">Még nincs bérlet rögzítve.</div>
            )}

            {/* New Package Form */}
            <div className="border-t border-[#E8D4C0] pt-6">
              <h3 className="text-xl font-bold text-[#4A3F35] mb-4">Új bérlet létrehozása</h3>
            <div className="bg-white rounded-2xl shadow-warm p-6">
              <form onSubmit={handleCreatePackage} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Vásárló neve *</Label>
                    <Input
                      value={packageForm.customerName}
                      onChange={(e) => setPackageForm({ ...packageForm, customerName: e.target.value })}
                      placeholder="Pl.: Kovács Anna"
                      required
                      className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Email cím *</Label>
                    <Input
                      type="email"
                      value={packageForm.customerEmail}
                      onChange={(e) => setPackageForm({ ...packageForm, customerEmail: e.target.value })}
                      placeholder="anna@pelda.hu"
                      required
                      className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Telefonszám</Label>
                    <Input
                      value={packageForm.customerPhone}
                      onChange={(e) => setPackageForm({ ...packageForm, customerPhone: e.target.value })}
                      placeholder="+36 30 123 4567"
                      className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Kezelés típusa</Label>
                    <select
                      value={packageForm.service}
                      onChange={(e) => setPackageForm({ ...packageForm, service: e.target.value })}
                      className="w-full h-10 pl-3 pr-10 border border-[#E8D4C0] rounded-md focus:border-[#D4854A] focus:ring-1 focus:ring-[#D4854A] bg-white text-[#4A3F35] appearance-none cursor-pointer"
                    >
                      <option value="">Bármely kezelés</option>
                      <option value="Frissítő masszázs">Frissítő masszázs</option>
                      <option value="Nepáli masszázs">Nepáli masszázs</option>
                      <option value="Nyirokmasszázs">Nyirokmasszázs</option>
                      <option value="Aromamasszázs">Aromamasszázs</option>
                      <option value="Indiai fejmasszázs">Indiai fejmasszázs</option>
                      <option value="Kineziológia">Kineziológia</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Alkalmak száma *</Label>
                    <select
                      value={packageForm.sessions}
                      onChange={(e) => setPackageForm({ ...packageForm, sessions: parseInt(e.target.value) })}
                      className="w-full h-10 pl-3 pr-10 border border-[#E8D4C0] rounded-md focus:border-[#D4854A] focus:ring-1 focus:ring-[#D4854A] bg-white text-[#4A3F35] appearance-none cursor-pointer"
                    >
                      {[2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                        <option key={num} value={num}>{num} alkalom</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Eredeti ár (Ft)</Label>
                    <Input
                      type="number"
                      value={packageForm.originalPrice}
                      onChange={(e) => setPackageForm({ ...packageForm, originalPrice: parseInt(e.target.value) })}
                      className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Foglaló befizetve (Ft)</Label>
                    <Input
                      type="number"
                      value={packageForm.depositPaid}
                      onChange={(e) => setPackageForm({ ...packageForm, depositPaid: parseInt(e.target.value) })}
                      className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[#4A3F35]">Megjegyzés</Label>
                    <Textarea
                      value={packageForm.notes}
                      onChange={(e) => setPackageForm({ ...packageForm, notes: e.target.value })}
                      placeholder="Opcionális megjegyzés..."
                      className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-[#F9F1EA] rounded-xl p-4">
                  <h4 className="font-semibold text-[#4A3F35] mb-3">Árösszegzés</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#635241]">Eredeti ár:</span>
                      <span className="text-[#4A3F35]">{packageForm.originalPrice.toLocaleString()} Ft</span>
                    </div>
                    {getPackageDiscount() > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[#8B9A7C]">Kedvezmény ({getPackageDiscount()}%):</span>
                        <span className="text-[#8B9A7C]">-{Math.round(packageForm.originalPrice * getPackageDiscount() / 100).toLocaleString()} Ft</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium">
                      <span className="text-[#4A3F35]">Fizetendő:</span>
                      <span className="text-[#4A3F35]">{getPackageFinalPrice().toLocaleString()} Ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#635241]">Foglaló:</span>
                      <span className="text-[#4A3F35]">{packageForm.depositPaid.toLocaleString()} Ft</span>
                    </div>
                    <div className="flex justify-between text-[#D4854A]">
                      <span>Hátralék:</span>
                      <span>{(getPackageFinalPrice() - packageForm.depositPaid).toLocaleString()} Ft</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#D4854A] hover:bg-[#B87333] text-white py-4 rounded-xl font-medium"
                >
                  {isSubmitting ? 'Létrehozás...' : 'Bérlet létrehozása'}
                </Button>
              </form>
            </div>
            </div>
          </div>
        )}

        {/* P&L TAB */}
        {activeTab === 'pnl' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#4A3F35]">Bevétel áttekintés</h2>
                <p className="text-sm text-[#635241] mt-1">Csak valóban beérkezett foglalók és aktív foglalások — nincs mínusz, nincs visszavonás sor.</p>
              </div>
              <div className="bg-white rounded-2xl shadow-warm px-4 py-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    let m = selectedMonth - 1;
                    let y = selectedYear;
                    if (m < 1) { m = 12; y -= 1; }
                    setSelectedMonth(m);
                    setSelectedYear(y);
                    loadPnLData(m, y);
                  }}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#E8D4C0] hover:bg-[#F9F1EA] text-[#4A3F35]"
                >‹</button>
                <span className="text-sm font-semibold text-[#4A3F35] min-w-[140px] text-center">
                  {new Date(selectedYear, selectedMonth - 1, 1).toLocaleDateString('hu-HU', { year: 'numeric', month: 'long' })}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    let m = selectedMonth + 1;
                    let y = selectedYear;
                    if (m > 12) { m = 1; y += 1; }
                    setSelectedMonth(m);
                    setSelectedYear(y);
                    loadPnLData(m, y);
                  }}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#E8D4C0] hover:bg-[#F9F1EA] text-[#4A3F35]"
                >›</button>
                <Button
                  disabled={tabLoading}
                  onClick={() => runWithTabLoading('Bevétel betöltése…', () => loadPnLData(selectedMonth, selectedYear))}
                  className="bg-[#D4854A] hover:bg-[#B87333] text-white h-9 disabled:opacity-60"
                >
                  Frissítés
                </Button>
              </div>
            </div>

            {pnlData ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl p-6 shadow-warm border border-[#E8D4C0]/50">
                    <p className="text-[#635241] text-sm mb-1">💰 Beérkezett foglalók</p>
                    <p className="text-3xl font-bold text-[#4A3F35]">{(pnlData.depositsReceived ?? pnlData.totalIncome ?? 0).toLocaleString('hu-HU')} Ft</p>
                    <p className="text-xs text-[#635241] mt-2">Ténylegesen befizetett összeg ebben a hónapban</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-warm border border-[#E8D4C0]/50">
                    <p className="text-[#635241] text-sm mb-1">📅 Aktív foglalások</p>
                    <p className="text-3xl font-bold text-[#8B9A7C]">{pnlData.activeBookings ?? pnlData.sessionsCompleted ?? 0}</p>
                    <p className="text-xs text-[#635241] mt-2">Megerősített időpontok ebben a hónapban</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-warm border border-[#E8D4C0]/50">
                    <p className="text-[#635241] text-sm mb-1">📈 Várható bevétel</p>
                    <p className="text-3xl font-bold text-[#4A7C59]">{(pnlData.estimatedFullRevenue ?? 0).toLocaleString('hu-HU')} Ft</p>
                    <p className="text-xs text-[#635241] mt-2">Teljes kezelési díj az aktív foglalásoknál</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-warm border border-[#E8D4C0]/50">
                    <p className="text-[#635241] text-sm mb-1">⏳ Hátralék kezeléskor</p>
                    <p className="text-3xl font-bold text-[#D4854A]">{(pnlData.remainingAtSession ?? pnlData.outstanding ?? 0).toLocaleString('hu-HU')} Ft</p>
                    <p className="text-xs text-[#635241] mt-2">Amit még a vendég a kezelésnél fizet</p>
                  </div>
                </div>

                {pnlData.transactions?.length > 0 ? (
                  <div className="bg-white rounded-2xl shadow-warm p-6 border border-[#E8D4C0]/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-[#4A3F35]">Befizetések</h3>
                      <span className="text-sm text-[#635241]">{pnlData.transactions.length} befizetés</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[#E8D4C0] bg-[#F9F1EA]/60">
                            <th className="text-left py-3 px-3 text-[#4A3F35] font-semibold">Dátum</th>
                            <th className="text-left py-3 px-3 text-[#4A3F35] font-semibold">Vendég</th>
                            <th className="text-left py-3 px-3 text-[#4A3F35] font-semibold">Kezelés / fizetés</th>
                            <th className="text-right py-3 px-3 text-[#4A3F35] font-semibold">Összeg</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pnlData.transactions.map((txn: any, i: number) => (
                            <tr key={i} className="border-b border-[#F9F1EA] hover:bg-[#FFFBF7]">
                              <td className="py-3 px-3 text-[#4A3F35] whitespace-nowrap">
                                {typeof txn.date === 'string' ? txn.date.slice(0, 10) : new Date(txn.date).toLocaleDateString('hu-HU')}
                              </td>
                              <td className="py-3 px-3 font-medium text-[#4A3F35]">{txn.customer}</td>
                              <td className="py-3 px-3 text-[#635241]">{txn.description}</td>
                              <td className="py-3 px-3 text-right font-semibold text-[#4A7C59] whitespace-nowrap">
                                +{Number(txn.amount || 0).toLocaleString('hu-HU')} Ft
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-warm p-10 text-center text-[#635241] border border-[#E8D4C0]/50">
                    Ebben a hónapban még nincs befizetés rögzítve.
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-warm p-10 text-center text-[#635241]">Adatok betöltése...</div>
            )}
          </div>
        )}

        {/* CANCEL TAB */}
        {activeTab === 'cancel' && (
          <div className="space-y-6">
            {/* Booking Search */}
            <div className="bg-white rounded-2xl shadow-warm-lg p-6">
              <h2 className="text-xl font-bold text-[#4A3F35] mb-4">Foglalás keresése</h2>
              <div className="relative">
                <Input
                  value={cancelSearch}
                  onChange={(e) => setCancelSearch(e.target.value)}
                  placeholder="Keresés név vagy email alapján..."
                  className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A] pl-10"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#635241]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </div>

              {cancelSearch.length >= 2 && (() => {
                const q = cancelSearch.toLowerCase();
                const results = allBookings.filter((b: any) =>
                  (b.customerName || '').toLowerCase().includes(q) ||
                  (b.customerEmail || '').toLowerCase().includes(q)
                ).slice(0, 8);
                return results.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {results.map((b: any, i: number) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          const dateStr = b.date ? (typeof b.date === 'string' ? b.date.slice(0, 10) : new Date(b.date).toISOString().slice(0, 10)) : '';
                          const timeStr = b.time ? String(b.time).slice(0, 5) : '';
                          setFormData({
                            ...formData,
                            clientName: b.customerName || '',
                            clientEmail: b.customerEmail || '',
                            appointmentDate: dateStr,
                            appointmentTime: timeStr,
                            service: b.service || '',
                            reason: ''
                          });
                          setCancelSearch('');
                        }}
                        className="w-full text-left p-3 rounded-xl border border-[#E8D4C0] hover:border-[#D4854A] hover:bg-[#FFF8F2] transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-[#4A3F35]">{b.customerName}</p>
                            <p className="text-sm text-[#635241]">{b.customerEmail}</p>
                          </div>
                          <div className="text-right text-sm text-[#635241]">
                            <p>{b.date ? (typeof b.date === 'string' ? b.date.slice(0, 10) : new Date(b.date).toLocaleDateString('hu-HU')) : '–'} {b.time ? String(b.time).slice(0, 5) : ''}</p>
                            <p className="text-xs">{b.service}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-[#635241]">Nincs találat.</p>
                );
              })()}

              {allBookings.length === 0 && cancelSearch.length === 0 && (
                <p className="mt-3 text-sm text-[#635241]">Foglalások betöltése folyamatban…</p>
              )}
            </div>

            {/* Cancel Form */}
            <div className="bg-white rounded-2xl shadow-warm-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-[#4A3F35] mb-6">Lemondás adatai</h2>
              {(formData.clientName || formData.clientEmail) && (
                <div className="mb-4 px-4 py-3 bg-[#8B9A7C]/10 rounded-xl text-sm text-[#4A7C59] font-medium">
                  ✓ Előtöltve a kiválasztott foglalásból — szükség esetén módosítható.
                </div>
              )}
              <form onSubmit={handleCancelAppointment} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Vendég neve *</Label>
                    <Input
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      placeholder="Pl.: Kovács Anna"
                      required
                      className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Vendég email címe *</Label>
                    <Input
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      placeholder="anna@pelda.hu"
                      required
                      className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Eredeti dátum *</Label>
                    <Input
                      type="date"
                      value={formData.appointmentDate}
                      onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                      required
                      className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Eredeti időpont *</Label>
                    <Input
                      type="time"
                      value={formData.appointmentTime}
                      onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                      required
                      className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[#4A3F35]">Kezelés *</Label>
                    <Input
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      placeholder="Pl.: Frissítő masszázs"
                      required
                      className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[#4A3F35]">Lemondás oka</Label>
                    <Textarea
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="Opcionális: lemondás oka..."
                      className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                    />
                  </div>
                </div>

                <div className="bg-[#F9F1EA] rounded-xl p-4">
                  <p className="text-sm text-[#635241]">
                    <strong className="text-[#4A3F35]">Fontos:</strong> A lemondás után ne felejtsd el törölni az időpontot a Google Naptárból is!
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-medium"
                >
                  {isSubmitting ? 'Küldés...' : 'Lemondási értesítés küldése'}
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* NOTIFY TAB */}
        {activeTab === 'notify' && (
          <div className="bg-white rounded-2xl shadow-warm-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-[#4A3F35] mb-6">Időpont Módosítása</h2>
            <form onSubmit={handleNotifyChange} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[#4A3F35]">Vendég neve *</Label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Pl.: Kovács Anna"
                    required
                    className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#4A3F35]">Vendég email címe *</Label>
                  <Input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    placeholder="anna@pelda.hu"
                    required
                    className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#4A3F35]">Eredeti dátum *</Label>
                  <Input
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    required
                    className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#4A3F35]">Eredeti időpont *</Label>
                  <Input
                    type="time"
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                    required
                    className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[#4A3F35]">Kezelés *</Label>
                  <Input
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    placeholder="Pl.: Frissítő masszázs"
                    required
                    className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#4A3F35]">Új dátum *</Label>
                  <Input
                    type="date"
                    value={formData.newDate}
                    onChange={(e) => setFormData({ ...formData, newDate: e.target.value })}
                    required
                    className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#4A3F35]">Új időpont *</Label>
                  <Input
                    type="time"
                    value={formData.newTime}
                    onChange={(e) => setFormData({ ...formData, newTime: e.target.value })}
                    required
                    className="border-[#E8D4C0] focus:border-[#D4854A] focus:ring-[#D4854A]"
                  />
                </div>
              </div>

              <div className="bg-[#F9F1EA] rounded-xl p-4">
                <p className="text-sm text-[#635241]">
                  <strong className="text-[#4A3F35]">Fontos:</strong> A módosítás után ne felejtsd el frissíteni az időpontot a Google Naptárból is!
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#8B9A7C] hover:bg-[#7A8B6B] text-white py-4 rounded-xl font-medium"
              >
                {isSubmitting ? 'Küldés...' : 'Módosítási értesítés küldése'}
              </Button>
            </form>
          </div>
        )}

        {activeTab === 'blockslot' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-2xl font-bold text-[#4A3F35] mb-2">Időpont zárolása</h2>
              <p className="text-sm text-[#635241]">
                A zárolt időszakok a Google Naptárban jelennek meg, és az online foglalásban nem lesznek elérhetők.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {([
                { id: 'single', label: 'Egyszeri' },
                { id: 'multi', label: 'Több időpont (egy nap)' },
                { id: 'recurring', label: 'Heti ismétlődő' },
              ] as const).map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setBlockMode(mode.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    blockMode === mode.id
                      ? 'bg-[#4A3F35] text-white'
                      : 'bg-white text-[#635241] border border-[#E8D4C0] hover:border-[#D4854A]'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {blockMode === 'single' && (
              <div className="bg-white rounded-2xl shadow-warm-lg p-6 sm:p-8">
                <form onSubmit={handleBlockSlot} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[#4A3F35]">Dátum *</Label>
                      <Input
                        type="date"
                        value={blockSlotForm.date}
                        onChange={(e) => setBlockSlotForm({ ...blockSlotForm, date: e.target.value })}
                        required
                        className="border-[#E8D4C0] focus:border-[#D4854A]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#4A3F35]">Időpont *</Label>
                      <select
                        value={blockSlotForm.time}
                        onChange={(e) => setBlockSlotForm({ ...blockSlotForm, time: e.target.value })}
                        required
                        className="w-full border border-[#E8D4C0] rounded-md px-3 py-2 text-sm text-[#4A3F35] bg-white focus:outline-none focus:ring-1 focus:ring-[#D4854A] focus:border-[#D4854A]"
                      >
                        <option value="">Válassz időpontot</option>
                        {ADMIN_TIME_SLOTS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Megjegyzés (opcionális)</Label>
                    <Input
                      value={blockSlotForm.label}
                      onChange={(e) => setBlockSlotForm({ ...blockSlotForm, label: e.target.value })}
                      placeholder="Pl.: Betegség, szabadnap..."
                      className="border-[#E8D4C0] focus:border-[#D4854A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Időtartam (perc)</Label>
                    <select
                      value={blockSlotForm.duration}
                      onChange={(e) => setBlockSlotForm({ ...blockSlotForm, duration: e.target.value })}
                      className="w-full border border-[#E8D4C0] rounded-md px-3 py-2 text-sm text-[#4A3F35] bg-white focus:outline-none focus:ring-1 focus:ring-[#D4854A] focus:border-[#D4854A]"
                    >
                      <option value="75">75 perc (1 időpont)</option>
                      <option value="150">150 perc (2 időpont)</option>
                      <option value="225">225 perc (3 időpont)</option>
                      <option value="300">300 perc (4 időpont)</option>
                      <option value="480">Egész nap (8 óra)</option>
                    </select>
                  </div>
                  <Button type="submit" disabled={isBlockingSlot} className="w-full bg-[#4A3F35] hover:bg-[#3a3029] text-white py-4 rounded-xl font-medium">
                    {isBlockingSlot ? 'Zárolás...' : '🔒 Időpont zárolása'}
                  </Button>
                </form>
              </div>
            )}

            {blockMode === 'multi' && (
              <div className="bg-white rounded-2xl shadow-warm-lg p-6 sm:p-8">
                <form onSubmit={handleBlockMultipleSlots} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Dátum *</Label>
                    <Input
                      type="date"
                      value={multiSlotForm.date}
                      onChange={(e) => setMultiSlotForm({ ...multiSlotForm, date: e.target.value })}
                      required
                      className="border-[#E8D4C0] focus:border-[#D4854A]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Időpontok * (több is választható)</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {ADMIN_TIME_SLOTS.map((slot) => {
                        const selected = multiSlotForm.times.includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => toggleMultiSlotTime(slot)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                              selected
                                ? 'bg-[#4A3F35] text-white border-[#4A3F35]'
                                : 'bg-white text-[#635241] border-[#E8D4C0] hover:border-[#D4854A]'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#4A3F35]">Megjegyzés (opcionális)</Label>
                    <Input
                      value={multiSlotForm.label}
                      onChange={(e) => setMultiSlotForm({ ...multiSlotForm, label: e.target.value })}
                      placeholder="Pl.: Szabadnap, családi program..."
                      className="border-[#E8D4C0] focus:border-[#D4854A]"
                    />
                  </div>
                  <Button type="submit" disabled={isBlockingSlot} className="w-full bg-[#4A3F35] hover:bg-[#3a3029] text-white py-4 rounded-xl font-medium">
                    {isBlockingSlot ? 'Zárolás...' : `🔒 ${multiSlotForm.times.length || 0} időpont zárolása`}
                  </Button>
                </form>
              </div>
            )}

            {blockMode === 'recurring' && (
              <div className="bg-white rounded-2xl shadow-warm-lg p-6 sm:p-8 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-[#635241]">Állandó heti foglalt időszakok — minden héten ismétlődnek a Google Naptárban.</p>
                  <button
                    type="button"
                    onClick={() => setRecurringBlocks(EDINA_WEEKLY_PRESET)}
                    className="px-3 py-1.5 text-sm rounded-lg border border-[#D4854A] text-[#D4854A] hover:bg-[#D4854A]/10"
                  >
                    Edina heti sablon betöltése
                  </button>
                </div>

                <div className="space-y-3">
                  {recurringBlocks.map((block, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 bg-[#FFFBF7] rounded-xl border border-[#E8D4C0]">
                      <select
                        value={block.dayOfWeek}
                        onChange={(e) => {
                          const next = [...recurringBlocks];
                          next[index] = { ...block, dayOfWeek: e.target.value };
                          setRecurringBlocks(next);
                        }}
                        className="border border-[#E8D4C0] rounded-md px-3 py-2 text-sm bg-white"
                      >
                        {WEEKDAY_OPTIONS.map((d) => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                      <Input
                        type="time"
                        value={block.startTime}
                        onChange={(e) => {
                          const next = [...recurringBlocks];
                          next[index] = { ...block, startTime: e.target.value };
                          setRecurringBlocks(next);
                        }}
                        className="border-[#E8D4C0]"
                      />
                      <Input
                        type="time"
                        value={block.endTime}
                        onChange={(e) => {
                          const next = [...recurringBlocks];
                          next[index] = { ...block, endTime: e.target.value };
                          setRecurringBlocks(next);
                        }}
                        className="border-[#E8D4C0]"
                      />
                      <Input
                        value={block.label}
                        onChange={(e) => {
                          const next = [...recurringBlocks];
                          next[index] = { ...block, label: e.target.value };
                          setRecurringBlocks(next);
                        }}
                        placeholder="Megjegyzés"
                        className="border-[#E8D4C0]"
                      />
                      <button
                        type="button"
                        onClick={() => setRecurringBlocks(recurringBlocks.filter((_, i) => i !== index))}
                        className="px-3 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
                      >
                        Törlés
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-end gap-3">
                  <button
                    type="button"
                    onClick={() => setRecurringBlocks([...recurringBlocks, { dayOfWeek: 'MONDAY', startTime: '08:30', endTime: '10:30', label: 'Foglalt – heti' }])}
                    className="px-4 py-2 text-sm rounded-lg border border-[#E8D4C0] text-[#635241] hover:border-[#D4854A]"
                  >
                    + Új heti sor
                  </button>
                  <div className="space-y-1">
                    <Label className="text-[#4A3F35] text-sm">Hány hétig ismétlődjön?</Label>
                    <div className="flex flex-wrap items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        max={260}
                        value={recurringWeeks}
                        onChange={(e) => setRecurringWeeks(e.target.value)}
                        className="w-24 border-[#E8D4C0] focus:border-[#D4854A]"
                      />
                      <span className="text-sm text-[#635241]">hét</span>
                      {[3, 6, 12, 26, 52].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setRecurringWeeks(String(w))}
                          className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                            recurringWeeks === String(w)
                              ? 'bg-[#4A3F35] text-white border-[#4A3F35]'
                              : 'bg-white text-[#635241] border-[#E8D4C0] hover:border-[#D4854A]'
                          }`}
                        >
                          {w} hét
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
                  <p>Pl. 4 sor × 52 hét = <b>208 külön naptáresemény</b> (minden héten ugyanarra az időre).</p>
                  <p className="mt-1">Sablon: Hétfő 08:30–11:00, Péntek 08:30–10:30, Csütörtök 11:00–12:00 és 17:00–20:00.</p>
                </div>

                <form onSubmit={handleBlockRecurringSchedule}>
                  <Button type="submit" disabled={isBlockingSlot} className="w-full bg-[#4A3F35] hover:bg-[#3a3029] text-white py-4 rounded-xl font-medium">
                    {isBlockingSlot ? 'Zárolás...' : `🔒 ${recurringBlocks.length} heti zárolás létrehozása`}
                  </Button>
                </form>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-warm-lg p-6 sm:p-8 border border-red-100 max-w-3xl">
              <h3 className="text-lg font-semibold text-[#4A3F35] mb-2">Zárolások törlése (tömeges)</h3>
              <p className="text-sm text-[#635241] mb-4">
                Ha megváltozott a terv (pl. éves zárolás már nem kell), itt egy gombbal törölheted a jövőbeli 🔒 eseményeket a Google Naptárból.
              </p>
              <div className="flex flex-wrap items-end gap-3 mb-4">
                <div className="space-y-1 flex-1 min-w-[200px]">
                  <Label className="text-[#4A3F35] text-sm">Szűrés megjegyzésben (opcionális)</Label>
                  <Input
                    value={deleteBlockLabel}
                    onChange={(e) => setDeleteBlockLabel(e.target.value)}
                    placeholder="Pl. Foglalt"
                    className="border-[#E8D4C0] focus:border-[#D4854A]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => loadBlockedSlotStats()}
                  className="px-4 py-2 text-sm rounded-lg border border-[#E8D4C0] text-[#635241] hover:border-[#D4854A]"
                >
                  Számolás
                </button>
              </div>
              {blockedSlotStats && (
                <p className="text-sm text-[#4A3F35] mb-4">
                  Jövőbeli zárolások: <b>{blockedSlotStats.future}</b> (összesen a keresésben: {blockedSlotStats.total})
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={isDeletingBlocks}
                  onClick={() => handleDeleteBlockedSlots({ labelOnly: true })}
                  className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-sm font-semibold disabled:opacity-50"
                >
                  {isDeletingBlocks ? 'Törlés...' : '🗑 Szűrt zárolások törlése'}
                </button>
                <button
                  type="button"
                  disabled={isDeletingBlocks}
                  onClick={() => handleDeleteBlockedSlots({ allFuture: true })}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
                >
                  {isDeletingBlocks ? 'Törlés...' : '🗑 Minden jövőbeli 🔒 törlése'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Bank Transfer Pending Page
export function BookingBankPendingPage() {
  useSeo({
    title: `Banki átutalás | ${SITE_NAME}`,
    description: 'Banki átutalásos foglalás részletei.',
    canonical: `${SITE_URL}/`,
    noindex: true,
  });

  const [booking, setBooking] = useState<{
    referenceId: string;
    amount: number;
    name: string;
    service: string;
    date: string;
    time: string;
    bankAccount: { holder: string; account: string };
  } | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('bankTransferBooking');
    if (raw) {
      try {
        setBooking(JSON.parse(raw));
      } catch {
        setBooking(null);
      }
    }
  }, []);

  const copyReference = () => {
    if (!booking?.referenceId) return;
    navigator.clipboard.writeText(booking.referenceId);
    toast.success('Közlemény azonosító másolva!');
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFFBF7] to-[#F5E6D8] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-warm-lg p-8 max-w-lg w-full text-center">
          <h1 className="text-2xl font-bold text-[#4A3F35] mb-4">Foglalás rögzítve</h1>
          <p className="text-[#635241] mb-6">Ellenőrizd az emailed a banki átutalás adataiért és a közlemény azonosítóért.</p>
          <a href="/" className="inline-block bg-[#D4854A] text-white px-8 py-3 rounded-xl">Vissza a főoldalra</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBF7] to-[#F5E6D8] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-warm-lg p-8 sm:p-12 max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-[#8B9A7C]/15 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-10 h-10 text-[#8B9A7C]" />
          </div>
          <h1 className="text-3xl font-bold text-[#4A3F35] mb-2">Foglalás rögzítve! 🏦</h1>
          <p className="text-[#635241]">Köszönöm, {booking.name}! A foglalásod rögzítve lett.</p>
        </div>

        <div className="bg-[#F9F1EA] rounded-2xl p-5 mb-5 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-[#635241]">Kezelés</span><span className="font-medium">{booking.service}</span></div>
          <div className="flex justify-between"><span className="text-[#635241]">Dátum</span><span className="font-medium">{booking.date}</span></div>
          <div className="flex justify-between"><span className="text-[#635241]">Időpont</span><span className="font-medium">{booking.time}</span></div>
        </div>

        <div className="border-2 border-[#D4854A] rounded-2xl p-5 mb-5">
          <p className="font-bold text-[#4A3F35] mb-3">Banki átutalás adatai</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-[#635241]">Számlatulajdonos</span><span>{booking.bankAccount.holder}</span></div>
            <div className="flex justify-between"><span className="text-[#635241]">Számlaszám</span><span className="font-mono text-xs">{booking.bankAccount.account}</span></div>
            <div className="flex justify-between"><span className="text-[#635241]">Összeg</span><span className="text-xl font-bold text-[#D4854A]">{booking.amount.toLocaleString()} Ft</span></div>
          </div>
          <div className="mt-4 bg-white rounded-xl p-4 text-center">
            <p className="text-xs text-[#635241] mb-1">Közlemény (kötelező!)</p>
            <p className="text-2xl font-black text-[#D4854A] tracking-wider">{booking.referenceId}</p>
            <Button onClick={copyReference} variant="outline" className="mt-3 border-[#D4854A] text-[#D4854A]">
              Azonosító másolása
            </Button>
          </div>
        </div>

        <p className="text-sm text-[#635241] mb-6">
          Emailben is elküldtük ezeket az adatokat. A foglalás a befizetés beérkezése után válik véglegessé, és küldünk visszaigazolást.
        </p>

        <a
          href="/"
          onClick={() => { window.location.hash = ''; }}
          className="block text-center bg-[#D4854A] hover:bg-[#B87333] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Vissza a főoldalra
        </a>
      </div>
    </div>
  );
}

// Booking Success Page
export function BookingSuccessPage() {
  useSeo({
    title: `Foglalás visszaigazolva | ${SITE_NAME}`,
    description: 'Sikeres online foglalás – Dunakeszi Masszázs Angyali Szalon.',
    canonical: `${SITE_URL}/booking-success`,
    noindex: true,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBF7] to-[#F5E6D8] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-warm-lg p-8 sm:p-12 max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-[#4A3F35] mb-3">Foglalás visszaigazolva! 🎉</h1>
        <p className="text-[#635241] text-lg mb-6">
          Köszönöm a foglalást! A foglalási díj befizetése sikeresen megtörtént,
          és az időpontod <strong className="text-[#4A3F35]">visszaigazolva</strong> lett.
          A részleteket emailben is elküldtük.
        </p>
        <div className="bg-[#F9F1EA] rounded-2xl p-5 mb-8 text-left space-y-2">
          <p className="text-[#4A3F35] font-semibold">📅 Fontos tudnivalók</p>
          <p className="text-[#635241] text-sm">• ✅ A foglalási díj (20%) megérkezett — foglalásod aktív</p>
          <p className="text-[#635241] text-sm">• A fennmaradó összeget a kezelésnél kell kifizetni</p>
          <p className="text-[#635241] text-sm">• Foglalásaidat itt kezelheted: <a href="/foglalasaim" className="text-[#D4854A] font-medium hover:underline">dunakeszimasszazs.hu/foglalasaim</a></p>
          <p className="text-[#635241] text-sm">• 📍 Dunakeszi, Kolonics György utca 2/B — Kapucsengő: 1/43</p>
          <p className="text-[#635241] text-sm">• 📞 +36 30 487 7883</p>
        </div>
        <p className="text-sm text-[#635241] mb-4">
          Ha tetszett a foglalás élménye, kezelés után szívesen fogadunk egy Google értékelést is.
        </p>
        <a
          href={GOOGLE_WRITE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mb-4 px-6 py-2.5 border border-[#E8D4C0] rounded-xl text-[#4A3F35] text-sm font-medium hover:bg-[#F9F1EA] transition-colors"
        >
          <Star className="w-4 h-4 text-[#D4854A]" />
          Google értékelés írása
        </a>
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); navigateTo(ROUTES.home); }}
          className="inline-block bg-[#D4854A] hover:bg-[#B87333] text-white font-semibold px-8 py-3 rounded-xl transition-colors duration-200"
        >
          Vissza a főoldalra
        </a>
      </div>
    </div>
  );
}

// Booking Cancel Page
export function BookingCancelPage() {
  useSeo({
    title: `Fizetés megszakítva | ${SITE_NAME}`,
    description: 'A fizetés nem történt meg. Próbáld újra a foglalást.',
    canonical: `${SITE_URL}/booking-cancel`,
    noindex: true,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBF7] to-[#F5E6D8] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-warm-lg p-8 sm:p-12 max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-[#4A3F35] mb-3">Fizetés megszakítva</h1>
        <p className="text-[#635241] text-lg mb-8">
          A fizetési folyamat megszakadt. A foglalásod nem véglegesedett.
          Próbáld újra, ha szeretnél időpontot foglalni!
        </p>
        <a
          href="/#idopont"
          onClick={() => { window.location.href = '/#idopont'; }}
          className="inline-block bg-[#D4854A] hover:bg-[#B87333] text-white font-semibold px-8 py-3 rounded-xl transition-colors duration-200"
        >
          Vissza a foglaláshoz
        </a>
      </div>
    </div>
  );
}

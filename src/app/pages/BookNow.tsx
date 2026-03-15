import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import {
  Calendar as CalendarIcon,
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { getFacilityImage } from './Home';
import {
  bookingApi,
  getStoredUser,
  isAuthenticated,
  districtApi,
} from '../api';
import { SportsIcon } from '../components/SportsIcon';
import { facilities } from '../data';

export function BookNow() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  // ─── API Data ──────────────────────────────────────────────────
  const [apiDistricts, setApiDistricts] = useState<any[]>([]);
  const [apiFacilities, setApiFacilities] = useState<any[]>([]);

  // ─── State: Form ───────────────────────────────────────────────
  const [bookingType, setBookingType] = useState('time');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [selectedOrgType, setSelectedOrgType] = useState<string>('');
  const [customOrgType, setCustomOrgType] = useState<string>('');
  const [selectedEventType, setSelectedEventType] = useState<string>('');
  const [customEventType, setCustomEventType] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedFacility, setSelectedFacility] = useState<string>('');
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [bookingMode, setBookingMode] = useState<'full' | 'half' | 'slot'>('full');
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const today = new Date().toISOString().split('T')[0];
  const [bookingDate, setBookingDate] = useState<string>(today);
  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(today);

  // ─── State: Guest details ──────────────────────────────────────
  const [guestEmail, setGuestEmail] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  // ─── State: Submission / availability ──────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<number[]>([]);
  const [resultMessage, setResultMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ─── Effects ───────────────────────────────────────────────────
  // Fetch Districts on mount
  useEffect(() => {
    districtApi.getAll().then(res => {
      setApiDistricts(res.districts);
      if (res.districts.length > 0) {
        setSelectedDistrict(String(res.districts[0].id));
      }
    });

    if (isAuthenticated()) {
      const user = getStoredUser();
      if (user) {
        setGuestName(user.name);
        setGuestEmail(user.email);
        setGuestPhone(user.phone || '');
      }
    }
  }, []);

  // Fetch Facilities when District selection changes
  useEffect(() => {
    if (selectedDistrict) {
      districtApi.getFacilities(Number(selectedDistrict)).then(res => {
        setApiFacilities(res.facilities);
        if (res.facilities.length > 0) {
          setSelectedFacility(String(res.facilities[0].id));
        } else {
          setSelectedFacility('');
        }
      });
    }
  }, [selectedDistrict]);

  // ─── Handlers ──────────────────────────────────────────────────
  const handleTimeSlotToggle = (slot: string) => {
    handleValuesChange();
    setSelectedTimeSlots(prev =>
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  };

  /** Build start/end time from the booking type */
  const getBookingTimes = () => {
    if (bookingType === 'time' && selectedTimeSlots.length > 0) {
      const sorted = [...selectedTimeSlots].sort();
      const first = sorted[0].split(' - ')[0].slice(0, 5); // "06:00"
      const last = sorted[sorted.length - 1].split(' - ')[1].slice(0, 5);
      return { start_time: first, end_time: last };
    }
    // For one-day / range, default full day
    return { start_time: '08:00', end_time: '18:00' };
  };

  const getBookingDate = () => {
    return bookingType === 'range' ? startDate : bookingDate;
  };

  const handleValuesChange = () => {
    setIsAvailable(false);
    setBookedSlots([]);
    setResultMessage(null);
  };

  const handleCheckAvailability = async () => {
    setChecking(true);
    setResultMessage(null);
    setIsAvailable(false);
    try {
      const times = getBookingTimes();
      // Since we are back to static, we might need to map these static IDs to whatever the API expects,
      // or assume the API is flexible. For this revert, we just pass the static IDs.
      const selectedFacilityObj = apiFacilities.find(f => String(f.id) === selectedFacility);
      const sportObj = selectedFacilityObj?.sports?.find((s: any) => s.name === selectedSport);

      const res = await bookingApi.checkAvailability({
        district_id: Number(selectedDistrict),
        facility_id: Number(selectedFacility),
        sport_id: sportObj ? sportObj.id : undefined,
        booking_date: getBookingDate(),
        booking_mode: bookingMode,
        slots: selectedSlots.length > 0 ? selectedSlots : undefined,
        total_slots: maxSlots,
        ...times,
      });
      // Update booked slots from API response
      if (res.booked_slots) {
        setBookedSlots(res.booked_slots);
      }
      setResultMessage({
        type: res.available ? 'success' : 'error',
        text: res.message,
      });
      if (res.available) {
        setIsAvailable(true);
      }
    } catch (err: any) {
      setResultMessage({
        type: 'error',
        text: err.errors
          ? Object.values(err.errors).flat().join(' ')
          : err.message || 'Failed to check availability.',
      });
    } finally {
      setChecking(false);
    }
  };

  const handleSubmitBooking = async () => {
    setSubmitting(true);
    setResultMessage(null);
    try {
      const times = getBookingTimes();
      const orgType =
        selectedOrgType === 'other' ? customOrgType : selectedOrgType;
      const evtType =
        selectedEventType === 'other' ? customEventType : selectedEventType;

      const selectedFacilityObj = apiFacilities.find(f => String(f.id) === selectedFacility);
      const sportObj = selectedFacilityObj?.sports?.find((s: any) => s.name === selectedSport);

      const res = await bookingApi.create({
        district_id: Number(selectedDistrict),
        facility_id: Number(selectedFacility),
        sport_id: sportObj ? sportObj.id : undefined,
        booking_date: getBookingDate(),
        booking_end_date: bookingType === 'range' ? endDate : undefined,
        ...times,
        organization_type: orgType || undefined,
        event_type: evtType || undefined,
        booking_mode: bookingMode,
        slots: selectedSlots.length > 0 ? selectedSlots : undefined,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
      });
      setResultMessage({ type: 'success', text: res.message });
    } catch (err: any) {
      setResultMessage({
        type: 'error',
        text: err.errors
          ? Object.values(err.errors).flat().join(' ')
          : err.message || 'Failed to submit booking.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── UI Constants ──────────────────────────────────────────────

  const bookingTypes = [
    {
      id: 'time',
      title: t('booking.time'),
      sub: t('booking.timeDesc'),
      activeClass: 'border-[#0070FF] bg-[#F2F8FF] text-[#0070FF]'
    },
    {
      id: 'one-day',
      title: t('booking.oneDay'),
      sub: t('booking.oneDayDesc'),
      activeClass: 'border-[#008060] bg-[#F4F9F6] text-[#008060]'
    },
    {
      id: 'range',
      title: t('booking.range'),
      sub: t('booking.rangeDesc'),
      activeClass: 'border-[#C8811A] bg-[#FFF9F0] text-[#C8811A]'
    },
  ];

  const timeSlots = [
    '06:00:00 - 07:00:00', '07:00:00 - 08:00:00', '08:00:00 - 09:00:00',
    '09:00:00 - 10:00:00', '10:00:00 - 11:00:00', '11:00:00 - 12:00:00',
    '12:00:00 - 13:00:00', '13:00:00 - 14:00:00', '14:00:00 - 15:00:00',
    '15:00:00 - 16:00:00', '16:00:00 - 17:00:00', '17:00:00 - 18:00:00',
    '18:00:00 - 19:00:00', '19:00:00 - 20:00:00', '20:00:00 - 21:00:00',
    '21:00:00 - 22:00:00'
  ];

  // Determine which facility list to show
  const facilityOptions = apiFacilities;

  // Get sports for the selected facility
  const selectedFacilityObj = apiFacilities.find(f => String(f.id) === selectedFacility);
  const facilitySports = selectedFacilityObj?.sports?.map((s: any) => s.name) || [];

  // Slot configuration: which sports support slots, per district name
  const slotConfig: Record<string, Record<string, number>> = {
    'Badminton': {
      'Vavuniya': 4,
      'Kilinochchi': 6,
    },
  };

  // Get the selected sport name and district name for slot logic
  const selectedDistrictObj = apiDistricts.find(d => String(d.id) === selectedDistrict);
  const sportName = selectedSport || '';
  const districtName = selectedDistrictObj?.name || '';
  const hasSlotOption = !!selectedSport;
  const defaultSlots = 2;
  const maxSlots = (slotConfig[sportName] && slotConfig[sportName][districtName]) ? slotConfig[sportName][districtName] : defaultSlots;

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#F9FAFB] font-['Montserrat'] antialiased">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* ─── Main Booking Form Card ─── */}
        <div className="bg-white rounded-[16px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-8 md:p-12 mb-20">

          {/* District & Facility selectors */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full max-w-xs">
              <Label className="text-[11px] font-semibold text-gray-800 uppercase tracking-tighter">{t('booking.selectDistrict')}</Label>
              <Select value={selectedDistrict} onValueChange={(val) => { setSelectedDistrict(val); handleValuesChange(); }}>
                <SelectTrigger className="h-12 border-gray-200 bg-white rounded-[4px] px-4 text-[14px] text-gray-404">
                  <SelectValue placeholder={t('booking.chooseDistrict')} />
                </SelectTrigger>
                <SelectContent className="rounded-lg shadow-2xl bg-white text-black">
                  {apiDistricts.map((d: any) => (
                    <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full max-w-xs">
              <Label className="text-[11px] font-semibold text-gray-800 uppercase tracking-tighter">{t('booking.selectFacility')}</Label>
              <Select key={`facility-select-${selectedDistrict}`} value={selectedFacility} onValueChange={(val) => { setSelectedFacility(val); setSelectedSport(''); setBookingMode('full'); setSelectedSlots([]); handleValuesChange(); }}>
                <SelectTrigger className="h-12 border-gray-200 bg-white rounded-[4px] px-4 text-[14px] text-gray-404">
                  <SelectValue placeholder={t('booking.chooseFacility')} />
                </SelectTrigger>
                <SelectContent className="rounded-lg shadow-2xl bg-white text-black">
                  {apiFacilities.map((f: any) => (
                    <SelectItem key={f.id} value={String(f.id)}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ─── Sport/Game Selection ─── */}
          {selectedFacility && facilitySports.length > 0 && (
            <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
              <h3 className="text-xl font-bold text-[#1a2744] mb-5">{t('booking.sports')}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {facilitySports.map((sport: string) => (
                  <button
                    key={sport}
                    onClick={() => { setSelectedSport(sport); setBookingMode('full'); setSelectedSlots([]); handleValuesChange(); }}
                    className={`group relative rounded-[16px] border-2 transition-all flex flex-col items-center overflow-hidden ${sport === selectedSport
                      ? 'border-[#1a5632] bg-[#F4F9F6] shadow-lg ring-2 ring-[#1a5632]/20'
                      : 'border-gray-100 bg-[#f5f5f5] hover:border-gray-200 hover:shadow-md'
                      }`}
                  >
                    <div className="w-full flex items-center justify-center p-4">
                      <SportsIcon sport={sport} className={`w-8 h-8 transition-transform duration-200 group-hover:scale-110 ${sport === selectedSport ? 'text-[#1a5632]' : 'text-[#2a2a2a]'}`} />
                    </div>
                    <div className={`w-full py-3 text-center text-[14px] font-semibold ${sport === selectedSport ? 'text-[#1a5632]' : 'text-[#333]'}`}>
                      {sport}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─── Full / Half / Slot Booking Mode ─── */}
          {selectedSport && (
            <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label className="text-[11px] font-semibold text-gray-800 uppercase tracking-tighter mb-3 block">{t('booking.bookingMode')}</Label>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => { setBookingMode('full'); setSelectedSlots(Array.from({ length: maxSlots }, (_, i) => i + 1)); handleValuesChange(); }}
                  className={`relative px-6 py-4 rounded-[12px] border-2 transition-all text-left flex flex-col gap-1 min-w-[180px] ${bookingMode === 'full'
                    ? 'border-[#008060] bg-[#F4F9F6] text-[#008060] shadow-md'
                    : 'border-gray-100 bg-white hover:border-gray-200 text-gray-600'
                    }`}
                >
                  <span className="font-semibold text-[15px]">{t('booking.full')}</span>
                  <span className="text-[11px] font-medium opacity-70">{t('booking.fullDesc')}</span>
                </button>

                {selectedSport !== 'Badminton' && (
                  <button
                    onClick={() => { setBookingMode('half'); setSelectedSlots(Array.from({ length: Math.floor(maxSlots / 2) || 1 }, (_, i) => i + 1)); handleValuesChange(); }}
                    className={`relative px-6 py-4 rounded-[12px] border-2 transition-all text-left flex flex-col gap-1 min-w-[180px] ${bookingMode === 'half'
                      ? 'border-[#E88C0C] bg-[#FFF8EF] text-[#E88C0C] shadow-md'
                      : 'border-gray-100 bg-white hover:border-gray-200 text-gray-600'
                      }`}
                  >
                    <span className="font-semibold text-[15px]">{t('booking.half')}</span>
                    <span className="text-[11px] font-medium opacity-70">{t('booking.halfDesc')}</span>
                  </button>
                )}

                {selectedSport === 'Badminton' && (
                  <button
                    onClick={() => { setBookingMode('slot'); setSelectedSlots([]); handleValuesChange(); }}
                    className={`relative px-6 py-4 rounded-[12px] border-2 transition-all text-left flex flex-col gap-1 min-w-[180px] ${bookingMode === 'slot'
                      ? 'border-[#0070FF] bg-[#F2F8FF] text-[#0070FF] shadow-md'
                      : 'border-gray-100 bg-white hover:border-gray-200 text-gray-600'
                      }`}
                  >
                    <span className="font-semibold text-[15px]">{t('booking.slots')}</span>
                    <span className="text-[11px] font-medium opacity-70">{t('booking.slotDesc')}</span>
                  </button>
                )}
              </div>

              {bookingMode === 'slot' && (
                <div className="mt-4 p-5 bg-[#F2F8FF] rounded-[12px] border border-blue-100 animate-in fade-in slide-in-from-top-1 duration-200">
                  <Label className="text-[11px] font-semibold text-[#0070FF] uppercase tracking-tighter mb-3 block">
                    {t('booking.selectSlots', { count: maxSlots })}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: maxSlots }, (_, i) => i + 1).map((slot) => {
                      const isBooked = bookedSlots.includes(slot);
                      return (
                        <button
                          key={slot}
                          disabled={isBooked}
                          onClick={() => {
                            if (isBooked) return;
                            setSelectedSlots(prev =>
                              prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot].sort((a, b) => a - b)
                            );
                            handleValuesChange();
                          }}
                          className={`w-12 h-12 rounded-[8px] border-2 font-bold text-[15px] transition-all ${
                            isBooked
                              ? 'border-red-200 bg-red-50 text-red-400 cursor-not-allowed opacity-70'
                              : selectedSlots.includes(slot)
                                ? 'border-[#0070FF] bg-[#0070FF] text-white shadow-md'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-[#0070FF] hover:text-[#0070FF]'
                          }`}
                          title={isBooked ? t('booking.slotBooked', { slot }) : ''}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Booking Type Cards & Dynamic Date/Time Section */}
          <div className="grid grid-cols-12 gap-6 mb-10">
            <div className="col-span-12 lg:col-span-6 grid md:grid-cols-3 gap-5">
              {bookingTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => { setBookingType(type.id); handleValuesChange(); }}
                  className={`relative p-6 rounded-[12px] border-2 transition-all text-left flex flex-col gap-2 h-[180px] ${bookingType === type.id
                    ? type.activeClass
                    : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                >
                  <span className={`font-semibold text-lg ${bookingType === type.id ? 'inherit' : 'text-gray-400'}`}>
                    {type.title}
                  </span>
                  <span className={`text-[12px] font-medium leading-relaxed whitespace-pre-line ${bookingType === type.id ? 'inherit opacity-70' : 'text-gray-400'}`}>
                    {type.sub}
                  </span>
                </button>
              ))}
            </div>

            <div className="col-span-12 lg:col-span-6">
              <div className="bg-white rounded-[12px] border border-gray-100 p-6 min-h-[250px]">
                {bookingType === 'time' && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-top-1 duration-300">
                    <div className="space-y-2">
                      <Label className="text-gray-800 font-bold text-[15px]">Booking Date</Label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={bookingDate}
                          min={today}
                          onChange={(e) => { setBookingDate(e.target.value); handleValuesChange(); }}
                          className="h-12 rounded-lg border-gray-200 bg-white pl-4 pr-10 focus:ring-gray-300 text-[14px] text-gray-700"
                        />
                        <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2.5">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleTimeSlotToggle(slot)}
                          className={`py-2.5 px-2 text-[12.5px] font-medium whitespace-nowrap border rounded-lg transition-all ${
                            selectedTimeSlots.includes(slot)
                              ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                              : 'border-gray-100 bg-[#f8f9fa] text-gray-600 hover:border-blue-300 hover:text-blue-600'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {bookingType === 'one-day' && (
                  <div className="space-y-2">
                    <Label className="text-[#333] font-semibold mb-2 block text-[13px]">{t('booking.bookingDate')}</Label>
                    <div className="relative">
                      <Input
                        type="date"
                        value={bookingDate}
                        min={today}
                        onChange={(e) => { setBookingDate(e.target.value); handleValuesChange(); }}
                        className="h-12 rounded-[6px] border-gray-200 bg-white pl-4 pr-10 focus:ring-gray-300 text-[13px]"
                      />
                      <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                )}

                {bookingType === 'range' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[#333] font-semibold mb-2 block text-[13px]">{t('booking.startDate')}</Label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={startDate}
                          min={today}
                          onChange={(e) => { setStartDate(e.target.value); handleValuesChange(); }}
                          className="h-12 rounded-[6px] border-gray-200 bg-white pl-4 pr-10 text-[12px] focus:ring-gray-300"
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#333] font-semibold mb-2 block text-[13px]">{t('booking.endDate')}</Label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={endDate}
                          min={startDate}
                          onChange={(e) => { setEndDate(e.target.value); handleValuesChange(); }}
                          className="h-12 rounded-[6px] border-gray-200 bg-white pl-4 pr-10 text-[12px] focus:ring-gray-300"
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Organization & Event Type Selection */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-3">
              <Label className="text-[11px] font-semibold text-gray-800 uppercase tracking-tighter">{t('booking.orgType')}</Label>
              <Select value={selectedOrgType} onValueChange={(val) => { setSelectedOrgType(val); handleValuesChange(); }}>
                <SelectTrigger className="h-12 border-gray-200 bg-white rounded-[4px] px-4 text-[14px] text-gray-404">
                  <SelectValue placeholder={t('booking.selectOrgType')} />
                </SelectTrigger>
                <SelectContent className="rounded-lg shadow-2xl bg-white text-black">
                  <SelectItem value="govt-schools">{t('booking.govtSchools')}</SelectItem>
                  <SelectItem value="club">{t('booking.club')}</SelectItem>
                  <SelectItem value="intl-schools">{t('booking.intlSchools')}</SelectItem>
                  <SelectItem value="international">{t('booking.international')}</SelectItem>
                  <SelectItem value="other">{t('booking.other')}</SelectItem>
                </SelectContent>
              </Select>
              {selectedOrgType === 'other' && (
                <Input
                  type="text"
                  value={customOrgType}
                  onChange={(e) => { setCustomOrgType(e.target.value); handleValuesChange(); }}
                  placeholder={t('booking.enterOrgType')}
                  className="h-12 border-gray-200 bg-white rounded-[4px] placeholder:text-gray-300 text-[14px] focus:border-gray-400 focus:ring-0 transition-colors"
                />
              )}
            </div>
            <div className="space-y-3">
              <Label className="text-[11px] font-semibold text-gray-800 uppercase tracking-tighter">{t('booking.eventType')}</Label>
              <Select value={selectedEventType} onValueChange={(val) => { setSelectedEventType(val); handleValuesChange(); }}>
                <SelectTrigger className="h-12 border-gray-200 bg-white rounded-[4px] px-4 text-[14px] text-gray-404">
                  <SelectValue placeholder={t('booking.selectEventType')} />
                </SelectTrigger>
                <SelectContent className="rounded-lg shadow-2xl bg-white text-black">
                  <SelectItem value="practice">{t('booking.practice')}</SelectItem>
                  <SelectItem value="tournament">{t('booking.tournament')}</SelectItem>
                  <SelectItem value="event">{t('booking.event')}</SelectItem>
                  {/* <SelectItem value="private">{t('booking.private')}</SelectItem>*/}
                  
                  <SelectItem value="other">{t('booking.other')}</SelectItem>
                </SelectContent>
              </Select>
              {selectedEventType === 'other' && (
                <Input
                  type="text"
                  value={customEventType}
                  onChange={(e) => { setCustomEventType(e.target.value); handleValuesChange(); }}
                  placeholder={t('booking.enterEventType')}
                  className="h-12 border-gray-200 bg-white rounded-[4px] placeholder:text-gray-300 text-[14px] focus:border-gray-400 focus:ring-0 transition-colors"
                />
              )}
            </div>
          </div>

          {/* Action Button: Check Availability */}
          <div className="flex justify-center mb-10 pb-10 border-b border-gray-100">
            <Button
              onClick={handleCheckAvailability}
              disabled={checking || !selectedFacility || !selectedDistrict || !selectedOrgType || !selectedEventType}
              className="h-13 px-12 bg-[#0070FF] hover:bg-blue-600 text-white rounded-[8px] text-[15px] font-bold transition-all shadow-md disabled:opacity-50"
            >
              {checking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {checking ? t('booking.checking') : t('booking.checkAvailability')}
            </Button>
          </div>

          {/* Result message */}
          {resultMessage && (
            <div className={`flex items-center gap-3 p-4 rounded-lg border mb-8 ${resultMessage.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
              }`}>
              {resultMessage.type === 'success'
                ? <CheckCircle2 className="w-5 h-5 shrink-0" />
                : <XCircle className="w-5 h-5 shrink-0" />}
              <span className="text-sm font-medium">{resultMessage.text}</span>
            </div>
          )}

          {/* Your Details - ONLY SHOWN IF AVAILABLE */}
          {isAvailable && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-gray-900">{t('booking.yourDetails')}</h2>
                <p className="text-sm text-gray-500">{t('booking.detailsDesc')}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <Label className="text-[11px] font-semibold text-gray-800 uppercase tracking-tighter">{t('booking.yourName')}</Label>
                  <Input
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="h-12 border-gray-200 bg-white rounded-[4px] placeholder:text-gray-300 text-[14px] focus:border-gray-400 focus:ring-0 transition-colors"
                    placeholder={t('booking.fullName')}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[11px] font-semibold text-gray-800 uppercase tracking-tighter">{t('booking.yourEmail')}</Label>
                  <Input
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="h-12 border-gray-200 bg-white rounded-[4px] placeholder:text-gray-300 text-[14px] focus:border-gray-400 focus:ring-0 transition-colors"
                    placeholder="example@email.com"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[11px] font-semibold text-gray-800 uppercase tracking-tighter">{t('booking.yourPhone')}</Label>
                  <Input
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="h-12 border-gray-200 bg-white rounded-[4px] placeholder:text-gray-300 text-[14px] focus:border-gray-400 focus:ring-0 transition-colors"
                    placeholder="+94 7X XXX XXXX"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button
                  onClick={handleSubmitBooking}
                  disabled={submitting || !guestName || !guestEmail || !guestPhone}
                  className="h-12 px-10 bg-black hover:bg-gray-900 text-white rounded-[8px] text-[14px] font-bold transition-all border-none disabled:opacity-50 shadow-lg"
                >
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t('booking.sendRequest')}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ─── Our Facilities Cards Section ─── */}
        <section className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-gray-900 mb-4 tracking-tight">{t('about.ourFacilities')}</h2>
            <div className="w-20 h-1.5 bg-black mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {apiFacilities.map((fac: any) => {
              const name = currentLang === 'si' ? (fac.name_si || fac.name) : currentLang === 'ta' ? (fac.name_ta || fac.name) : fac.name;
              const desc = currentLang === 'si' ? (fac.description_si || fac.description) : currentLang === 'ta' ? (fac.description_ta || fac.description) : fac.description;
              return (
                <div key={fac.id} className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-8 border-4 border-gray-50 group-hover:border-gray-100 transition-colors mx-auto">
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                      <img
                        src={getFacilityImage(fac)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={name}
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 text-center">
                    {desc}
                  </p>
                  <div className="mt-auto pt-4 flex justify-center">
                    <Link to={`/facilities/${fac.slug}`} className="text-blue-500 text-sm font-semibold flex items-center gap-1.5 hover:gap-2.5 transition-all">
                      {t('booking.view')} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        
        {/* ─── Facility Pricing Details Section ─── */}
        <section className="mt-32 pb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-gray-900 mb-4 tracking-tight">{t('booking.pricingTable') || 'Pricing Table'}</h2>
            <div className="w-20 h-1.5 bg-black mx-auto rounded-full" />
          </div>

          <div className="space-y-24">
            {facilities
              .filter(fac => ['outdoor-stadium', 'swimming-pool', 'indoor-stadium', 'basketball-court'].includes(fac.slug))
              .map((fac) => {
              const name = currentLang === 'si' ? fac.nameSi : currentLang === 'ta' ? fac.nameTa : fac.name;
              const hasPricing = fac.pricingData.competition.length > 0 || fac.pricingData.practices.length > 0 || fac.pricingData.refundableDeposits.length > 0;
              
              if (!hasPricing) return null;

              return (
                <div key={fac.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h3 className="text-2xl font-bold text-[#1a5632] mb-8 pb-2 border-b-2 border-green-50 uppercase tracking-wide">
                    {name} {/* Price List*/}
                  </h3>

                  <div className="space-y-12 pl-4">
                    {/* Competition Table */}
                    {fac.pricingData.competition.length > 0 && (
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 mb-4">
                          Competition / Meet / Tournament
                        </h4>
                        <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                  <tr className="bg-[#1a2744] text-white text-[11px] uppercase tracking-wider">
                                    <th className="px-4 py-4 text-left font-bold w-12">No</th>
                                    <th className="px-4 py-4 text-left font-bold">Events</th>
                                    <th className="px-4 py-4 text-left font-bold">Sports</th>
                                    <th className="px-4 py-4 text-left font-bold">Duration</th>
                                    <th className="px-4 py-4 text-right font-bold">Government Schools (Rs.)</th>
                                    <th className="px-4 py-4 text-right font-bold">Club/Institute (Rs.)</th>
                                    <th className="px-4 py-4 text-right font-bold">International Schools (Rs.)</th>
                                    <th className="px-4 py-4 text-right font-bold">International (Rs.)</th>
                                  </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-50">
                                {fac.pricingData.competition.map((row) => (
                                  <tr key={row.no} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-4 text-gray-500 text-sm">{row.no}</td>
                                    <td className="px-4 py-4 text-gray-700 text-sm leading-relaxed">{currentLang === 'si' ? row.eventSi : currentLang === 'ta' ? row.eventTa : row.event}</td>
                                    <td className="px-4 py-4 text-gray-500 text-[13px] leading-relaxed">{currentLang === 'si' ? row.sportsSi : currentLang === 'ta' ? row.sportsTa : row.sports}</td>
                                    <td className="px-4 py-4 text-gray-700 text-sm whitespace-nowrap">{row.duration}</td>
                                    <td className="px-4 py-4 text-right text-gray-700 text-sm">{row.govtSchools.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-4 text-right text-gray-700 text-sm">{row.club.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-4 text-right text-gray-700 text-sm">{row.intlSchools.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-4 text-right text-gray-700 text-sm">{row.international.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Practices Table */}
                    {fac.pricingData.practices.length > 0 && (
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 mb-4">
                          Practices
                        </h4>
                        <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-[#1a2744] text-white text-[11px] uppercase tracking-wider">
                                  <th className="px-4 py-4 text-left font-bold w-12">No</th>
                                  <th className="px-4 py-4 text-left font-bold">Events</th>
                                  <th className="px-4 py-4 text-left font-bold">Sports</th>
                                  <th className="px-4 py-4 text-left font-bold">Duration</th>
                                  <th className="px-4 py-4 text-right font-bold">Government Schools (Rs.)</th>
                                  <th className="px-4 py-4 text-right font-bold">Club/Institute (Rs.)</th>
                                  <th className="px-4 py-4 text-right font-bold">International Schools (Rs.)</th>
                                  <th className="px-4 py-4 text-right font-bold">International (Rs.)</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-50">
                                {fac.pricingData.practices.map((row) => (
                                  <tr key={row.no} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-4 text-gray-500 text-sm">{row.no}</td>
                                    <td className="px-4 py-4 text-gray-700 text-sm leading-relaxed">{currentLang === 'si' ? row.eventSi : currentLang === 'ta' ? row.eventTa : row.event}</td>
                                    <td className="px-4 py-4 text-gray-500 text-[13px] leading-relaxed">{currentLang === 'si' ? row.sportsSi : currentLang === 'ta' ? row.sportsTa : row.sports}</td>
                                    <td className="px-4 py-4 text-gray-700 text-sm whitespace-nowrap">{row.duration}</td>
                                    <td className="px-4 py-4 text-right text-gray-700 text-sm">{row.govtSchools.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-4 text-right text-gray-700 text-sm">{row.club.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-4 text-right text-gray-700 text-sm">{row.intlSchools.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-4 text-right text-gray-700 text-sm">{row.international.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Refundable Deposits Table */}
                    {fac.pricingData.refundableDeposits.length > 0 && (
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 mb-4">
                          Refundable Deposits
                        </h4>
                        <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-[#1a2744] text-white text-[11px] uppercase tracking-wider">
                                  <th className="px-4 py-4 text-left font-bold w-12">No</th>
                                  <th className="px-4 py-4 text-left font-bold">Customer Type</th>
                                  <th className="px-4 py-4 text-left font-bold">Duration</th>
                                  <th className="px-4 py-4 text-right font-bold">Deposit (Rs.)</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-50">
                                {fac.pricingData.refundableDeposits.map((row) => (
                                  <tr key={row.no} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-4 text-gray-500 text-sm">{row.no}</td>
                                    <td className="px-4 py-4 text-gray-700 text-sm leading-relaxed">{currentLang === 'si' ? row.customerTypeSi : currentLang === 'ta' ? row.customerTypeTa : row.customerType}</td>
                                    <td className="px-4 py-4 text-gray-700 text-sm whitespace-nowrap">{row.duration}</td>
                                    <td className="px-4 py-4 text-right text-gray-700 text-sm">{row.deposit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>


      </div>
    </div>
  );
}

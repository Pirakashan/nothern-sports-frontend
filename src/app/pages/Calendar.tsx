import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Calendar as CalendarIcon } from 'lucide-react';

import { Card, CardContent } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { CustomCalendar } from '../components/CustomCalendar';
import {
  districtApi,
  calendarApi,
  type District,
  type CalendarEntry,
} from '../api';
import { facilities } from '../data';

export function Calendar() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedFacility, setSelectedFacility] = useState<string>('all');

  // ─── API state ─────────────────────────────────────────────────
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // ─── Fetch districts on mount ──────────────────────────────────
  useEffect(() => {
    districtApi
      .getAll()
      .then((res) => {
        // Only show Vavuniya and Kilinochchi
        const filtered = res.districts.filter(d =>
          ['vavuniya', 'kilinochchi'].includes(d.name.toLowerCase())
        );
        setDistricts(filtered);

        // Default to Vavuniya if found, otherwise first available
        const vavuniya = filtered.find(d => d.name.toLowerCase() === 'vavuniya');
        if (vavuniya) {
          setSelectedDistrict(String(vavuniya.id));
        } else if (filtered.length > 0) {
          setSelectedDistrict(String(filtered[0].id));
        }

        setLoadingDistricts(false);
      })
      .catch((err) => {
        console.error("Error fetching districts:", err);
        setLoadingDistricts(false);
      });
  }, []);

  // Only show the 4 main sports facilities in the calendar dropdown
  const allowedFacilitySlugs = ['outdoor-stadium', 'swimming-pool', 'indoor-stadium', 'basketball-court'];
  const displayFacilities = facilities.filter(f => allowedFacilitySlugs.includes(f.slug));

  // ─── Fetch calendar events when district changes ───────────────
  useEffect(() => {
    if (!selectedDistrict) {
      console.log("No district selected");
      return;
    }
    console.log("Fetching events for district:", selectedDistrict);
    setLoadingEvents(true);
    calendarApi
      .getEvents(Number(selectedDistrict))
      .then((res) => {
        console.log("RAW API RESPONSE for district " + selectedDistrict + ":", res);
        // Transform API events to match CustomCalendar format
        const transformed = (res.calendar || []).map((ev: any) => ({
          id: ev.id,
          title: ev.user_name || 'Booked',
          date: ev.date,
          end_date: ev.end_date || ev.date, // Default to start date if no end date
          start_time: ev.start_time,
          end_time: ev.end_time,
          facility_slug: ev.facility_slug,
          facility_name: ev.facility || 'Facility',
          user_name: ev.user_name || 'User',
          status: ev.status, // API returns 'confirmed' for approved bookings
        }));
        console.log("TRANSFORMED EVENTS:", transformed);
        console.log("TOTAL EVENTS:", transformed.length);
        setCalendarEvents(transformed);
        setLoadingEvents(false);
      })
      .catch((err) => {
        console.error("Error fetching calendar events:", err);
        setLoadingEvents(false);
      });
  }, [selectedDistrict]);

  // ─── Filter events by selected facility ──────────────────────
  const filteredEvents = useMemo(() => {
    const filtered = calendarEvents.filter(ev => {
      if (selectedFacility === 'all') return true;
      return ev.facility_slug.toLowerCase().includes(selectedFacility.toLowerCase());
    });
    console.log("FILTERED EVENTS:", { selectedFacility, count: filtered.length, events: filtered });
    return filtered;
  }, [calendarEvents, selectedFacility]);

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50/50">
      <div className="container mx-auto px-4 max-w-[1400px]">
        {/* Green Header Bar */}
        <div className="bg-[#1a5632] rounded-t-2xl px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-6 h-6 text-white/90" />
            <h1 className="text-xl font-bold text-white">{t('calendar.title')}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-200 text-green-900 uppercase tracking-wider">
              {t('calendar.publicView')}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* District Filter */}
            <div className="w-52">
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="bg-white/95 border-0 shadow-sm h-9 px-3 rounded-lg text-sm font-medium text-gray-700">
                  <SelectValue placeholder={loadingDistricts ? t('calendar.loading') : t('calendar.selectDistrictPlaceholder')} />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-xl">
                  {districts.map((d) => (
                    <SelectItem
                      key={d.id}
                      value={String(d.id)}
                      className="py-2 px-3 text-sm font-medium cursor-pointer"
                    >
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Facility Filter */}
            <div className="w-52">
              <Select value={selectedFacility} onValueChange={setSelectedFacility}>
                <SelectTrigger className="bg-white/95 border-0 shadow-sm h-9 px-3 rounded-lg text-sm font-medium text-gray-700">
                  <SelectValue placeholder={t('calendar.allFacilities')} />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-xl">
                  <SelectItem value="all" className="py-2 px-3 text-sm font-medium cursor-pointer italic">
                    {t('calendar.allFacilities')}
                  </SelectItem>
                  {displayFacilities.map((facility) => {
                    const name = currentLang === 'si' ? facility.nameSi : currentLang === 'ta' ? facility.nameTa : facility.name;
                    return (
                      <SelectItem
                        key={facility.id}
                        value={facility.slug}
                        className="py-2 px-3 text-sm font-medium cursor-pointer"
                      >
                        {name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Calendar Card */}
        <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-b-2xl rounded-t-none relative min-h-[600px]">
          <CardContent className="p-0 relative">
            {loadingEvents && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-[50] flex flex-col items-center justify-center transition-opacity duration-300">
                <div className="bg-white/90 p-6 rounded-2xl shadow-xl flex flex-col items-center gap-3 border border-slate-100">
                  <Loader2 className="w-10 h-10 animate-spin text-[#1a5632]" />
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#0f172a]">{t('calendar.syncing')}</p>
                    <p className="text-sm text-slate-500">{t('calendar.fetching')}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="min-h-[700px] p-4 md:p-6 calendar-container bg-white overflow-visible">
              <CustomCalendar events={filteredEvents} view={view} onViewChange={setView} />
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 p-4 bg-white rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50">
            <div className="w-3 h-3 rounded-sm bg-[#48bb78]" />
            <span className="text-xs font-semibold text-gray-700">{t('facilities.indoorStadium')}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50">
            <div className="w-3 h-3 rounded-sm bg-[#ed8936]" />
            <span className="text-xs font-semibold text-gray-700">{t('facilities.basketballCourt')}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50">
            <div className="w-3 h-3 rounded-sm bg-[#4299e1]" />
            <span className="text-xs font-semibold text-gray-700">{t('facilities.swimmingPool')}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50">
            <div className="w-3 h-3 rounded-sm bg-[#e53e3e]" />
            <span className="text-xs font-semibold text-gray-700">{t('facilities.outdoorStadium')}</span>
          </div>
          {/*<div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50">
            <div className="w-3 h-3 rounded-sm bg-[#9f7aea]" />
            <span className="text-xs font-semibold text-gray-700">Cricket</span>
          </div>*/}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  addWeeks,
  isSameMonth,
  isSameDay,
  parseISO,
} from 'date-fns';

interface BookingEvent {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD (start date)
  end_date: string; // YYYY-MM-DD (end date)
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  facility_slug: string;
  facility_name: string;
  user_name: string;
  status: 'confirmed' | 'pending' | 'rejected' | 'approved';
}

interface FacilityColor {
  [key: string]: { bg: string; text: string; border: string };
}

const FACILITY_COLORS: FacilityColor = {
  'indoor-stadium': {
    bg: '#48bb78',
    text: '#fff',
    border: '#38a169',
  },
  'outdoor-stadium': {
    bg: '#e53e3e',
    text: '#fff',
    border: '#c53030',
  },
  'basketball-court': {
    bg: '#ed8936',
    text: '#fff',
    border: '#dd6b20',
  },
  'swimming-pool': {
    bg: '#4299e1',
    text: '#fff',
    border: '#3182ce',
  },
  'cricket': {
    bg: '#9f7aea',
    text: '#fff',
    border: '#805ad5',
  },
};

interface CustomCalendarProps {
  events: BookingEvent[];
  view: 'month' | 'week' | 'day';
  onViewChange?: (view: 'month' | 'week' | 'day') => void;
}

export function CustomCalendar({ events, view, onViewChange }: CustomCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { t } = useTranslation();

  // Only show confirmed (approved) bookings on the calendar
  const approvedEvents = useMemo(() => {
    return events.filter(event => event.status === 'confirmed');
  }, [events]);

  const getColorForFacility = (slug: string) => {
    const key = slug?.toLowerCase() || 'indoor-stadium';
    for (const [facility, colors] of Object.entries(FACILITY_COLORS)) {
      if (key.includes(facility.split('-')[0]) || facility.includes(key.split('-')[0])) {
        return colors;
      }
    }
    return FACILITY_COLORS['indoor-stadium'];
  };

  const handleViewChange = (newView: 'month' | 'week' | 'day') => {
    onViewChange?.(newView);
  };

  if (view === 'month') {
    return <MonthView date={currentDate} setDate={setCurrentDate} events={approvedEvents} getColor={getColorForFacility} onViewChange={handleViewChange} />;
  } else if (view === 'week') {
    return <WeekView date={currentDate} setDate={setCurrentDate} events={approvedEvents} getColor={getColorForFacility} onViewChange={handleViewChange} />;
  } else {
    return <DayView date={currentDate} setDate={setCurrentDate} events={approvedEvents} getColor={getColorForFacility} onViewChange={handleViewChange} />;
  }
}

// ─── Helper: format time as 12h ───
function formatTime12h(time: string): string {
  const [hStr, mStr] = time.split(':');
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h.toString().padStart(2, '0')}:${mStr} ${ampm}`;
}

// ─── Shared Navigation Header ───
interface NavHeaderProps {
  title: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  activeView: 'month' | 'week' | 'day';
  onViewChange: (view: 'month' | 'week' | 'day') => void;
  t: (key: string) => string;
}

function NavHeader({ title, onPrev, onNext, onToday, activeView, onViewChange, t }: NavHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4 px-1">
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors border border-gray-300"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={onToday}
          className="px-4 py-1.5 rounded-md border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {t('calendar.today')}
        </button>
        <button
          onClick={onNext}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors border border-gray-300"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <h2 className="text-xl font-bold text-gray-800 tracking-wide">
        {title}
      </h2>

      <div className="flex rounded-lg overflow-hidden border border-gray-300">
        {(['month', 'week', 'day'] as const).map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={`px-4 py-1.5 text-sm font-semibold transition-colors ${
              activeView === v
                ? 'bg-[#1a73e8] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } ${v !== 'month' ? 'border-l border-gray-300' : ''}`}
          >
            {t(`calendar.${v}`)}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────── MONTH VIEW ───────────
interface MonthViewProps {
  date: Date;
  setDate: (date: Date) => void;
  events: BookingEvent[];
  getColor: (slug: string) => any;
  onViewChange?: (view: 'month' | 'week' | 'day') => void;
}

function MonthView({ date, setDate, events, getColor, onViewChange }: MonthViewProps) {
  const { t } = useTranslation();
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Group days into weeks
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Get all events for a given day (including multi-day spans)
  const getEventsForDay = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return events.filter(event => {
      const eventEnd = event.end_date || event.date;
      return dateStr >= event.date && dateStr <= eventEnd;
    });
  };

  return (
    <div className="w-full">
      <NavHeader
        title={format(date, 'MMMM yyyy')}
        onPrev={() => setDate(addMonths(date, -1))}
        onNext={() => setDate(addMonths(date, 1))}
        onToday={() => setDate(new Date())}
        activeView="month"
        onViewChange={onViewChange || (() => {})}
        t={t}
      />

      {/* Calendar Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-[#f8f9fa] border-b border-gray-200">
          {[t('calendar.sun'), t('calendar.mon'), t('calendar.tue'), t('calendar.wed'), t('calendar.thu'), t('calendar.fri'), t('calendar.sat')].map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        {weeks.map((weekDays, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 border-b border-gray-200 last:border-b-0">
            {weekDays.map((day, dayIdx) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, date);
              const isToday = isSameDay(day, new Date());

              // Sort events by start_time
              const sortedEvents = [...dayEvents].sort((a, b) => a.start_time.localeCompare(b.start_time));

              return (
                <div
                  key={dayIdx}
                  className={`border-r border-gray-200 last:border-r-0 min-h-[120px] flex flex-col ${
                    !isCurrentMonth ? 'bg-gray-50/60' : 'bg-white'
                  } ${isToday ? 'ring-2 ring-inset ring-[#1a73e8]' : ''}`}
                >
                  {/* Day Number */}
                  <div className="flex justify-end p-1">
                    <span
                      className={`text-xs font-semibold leading-none ${
                        isToday
                          ? 'bg-[#1a73e8] text-white w-6 h-6 rounded-full flex items-center justify-center'
                          : !isCurrentMonth
                          ? 'text-gray-400'
                          : 'text-gray-700'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                  </div>

                  {/* Events */}
                  <div className="flex-1 pb-1 space-y-px overflow-y-auto max-h-[200px] scrollbar-thin">
                    {sortedEvents.map((event) => {
                      const color = getColor(event.facility_slug);
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const eventEnd = event.end_date || event.date;
                      const isStart = dateStr === event.date;
                      const isEnd = dateStr === eventEnd;
                      const isSunday = dayIdx === 0;
                      const isSaturday = dayIdx === 6;

                      return (
                        <div
                          key={`${event.id}-${dateStr}`}
                          className={`flex items-center gap-0 text-[11px] leading-tight font-semibold py-[3px] truncate cursor-default transition-opacity hover:opacity-80
                            ${isStart || isSunday ? 'rounded-l-md ml-1 pl-1' : 'ml-0 pl-[7px]'}
                            ${isEnd || isSaturday ? 'rounded-r-md mr-1 pr-1' : 'mr-0 pr-[7px]'}
                          `}
                          style={{
                            backgroundColor: color.bg,
                            color: color.text,
                            borderLeft: (isStart || isSunday) ? `3px solid ${color.border}` : 'none',
                          }}
                          title={`${event.start_time} - ${event.end_time} | ${event.facility_name} | ${event.user_name}`}
                        >
                          <span className="font-bold whitespace-nowrap mr-1">
                            {formatTime12h(event.start_time)}
                          </span>
                          <span className="truncate">
                            {event.user_name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────── WEEK VIEW ───────────
interface WeekViewProps {
  date: Date;
  setDate: (date: Date) => void;
  events: BookingEvent[];
  getColor: (slug: string) => any;
  onViewChange?: (view: 'month' | 'week' | 'day') => void;
}

function WeekView({ date, setDate, events, getColor, onViewChange }: WeekViewProps) {
  const { t } = useTranslation();
  const weekStart = startOfWeek(date);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

  const getEventsForTimeSlot = (day: Date, hour: number) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return events.filter(event => {
      const eventStart = event.date;
      const eventEnd = event.end_date || event.date;

      if (!(dateStr >= eventStart && dateStr <= eventEnd)) return false;

      if (dateStr === eventStart) {
        const startHour = parseInt(event.start_time.split(':')[0]);
        const endHour = parseInt(event.end_time.split(':')[0]);
        return startHour <= hour && hour < endHour;
      } else {
        return hour >= 8 && hour < 21;
      }
    });
  };

  return (
    <div className="w-full">
      <NavHeader
        title={`${format(weekStart, 'MMM d')} – ${format(addDays(weekStart, 6), 'MMM d, yyyy')}`}
        onPrev={() => setDate(addWeeks(date, -1))}
        onNext={() => setDate(addWeeks(date, 1))}
        onToday={() => setDate(new Date())}
        activeView="week"
        onViewChange={onViewChange || (() => {})}
        t={t}
      />

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-8 bg-[#f8f9fa] border-b border-gray-200">
          <div className="p-2 border-r border-gray-200 text-xs font-bold text-gray-500 uppercase">
            Time
          </div>
          {weekDays.map((day) => (
            <div
              key={format(day, 'yyyy-MM-dd')}
              className="p-2 border-r border-gray-200 last:border-r-0 text-center"
            >
              <div className="text-xs font-bold text-gray-500 uppercase">{format(day, 'EEE')}</div>
              <div className={`text-lg font-bold mt-0.5 ${
                isSameDay(day, new Date())
                  ? 'bg-[#1a73e8] text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto'
                  : 'text-gray-800'
              }`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Time slots */}
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-gray-200 last:border-b-0 min-h-[52px]">
            <div className="p-1 border-r border-gray-200 bg-[#f8f9fa] text-xs font-semibold text-gray-500 flex items-start justify-end pr-2 pt-1">
              {hour % 12 === 0 ? 12 : hour % 12} {hour >= 12 ? 'PM' : 'AM'}
            </div>

            {weekDays.map((day) => {
              const dayEvents = getEventsForTimeSlot(day, hour);
              return (
                <div
                  key={format(day, 'yyyy-MM-dd')}
                  className="border-r border-gray-200 last:border-r-0 p-0.5 bg-white hover:bg-gray-50/50"
                >
                  {dayEvents.map((event) => {
                    const color = getColor(event.facility_slug);
                    return (
                      <div
                        key={event.id}
                        className="text-[10px] font-semibold px-1 py-0.5 rounded-sm mb-px truncate"
                        style={{
                          backgroundColor: color.bg,
                          color: color.text,
                          borderLeft: `3px solid ${color.border}`,
                        }}
                        title={`${event.start_time}-${event.end_time}: ${event.facility_name} - ${event.user_name}`}
                      >
                        {formatTime12h(event.start_time)} {event.user_name}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────── DAY VIEW ───────────
interface DayViewProps {
  date: Date;
  setDate: (date: Date) => void;
  events: BookingEvent[];
  getColor: (slug: string) => any;
  onViewChange?: (view: 'month' | 'week' | 'day') => void;
}

function DayView({ date, setDate, events, getColor, onViewChange }: DayViewProps) {
  const { t } = useTranslation();
  const hours = Array.from({ length: 14 }, (_, i) => i + 8);
  const dateStr = format(date, 'yyyy-MM-dd');
  const dayEvents = events.filter(event => {
    const eventEnd = event.end_date || event.date;
    return dateStr >= event.date && dateStr <= eventEnd;
  });

  const getEventsForHour = (hour: number) => {
    return dayEvents.filter(event => {
      if (dateStr === event.date) {
        const startHour = parseInt(event.start_time.split(':')[0]);
        const endHour = parseInt(event.end_time.split(':')[0]);
        return startHour <= hour && hour < endHour;
      }
      return hour >= 8 && hour < 21;
    });
  };

  return (
    <div className="w-full">
      <NavHeader
        title={format(date, 'EEEE, MMMM d, yyyy')}
        onPrev={() => setDate(addDays(date, -1))}
        onNext={() => setDate(addDays(date, 1))}
        onToday={() => setDate(new Date())}
        activeView="day"
        onViewChange={onViewChange || (() => {})}
        t={t}
      />

      {/* All-day events */}
      {dayEvents.some(e => e.start_time === '00:00' && e.end_time === '23:59') && (
        <div className="mb-3 p-3 bg-blue-50 border-l-4 border-[#1a73e8] rounded">
          <p className="text-xs font-bold text-blue-800 mb-2 uppercase tracking-wider">All-Day</p>
          <div className="space-y-1">
            {dayEvents
              .filter(e => e.start_time === '00:00' && e.end_time === '23:59')
              .map((event) => {
                const color = getColor(event.facility_slug);
                return (
                  <div
                    key={event.id}
                    className="text-sm font-bold px-3 py-2 rounded text-white"
                    style={{ backgroundColor: color.bg }}
                  >
                    {event.facility_name} – {event.user_name}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Time slots */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {hours.map((hour) => {
          const hourEvents = getEventsForHour(hour);
          return (
            <div key={hour} className="border-b border-gray-200 last:border-b-0 min-h-[56px] flex">
              <div className="w-20 bg-[#f8f9fa] p-2 border-r border-gray-200 flex items-start justify-end pr-3 pt-1 text-xs font-semibold text-gray-500">
                {hour % 12 === 0 ? 12 : hour % 12} {hour >= 12 ? 'PM' : 'AM'}
              </div>
              <div className="flex-1 p-1">
                {hourEvents.length > 0 && (
                  <div className="space-y-1">
                    {hourEvents.map((event) => {
                      const color = getColor(event.facility_slug);
                      return (
                        <div
                          key={event.id}
                          className="text-sm font-semibold px-3 py-2 rounded text-white"
                          style={{
                            backgroundColor: color.bg,
                            borderLeft: `4px solid ${color.border}`,
                          }}
                        >
                          <div className="font-bold">
                            {formatTime12h(event.start_time)} – {formatTime12h(event.end_time)}  {event.facility_name}
                          </div>
                          <div className="text-xs opacity-90 mt-0.5">{event.user_name}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

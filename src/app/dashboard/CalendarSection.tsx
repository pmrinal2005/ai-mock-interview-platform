'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Brain,
  Calendar as CalendarIcon,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code,
  Plus,
  Sparkles,
  Users,
  Video,
  X,
  type LucideIcon,
} from 'lucide-react';

interface Interview {
  id: string;
  date: string; // YYYY-MM-DD (local)
  time: string; // display string e.g. "2:30 PM"
  title: string;
  type: 'Technical' | 'Behavioral' | 'System Design' | 'HR';
  aiBot: string;
  focus: string;
  duration: string;
  status: 'Scheduled' | 'Completed' | 'Upcoming';
  score?: number;
}

/** ---------- Date/time helpers (timezone-safe) ---------- **/
const pad2 = (n: number) => String(n).padStart(2, '0');

const formatDateLocal = (d: Date) => {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
};

const parseYYYYMMDD = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};

const addDays = (d: Date, days: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
};

const formatTime12h = (time24: string) => {
  // "HH:MM" -> "h:MM AM/PM"
  const m = time24.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return time24;
  let hh = Number(m[1]);
  const mm = m[2];
  const ampm = hh >= 12 ? 'PM' : 'AM';
  hh = hh % 12;
  if (hh === 0) hh = 12;
  return `${hh}:${mm} ${ampm}`;
};

const timeToMinutes = (t: string) => {
  // Supports "HH:MM" OR "h:MM AM/PM"
  const ampm = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    let hh = Number(ampm[1]);
    const mm = Number(ampm[2]);
    const ap = ampm[3].toUpperCase();
    if (ap === 'PM' && hh !== 12) hh += 12;
    if (ap === 'AM' && hh === 12) hh = 0;
    return hh * 60 + mm;
  }
  const t24 = t.match(/^(\d{1,2}):(\d{2})$/);
  if (t24) return Number(t24[1]) * 60 + Number(t24[2]);
  return 0;
};

const getUUID = () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c: any = typeof crypto !== 'undefined' ? crypto : null;
    return c?.randomUUID ? c.randomUUID() : `${Date.now()}-${Math.random()}`;
  } catch {
    return `${Date.now()}-${Math.random()}`;
  }
};

/** ---------- Mock data (near today's date so it always shows) ---------- **/
const seed = new Date();
const d0 = formatDateLocal(seed);
const d1 = formatDateLocal(addDays(seed, 1));
const d3 = formatDateLocal(addDays(seed, 3));
const d5 = formatDateLocal(addDays(seed, 5));
const d7 = formatDateLocal(addDays(seed, 7));

const MOCK_INTERVIEWS: Interview[] = [
  {
    id: '1',
    date: d0,
    time: '10:00 AM',
    title: 'React Hooks Deep Dive',
    type: 'Technical',
    aiBot: 'Zeta',
    focus: 'useState, useEffect, custom hooks',
    duration: '45 min',
    status: 'Upcoming',
  },
  {
    id: '2',
    date: d0,
    time: '2:30 PM',
    title: 'Leadership Scenarios',
    type: 'Behavioral',
    aiBot: 'Alpha',
    focus: 'Conflict resolution, team management',
    duration: '30 min',
    status: 'Scheduled',
  },
  {
    id: '3',
    date: d3,
    time: '11:00 AM',
    title: 'System Design: URL Shortener',
    type: 'System Design',
    aiBot: 'Omega',
    focus: 'Scalability, database design, caching',
    duration: '60 min',
    status: 'Scheduled',
  },
  {
    id: '4',
    date: d5,
    time: '9:00 AM',
    title: 'Python OOP Concepts',
    type: 'Technical',
    aiBot: 'Zeta',
    focus: 'Classes, inheritance, polymorphism',
    duration: '40 min',
    status: 'Completed',
    score: 82,
  },
  {
    id: '5',
    date: d7,
    time: '3:00 PM',
    title: 'HR Communication Round',
    type: 'HR',
    aiBot: 'Beta',
    focus: 'Self-introduction, career goals',
    duration: '25 min',
    status: 'Scheduled',
  },
];

const TYPE_CONFIG: Record<
  Interview['type'],
  { color: string; icon: LucideIcon; bg: string }
> = {
  Technical: { color: '#2563eb', icon: Code, bg: 'rgba(37,99,235,0.14)' },
  Behavioral: { color: '#f59e0b', icon: Users, bg: 'rgba(245,158,11,0.14)' },
  'System Design': { color: '#8b5cf6', icon: Brain, bg: 'rgba(139,92,246,0.14)' },
  HR: { color: '#16a34a', icon: Sparkles, bg: 'rgba(22,163,74,0.14)' },
};

interface Props {
  dark: boolean;
}

type BookingForm = {
  type: Interview['type'];
  aiBot: string;
  title: string;
  focus: string;
  duration: string; // "30 min"
  date: string; // YYYY-MM-DD
  time: string; // "HH:MM" from <input type="time" />
};

export default function CalendarSection({ dark }: Props) {
  const todayStr = useMemo(() => formatDateLocal(new Date()), []);

  const [currentDate, setCurrentDate] = useState<Date>(() => parseYYYYMMDD(todayStr));
  const [selectedDate, setSelectedDate] = useState<string>(() => todayStr);

  // interviews are STATE now (so booking actually updates the calendar)
  const [interviews, setInterviews] = useState<Interview[]>(() => MOCK_INTERVIEWS);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [form, setForm] = useState<BookingForm>({
    type: 'Technical',
    aiBot: 'Zeta - Technical Specialist',
    title: '',
    focus: '',
    duration: '45 min',
    date: todayStr,
    time: '10:00',
  });

  // Reset modal form when opening
  useEffect(() => {
    if (!showBookingModal) return;
    setForm((prev) => ({
      ...prev,
      date: selectedDate || todayStr,
      time: prev.time || '10:00',
      title: prev.title || '',
      focus: prev.focus || '',
    }));
  }, [showBookingModal, selectedDate, todayStr]);

  /** ---------- Theme tokens ---------- **/
  const pageBg = dark
    ? 'radial-gradient(900px 400px at 20% -10%, rgba(22,163,74,0.14), transparent 60%), #0b1020'
    : 'radial-gradient(900px 400px at 20% -10%, rgba(22,163,74,0.14), transparent 60%), #f4f7f4';

  const cardBg = dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.85)';
  const cardBgSolid = dark ? '#0f172a' : '#ffffff';
  const border = dark ? 'rgba(255,255,255,0.08)' : 'rgba(2,6,23,0.08)';
  const text = dark ? '#e5e7eb' : '#0f172a';
  const sub = dark ? 'rgba(226,232,240,0.62)' : 'rgba(15,23,42,0.55)';
  const accent = '#16a34a';

  /** ---------- Calendar grid (42 cells) ---------- **/
  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const first = new Date(year, month, 1);
    const startOffset = first.getDay(); // 0..6 (Sun..Sat)
    const gridStart = new Date(year, month, 1 - startOffset);

    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + i);
      return { date, currentMonth: date.getMonth() === month };
    });
  }, [currentDate]);

  const monthNames = useMemo(
    () => [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    []
  );

  const interviewsByDate = useMemo(() => {
    const map: Record<string, Interview[]> = {};
    for (const i of interviews) {
      (map[i.date] ??= []).push(i);
    }
    // sort each day by time
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
    }
    return map;
  }, [interviews]);

  const getInterviewsForDate = (dateStr: string) => interviewsByDate[dateStr] ?? [];
  const selectedInterviews = getInterviewsForDate(selectedDate);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return d;
    });
  };

  const selectedDateObj = useMemo(() => parseYYYYMMDD(selectedDate), [selectedDate]);

  const computeStatus = (dateStr: string, time24: string): Interview['status'] => {
    const now = new Date();
    const d = parseYYYYMMDD(dateStr);
    const [hh, mm] = time24.split(':').map(Number);
    d.setHours(hh || 0, mm || 0, 0, 0);

    const diff = d.getTime() - now.getTime();
    if (diff < 0) return 'Scheduled'; // keep it simple; user can mark completed elsewhere
    // "Upcoming" if within next 24 hours
    return diff <= 24 * 60 * 60 * 1000 ? 'Upcoming' : 'Scheduled';
  };

  const handleSchedule = () => {
    // basic validation
    if (!form.title.trim()) return;
    if (!form.date) return;
    if (!form.time) return;

    const newInterview: Interview = {
      id: getUUID(),
      date: form.date,
      time: formatTime12h(form.time),
      title: form.title.trim(),
      type: form.type,
      aiBot: form.aiBot,
      focus: form.focus.trim() || 'General practice',
      duration: form.duration,
      status: computeStatus(form.date, form.time),
    };

    setInterviews((prev) => {
      const next = [...prev, newInterview];
      next.sort((a, b) => (a.date === b.date ? timeToMinutes(a.time) - timeToMinutes(b.time) : a.date.localeCompare(b.date)));
      return next;
    });

    setSelectedDate(form.date);
    setCurrentDate(parseYYYYMMDD(form.date));
    setShowBookingModal(false);
  };

  const joinInterview = (intv: Interview) => {
    // Replace with your real routing/video call logic
    console.log('Join interview:', intv);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: 28,
        background: pageBg,
        minHeight: 'calc(100vh - 80px)',
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 14,
          marginBottom: 18,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 850,
              color: text,
              margin: 0,
              letterSpacing: -0.6,
              lineHeight: 1.1,
            }}
          >
            Interview Calendar
          </h1>
          <p style={{ color: sub, fontSize: 13, marginTop: 6, marginBottom: 0 }}>
            Schedule and manage your AI mock interview sessions.
          </p>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowBookingModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            borderRadius: 14,
            background: `linear-gradient(135deg, ${accent}, #15803d)`,
            border: `1px solid rgba(255,255,255,0.18)`,
            color: '#fff',
            fontSize: 13,
            fontWeight: 750,
            cursor: 'pointer',
            boxShadow: dark
              ? '0 10px 26px rgba(0,0,0,0.45)'
              : '0 10px 26px rgba(22,163,74,0.18)',
          }}
        >
          <Plus size={16} />
          Book AI Interview
        </motion.button>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(520px, 1fr) 360px',
          gap: 18,
          alignItems: 'start',
        }}
      >
        {/* Calendar Card */}
        <div
          style={{
            borderRadius: 20,
            background: cardBg,
            border: `1px solid ${border}`,
            padding: 18,
            boxShadow: dark ? '0 10px 30px rgba(0,0,0,0.35)' : '0 10px 30px rgba(2,6,23,0.08)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Calendar Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              marginBottom: 14,
              padding: '6px 6px 10px',
            }}
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateMonth('prev')}
              aria-label="Previous month"
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(2,6,23,0.04)',
                border: `1px solid ${border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronLeft size={16} style={{ color: sub as string }} />
            </motion.button>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <div style={{ color: text, fontSize: 18, fontWeight: 800 }}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </div>
              <div
                style={{
                  color: sub,
                  fontSize: 11,
                  fontWeight: 650,
                  border: `1px solid ${border}`,
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(2,6,23,0.03)',
                }}
              >
                Today: {parseYYYYMMDD(todayStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateMonth('next')}
              aria-label="Next month"
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(2,6,23,0.04)',
                border: `1px solid ${border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronRight size={16} style={{ color: sub as string }} />
            </motion.button>
          </div>

          {/* Day names */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 8,
              marginBottom: 10,
              padding: '0 6px',
            }}
          >
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  color: sub,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 0.4,
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 8,
              padding: '0 6px 6px',
            }}
          >
            {daysInMonth.map((day, idx) => {
              const dateStr = formatDateLocal(day.date);
              const dayInterviews = getInterviewsForDate(dateStr);

              const isSelected = dateStr === selectedDate;
              const isToday = dateStr === todayStr;

              const baseBg = day.currentMonth
                ? dark
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(2,6,23,0.03)'
                : 'transparent';

              return (
                <motion.button
                  type="button"
                  key={idx}
                  whileHover={{ y: -1, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedDate(dateStr)}
                  style={{
                    aspectRatio: '1 / 1',
                    borderRadius: 14,
                    background: isSelected
                      ? `linear-gradient(135deg, ${accent}, #15803d)`
                      : baseBg,
                    border: isToday
                      ? `2px solid ${accent}`
                      : isSelected
                      ? '1px solid rgba(255,255,255,0.15)'
                      : `1px solid ${border}`,
                    cursor: 'pointer',
                    padding: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    opacity: day.currentMonth ? 1 : 0.45,
                    boxShadow: isSelected
                      ? (dark ? '0 10px 18px rgba(0,0,0,0.35)' : '0 10px 18px rgba(22,163,74,0.18)')
                      : 'none',
                  }}
                  aria-label={`Select ${day.date.toDateString()}`}
                >
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        color: isSelected ? '#fff' : day.currentMonth ? text : sub,
                        fontSize: 13,
                        fontWeight: isSelected ? 850 : 650,
                      }}
                    >
                      {day.date.getDate()}
                    </span>

                    {dayInterviews.length > 0 && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 850,
                          color: isSelected ? '#fff' : text,
                          background: isSelected
                            ? 'rgba(255,255,255,0.22)'
                            : dark
                            ? 'rgba(255,255,255,0.07)'
                            : 'rgba(2,6,23,0.06)',
                          border: `1px solid ${border}`,
                          padding: '2px 7px',
                          borderRadius: 999,
                        }}
                        title={`${dayInterviews.length} interview(s)`}
                      >
                        {dayInterviews.length}
                      </span>
                    )}
                  </div>

                  {dayInterviews.length > 0 ? (
                    <div
                      style={{
                        display: 'flex',
                        gap: 4,
                        width: '100%',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      {dayInterviews.slice(0, 4).map((intv, i) => {
                        const Icon = TYPE_CONFIG[intv.type].icon;
                        const cfg = TYPE_CONFIG[intv.type];
                        return (
                          <div
                            key={`${intv.id}-${i}`}
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: 6,
                              background: isSelected ? 'rgba(255,255,255,0.18)' : cfg.bg,
                              border: `1px solid ${isSelected ? 'rgba(255,255,255,0.28)' : `${cfg.color}33`}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            title={intv.type}
                          >
                            <Icon size={10} style={{ color: isSelected ? '#fff' : cfg.color }} />
                          </div>
                        );
                      })}
                      {dayInterviews.length > 4 && (
                        <span style={{ fontSize: 10, fontWeight: 800, color: isSelected ? '#fff' : sub }}>
                          +{dayInterviews.length - 4}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div style={{ height: 18 }} />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Legend */}
          <div
            style={{
              marginTop: 10,
              padding: '12px 10px',
              borderRadius: 16,
              background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(2,6,23,0.03)',
              border: `1px solid ${border}`,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              justifyContent: 'space-between',
            }}
          >
            {(Object.keys(TYPE_CONFIG) as Interview['type'][]).map((t) => {
              const cfg = TYPE_CONFIG[t];
              const Icon = cfg.icon;
              return (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 10,
                      background: cfg.bg,
                      border: `1px solid ${cfg.color}33`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={14} style={{ color: cfg.color }} />
                  </div>
                  <div style={{ color: sub, fontSize: 12, fontWeight: 700 }}>{t}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details */}
        <div
          style={{
            borderRadius: 20,
            background: cardBg,
            border: `1px solid ${border}`,
            padding: 18,
            boxShadow: dark ? '0 10px 30px rgba(0,0,0,0.35)' : '0 10px 30px rgba(2,6,23,0.08)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: sub, fontSize: 12, fontWeight: 700 }}>Selected day</div>
            <div style={{ color: text, fontSize: 16, fontWeight: 850, marginTop: 4 }}>
              {selectedDateObj.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {selectedInterviews.length > 0 ? (
              <motion.div
                key={selectedDate}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                {selectedInterviews.map((intv, idx) => {
                  const cfg = TYPE_CONFIG[intv.type];
                  const Icon = cfg.icon;

                  const statusColor =
                    intv.status === 'Completed'
                      ? '#16a34a'
                      : intv.status === 'Upcoming'
                      ? '#f59e0b'
                      : '#2563eb';

                  return (
                    <motion.div
                      key={intv.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      style={{
                        borderRadius: 16,
                        padding: 14,
                        background: dark ? cardBgSolid : '#fff',
                        border: `1px solid ${border}`,
                        boxShadow: dark ? '0 10px 20px rgba(0,0,0,0.25)' : '0 10px 20px rgba(2,6,23,0.06)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 12,
                            background: cfg.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${cfg.color}33`,
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={16} style={{ color: cfg.color }} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ color: text, fontSize: 13, fontWeight: 850, marginBottom: 3 }}>
                            {intv.title}
                          </div>
                          <div style={{ color: sub, fontSize: 11, fontWeight: 650 }}>AI Bot: {intv.aiBot}</div>
                        </div>

                        <div
                          style={{
                            background: cfg.bg,
                            color: cfg.color,
                            fontSize: 10,
                            fontWeight: 900,
                            padding: '4px 10px',
                            borderRadius: 999,
                            border: `1px solid ${cfg.color}22`,
                          }}
                        >
                          {intv.type}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: sub, fontSize: 11, fontWeight: 700 }}>
                          <Clock size={12} />
                          {intv.time}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: sub, fontSize: 11, fontWeight: 700 }}>
                          <Video size={12} />
                          {intv.duration}
                        </div>
                      </div>

                      <div style={{ color: sub, fontSize: 11, lineHeight: 1.45, marginBottom: 12 }}>
                        <span style={{ color: text, fontWeight: 850 }}>Focus:</span> {intv.focus}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: statusColor, fontSize: 10, fontWeight: 900 }}>
                          {intv.status === 'Completed' ? <CheckCircle size={12} /> : <CalendarIcon size={12} />}
                          {intv.status}
                          {intv.score !== undefined && ` • Score: ${intv.score}%`}
                        </div>

                        {intv.status !== 'Completed' && (
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => joinInterview(intv)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: 12,
                              background: `linear-gradient(135deg, ${accent}, #15803d)`,
                              border: 'none',
                              color: '#fff',
                              fontSize: 11,
                              fontWeight: 850,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              boxShadow: dark ? '0 10px 18px rgba(0,0,0,0.35)' : '0 10px 18px rgba(22,163,74,0.18)',
                            }}
                          >
                            <Video size={14} />
                            Join
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                style={{
                  textAlign: 'center',
                  padding: '34px 16px',
                  color: sub,
                  borderRadius: 16,
                  border: `1px dashed ${border}`,
                  background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(2,6,23,0.02)',
                }}
              >
                <CalendarIcon
                  size={42}
                  style={{
                    color: dark ? 'rgba(255,255,255,0.14)' : 'rgba(2,6,23,0.14)',
                    marginBottom: 12,
                  }}
                />
                <div style={{ fontSize: 13, fontWeight: 900, marginBottom: 6 }}>No interviews scheduled</div>
                <div style={{ fontSize: 11, fontWeight: 650 }}>Use “Book AI Interview” to add one for this day.</div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowBookingModal(true)}
                  style={{
                    marginTop: 14,
                    padding: '10px 12px',
                    borderRadius: 14,
                    background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(2,6,23,0.05)',
                    border: `1px solid ${border}`,
                    color: text,
                    fontSize: 12,
                    fontWeight: 850,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    gap: 8,
                    alignItems: 'center',
                  }}
                >
                  <Plus size={14} />
                  Book for {selectedDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.62)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
              zIndex: 1000,
            }}
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 560,
                borderRadius: 22,
                background: dark ? '#0b1220' : '#ffffff',
                border: `1px solid ${border}`,
                padding: 18,
                boxShadow: '0 20px 70px rgba(0,0,0,0.55)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <div>
                  <div style={{ color: text, fontSize: 18, fontWeight: 900, letterSpacing: -0.3 }}>
                    Book New AI Interview
                  </div>
                  <div style={{ color: sub, fontSize: 12, fontWeight: 650, marginTop: 4 }}>
                    Add details below — it will appear on the selected date immediately.
                  </div>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBookingModal(false)}
                  aria-label="Close"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(2,6,23,0.05)',
                    border: `1px solid ${border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} style={{ color: sub as string }} />
                </motion.button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {/* Title */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ color: text, fontSize: 12, fontWeight: 800, display: 'block', marginBottom: 6 }}>
                    Session title *
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Frontend mock interview (React)"
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      borderRadius: 14,
                      background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(2,6,23,0.04)',
                      border: `1px solid ${border}`,
                      color: text,
                      fontSize: 12,
                      outline: 'none',
                      fontWeight: 700,
                    }}
                  />
                </div>

                {/* Interview Type */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ color: text, fontSize: 12, fontWeight: 800, display: 'block', marginBottom: 6 }}>
                    Interview type
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                    {(Object.keys(TYPE_CONFIG) as Interview['type'][]).map((type) => {
                      const cfg = TYPE_CONFIG[type];
                      const Icon = cfg.icon;
                      const active = form.type === type;

                      return (
                        <motion.button
                          type="button"
                          key={type}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setForm((p) => ({ ...p, type }))}
                          aria-pressed={active}
                          style={{
                            padding: '12px',
                            borderRadius: 16,
                            background: active
                              ? `linear-gradient(135deg, ${cfg.bg}, ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)'})`
                              : dark
                              ? 'rgba(255,255,255,0.04)'
                              : 'rgba(2,6,23,0.03)',
                            border: active ? `1px solid ${cfg.color}66` : `1px solid ${border}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          <div
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 12,
                              background: cfg.bg,
                              border: `1px solid ${cfg.color}33`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Icon size={15} style={{ color: cfg.color }} />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <span style={{ color: text, fontSize: 12, fontWeight: 900 }}>{type}</span>
                            <span style={{ color: sub, fontSize: 10, fontWeight: 700 }}>
                              {type === 'Technical'
                                ? 'Coding + fundamentals'
                                : type === 'Behavioral'
                                ? 'Stories + communication'
                                : type === 'System Design'
                                ? 'Architecture + tradeoffs'
                                : 'HR + career goals'}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* AI Interviewer */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ color: text, fontSize: 12, fontWeight: 800, display: 'block', marginBottom: 6 }}>
                    AI interviewer
                  </label>
                  <select
                    value={form.aiBot}
                    onChange={(e) => setForm((p) => ({ ...p, aiBot: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      borderRadius: 14,
                      background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(2,6,23,0.04)',
                      border: `1px solid ${border}`,
                      color: text,
                      fontSize: 12,
                      outline: 'none',
                      cursor: 'pointer',
                      fontWeight: 750,
                    }}
                  >
                    <option>Zeta - Technical Specialist</option>
                    <option>Alpha - Behavioral Coach</option>
                    <option>Omega - System Design Expert</option>
                    <option>Beta - HR Interviewer</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label style={{ color: text, fontSize: 12, fontWeight: 800, display: 'block', marginBottom: 6 }}>
                    Date
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={form.date}
                    onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      borderRadius: 14,
                      background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(2,6,23,0.04)',
                      border: `1px solid ${border}`,
                      color: text,
                      fontSize: 12,
                      outline: 'none',
                      fontWeight: 750,
                    }}
                  />
                </div>

                {/* Time */}
                <div>
                  <label style={{ color: text, fontSize: 12, fontWeight: 800, display: 'block', marginBottom: 6 }}>
                    Time
                  </label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      borderRadius: 14,
                      background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(2,6,23,0.04)',
                      border: `1px solid ${border}`,
                      color: text,
                      fontSize: 12,
                      outline: 'none',
                      fontWeight: 750,
                    }}
                  />
                </div>

                {/* Duration */}
                <div>
                  <label style={{ color: text, fontSize: 12, fontWeight: 800, display: 'block', marginBottom: 6 }}>
                    Duration
                  </label>
                  <select
                    value={form.duration}
                    onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      borderRadius: 14,
                      background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(2,6,23,0.04)',
                      border: `1px solid ${border}`,
                      color: text,
                      fontSize: 12,
                      outline: 'none',
                      cursor: 'pointer',
                      fontWeight: 750,
                    }}
                  >
                    <option>25 min</option>
                    <option>30 min</option>
                    <option>40 min</option>
                    <option>45 min</option>
                    <option>60 min</option>
                  </select>
                </div>

                {/* Focus */}
                <div>
                  <label style={{ color: text, fontSize: 12, fontWeight: 800, display: 'block', marginBottom: 6 }}>
                    Focus (optional)
                  </label>
                  <input
                    value={form.focus}
                    onChange={(e) => setForm((p) => ({ ...p, focus: e.target.value }))}
                    placeholder="e.g. caching, hooks, STAR answers"
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      borderRadius: 14,
                      background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(2,6,23,0.04)',
                      border: `1px solid ${border}`,
                      color: text,
                      fontSize: 12,
                      outline: 'none',
                      fontWeight: 750,
                    }}
                  />
                </div>

                {/* Actions */}
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10, marginTop: 4 }}>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowBookingModal(false)}
                    style={{
                      flex: 1,
                      padding: '12px 12px',
                      borderRadius: 14,
                      background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(2,6,23,0.05)',
                      border: `1px solid ${border}`,
                      color: text,
                      fontSize: 13,
                      fontWeight: 900,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: form.title.trim() ? 1.01 : 1 }}
                    whileTap={{ scale: form.title.trim() ? 0.98 : 1 }}
                    onClick={handleSchedule}
                    disabled={!form.title.trim()}
                    style={{
                      flex: 1.2,
                      padding: '12px 12px',
                      borderRadius: 14,
                      background: form.title.trim()
                        ? `linear-gradient(135deg, ${accent}, #15803d)`
                        : dark
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(2,6,23,0.08)',
                      border: form.title.trim() ? 'none' : `1px solid ${border}`,
                      color: form.title.trim() ? '#fff' : sub,
                      fontSize: 13,
                      fontWeight: 950,
                      cursor: form.title.trim() ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: form.title.trim()
                        ? dark
                          ? '0 14px 26px rgba(0,0,0,0.45)'
                          : '0 14px 26px rgba(22,163,74,0.18)'
                        : 'none',
                    }}
                  >
                    <Sparkles size={16} />
                    Schedule Interview
                  </motion.button>
                </div>

                <div style={{ gridColumn: '1 / -1', color: sub, fontSize: 11, fontWeight: 650 }}>
                  Note: Booking adds the interview to the calendar immediately (client-side state).
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
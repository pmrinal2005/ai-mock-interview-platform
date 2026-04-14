'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Video,
  Brain,
  Code,
  Users,
  Clock,
  X,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

interface Interview {
  id: string;
  date: string;
  time: string;
  title: string;
  type: 'Technical' | 'Behavioral' | 'System Design' | 'HR';
  aiBot: string;
  focus: string;
  duration: string;
  status: 'Scheduled' | 'Completed' | 'Upcoming';
  score?: number;
}

const MOCK_INTERVIEWS: Interview[] = [
  {
    id: '1',
    date: '2024-01-15',
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
    date: '2024-01-15',
    time: '02:30 PM',
    title: 'Leadership Scenarios',
    type: 'Behavioral',
    aiBot: 'Alpha',
    focus: 'Conflict resolution, team management',
    duration: '30 min',
    status: 'Scheduled',
  },
  {
    id: '3',
    date: '2024-01-18',
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
    date: '2024-01-20',
    time: '09:00 AM',
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
    date: '2024-01-22',
    time: '03:00 PM',
    title: 'HR Communication Round',
    type: 'HR',
    aiBot: 'Beta',
    focus: 'Self-introduction, career goals',
    duration: '25 min',
    status: 'Scheduled',
  },
];

const TYPE_CONFIG = {
  Technical: { color: '#2563eb', icon: Code, bg: 'rgba(37,99,235,0.15)' },
  Behavioral: { color: '#f59e0b', icon: Users, bg: 'rgba(245,158,11,0.15)' },
  'System Design': { color: '#8b5cf6', icon: Brain, bg: 'rgba(139,92,246,0.15)' },
  HR: { color: '#16a34a', icon: Sparkles, bg: 'rgba(22,163,74,0.15)' },
};

interface Props {
  dark: boolean;
}

export default function CalendarSection({ dark }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 15));
  const [selectedDate, setSelectedDate] = useState<string>('2024-01-15');
  const [showBookingModal, setShowBookingModal] = useState(false);

  const bg = dark ? '#0d1117' : '#f0f4f0';
  const cardBg = dark ? '#161b27' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const text = dark ? '#f1f5f9' : '#0f172a';
  const sub = dark ? '#64748b' : '#6b7280';
  const accent = '#16a34a';

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    const startDay = firstDay.getDay();
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month, -i), currentMonth: false });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), currentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), currentMonth: false });
    }
    return days;
  }, [currentDate]);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const getInterviewsForDate = (dateStr: string) =>
    MOCK_INTERVIEWS.filter((i) => i.date === dateStr);

  const selectedInterviews = getInterviewsForDate(selectedDate);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        
        padding: '28px',
        background: bg,
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: text,
              margin: 0,
              letterSpacing: -0.5,
            }}
          >
            Interview Calendar
          </h1>
          <p style={{ color: sub, fontSize: 14, marginTop: 4 }}>
            Schedule and manage your AI mock interview sessions
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowBookingModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 20px',
            borderRadius: 12,
            background: `linear-gradient(135deg, ${accent}, #15803d)`,
            border: 'none',
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(22,163,74,0.35)',
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
          gridTemplateColumns: '1fr 340px',
          gap: 20,
        }}
      >
        {/* Calendar Grid */}
        <div
          style={{
            borderRadius: 18,
            background: cardBg,
            border: `1px solid ${border}`,
            padding: 20,
            boxShadow: dark
              ? '0 2px 12px rgba(0,0,0,0.2)'
              : '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          {/* Calendar Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateMonth('prev')}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                border: `1px solid ${border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronLeft size={16} style={{ color: sub }} />
            </motion.button>

            <div style={{ color: text, fontSize: 18, fontWeight: 700 }}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateMonth('next')}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                border: `1px solid ${border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronRight size={16} style={{ color: sub }} />
            </motion.button>
          </div>

          {/* Day Names */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 8,
              marginBottom: 12,
            }}
          >
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  color: sub,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 8,
            }}
          >
            {daysInMonth.map((day, idx) => {
              const dateStr = formatDate(day.date);
              const interviews = getInterviewsForDate(dateStr);
              const isSelected = dateStr === selectedDate;
              const isToday = dateStr === '2024-01-15';

              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDate(dateStr)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 12,
                    background: isSelected
                      ? `linear-gradient(135deg, ${accent}, #15803d)`
                      : day.currentMonth
                      ? dark
                        ? 'rgba(255,255,255,0.03)'
                        : 'rgba(0,0,0,0.03)'
                      : 'transparent',
                    border: isToday
                      ? `2px solid ${accent}`
                      : isSelected
                      ? 'none'
                      : `1px solid ${border}`,
                    cursor: 'pointer',
                    padding: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    opacity: day.currentMonth ? 1 : 0.4,
                  }}
                >
                  <span
                    style={{
                      color: isSelected
                        ? '#fff'
                        : day.currentMonth
                        ? text
                        : sub,
                      fontSize: 13,
                      fontWeight: isSelected ? 700 : 500,
                    }}
                  >
                    {day.date.getDate()}
                  </span>

                  {interviews.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        gap: 2,
                        marginTop: 4,
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                      }}
                    >
                      {interviews.slice(0, 3).map((intv, i) => {
                        const Icon = TYPE_CONFIG[intv.type].icon;
                        return (
                          <div
                            key={i}
                            style={{
                              width: 16,
                              height: 16,
                              borderRadius: 4,
                              background: TYPE_CONFIG[intv.type].bg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: `1px solid ${TYPE_CONFIG[intv.type].color}40`,
                            }}
                          >
                            <Icon
                              size={8}
                              style={{ color: TYPE_CONFIG[intv.type].color }}
                            />
                          </div>
                        );
                      })}
                      {interviews.length > 3 && (
                        <span
                          style={{
                            fontSize: 8,
                            color: isSelected ? '#fff' : sub,
                            fontWeight: 600,
                          }}
                        >
                          +{interviews.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details */}
        <div
          style={{
            borderRadius: 18,
            background: cardBg,
            border: `1px solid ${border}`,
            padding: 20,
            boxShadow: dark
              ? '0 2px 12px rgba(0,0,0,0.2)'
              : '0 2px 12px rgba(0,0,0,0.06)',
            height: 'fit-content',
          }}
        >
          <div
            style={{
              color: text,
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </div>

          <AnimatePresence mode="wait">
            {selectedInterviews.length > 0 ? (
              <motion.div
                key={selectedDate}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                {selectedInterviews.map((intv, idx) => {
                  const config = TYPE_CONFIG[intv.type];
                  const Icon = config.icon;

                  return (
                    <motion.div
                      key={intv.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      style={{
                        borderRadius: 14,
                        padding: 14,
                        background: dark
                          ? 'rgba(255,255,255,0.03)'
                          : 'rgba(0,0,0,0.03)',
                        border: `1px solid ${border}`,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: config.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={16} style={{ color: config.color }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              color: text,
                              fontSize: 13,
                              fontWeight: 700,
                              marginBottom: 2,
                            }}
                          >
                            {intv.title}
                          </div>
                          <div style={{ color: sub, fontSize: 11 }}>
                            AI Bot: {intv.aiBot}
                          </div>
                        </div>
                        <div
                          style={{
                            background: config.bg,
                            color: config.color,
                            fontSize: 9,
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 99,
                          }}
                        >
                          {intv.type}
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            color: sub,
                            fontSize: 11,
                          }}
                        >
                          <Clock size={10} />
                          {intv.time}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            color: sub,
                            fontSize: 11,
                          }}
                        >
                          <Video size={10} />
                          {intv.duration}
                        </div>
                      </div>

                      <div
                        style={{
                          color: sub,
                          fontSize: 11,
                          marginBottom: 10,
                          lineHeight: 1.4,
                        }}
                      >
                        <span style={{ color: text, fontWeight: 600 }}>
                          Focus:
                        </span>{' '}
                        {intv.focus}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            color:
                              intv.status === 'Completed'
                                ? '#16a34a'
                                : intv.status === 'Upcoming'
                                ? '#f59e0b'
                                : '#2563eb',
                            fontSize: 10,
                            fontWeight: 600,
                          }}
                        >
                          {intv.status === 'Completed' ? (
                            <CheckCircle size={10} />
                          ) : (
                            <CalendarIcon size={10} />
                          )}
                          {intv.status}
                          {intv.score && ` • Score: ${intv.score}%`}
                        </div>

                        {intv.status !== 'Completed' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 8,
                              background: accent,
                              border: 'none',
                              color: '#fff',
                              fontSize: 10,
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <Video size={10} />
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: sub,
                }}
              >
                <CalendarIcon
                  size={40}
                  style={{
                    color: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    marginBottom: 12,
                  }}
                />
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                  No interviews scheduled
                </div>
                <div style={{ fontSize: 11 }}>
                  Click "Book AI Interview" to schedule a session
                </div>
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
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
            }}
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 480,
                borderRadius: 20,
                background: cardBg,
                border: `1px solid ${border}`,
                padding: 24,
                boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 20,
                }}
              >
                <div>
                  <div
                    style={{
                      color: text,
                      fontSize: 18,
                      fontWeight: 800,
                    }}
                  >
                    Book New AI Interview
                  </div>
                  <div style={{ color: sub, fontSize: 12 }}>
                    Schedule a mock session with our AI bots
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowBookingModal(false)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: dark
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(0,0,0,0.05)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} style={{ color: sub }} />
                </motion.button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label
                    style={{
                      color: text,
                      fontSize: 12,
                      fontWeight: 600,
                      marginBottom: 6,
                      display: 'block',
                    }}
                  >
                    Interview Type
                  </label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: 8,
                    }}
                  >
                    {Object.entries(TYPE_CONFIG).map(([type, config]) => {
                      const Icon = config.icon;
                      return (
                        <motion.button
                          key={type}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          style={{
                            padding: '12px',
                            borderRadius: 12,
                            background: dark
                              ? 'rgba(255,255,255,0.03)'
                              : 'rgba(0,0,0,0.03)',
                            border: `1px solid ${border}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            cursor: 'pointer',
                          }}
                        >
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 8,
                              background: config.bg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Icon size={14} style={{ color: config.color }} />
                          </div>
                          <span
                            style={{
                              color: text,
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                          >
                            {type}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      color: text,
                      fontSize: 12,
                      fontWeight: 600,
                      marginBottom: 6,
                      display: 'block',
                    }}
                  >
                    AI Interviewer
                  </label>
                  <select
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: dark
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.05)',
                      border: `1px solid ${border}`,
                      color: text,
                      fontSize: 12,
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option>Zeta - Technical Specialist</option>
                    <option>Alpha - Behavioral Coach</option>
                    <option>Omega - System Design Expert</option>
                    <option>Beta - HR Interviewer</option>
                  </select>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 10,
                  }}
                >
                  <div>
                    <label
                      style={{
                        color: text,
                        fontSize: 12,
                        fontWeight: 600,
                        marginBottom: 6,
                        display: 'block',
                      }}
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 10,
                        background: dark
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(0,0,0,0.05)',
                        border: `1px solid ${border}`,
                        color: text,
                        fontSize: 12,
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        color: text,
                        fontSize: 12,
                        fontWeight: 600,
                        marginBottom: 6,
                        display: 'block',
                      }}
                    >
                      Time
                    </label>
                    <input
                      type="time"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 10,
                        background: dark
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(0,0,0,0.05)',
                        border: `1px solid ${border}`,
                        color: text,
                        fontSize: 12,
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowBookingModal(false)}
                  style={{
                    marginTop: 8,
                    padding: '14px',
                    borderRadius: 12,
                    background: `linear-gradient(135deg, ${accent}, #15803d)`,
                    border: 'none',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 16px rgba(22,163,74,0.35)',
                  }}
                >
                  <Sparkles size={16} />
                  Schedule Interview
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
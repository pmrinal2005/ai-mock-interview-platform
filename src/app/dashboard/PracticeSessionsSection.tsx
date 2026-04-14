'use client';

import { motion } from 'framer-motion';
import { Play, Code, Brain, Users, Sparkles, Clock, TrendingUp } from 'lucide-react';

interface Props { dark: boolean; }

const MODES = [
  { id: 1, title: 'Technical Coding', icon: Code, color: '#2563eb', desc: 'DSA problems with AI code review', duration: '45 min', level: 'Intermediate' },
  { id: 2, title: 'System Design', icon: Brain, color: '#8b5cf6', desc: 'Architecture & scalability challenges', duration: '60 min', level: 'Advanced' },
  { id: 3, title: 'Behavioral', icon: Users, color: '#f59e0b', desc: 'STAR method with feedback', duration: '30 min', level: 'All Levels' },
  { id: 4, title: 'Quick Drill', icon: Sparkles, color: '#16a34a', desc: 'Rapid-fire questions', duration: '15 min', level: 'Warm-up' },
];

const RECENT = [
  { id: 1, title: 'React Hooks Deep Dive', score: 82, date: '2 hours ago', type: 'Technical' },
  { id: 2, title: 'Leadership Scenarios', score: 74, date: 'Yesterday', type: 'Behavioral' },
  { id: 3, title: 'URL Shortener Design', score: 91, date: '2 days ago', type: 'System Design' },
];

export default function PracticeSessionsSection({ dark }: Props) {
  const cardBg = dark ? '#161b27' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const text = dark ? '#f1f5f9' : '#0f172a';
  const sub = dark ? '#64748b' : '#6b7280';
  const accent = '#16a34a';

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif", paddingBottom: 40 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: text, margin: 0, letterSpacing: -0.5 }}>
          Practice Sessions
        </h1>
        <p style={{ color: sub, fontSize: 14, marginTop: 4 }}>
          Start a new AI mock interview or review past sessions
        </p>
      </div>

      {/* Practice Modes */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ color: text, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          Choose Practice Mode
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {MODES.map((mode, idx) => {
            const Icon = mode.icon;
            return (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                style={{
                  borderRadius: 16,
                  padding: 20,
                  background: cardBg,
                  border: `1px solid ${border}`,
                  cursor: 'pointer',
                  boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.06)',
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${mode.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon size={20} style={{ color: mode.color }} />
                </div>
                <div style={{ color: text, fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{mode.title}</div>
                <div style={{ color: sub, fontSize: 12, marginBottom: 12, lineHeight: 1.4 }}>{mode.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: sub, fontSize: 10 }}>
                      <Clock size={10} />{mode.duration}
                    </div>
                    <div style={{ background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: sub, fontSize: 9, padding: '2px 6px', borderRadius: 6 }}>{mode.level}</div>
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ width: 32, height: 32, borderRadius: 8, background: accent, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Play size={14} style={{ color: '#fff', marginLeft: 2 }} />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Sessions */}
      <div>
        <div style={{ color: text, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          Recent Sessions
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {RECENT.map((session, idx) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
              style={{
                borderRadius: 14,
                padding: 16,
                background: cardBg,
                border: `1px solid ${border}`,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Play size={16} style={{ color: accent }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: text, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{session.title}</div>
                <div style={{ color: sub, fontSize: 11 }}>{session.type} • {session.date}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <TrendingUp size={14} style={{ color: '#16a34a' }} />
                <span style={{ color: text, fontSize: 13, fontWeight: 700 }}>{session.score}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, Zap } from 'lucide-react';

interface Props { dark: boolean; }

const SKILLS = [
  { name: 'Data Structures', score: 88, trend: '+5%' },
  { name: 'System Design', score: 76, trend: '+8%' },
  { name: 'Communication', score: 82, trend: '+3%' },
  { name: 'Problem Solving', score: 91, trend: '+2%' },
  { name: 'Behavioral', score: 74, trend: '+6%' },
];

const ACHIEVEMENTS = [
  { title: '10 Interviews Completed', icon: Award, color: '#16a34a' },
  { title: 'Score Above 80%', icon: Target, color: '#2563eb' },
  { title: '7-Day Streak', icon: Zap, color: '#f59e0b' },
];

export default function PerformanceInsightsSection({ dark }: Props) {
  const cardBg = dark ? '#161b27' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const text = dark ? '#f1f5f9' : '#0f172a';
  const sub = dark ? '#64748b' : '#6b7280';
  const accent = '#16a34a';

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif", paddingBottom: 40 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: text, margin: 0, letterSpacing: -0.5 }}>
          Performance Insights
        </h1>
        <p style={{ color: sub, fontSize: 14, marginTop: 4 }}>
          AI-powered analysis of your interview performance
        </p>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Avg Score', value: '78%', change: '+4.2%' },
          { label: 'Interviews', value: '24', change: '+8 this month' },
          { label: 'Best Skill', value: 'Problem Solving', change: '91%' },
          { label: 'Improvement', value: 'System Design', change: '+8%' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            style={{
              borderRadius: 16,
              padding: 20,
              background: cardBg,
              border: `1px solid ${border}`,
              boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ color: sub, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>{stat.label}</div>
            <div style={{ color: text, fontSize: 28, fontWeight: 800, marginBottom: 6 }}>{stat.value}</div>
            <div style={{ color: '#16a34a', fontSize: 11, fontWeight: 600 }}>{stat.change}</div>
          </motion.div>
        ))}
      </div>

      {/* Skills Breakdown */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: text, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          Skill Breakdown
        </div>
        <div style={{ borderRadius: 16, padding: 20, background: cardBg, border: `1px solid ${border}` }}>
          {SKILLS.map((skill, idx) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              style={{ marginBottom: idx < SKILLS.length - 1 ? 16 : 0 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: text, fontSize: 13, fontWeight: 600 }}>{skill.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#16a34a', fontSize: 10, fontWeight: 600 }}>{skill.trend}</span>
                  <span style={{ color: text, fontSize: 13, fontWeight: 700 }}>{skill.score}%</span>
                </div>
              </div>
              <div style={{ height: 6, background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.score}%` }}
                  transition={{ duration: 1, delay: 0.2 + idx * 0.05, ease: 'easeOut' }}
                  style={{ height: '100%', background: `linear-gradient(90deg, ${accent}, #2563eb)`, borderRadius: 99 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <div style={{ color: text, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          Achievements
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {ACHIEVEMENTS.map((ach, idx) => {
            const Icon = ach.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                style={{
                  borderRadius: 14,
                  padding: 16,
                  background: cardBg,
                  border: `1px solid ${border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${ach.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} style={{ color: ach.color }} />
                </div>
                <span style={{ color: text, fontSize: 13, fontWeight: 600 }}>{ach.title}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
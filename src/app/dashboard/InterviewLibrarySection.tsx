'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Bookmark, Filter, Play } from 'lucide-react';

interface Props { dark: boolean; }

const CATEGORIES = ['All', 'Technical', 'Behavioral', 'System Design', 'HR'];

const QUESTIONS = [
  { id: 1, title: 'Explain React Hooks', category: 'Technical', difficulty: 'Medium', saved: true },
  { id: 2, title: 'Tell me about yourself', category: 'Behavioral', difficulty: 'Easy', saved: false },
  { id: 3, title: 'Design a URL Shortener', category: 'System Design', difficulty: 'Hard', saved: true },
  { id: 4, title: 'What are your strengths?', category: 'HR', difficulty: 'Easy', saved: false },
  { id: 5, title: 'Reverse a Linked List', category: 'Technical', difficulty: 'Medium', saved: false },
  { id: 6, title: 'Describe a conflict situation', category: 'Behavioral', difficulty: 'Medium', saved: true },
];

export default function InterviewLibrarySection({ dark }: Props) {
  const [activeCat, setActiveCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const cardBg = dark ? '#161b27' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const text = dark ? '#f1f5f9' : '#0f172a';
  const sub = dark ? '#64748b' : '#6b7280';
  const accent = '#16a34a';
  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#f3f4f6';

  const filteredQuestions = QUESTIONS.filter(q => {
    const matchesCat = activeCat === 'All' || q.category === activeCat;
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const difficultyColor = (diff: string) => {
    if (diff === 'Easy') return '#16a34a';
    if (diff === 'Medium') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif", paddingBottom: 40 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: text, margin: 0, letterSpacing: -0.5 }}>
          Interview Library
        </h1>
        <p style={{ color: sub, fontSize: 14, marginTop: 4 }}>
          Browse and practice from our AI-curated question bank
        </p>
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: sub }} />
          <input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              borderRadius: 10,
              background: inputBg,
              border: `1px solid ${border}`,
              color: text,
              fontSize: 13,
              outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCat(cat)}
              style={{
                padding: '8px 14px',
                borderRadius: 99,
                background: activeCat === cat ? accent : inputBg,
                border: 'none',
                color: activeCat === cat ? '#fff' : sub,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Questions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filteredQuestions.map((q, idx) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            whileHover={{ y: -4 }}
            style={{
              borderRadius: 16,
              padding: 18,
              background: cardBg,
              border: `1px solid ${border}`,
              boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.2)' : '0 2px 12px rgba(0,0,0,0.06)',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: `${accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={14} style={{ color: accent }} />
                </div>
                <span style={{ color: sub, fontSize: 10, fontWeight: 600 }}>{q.category}</span>
              </div>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Bookmark size={16} style={{ color: q.saved ? '#f59e0b' : sub }} fill={q.saved ? '#f59e0b' : 'none'} />
              </motion.button>
            </div>
            <div style={{ color: text, fontSize: 14, fontWeight: 600, marginBottom: 10, lineHeight: 1.4 }}>
              {q.title}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: difficultyColor(q.difficulty) }} />
                <span style={{ color: sub, fontSize: 10 }}>{q.difficulty}</span>
              </div>
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
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Play size={10} />Practice
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: sub }}>
          <Search size={40} style={{ color: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', marginBottom: 12 }} />
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>No questions found</div>
          <div style={{ fontSize: 12 }}>Try adjusting your search or filters</div>
        </div>
      )}
    </div>
  );
}
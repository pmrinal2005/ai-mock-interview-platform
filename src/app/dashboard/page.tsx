'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import StatsRow from './StatsRow';
import ScoreTrendChart from './ScoreTrendChart';
import UpcomingInterview from './UpcomingInterview';
import RecentAnalysis from './RecentAnalysis';
import AIFeedbackPanel from './AIFeedbackPanel';
import ReadinessScore from './ReadinessScore';
import PracticeDuration from './PracticeDuration';
import CalendarSection from './CalendarSection';
import PracticeSessionsSection from './PracticeSessionsSection';
import PerformanceInsightsSection from './PerformanceInsightsSection';
import InterviewLibrarySection from './InterviewLibrarySection';

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'dashboard';

  const bg = darkMode ? '#0d1117' : '#f0f4f0';

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: bg,
        fontFamily: "'Space Grotesk', sans-serif",
        transition: 'background 0.3s',
      }}
    >
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
        dark={darkMode}
        activeView={view}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        <DashboardHeader
          dark={darkMode}
          onToggleDark={() => setDarkMode((prev) => !prev)}
        />

        {/* ✅ Shared Scroll Container for ALL views */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '28px',
            background: bg,
            transition: 'background 0.3s',
          }}
        >
          <AnimatePresence mode="wait">
            {view === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ marginBottom: 24 }}>
                  <h1
                    style={{
                      fontSize: 32,
                      fontWeight: 800,
                      color: darkMode ? '#f1f5f9' : '#0f172a',
                      margin: 0,
                      letterSpacing: -0.5,
                    }}
                  >
                    Dashboard
                  </h1>
                  <p
                    style={{
                      color: darkMode ? '#64748b' : '#6b7280',
                      fontSize: 14,
                      marginTop: 4,
                      marginBottom: 0,
                    }}
                  >
                    Track your interview prep, scores, and AI-powered feedback.
                  </p>
                </div>

                <StatsRow dark={darkMode} />

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 280px 260px',
                    gap: 20,
                    marginTop: 20,
                  }}
                >
                  <ScoreTrendChart dark={darkMode} />
                  <UpcomingInterview dark={darkMode} />
                  <RecentAnalysis dark={darkMode} />
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 280px 220px',
                    gap: 20,
                    marginTop: 20,
                    marginBottom: 40,
                  }}
                >
                  <AIFeedbackPanel dark={darkMode} />
                  <ReadinessScore dark={darkMode} />
                  <PracticeDuration dark={darkMode} />
                </div>
              </motion.div>
            )}

            {view === 'calendar' && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <CalendarSection dark={darkMode} />
              </motion.div>
            )}

            {view === 'practice' && (
              <motion.div
                key="practice"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <PracticeSessionsSection dark={darkMode} />
              </motion.div>
            )}

            {view === 'insights' && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <PerformanceInsightsSection dark={darkMode} />
              </motion.div>
            )}

            {view === 'library' && (
              <motion.div
                key="library"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <InterviewLibrarySection dark={darkMode} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
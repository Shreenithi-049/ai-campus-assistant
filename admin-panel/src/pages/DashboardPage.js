import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getTheme, spacing, typography, borderRadius, shadows } from '../constants/theme';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import GlassCard from '../components/GlassCard';
import { getDashboardStats, getRecentRegistrations } from '../services/adminService';
import { getRecentEvents } from '../services/eventsService';

function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function DashboardPage() {
  const { isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentRegs, setRecentRegs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, e, r] = await Promise.all([
          getDashboardStats(),
          getRecentEvents(5),
          getRecentRegistrations(5),
        ]);
        setStats(s);
        setRecentEvents(e);
        setRecentRegs(r);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statCards = [
    { label: 'Total Students',      value: stats?.students,      icon: '👨🎓', color: '#3B82F6' },
    { label: 'Total Events',        value: stats?.events,        icon: '📅',   color: '#8B5CF6' },
    { label: 'Total Registrations', value: stats?.registrations, icon: '🧾',   color: '#10B981' },
    { label: 'Announcements',       value: stats?.announcements, icon: '📢',   color: '#F59E0B' },
  ];

  const categoryColor = {
    academic: '#3B82F6', cultural: '#8B5CF6',
    sports: '#10B981', other: '#F59E0B',
  };

  return (
    <AdminLayout title="Dashboard" subtitle="Welcome back! Here's what's happening on campus.">
      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: spacing.lg,
        marginBottom: spacing.xl,
      }}>
        {statCards.map(card => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
        {/* Recent Events */}
        <GlassCard style={{ gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
            <h3 style={{ ...typography.h4, color: theme.text, margin: 0 }}>📅 Recent Events</h3>
            <button
              onClick={() => navigate('/events')}
              style={{ ...typography.small, color: theme.primary, background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
            >
              View all →
            </button>
          </div>
          {loading ? (
            <SkeletonList />
          ) : recentEvents.length === 0 ? (
            <EmptyState message="No events yet" />
          ) : (
            recentEvents.map(ev => (
              <div key={ev.id} style={{
                display: 'flex', alignItems: 'center', gap: spacing.md,
                padding: `${spacing.sm}px 0`,
                borderBottom: `1px solid ${theme.border}`,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: borderRadius.lg, flexShrink: 0,
                  background: `${categoryColor[ev.category] || '#3B82F6'}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>
                  📅
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...typography.smallMedium, color: theme.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ev.title}
                  </div>
                  <div style={{ ...typography.caption, color: theme.textSecondary }}>{ev.date}</div>
                </div>
                <StatusBadge status={ev.status} theme={theme} />
              </div>
            ))
          )}
        </GlassCard>

        {/* Recent Registrations */}
        <GlassCard style={{ gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
            <h3 style={{ ...typography.h4, color: theme.text, margin: 0 }}>🧾 Recent Registrations</h3>
            <button
              onClick={() => navigate('/registrations')}
              style={{ ...typography.small, color: theme.primary, background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
            >
              View all →
            </button>
          </div>
          {loading ? (
            <SkeletonList />
          ) : recentRegs.length === 0 ? (
            <EmptyState message="No registrations yet" />
          ) : (
            recentRegs.map(reg => (
              <div key={reg.id} style={{
                display: 'flex', alignItems: 'center', gap: spacing.md,
                padding: `${spacing.sm}px 0`,
                borderBottom: `1px solid ${theme.border}`,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #1E3A8A, #8B5CF6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: '700', fontSize: 14,
                }}>
                  {(reg.eventTitle || 'E')[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...typography.smallMedium, color: theme.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {reg.eventTitle}
                  </div>
                  <div style={{ ...typography.caption, color: theme.textSecondary }}>
                    {formatDate(reg.registeredAt)}
                  </div>
                </div>
                <span style={{
                  ...typography.caption, color: '#10B981',
                  background: '#10B98118', borderRadius: 9999,
                  padding: '2px 8px', fontWeight: '600',
                }}>
                  {reg.status || 'registered'}
                </span>
              </div>
            ))
          )}
        </GlassCard>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AdminLayout>
  );
}

function StatusBadge({ status, theme }) {
  const map = {
    published: { bg: '#10B98118', color: '#10B981', label: 'Published' },
    draft:     { bg: '#F59E0B18', color: '#F59E0B', label: 'Draft' },
  };
  const s = map[status] || map.draft;
  return (
    <span style={{
      ...typography.caption, color: s.color,
      background: s.bg, borderRadius: 9999,
      padding: '2px 8px', fontWeight: '600', flexShrink: 0,
    }}>
      {s.label}
    </span>
  );
}

function SkeletonList() {
  return (
    <>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          height: 52, background: '#E2E8F020',
          borderRadius: 8, marginBottom: 8,
          animation: 'pulse 1.4s ease-in-out infinite',
        }} />
      ))}
    </>
  );
}

function EmptyState({ message }) {
  return (
    <div style={{ textAlign: 'center', padding: '32px 0', color: '#94A3B8' }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
      <div>{message}</div>
    </div>
  );
}

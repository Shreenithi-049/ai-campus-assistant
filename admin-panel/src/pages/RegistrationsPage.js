import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTheme, spacing, typography, borderRadius } from '../constants/theme';
import AdminLayout from '../components/AdminLayout';
import GlassCard from '../components/GlassCard';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import { getEventRegistrations } from '../services/adminService';
import { getEvents } from '../services/eventsService';

function formatDate(ts) {
  if (!ts) return '—';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return '—'; }
}

export default function RegistrationsPage() {
  const { isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEvent, setFilterEvent] = useState('all');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [regs, evs] = await Promise.all([getEventRegistrations(), getEvents()]);
      setRegistrations(regs);
      setEvents(evs);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = registrations.filter(r => {
    const matchEvent = filterEvent === 'all' || r.eventId === filterEvent;
    const matchSearch = !search || r.eventTitle?.toLowerCase().includes(search.toLowerCase()) || r.userId?.toLowerCase().includes(search.toLowerCase());
    return matchEvent && matchSearch;
  });

  // Count per event
  const countByEvent = registrations.reduce((acc, r) => {
    acc[r.eventId] = (acc[r.eventId] || 0) + 1;
    return acc;
  }, {});

  const topEvent = Object.entries(countByEvent).sort((a, b) => b[1] - a[1])[0];
  const topEventName = topEvent ? events.find(e => e.id === topEvent[0])?.title || topEvent[0] : '—';

  const columns = [
    {
      key: 'eventTitle', label: 'Event',
      render: (v) => (
        <div style={{ ...typography.smallMedium, color: theme.text }}>{v || '—'}</div>
      ),
    },
    {
      key: 'userId', label: 'User ID',
      render: v => <span style={{ ...typography.caption, color: theme.textSecondary, fontFamily: 'monospace' }}>{v?.slice(0, 16)}…</span>,
    },
    {
      key: 'status', label: 'Status',
      render: v => (
        <span style={{
          ...typography.captionMedium,
          background: '#10B98118', color: '#10B981',
          borderRadius: 9999, padding: '3px 10px', fontWeight: '600',
        }}>
          ✅ {v || 'registered'}
        </span>
      ),
    },
    {
      key: 'registeredAt', label: 'Registered At',
      render: v => <span style={{ ...typography.caption, color: theme.textSecondary }}>{formatDate(v)}</span>,
    },
  ];

  return (
    <AdminLayout title="Event Registrations" subtitle="View all student event registrations">
      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing.lg, marginBottom: spacing.xl }}>
        <StatCard label="Total Registrations" value={registrations.length} icon="🧾" color="#10B981" />
        <StatCard label="Events with Registrations" value={Object.keys(countByEvent).length} icon="📅" color="#3B82F6" />
        <StatCard label="Most Popular Event" value={topEventName} icon="🏆" color="#F59E0B" />
      </div>

      {/* Per-event breakdown */}
      {events.filter(e => countByEvent[e.id]).length > 0 && (
        <GlassCard style={{ marginBottom: spacing.lg }}>
          <h3 style={{ ...typography.h4, color: theme.text, marginBottom: spacing.lg }}>📊 Registrations per Event</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            {events.filter(e => countByEvent[e.id]).map(ev => {
              const count = countByEvent[ev.id] || 0;
              const max = ev.maxParticipants || null;
              const pct = max ? Math.min((count / max) * 100, 100) : null;
              return (
                <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ ...typography.smallMedium, color: theme.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</span>
                      <span style={{ ...typography.smallMedium, color: theme.primary, flexShrink: 0, marginLeft: spacing.sm }}>
                        {count}{max ? ` / ${max}` : ''}
                      </span>
                    </div>
                    {pct !== null && (
                      <div style={{ height: 6, background: theme.border, borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: pct >= 90 ? '#EF4444' : '#10B981', borderRadius: 3, transition: 'width 0.4s' }} />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setFilterEvent(ev.id)}
                    style={{
                      ...typography.caption, color: theme.primary,
                      background: `${theme.primary}12`, border: `1px solid ${theme.primary}30`,
                      borderRadius: borderRadius.sm, padding: '3px 10px', cursor: 'pointer', fontWeight: '600', flexShrink: 0,
                    }}
                  >
                    Filter
                  </button>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* Filters + Table */}
      <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.lg, flexWrap: 'wrap' }}>
        <input
          placeholder="🔍  Search registrations..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 200, padding: '9px 14px',
            border: `1px solid ${theme.border}`, borderRadius: borderRadius.lg,
            background: theme.surface, color: theme.text, ...typography.body, outline: 'none',
          }}
        />
        <select
          value={filterEvent}
          onChange={e => setFilterEvent(e.target.value)}
          style={{ padding: '9px 14px', border: `1px solid ${theme.border}`, borderRadius: borderRadius.lg, background: theme.surface, color: theme.text, ...typography.body, cursor: 'pointer', outline: 'none', maxWidth: 260 }}
        >
          <option value="all">All Events</option>
          {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
        </select>
        {filterEvent !== 'all' && (
          <button
            onClick={() => setFilterEvent('all')}
            style={{ ...typography.small, color: theme.error, background: `${theme.error}12`, border: `1px solid ${theme.error}30`, borderRadius: borderRadius.lg, padding: '9px 14px', cursor: 'pointer', fontWeight: '600' }}
          >
            Clear Filter ×
          </button>
        )}
      </div>

      <GlassCard padding={0}>
        <div style={{ padding: `${spacing.lg}px ${spacing.lg}px ${spacing.sm}px` }}>
          <span style={{ ...typography.smallMedium, color: theme.textSecondary }}>
            {filtered.length} registration{filtered.length !== 1 ? 's' : ''}
            {filterEvent !== 'all' && ` for "${events.find(e => e.id === filterEvent)?.title}"`}
          </span>
        </div>
        <DataTable columns={columns} data={filtered} loading={loading} emptyMessage="No registrations found." />
      </GlassCard>
    </AdminLayout>
  );
}

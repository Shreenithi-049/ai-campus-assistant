import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTheme, spacing, typography, borderRadius, shadows } from '../constants/theme';
import AdminLayout from '../components/AdminLayout';
import GlassCard from '../components/GlassCard';
import DataTable from '../components/DataTable';
import { getStudents } from '../services/adminService';

function formatDate(ts) {
  if (!ts) return '—';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return '—'; }
}

export default function StudentsPage() {
  const { isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setStudents(await getStudents()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const departments = ['all', ...new Set(students.map(s => s.department).filter(Boolean))];
  const years = ['all', ...new Set(students.map(s => s.year).filter(Boolean))];

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.fullName?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q) || s.studentId?.toLowerCase().includes(q);
    const matchDept = filterDept === 'all' || s.department === filterDept;
    const matchYear = filterYear === 'all' || s.year === filterYear;
    return matchSearch && matchDept && matchYear;
  });

  const columns = [
    {
      key: 'fullName', label: 'Student',
      render: (v, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
            background: row.photoURL ? 'transparent' : 'linear-gradient(135deg, #1E3A8A, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: '700', fontSize: 14, overflow: 'hidden',
          }}>
            {row.photoURL
              ? <img src={row.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (v || 'S')[0].toUpperCase()
            }
          </div>
          <div>
            <div style={{ ...typography.smallMedium, color: theme.text }}>{v || '—'}</div>
            <div style={{ ...typography.caption, color: theme.textSecondary }}>{row.email}</div>
          </div>
        </div>
      ),
    },
    { key: 'studentId', label: 'Student ID', render: v => <span style={{ ...typography.small, color: theme.textSecondary, fontFamily: 'monospace' }}>{v || '—'}</span> },
    { key: 'department', label: 'Department', render: v => <span style={{ ...typography.small, color: theme.text }}>{v || '—'}</span> },
    { key: 'year', label: 'Year', render: v => <span style={{ ...typography.small, color: theme.textSecondary }}>{v || '—'}</span> },
    {
      key: 'emailVerified', label: 'Verified',
      render: v => (
        <span style={{
          ...typography.captionMedium,
          background: v ? '#10B98118' : '#EF444418',
          color: v ? '#10B981' : '#EF4444',
          borderRadius: 9999, padding: '3px 10px', fontWeight: '600',
        }}>
          {v ? '✅ Yes' : '❌ No'}
        </span>
      ),
    },
    { key: 'createdAt', label: 'Joined', render: v => <span style={{ ...typography.caption, color: theme.textSecondary }}>{formatDate(v)}</span> },
    {
      key: 'id', label: 'Details', width: 80,
      render: (_, row) => (
        <button
          onClick={() => setSelected(row)}
          style={{
            ...typography.small, color: theme.primary, background: `${theme.primary}12`,
            border: `1px solid ${theme.primary}30`, borderRadius: borderRadius.sm,
            padding: '4px 10px', cursor: 'pointer', fontWeight: '600',
          }}
        >
          View
        </button>
      ),
    },
  ];

  return (
    <AdminLayout title="Students" subtitle="View and search all registered students">
      {/* Filters */}
      <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.lg, flexWrap: 'wrap' }}>
        <input
          placeholder="🔍  Search by name, email or ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 220, padding: '9px 14px',
            border: `1px solid ${theme.border}`, borderRadius: borderRadius.lg,
            background: theme.surface, color: theme.text, ...typography.body, outline: 'none',
          }}
        />
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
          style={{ padding: '9px 14px', border: `1px solid ${theme.border}`, borderRadius: borderRadius.lg, background: theme.surface, color: theme.text, ...typography.body, cursor: 'pointer', outline: 'none' }}>
          {departments.map(d => <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>)}
        </select>
        <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
          style={{ padding: '9px 14px', border: `1px solid ${theme.border}`, borderRadius: borderRadius.lg, background: theme.surface, color: theme.text, ...typography.body, cursor: 'pointer', outline: 'none' }}>
          {years.map(y => <option key={y} value={y}>{y === 'all' ? 'All Years' : y}</option>)}
        </select>
      </div>

      <GlassCard padding={0}>
        <div style={{ padding: `${spacing.lg}px ${spacing.lg}px ${spacing.sm}px` }}>
          <span style={{ ...typography.smallMedium, color: theme.textSecondary }}>
            {filtered.length} student{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
        <DataTable columns={columns} data={filtered} loading={loading} emptyMessage="No students found." />
      </GlassCard>

      {/* Student detail modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: theme.surface, borderRadius: 20, boxShadow: shadows.lg, width: '100%', maxWidth: 480, border: `1px solid ${theme.border}`, animation: 'slideUp 0.2s ease', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: `${spacing.lg}px ${spacing.xl}px`, borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ ...typography.h4, color: theme.text, margin: 0 }}>Student Profile</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: theme.textSecondary }}>×</button>
            </div>
            <div style={{ padding: spacing.xl }}>
              <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%', margin: '0 auto 12px',
                  background: 'linear-gradient(135deg, #1E3A8A, #8B5CF6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: '700', fontSize: 28, overflow: 'hidden',
                }}>
                  {selected.photoURL
                    ? <img src={selected.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : (selected.fullName || 'S')[0].toUpperCase()
                  }
                </div>
                <div style={{ ...typography.h4, color: theme.text }}>{selected.fullName || '—'}</div>
                <div style={{ ...typography.small, color: theme.textSecondary }}>{selected.email}</div>
              </div>
              {[
                ['Student ID', selected.studentId],
                ['Department', selected.department],
                ['Year', selected.year],
                ['Semester', selected.semester],
                ['Phone', selected.phoneNumber],
                ['Gender', selected.gender],
                ['Blood Group', selected.bloodGroup],
                ['Date of Birth', selected.dateOfBirth],
                ['Emergency Contact', selected.emergencyContact],
                ['Joined', formatDate(selected.createdAt)],
              ].map(([label, value]) => value ? (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: `${spacing.sm}px 0`, borderBottom: `1px solid ${theme.border}` }}>
                  <span style={{ ...typography.smallMedium, color: theme.textSecondary }}>{label}</span>
                  <span style={{ ...typography.smallMedium, color: theme.text }}>{value}</span>
                </div>
              ) : null)}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

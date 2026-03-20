import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTheme, spacing, typography, borderRadius, shadows } from '../constants/theme';
import AdminLayout from '../components/AdminLayout';
import GlassCard from '../components/GlassCard';
import ModernButton from '../components/ModernButton';
import ModernInput from '../components/ModernInput';
import Toast from '../components/Toast';
import { getTimetable, saveTimetable } from '../services/timetableService';
import { DEPARTMENT_OPTIONS, YEARS } from '../constants/departments';
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

const EMPTY_ENTRY = { subject: '', time: '', room: '', professor: '', day: 'Monday', color: '#3B82F6' };

export default function TimetablePage() {
  const { isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);
  const [department, setDepartment] = useState('CSD');
  const [year, setYear] = useState('1st Year');
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeDay, setActiveDay] = useState('Monday');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState(EMPTY_ENTRY);
  const [editingIdx, setEditingIdx] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const load = async () => {
    setLoading(true);
    try {
      const data = await getTimetable(department, year);
      setSchedule(data);
    } catch { showToast('Failed to load timetable', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [department, year]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveTimetable(department, year, schedule);
      showToast('Timetable saved successfully');
    } catch { showToast('Failed to save', 'error'); }
    finally { setSaving(false); }
  };

  const addEntry = () => {
    if (!newEntry.subject.trim() || !newEntry.time.trim()) {
      showToast('Subject and time are required', 'warning');
      return;
    }
    if (editingIdx !== null) {
      const updated = [...schedule];
      updated[editingIdx] = { ...newEntry };
      setSchedule(updated);
      setEditingIdx(null);
    } else {
      setSchedule(prev => [...prev, { ...newEntry, id: `tt${Date.now()}` }]);
    }
    setNewEntry(EMPTY_ENTRY);
    setShowAddForm(false);
  };

  const removeEntry = (idx) => {
    setSchedule(prev => prev.filter((_, i) => i !== idx));
  };

  const startEdit = (entry, idx) => {
    setNewEntry({ ...entry });
    setEditingIdx(idx);
    setShowAddForm(true);
  };

  const daySchedule = schedule.filter(e => e.day === activeDay);

  return (
    <AdminLayout title="Timetable Manager" subtitle="Manage class schedules by department and year">
      {/* Selectors */}
      <GlassCard style={{ marginBottom: spacing.lg }}>
        <div style={{ display: 'flex', gap: spacing.lg, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <ModernInput
              label="Department"
              type="select"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              options={DEPARTMENT_OPTIONS}
              icon={<span>🏛️</span>}
              style={{ marginBottom: 0 }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <ModernInput
              label="Year"
              type="select"
              value={year}
              onChange={e => setYear(e.target.value)}
              options={YEARS.map(y => ({ value: y, label: y }))}
              icon={<span>📚</span>}
              style={{ marginBottom: 0 }}
            />
          </div>
          <ModernButton variant="primary" onClick={handleSave} loading={saving} icon={<span>💾</span>}>
            Save Timetable
          </ModernButton>
        </div>
      </GlassCard>

      {/* Day tabs */}
      <div style={{ display: 'flex', gap: spacing.sm, marginBottom: spacing.lg, flexWrap: 'wrap' }}>
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            style={{
              padding: '8px 18px',
              borderRadius: borderRadius.full,
              border: activeDay === day ? `2px solid ${theme.primary}` : `1px solid ${theme.border}`,
              background: activeDay === day ? `${theme.primary}18` : theme.surface,
              color: activeDay === day ? theme.primary : theme.textSecondary,
              cursor: 'pointer', fontWeight: activeDay === day ? '600' : '400',
              ...typography.smallMedium, transition: 'all 0.15s',
            }}
          >
            {day}
            {schedule.filter(e => e.day === day).length > 0 && (
              <span style={{
                marginLeft: 6, background: theme.primary, color: '#fff',
                borderRadius: 9999, padding: '1px 6px', fontSize: 11, fontWeight: '700',
              }}>
                {schedule.filter(e => e.day === day).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Schedule for active day */}
      <GlassCard>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
          <h3 style={{ ...typography.h4, color: theme.text, margin: 0 }}>
            📅 {activeDay} — {department} ({year})
          </h3>
          <ModernButton
            variant="primary" size="small"
            onClick={() => { setNewEntry({ ...EMPTY_ENTRY, day: activeDay }); setEditingIdx(null); setShowAddForm(true); }}
            icon={<span>➕</span>}
          >
            Add Class
          </ModernButton>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: spacing.xl, color: theme.textSecondary }}>Loading…</div>
        ) : daySchedule.length === 0 ? (
          <div style={{ textAlign: 'center', padding: spacing.xxl, color: theme.textTertiary }}>
            <div style={{ fontSize: 40, marginBottom: spacing.md }}>📭</div>
            <div>No classes scheduled for {activeDay}</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            {daySchedule.map((entry, i) => {
              const realIdx = schedule.findIndex((e, idx) => e === entry);
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: spacing.md,
                  background: theme.backgroundSecondary,
                  borderRadius: borderRadius.lg, padding: spacing.md,
                  borderLeft: `4px solid ${entry.color || '#3B82F6'}`,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...typography.bodyMedium, color: theme.text }}>{entry.subject}</div>
                    <div style={{ ...typography.small, color: theme.textSecondary, marginTop: 2 }}>
                      ⏰ {entry.time} &nbsp;|&nbsp; 🚪 {entry.room} &nbsp;|&nbsp; 👤 {entry.professor}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: spacing.xs }}>
                    <ModernButton size="small" variant="outline" onClick={() => startEdit(entry, realIdx)}>Edit</ModernButton>
                    <ModernButton size="small" variant="danger" onClick={() => removeEntry(realIdx)}>Remove</ModernButton>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>

      {/* Add/Edit form modal */}
      {showAddForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: theme.surface, borderRadius: 20, boxShadow: shadows.lg, width: '100%', maxWidth: 520, border: `1px solid ${theme.border}`, animation: 'slideUp 0.2s ease' }}>
            <div style={{ padding: `${spacing.lg}px ${spacing.xl}px`, borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ ...typography.h4, color: theme.text, margin: 0 }}>
                {editingIdx !== null ? 'Edit Class' : 'Add Class'}
              </h3>
              <button onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: theme.textSecondary }}>×</button>
            </div>
            <div style={{ padding: spacing.xl }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `0 ${spacing.md}px` }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <ModernInput label="Subject" value={newEntry.subject} onChange={e => setNewEntry({ ...newEntry, subject: e.target.value })} placeholder="e.g. Data Structures" required icon={<span>📖</span>} />
                </div>
                <ModernInput label="Time" value={newEntry.time} onChange={e => setNewEntry({ ...newEntry, time: e.target.value })} placeholder="9:00 AM - 10:30 AM" required icon={<span>⏰</span>} />
                <ModernInput label="Room" value={newEntry.room} onChange={e => setNewEntry({ ...newEntry, room: e.target.value })} placeholder="ENG-301" icon={<span>🚪</span>} />
                <ModernInput label="Professor" value={newEntry.professor} onChange={e => setNewEntry({ ...newEntry, professor: e.target.value })} placeholder="Dr. Smith" icon={<span>👤</span>} />
                <ModernInput label="Day" type="select" value={newEntry.day} onChange={e => setNewEntry({ ...newEntry, day: e.target.value })} options={DAYS.map(d => ({ value: d, label: d }))} icon={<span>📅</span>} />
              </div>
              <div>
                <label style={{ ...typography.smallMedium, color: theme.text, display: 'block', marginBottom: spacing.sm }}>Color</label>
                <div style={{ display: 'flex', gap: spacing.sm }}>
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setNewEntry({ ...newEntry, color: c })}
                      style={{
                        width: 32, height: 32, borderRadius: '50%', background: c,
                        border: newEntry.color === c ? `3px solid ${theme.text}` : '3px solid transparent',
                        cursor: 'pointer', transition: 'border 0.15s',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div style={{ padding: `${spacing.md}px ${spacing.xl}px`, borderTop: `1px solid ${theme.border}`, display: 'flex', gap: spacing.sm, justifyContent: 'flex-end' }}>
              <ModernButton variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</ModernButton>
              <ModernButton variant="primary" onClick={addEntry}>
                {editingIdx !== null ? 'Update' : 'Add Class'}
              </ModernButton>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </AdminLayout>
  );
}

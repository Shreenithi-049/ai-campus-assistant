import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTheme, spacing, typography, borderRadius, shadows } from '../constants/theme';
import AdminLayout from '../components/AdminLayout';
import GlassCard from '../components/GlassCard';
import ModernButton from '../components/ModernButton';
import ModernInput from '../components/ModernInput';
import Toast from '../components/Toast';
import { getSyllabus, saveSyllabus } from '../services/syllabusService';
import { DEPARTMENT_OPTIONS, YEARS } from '../constants/departments';

const SEMESTERS = ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'];
const EMPTY_SUBJECT = { subject: '', totalTopics: '', completedTopics: '' };

export default function SyllabusPage() {
  const { isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);
  const [department, setDepartment] = useState('CSD');
  const [year, setYear] = useState('3rd Year');
  const [semester, setSemester] = useState('6th Semester');
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const load = async () => {
    setLoading(true);
    try {
      const data = await getSyllabus(department, year, semester);
      setSubjects(data.length > 0 ? data : [{ ...EMPTY_SUBJECT }]);
    } catch {
      showToast('Failed to load syllabus', 'error');
      setSubjects([{ ...EMPTY_SUBJECT }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [department, year, semester]);

  const handleSave = async () => {
    const valid = subjects.every(s => s.subject.trim() && s.totalTopics !== '' && s.completedTopics !== '');
    if (!valid) { showToast('Fill in all subject fields', 'warning'); return; }

    const cleaned = subjects.map(s => ({
      subject: s.subject.trim(),
      totalTopics: Number(s.totalTopics),
      completedTopics: Number(s.completedTopics),
    }));

    setSaving(true);
    try {
      await saveSyllabus(department, year, semester, cleaned);
      showToast('Syllabus saved successfully');
    } catch {
      showToast('Failed to save syllabus', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateSubject = (idx, field, value) => {
    setSubjects(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const addSubject = () => setSubjects(prev => [...prev, { ...EMPTY_SUBJECT }]);

  const removeSubject = (idx) => setSubjects(prev => prev.filter((_, i) => i !== idx));

  const inputStyle = {
    width: '100%', padding: '9px 12px',
    border: `1px solid ${theme.border}`, borderRadius: borderRadius.lg,
    background: theme.backgroundSecondary, color: theme.text,
    ...typography.body, outline: 'none',
  };

  return (
    <AdminLayout title="Syllabus Manager" subtitle="Manage subject syllabus by department, year and semester">
      {/* Selectors */}
      <GlassCard style={{ marginBottom: spacing.lg }}>
        <div style={{ display: 'flex', gap: spacing.lg, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <ModernInput
              label="Department" type="select" value={department}
              onChange={e => setDepartment(e.target.value)}
              options={DEPARTMENT_OPTIONS} icon={<span>🏛️</span>}
              style={{ marginBottom: 0 }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <ModernInput
              label="Year" type="select" value={year}
              onChange={e => setYear(e.target.value)}
              options={YEARS.map(y => ({ value: y, label: y }))} icon={<span>📚</span>}
              style={{ marginBottom: 0 }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <ModernInput
              label="Semester" type="select" value={semester}
              onChange={e => setSemester(e.target.value)}
              options={SEMESTERS.map(s => ({ value: s, label: s }))} icon={<span>🗓️</span>}
              style={{ marginBottom: 0 }}
            />
          </div>
          <ModernButton variant="primary" onClick={handleSave} loading={saving} icon={<span>💾</span>}>
            Save Syllabus
          </ModernButton>
        </div>
      </GlassCard>

      {/* Subject List */}
      <GlassCard>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
          <h3 style={{ ...typography.h4, color: theme.text, margin: 0 }}>
            📖 {department} — {year} — {semester}
          </h3>
          <ModernButton variant="primary" size="small" onClick={addSubject} icon={<span>➕</span>}>
            Add Subject
          </ModernButton>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: spacing.xl, color: theme.textSecondary }}>Loading…</div>
        ) : (
          <>
            {/* Column headers */}
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto',
              gap: spacing.md, padding: `0 0 ${spacing.sm}px`,
              borderBottom: `1px solid ${theme.border}`, marginBottom: spacing.md,
            }}>
              {['Subject Name', 'Total Topics', 'Completed', ''].map(h => (
                <div key={h} style={{ ...typography.smallMedium, color: theme.textSecondary }}>{h}</div>
              ))}
            </div>

            {subjects.map((sub, idx) => {
              const progress = sub.totalTopics > 0
                ? Math.round((Number(sub.completedTopics) / Number(sub.totalTopics)) * 100) : 0;
              const color = progress >= 75 ? '#10B981' : progress >= 50 ? '#F59E0B' : '#EF4444';

              return (
                <div key={idx} style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto',
                  gap: spacing.md, alignItems: 'center', marginBottom: spacing.md,
                  padding: spacing.md, borderRadius: borderRadius.lg,
                  background: theme.backgroundSecondary,
                  borderLeft: `4px solid ${color}`,
                }}>
                  <input
                    style={inputStyle}
                    placeholder="e.g. Quantum Computing"
                    value={sub.subject}
                    onChange={e => updateSubject(idx, 'subject', e.target.value)}
                  />
                  <input
                    style={inputStyle} type="number" min="0"
                    placeholder="14"
                    value={sub.totalTopics}
                    onChange={e => updateSubject(idx, 'totalTopics', e.target.value)}
                  />
                  <div>
                    <input
                      style={inputStyle} type="number" min="0"
                      placeholder="10"
                      value={sub.completedTopics}
                      onChange={e => updateSubject(idx, 'completedTopics', e.target.value)}
                    />
                    {sub.totalTopics > 0 && (
                      <div style={{ marginTop: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                          <span style={{ ...typography.caption, color: theme.textSecondary }}>{progress}%</span>
                        </div>
                        <div style={{ height: 4, background: theme.border, borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${progress}%`, background: color, borderRadius: 2, transition: 'width 0.3s' }} />
                        </div>
                      </div>
                    )}
                  </div>
                  <ModernButton
                    size="small" variant="danger"
                    onClick={() => removeSubject(idx)}
                    disabled={subjects.length === 1}
                  >
                    ✕
                  </ModernButton>
                </div>
              );
            })}

            <div style={{ marginTop: spacing.lg, paddingTop: spacing.lg, borderTop: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'flex-end', gap: spacing.sm }}>
              <ModernButton variant="ghost" onClick={addSubject} icon={<span>➕</span>}>Add Subject</ModernButton>
              <ModernButton variant="primary" onClick={handleSave} loading={saving} icon={<span>💾</span>}>Save Syllabus</ModernButton>
            </div>
          </>
        )}
      </GlassCard>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </AdminLayout>
  );
}

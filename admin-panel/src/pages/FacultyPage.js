import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTheme, spacing, typography, borderRadius, shadows } from '../constants/theme';
import AdminLayout from '../components/AdminLayout';
import GlassCard from '../components/GlassCard';
import ModernButton from '../components/ModernButton';
import ModernInput from '../components/ModernInput';
import DataTable from '../components/DataTable';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import { getFaculty, createFaculty, updateFaculty, deleteFaculty } from '../services/facultyService';

const EMPTY_FORM = { name: '', department: '', email: '', office: '', hours: '', phone: '' };

export default function FacultyPage() {
  const { isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setFaculty(await getFaculty()); }
    catch { showToast('Failed to load faculty', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setErrors({}); setShowForm(true); };
  const openEdit = (f) => {
    setForm({ name: f.name || '', department: f.department || '', email: f.email || '', office: f.office || '', hours: f.hours || '', phone: f.phone || '' });
    setEditingId(f.id);
    setErrors({});
    setShowForm(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.department.trim()) e.department = 'Department is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editingId) { await updateFaculty(editingId, form); showToast('Faculty updated'); }
      else { await createFaculty(form); showToast('Faculty added'); }
      setShowForm(false);
      load();
    } catch { showToast('Failed to save', 'error'); }
    finally { setSaving(false); }
  };

  const filtered = faculty.filter(f =>
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.department?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: 'name', label: 'Faculty Member',
      render: (v, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #1E3A8A, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: '700', fontSize: 16,
          }}>
            {(v || 'F')[0].toUpperCase()}
          </div>
          <div>
            <div style={{ ...typography.smallMedium, color: theme.text }}>{v}</div>
            <div style={{ ...typography.caption, color: theme.textSecondary }}>{row.department}</div>
          </div>
        </div>
      ),
    },
    { key: 'email', label: 'Email', render: v => <span style={{ ...typography.small, color: theme.primary }}>{v}</span> },
    { key: 'office', label: 'Office', render: v => <span style={{ ...typography.small, color: theme.textSecondary }}>{v || '—'}</span> },
    { key: 'hours', label: 'Office Hours', render: v => <span style={{ ...typography.small, color: theme.textSecondary }}>{v || '—'}</span> },
    {
      key: 'id', label: 'Actions', width: 120,
      render: (_, row) => (
        <div style={{ display: 'flex', gap: spacing.xs }}>
          <ModernButton size="small" variant="outline" onClick={() => openEdit(row)}>Edit</ModernButton>
          <ModernButton size="small" variant="danger" onClick={() => setDeleteTarget(row)}>Del</ModernButton>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Faculty Directory" subtitle="Manage faculty members and their information">
      <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.lg, alignItems: 'center' }}>
        <input
          placeholder="🔍  Search faculty..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, padding: '9px 14px',
            border: `1px solid ${theme.border}`, borderRadius: borderRadius.lg,
            background: theme.surface, color: theme.text, ...typography.body, outline: 'none',
          }}
        />
        <ModernButton variant="primary" onClick={openCreate} icon={<span>➕</span>}>
          Add Faculty
        </ModernButton>
      </div>

      <GlassCard padding={0}>
        <div style={{ padding: `${spacing.lg}px ${spacing.lg}px ${spacing.sm}px` }}>
          <span style={{ ...typography.smallMedium, color: theme.textSecondary }}>
            {filtered.length} faculty member{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
        <DataTable columns={columns} data={filtered} loading={loading} emptyMessage="No faculty members found." />
      </GlassCard>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: theme.surface, borderRadius: 20, boxShadow: shadows.lg, width: '100%', maxWidth: 560, border: `1px solid ${theme.border}`, animation: 'slideUp 0.2s ease' }}>
            <div style={{ padding: `${spacing.lg}px ${spacing.xl}px`, borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ ...typography.h4, color: theme.text, margin: 0 }}>
                {editingId ? 'Edit Faculty' : 'Add Faculty Member'}
              </h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: theme.textSecondary }}>×</button>
            </div>
            <div style={{ padding: spacing.xl }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `0 ${spacing.md}px` }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <ModernInput label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Dr. Sarah Smith" required error={errors.name} icon={<span>👤</span>} />
                </div>
                <ModernInput label="Department" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="Computer Science" required error={errors.department} icon={<span>🏛️</span>} />
                <ModernInput label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="name@skcet.ac.in" required error={errors.email} icon={<span>📧</span>} />
                <ModernInput label="Office" value={form.office} onChange={e => setForm({ ...form, office: e.target.value })} placeholder="ENG-501" icon={<span>🚪</span>} />
                <ModernInput label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 9876543210" icon={<span>📞</span>} />
                <div style={{ gridColumn: 'span 2' }}>
                  <ModernInput label="Office Hours" value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} placeholder="Mon-Wed 2-4 PM" icon={<span>🕐</span>} />
                </div>
              </div>
            </div>
            <div style={{ padding: `${spacing.md}px ${spacing.xl}px`, borderTop: `1px solid ${theme.border}`, display: 'flex', gap: spacing.sm, justifyContent: 'flex-end' }}>
              <ModernButton variant="ghost" onClick={() => setShowForm(false)} disabled={saving}>Cancel</ModernButton>
              <ModernButton variant="primary" onClick={handleSave} loading={saving}>Save</ModernButton>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Remove Faculty"
        message={`Remove "${deleteTarget?.name}" from the directory?`}
        onConfirm={async () => { await deleteFaculty(deleteTarget.id); setDeleteTarget(null); showToast('Faculty removed'); load(); }}
        onCancel={() => setDeleteTarget(null)}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </AdminLayout>
  );
}

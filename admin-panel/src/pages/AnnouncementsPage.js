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
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../services/announcementsService';

const EMPTY_FORM = { title: '', message: '', priority: 'medium', date: '' };
const PRIORITIES = [
  { value: 'high',   label: '🔴 High' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'low',    label: '🟢 Low' },
];

function PriorityBadge({ priority }) {
  const map = {
    high:   { bg: '#EF444418', color: '#EF4444', label: '🔴 High' },
    medium: { bg: '#F59E0B18', color: '#F59E0B', label: '🟡 Medium' },
    low:    { bg: '#10B98118', color: '#10B981', label: '🟢 Low' },
  };
  const s = map[priority] || map.medium;
  return (
    <span style={{ ...typography.captionMedium, background: s.bg, color: s.color, borderRadius: 9999, padding: '3px 10px', fontWeight: '600' }}>
      {s.label}
    </span>
  );
}

export default function AnnouncementsPage() {
  const { isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await getAnnouncements()); }
    catch { showToast('Failed to load announcements', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setErrors({}); setShowForm(true); };
  const openEdit = (item) => {
    setForm({ title: item.title || '', message: item.message || '', priority: item.priority || 'medium', date: item.date || '' });
    setEditingId(item.id);
    setErrors({});
    setShowForm(true);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...form, date: form.date || new Date().toISOString().split('T')[0] };
      if (editingId) {
        await updateAnnouncement(editingId, payload);
        showToast('Announcement updated');
      } else {
        await createAnnouncement(payload);
        showToast('Announcement created');
      }
      setShowForm(false);
      load();
    } catch { showToast('Failed to save', 'error'); }
    finally { setSaving(false); }
  };

  const columns = [
    {
      key: 'title', label: 'Title',
      render: (v, row) => (
        <div>
          <div style={{ ...typography.smallMedium, color: theme.text }}>{v}</div>
          <div style={{ ...typography.caption, color: theme.textSecondary, marginTop: 2, maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {row.message}
          </div>
        </div>
      ),
    },
    { key: 'priority', label: 'Priority', render: v => <PriorityBadge priority={v} /> },
    { key: 'date', label: 'Date', render: v => <span style={{ ...typography.small, color: theme.textSecondary }}>{v || '—'}</span> },
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
    <AdminLayout title="Announcements" subtitle="Post and manage campus announcements">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: spacing.lg }}>
        <ModernButton variant="primary" onClick={openCreate} icon={<span>➕</span>}>
          New Announcement
        </ModernButton>
      </div>

      <GlassCard padding={0}>
        <div style={{ padding: `${spacing.lg}px ${spacing.lg}px ${spacing.sm}px` }}>
          <span style={{ ...typography.smallMedium, color: theme.textSecondary }}>
            {items.length} announcement{items.length !== 1 ? 's' : ''}
          </span>
        </div>
        <DataTable columns={columns} data={items} loading={loading} emptyMessage="No announcements yet." />
      </GlassCard>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: theme.surface, borderRadius: 20, boxShadow: shadows.lg, width: '100%', maxWidth: 520, border: `1px solid ${theme.border}`, animation: 'slideUp 0.2s ease' }}>
            <div style={{ padding: `${spacing.lg}px ${spacing.xl}px`, borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ ...typography.h4, color: theme.text, margin: 0 }}>
                {editingId ? 'Edit Announcement' : 'New Announcement'}
              </h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: theme.textSecondary }}>×</button>
            </div>
            <div style={{ padding: spacing.xl }}>
              <ModernInput label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Announcement title" required error={errors.title} icon={<span>📢</span>} />
              <ModernInput label="Message" type="textarea" rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Announcement message..." required error={errors.message} icon={<span>📝</span>} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                <ModernInput label="Priority" type="select" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} options={PRIORITIES} icon={<span>🚦</span>} />
                <ModernInput label="Date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} icon={<span>📅</span>} />
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
        title="Delete Announcement"
        message={`Delete "${deleteTarget?.title}"?`}
        onConfirm={async () => { await deleteAnnouncement(deleteTarget.id); setDeleteTarget(null); showToast('Deleted'); load(); }}
        onCancel={() => setDeleteTarget(null)}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </AdminLayout>
  );
}

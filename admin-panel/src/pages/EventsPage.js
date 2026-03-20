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
import { getEvents, createEvent, updateEvent, deleteEvent } from '../services/eventsService';

const EMPTY_FORM = {
  title: '', description: '', category: 'academic',
  date: '', time: '', location: '', registrationLink: '',
  status: 'draft', deadline: '', maxParticipants: '',
};

const CATEGORIES = [
  { value: 'academic', label: 'Academic' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'sports',   label: 'Sports' },
  { value: 'other',    label: 'Other' },
];

const STATUS_OPTIONS = [
  { value: 'draft',     label: 'Draft' },
  { value: 'published', label: 'Published' },
];

const ICONS = {
  academic: '🎓', cultural: '🎭', sports: '⚽', other: '📌',
};

export default function EventsPage() {
  const { isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    try { setEvents(await getEvents()); }
    catch (e) { showToast('Failed to load events', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setErrors({}); setShowForm(true); };
  const openEdit = (ev) => {
    setForm({
      title: ev.title || '', description: ev.description || '',
      category: ev.category || 'academic', date: ev.date || '',
      time: ev.time || '', location: ev.location || '',
      registrationLink: ev.registrationLink || '',
      status: ev.status || 'draft', deadline: ev.deadline || '',
      maxParticipants: ev.maxParticipants || '',
    });
    setEditingId(ev.id);
    setErrors({});
    setShowForm(true);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.date.trim()) e.date = 'Date is required';
    if (!form.location.trim()) e.location = 'Location is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : null,
      };
      if (editingId) {
        await updateEvent(editingId, payload);
        showToast('Event updated successfully');
      } else {
        await createEvent(payload);
        showToast('Event created successfully');
      }
      setShowForm(false);
      load();
    } catch (e) {
      showToast('Failed to save event', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await deleteEvent(deleteTarget.id);
    setDeleteTarget(null);
    showToast('Event deleted');
    load();
  };

  const filtered = events.filter(ev => {
    const matchSearch = ev.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || ev.category === filterCat;
    return matchSearch && matchCat;
  });

  const columns = [
    {
      key: 'title', label: 'Event',
      render: (v, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <span style={{ fontSize: 20 }}>{ICONS[row.category] || '📌'}</span>
          <div>
            <div style={{ ...typography.smallMedium, color: theme.text }}>{v}</div>
            <div style={{ ...typography.caption, color: theme.textSecondary }}>{row.location}</div>
          </div>
        </div>
      ),
    },
    { key: 'date', label: 'Date', render: v => <span style={{ ...typography.small, color: theme.textSecondary }}>{v || '—'}</span> },
    { key: 'category', label: 'Category', render: v => <CategoryBadge cat={v} /> },
    {
      key: 'status', label: 'Status',
      render: v => (
        <span style={{
          ...typography.captionMedium,
          background: v === 'published' ? '#10B98118' : '#F59E0B18',
          color: v === 'published' ? '#10B981' : '#F59E0B',
          borderRadius: 9999, padding: '3px 10px', fontWeight: '600',
        }}>
          {v === 'published' ? '✅ Published' : '📝 Draft'}
        </span>
      ),
    },
    {
      key: 'attendees', label: 'Attendees',
      render: (v, row) => (
        <span style={{ ...typography.small, color: theme.textSecondary }}>
          {v || 0}{row.maxParticipants ? ` / ${row.maxParticipants}` : ''}
        </span>
      ),
    },
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
    <AdminLayout title="Events Management" subtitle="Create, edit and manage campus events">
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.lg, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="🔍  Search events..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 200, padding: '9px 14px',
            border: `1px solid ${theme.border}`, borderRadius: borderRadius.lg,
            background: theme.surface, color: theme.text,
            ...typography.body, outline: 'none',
          }}
        />
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          style={{
            padding: '9px 14px', border: `1px solid ${theme.border}`,
            borderRadius: borderRadius.lg, background: theme.surface,
            color: theme.text, ...typography.body, cursor: 'pointer', outline: 'none',
          }}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <ModernButton variant="primary" onClick={openCreate} icon={<span>➕</span>}>
          New Event
        </ModernButton>
      </div>

      {/* Table */}
      <GlassCard padding={0}>
        <div style={{ padding: `${spacing.lg}px ${spacing.lg}px ${spacing.sm}px` }}>
          <span style={{ ...typography.smallMedium, color: theme.textSecondary }}>
            {filtered.length} event{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
        <DataTable columns={columns} data={filtered} loading={loading} emptyMessage="No events found. Create your first event!" />
      </GlassCard>

      {/* Form Modal */}
      {showForm && (
        <FormModal
          title={editingId ? 'Edit Event' : 'Create New Event'}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          saving={saving}
          theme={theme}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `0 ${spacing.md}px` }}>
            <div style={{ gridColumn: 'span 2' }}>
              <ModernInput label="Event Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Tech Symposium 2025" required error={errors.title} icon={<span>📌</span>} />
            </div>
            <ModernInput label="Date" type="text" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} placeholder="e.g. March 15, 2025" required error={errors.date} icon={<span>📅</span>} />
            <ModernInput label="Time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="e.g. 10:00 AM" icon={<span>⏰</span>} />
            <ModernInput label="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Main Auditorium" required error={errors.location} icon={<span>📍</span>} />
            <ModernInput label="Registration Deadline" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} placeholder="e.g. March 10, 2025" icon={<span>⏳</span>} />
            <ModernInput label="Category" type="select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} options={CATEGORIES} icon={<span>🏷️</span>} />
            <ModernInput label="Status" type="select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} options={STATUS_OPTIONS} icon={<span>📊</span>} />
            <ModernInput label="Max Participants" type="number" value={form.maxParticipants} onChange={e => setForm({ ...form, maxParticipants: e.target.value })} placeholder="Leave blank for unlimited" icon={<span>👥</span>} />
            <div style={{ gridColumn: 'span 2' }}>
              <ModernInput label="Registration Link" value={form.registrationLink} onChange={e => setForm({ ...form, registrationLink: e.target.value })} placeholder="https://... (leave blank to show 'Coming Soon')" icon={<span>🔗</span>} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <ModernInput label="Description" type="textarea" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Event description..." icon={<span>📝</span>} />
            </div>
          </div>
        </FormModal>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </AdminLayout>
  );
}

function CategoryBadge({ cat }) {
  const map = {
    academic: { bg: '#3B82F618', color: '#3B82F6', label: '🎓 Academic' },
    cultural: { bg: '#8B5CF618', color: '#8B5CF6', label: '🎭 Cultural' },
    sports:   { bg: '#10B98118', color: '#10B981', label: '⚽ Sports' },
    other:    { bg: '#F59E0B18', color: '#F59E0B', label: '📌 Other' },
  };
  const s = map[cat] || map.other;
  return (
    <span style={{ ...typography.captionMedium, background: s.bg, color: s.color, borderRadius: 9999, padding: '3px 10px', fontWeight: '600' }}>
      {s.label}
    </span>
  );
}

function FormModal({ title, children, onClose, onSave, saving, theme }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16,
    }}>
      <div style={{
        background: theme.surface, borderRadius: 20,
        boxShadow: shadows.lg, width: '100%', maxWidth: 680,
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        border: `1px solid ${theme.border}`,
        animation: 'slideUp 0.2s ease',
      }}>
        <div style={{
          padding: `${spacing.lg}px ${spacing.xl}px`,
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h3 style={{ ...typography.h4, color: theme.text, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: theme.textSecondary, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: spacing.xl, overflowY: 'auto', flex: 1 }}>{children}</div>
        <div style={{
          padding: `${spacing.md}px ${spacing.xl}px`,
          borderTop: `1px solid ${theme.border}`,
          display: 'flex', gap: spacing.sm, justifyContent: 'flex-end',
        }}>
          <ModernButton variant="ghost" onClick={onClose} disabled={saving}>Cancel</ModernButton>
          <ModernButton variant="primary" onClick={onSave} loading={saving}>
            {saving ? 'Saving…' : 'Save Event'}
          </ModernButton>
        </div>
      </div>
    </div>
  );
}

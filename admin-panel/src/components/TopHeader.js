import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTheme, typography, spacing, shadows } from '../constants/theme';

export default function TopHeader({ title, subtitle }) {
  const { isDarkMode, toggleDarkMode, admin } = useAuth();
  const theme = getTheme(isDarkMode);

  return (
    <header style={{
      background: theme.surface,
      borderBottom: `1px solid ${theme.border}`,
      padding: `${spacing.md}px ${spacing.xl}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: shadows.sm,
      position: 'sticky',
      top: 0,
      zIndex: 5,
    }}>
      <div>
        <h1 style={{ ...typography.h3, color: theme.text, margin: 0 }}>{title}</h1>
        {subtitle && (
          <p style={{ ...typography.small, color: theme.textSecondary, margin: 0 }}>{subtitle}</p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          style={{
            background: theme.backgroundSecondary,
            border: `1px solid ${theme.border}`,
            borderRadius: 9999,
            padding: '6px 14px',
            cursor: 'pointer',
            color: theme.textSecondary,
            fontSize: 16,
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'all 0.15s',
          }}
          title="Toggle dark mode"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        {/* Admin badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: spacing.sm,
          background: theme.backgroundSecondary,
          border: `1px solid ${theme.border}`,
          borderRadius: 9999,
          padding: '6px 14px 6px 8px',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, #1E3A8A, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: '700', fontSize: 12,
          }}>
            {(admin?.fullName || admin?.email || 'A')[0].toUpperCase()}
          </div>
          <span style={{ ...typography.smallMedium, color: theme.text }}>
            {admin?.fullName || 'Admin'}
          </span>
          <span style={{
            background: '#10B98120', color: '#10B981',
            borderRadius: 9999, padding: '2px 8px',
            ...typography.caption, fontWeight: '600',
          }}>
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}

import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTheme, typography, spacing, borderRadius, shadows } from '../constants/theme';

export default function Toast({ message, type = 'success', onClose }) {
  const { isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);

  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: { bg: '#10B98118', border: '#10B981', icon: '✅', text: '#10B981' },
    error:   { bg: '#EF444418', border: '#EF4444', icon: '❌', text: '#EF4444' },
    info:    { bg: '#3B82F618', border: '#3B82F6', icon: 'ℹ️',  text: '#3B82F6' },
    warning: { bg: '#F59E0B18', border: '#F59E0B', icon: '⚠️', text: '#F59E0B' },
  };
  const c = colors[type] || colors.info;

  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
      background: theme.surface,
      border: `1px solid ${c.border}`,
      borderLeft: `4px solid ${c.border}`,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.lg,
      padding: `${spacing.md}px ${spacing.lg}px`,
      display: 'flex', alignItems: 'center', gap: spacing.md,
      minWidth: 280, maxWidth: 400,
      animation: 'slideInRight 0.25s ease',
    }}>
      <span style={{ fontSize: 20 }}>{c.icon}</span>
      <span style={{ ...typography.bodyMedium, color: theme.text, flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: theme.textTertiary, fontSize: 18, lineHeight: 1,
          padding: 2,
        }}
      >×</button>
    </div>
  );
}

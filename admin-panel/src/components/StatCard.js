import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTheme, typography, spacing, borderRadius, shadows } from '../constants/theme';

export default function StatCard({ label, value, icon, color = '#3B82F6', trend }) {
  const { isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);

  return (
    <div style={{
      background: theme.surface,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      boxShadow: shadows.md,
      border: `1px solid ${theme.border}`,
      display: 'flex',
      alignItems: 'center',
      gap: spacing.lg,
      transition: 'transform 0.15s, box-shadow 0.15s',
      cursor: 'default',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = shadows.lg;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = shadows.md;
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: borderRadius.lg,
        background: `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ ...typography.caption, color: theme.textSecondary, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </div>
        <div style={{ ...typography.h2, color: theme.text, lineHeight: 1 }}>
          {value ?? <span style={{ ...typography.body, color: theme.textTertiary }}>—</span>}
        </div>
        {trend && (
          <div style={{ ...typography.caption, color: theme.success, marginTop: 4 }}>
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}

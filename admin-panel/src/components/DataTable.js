import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTheme, typography, spacing, borderRadius, shadows } from '../constants/theme';

export default function DataTable({ columns, data, loading, emptyMessage = 'No data found.' }) {
  const { isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    ...typography.small,
    color: theme.text,
  };

  const thStyle = {
    padding: `${spacing.sm}px ${spacing.md}px`,
    textAlign: 'left',
    ...typography.captionMedium,
    color: theme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: `2px solid ${theme.border}`,
    background: theme.backgroundSecondary,
    fontWeight: '600',
  };

  const tdStyle = {
    padding: `${spacing.sm + 2}px ${spacing.md}px`,
    borderBottom: `1px solid ${theme.border}`,
    verticalAlign: 'middle',
  };

  if (loading) {
    return (
      <div style={{ padding: spacing.xl, textAlign: 'center' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            height: 44, background: theme.border,
            borderRadius: borderRadius.md, marginBottom: spacing.sm,
            animation: 'pulse 1.4s ease-in-out infinite',
            opacity: 1 - i * 0.15,
          }} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={{
        padding: spacing.xxl, textAlign: 'center',
        color: theme.textTertiary, ...typography.body,
      }}>
        <div style={{ fontSize: 40, marginBottom: spacing.md }}>📭</div>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ ...thStyle, width: col.width }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id || i}
              style={{ transition: 'background 0.12s' }}
              onMouseEnter={e => e.currentTarget.style.background = theme.hoverBackground}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {columns.map(col => (
                <td key={col.key} style={tdStyle}>
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

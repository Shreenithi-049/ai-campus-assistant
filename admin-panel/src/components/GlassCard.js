import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTheme, shadows, borderRadius } from '../constants/theme';

export default function GlassCard({ children, style = {}, padding = 24 }) {
  const { isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);

  return (
    <div
      style={{
        background: theme.glassBackground,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${theme.glassBorder}`,
        borderRadius: borderRadius.xl,
        boxShadow: shadows.md,
        padding,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

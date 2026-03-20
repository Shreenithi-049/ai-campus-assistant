import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTheme, shadows, borderRadius } from '../constants/theme';

export default function ModernButton({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  type = 'button',
  style = {},
  icon = null,
}) {
  const { isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const sizeStyles = {
    small: { padding: '6px 14px', fontSize: 13 },
    medium: { padding: '10px 20px', fontSize: 15 },
    large: { padding: '14px 28px', fontSize: 16 },
  };

  const variantStyles = {
    primary: {
      background: hovered
        ? theme.primaryLight
        : `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
      color: '#fff',
      border: 'none',
      boxShadow: hovered ? shadows.md : shadows.sm,
    },
    secondary: {
      background: hovered
        ? theme.accent
        : `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`,
      color: '#fff',
      border: 'none',
      boxShadow: hovered ? shadows.md : shadows.sm,
    },
    outline: {
      background: hovered ? theme.hoverBackground : 'transparent',
      color: theme.primary,
      border: `2px solid ${theme.primary}`,
      boxShadow: 'none',
    },
    danger: {
      background: hovered ? '#DC2626' : theme.error,
      color: '#fff',
      border: 'none',
      boxShadow: hovered ? shadows.md : shadows.sm,
    },
    ghost: {
      background: hovered ? theme.hoverBackground : 'transparent',
      color: theme.textSecondary,
      border: 'none',
      boxShadow: 'none',
    },
    success: {
      background: hovered ? '#059669' : theme.success,
      color: '#fff',
      border: 'none',
      boxShadow: hovered ? shadows.md : shadows.sm,
    },
  };

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: borderRadius.lg,
    fontWeight: '600',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.55 : 1,
    transition: 'all 0.18s ease',
    transform: pressed && !disabled ? 'scale(0.97)' : 'scale(1)',
    outline: 'none',
    whiteSpace: 'nowrap',
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style,
  };

  return (
    <button
      type={type}
      style={base}
      onClick={!disabled && !loading ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <span style={spinnerStyle} />
          Loading…
        </>
      ) : (
        <>
          {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}

const spinnerStyle = {
  width: 14,
  height: 14,
  border: '2px solid rgba(255,255,255,0.4)',
  borderTopColor: '#fff',
  borderRadius: '50%',
  animation: 'spin 0.7s linear infinite',
  display: 'inline-block',
};

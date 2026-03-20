import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTheme, spacing, borderRadius, typography } from '../constants/theme';

export default function ModernInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  icon,
  required = false,
  disabled = false,
  rows,
  options,
  style = {},
  inputStyle = {},
}) {
  const { isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);
  const [focused, setFocused] = useState(false);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    marginBottom: spacing.md,
    ...style,
  };

  const labelStyle = {
    ...typography.smallMedium,
    color: theme.text,
    fontWeight: '500',
  };

  const wrapperStyle = {
    display: 'flex',
    alignItems: type === 'textarea' ? 'flex-start' : 'center',
    gap: spacing.sm,
    background: theme.surface,
    border: `${focused ? 2 : 1}px solid ${error ? theme.error : focused ? theme.primary : theme.border}`,
    borderRadius: borderRadius.lg,
    padding: `0 ${spacing.md}px`,
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxShadow: focused ? `0 0 0 3px ${theme.primary}22` : 'none',
    opacity: disabled ? 0.6 : 1,
  };

  const inputBaseStyle = {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: theme.text,
    ...typography.body,
    padding: `${spacing.sm + 2}px 0`,
    resize: type === 'textarea' ? 'vertical' : 'none',
    ...inputStyle,
  };

  const iconStyle = {
    color: focused ? theme.primary : theme.textTertiary,
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    paddingTop: type === 'textarea' ? spacing.sm + 2 : 0,
    transition: 'color 0.15s',
  };

  const errorStyle = {
    ...typography.caption,
    color: theme.error,
  };

  const sharedProps = {
    value,
    onChange,
    placeholder,
    disabled,
    required,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: inputBaseStyle,
  };

  return (
    <div style={containerStyle}>
      {label && (
        <label style={labelStyle}>
          {label} {required && <span style={{ color: theme.error }}>*</span>}
        </label>
      )}
      <div style={wrapperStyle}>
        {icon && <span style={iconStyle}>{icon}</span>}
        {type === 'textarea' ? (
          <textarea rows={rows || 3} {...sharedProps} />
        ) : type === 'select' ? (
          <select {...sharedProps} style={{ ...inputBaseStyle, cursor: 'pointer' }}>
            {options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : (
          <input type={type} {...sharedProps} />
        )}
      </div>
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
}

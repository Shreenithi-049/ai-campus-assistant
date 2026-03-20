import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTheme, shadows, borderRadius, typography, spacing } from '../constants/theme';
import ModernButton from './ModernButton';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Delete', confirmVariant = 'danger' }) {
  const { isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div style={overlayStyle}>
      <div
        style={{
          background: theme.surface,
          borderRadius: borderRadius.xl,
          boxShadow: shadows.lg,
          padding: spacing.xl,
          width: '100%',
          maxWidth: 420,
          border: `1px solid ${theme.border}`,
          animation: 'slideUp 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
          <div style={{
            width: 44, height: 44, borderRadius: borderRadius.lg,
            background: `${theme.error}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>
            🗑️
          </div>
          <h3 style={{ ...typography.h4, color: theme.text, margin: 0 }}>{title}</h3>
        </div>
        <p style={{ ...typography.body, color: theme.textSecondary, marginBottom: spacing.xl }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: spacing.sm, justifyContent: 'flex-end' }}>
          <ModernButton variant="ghost" onClick={onCancel} disabled={loading}>Cancel</ModernButton>
          <ModernButton variant={confirmVariant} onClick={handleConfirm} loading={loading}>
            {confirmLabel}
          </ModernButton>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed', inset: 0,
  background: 'rgba(0,0,0,0.45)',
  backdropFilter: 'blur(4px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000, padding: 16,
};

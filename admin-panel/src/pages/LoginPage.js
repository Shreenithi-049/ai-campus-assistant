import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getTheme, spacing, typography, borderRadius, shadows } from '../constants/theme';
import ModernButton from '../components/ModernButton';
import ModernInput from '../components/ModernInput';

export default function LoginPage() {
  const { login, isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: isDarkMode
        ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)'
        : 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 50%, #E0E7FF 100%)',
      display: 'flex',
    }}>
      {/* Left hero panel */}
      <div style={{
        flex: 1, display: 'none',
        background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 50%, #7C3AED 100%)',
        alignItems: 'center', justifyContent: 'center', padding: spacing.xxl,
        '@media (min-width: 768px)': { display: 'flex' },
      }}
        className="hero-panel"
      >
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ fontSize: 72, marginBottom: spacing.xl }}>🎓</div>
          <h1 style={{ ...typography.h1, color: '#FFFFFF', marginBottom: spacing.md }}>
            IntelliCamp
          </h1>
          <p style={{ ...typography.h4, color: '#C7D2FE', marginBottom: spacing.xxl, fontWeight: '400' }}>
            Admin Control Panel
          </p>
          {['Manage Events & Registrations', 'Update Timetables & Faculty', 'Post Announcements', 'Monitor Student Activity'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <span style={{ ...typography.bodyMedium, color: '#E0E7FF' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: spacing.xl,
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Logo for mobile */}
          <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
            <div style={{
              width: 64, height: 64, borderRadius: borderRadius.xl,
              background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, marginBottom: spacing.md,
            }}>
              🎓
            </div>
            <h2 style={{ ...typography.h2, color: theme.text, margin: 0 }}>Admin Login</h2>
            <p style={{ ...typography.body, color: theme.textSecondary, marginTop: spacing.xs }}>
              Sign in to manage IntelliCamp
            </p>
          </div>

          <div style={{
            background: theme.surface,
            borderRadius: borderRadius.xl,
            padding: spacing.xl,
            boxShadow: shadows.lg,
            border: `1px solid ${theme.border}`,
          }}>
            {error && (
              <div style={{
                background: `${theme.error}15`,
                border: `1px solid ${theme.error}40`,
                borderRadius: borderRadius.lg,
                padding: spacing.md,
                marginBottom: spacing.lg,
                display: 'flex', alignItems: 'center', gap: spacing.sm,
              }}>
                <span>⚠️</span>
                <span style={{ ...typography.small, color: theme.error }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <ModernInput
                label="Email Address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@skcet.ac.in"
                icon={<span>📧</span>}
                required
              />
              <ModernInput
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                icon={<span>🔒</span>}
                required
              />
              <ModernButton
                type="submit"
                variant="primary"
                size="large"
                loading={loading}
                style={{ width: '100%', marginTop: spacing.sm }}
              >
                Sign In to Admin Panel
              </ModernButton>
            </form>
          </div>

          <p style={{ ...typography.caption, color: theme.textTertiary, textAlign: 'center', marginTop: spacing.lg }}>
            Only accounts with <strong>role: "admin"</strong> can access this panel.
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) { .hero-panel { display: flex !important; } }
      `}</style>
    </div>
  );
}

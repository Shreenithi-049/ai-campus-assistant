// Exact mirror of the student app's modernTheme.js — adapted for web CSS

export const lightTheme = {
  primary: '#1E3A8A',
  primaryLight: '#3B82F6',
  accent: '#8B5CF6',
  accentLight: '#C4B5FD',
  background: '#F8FAFC',
  backgroundSecondary: '#F1F5F9',
  surface: '#FFFFFF',
  cardBackground: '#F8FAFC',
  text: '#1E293B',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  border: '#E2E8F0',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  glassBackground: 'rgba(255, 255, 255, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 0.4)',
  hoverBackground: 'rgba(30, 58, 138, 0.06)',
  activeBackground: 'rgba(30, 58, 138, 0.12)',
  sidebarBg: '#0F172A',
  sidebarText: '#CBD5E1',
  sidebarActive: '#3B82F6',
  sidebarHover: 'rgba(59, 130, 246, 0.1)',
};

export const darkTheme = {
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  accent: '#A78BFA',
  accentLight: '#C4B5FD',
  background: '#0F172A',
  backgroundSecondary: '#1E293B',
  surface: '#1E293B',
  cardBackground: '#1E293B',
  text: '#F1F5F9',
  textPrimary: '#FFFFFF',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  border: '#334155',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  glassBackground: 'rgba(30, 41, 59, 0.85)',
  glassBorder: 'rgba(59, 130, 246, 0.2)',
  hoverBackground: 'rgba(59, 130, 246, 0.08)',
  activeBackground: 'rgba(59, 130, 246, 0.16)',
  sidebarBg: '#020617',
  sidebarText: '#94A3B8',
  sidebarActive: '#60A5FA',
  sidebarHover: 'rgba(96, 165, 250, 0.1)',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };

export const borderRadius = { sm: 8, md: 12, lg: 16, xl: 20, full: 9999 };

export const typography = {
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 1.25 },
  h2: { fontSize: 28, fontWeight: '700', lineHeight: 1.29 },
  h3: { fontSize: 24, fontWeight: '600', lineHeight: 1.33 },
  h4: { fontSize: 20, fontWeight: '600', lineHeight: 1.4 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 1.5 },
  bodyMedium: { fontSize: 16, fontWeight: '500', lineHeight: 1.5 },
  bodySemibold: { fontSize: 16, fontWeight: '600', lineHeight: 1.5 },
  small: { fontSize: 14, fontWeight: '400', lineHeight: 1.43 },
  smallMedium: { fontSize: 14, fontWeight: '500', lineHeight: 1.43 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 1.33 },
  captionMedium: { fontSize: 12, fontWeight: '500', lineHeight: 1.33 },
};

export const shadows = {
  sm: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  md: '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
  lg: '0 8px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06)',
  glow: '0 0 20px rgba(59, 130, 246, 0.25)',
};

export const getTheme = (isDark) => (isDark ? darkTheme : lightTheme);

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const lightTheme = {
  primary: '#1E3A8A',
  primaryLight: '#3B82F6',
  accent: '#8B5CF6',
  accentLight: '#C4B5FD',
  background: '#FFFFFF',
  backgroundSecondary: '#F8FAFC',
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
  gradient: ['#E0E7FF', '#DDD6FE'],
  cardGradient: ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)'],
  glassBackground: 'rgba(255, 255, 255, 0.7)',
  glassBorder: 'rgba(255, 255, 255, 0.3)',
  primaryGradient: ['#1E3A8A', '#3B82F6'],
  accentGradient: ['#C4B5FD', '#8B5CF6'],
  heroGradient: ['#1E3A8A', '#7C3AED', '#EC4899'],
  suggestionGradient: ['#EEF2FF', '#F5F3FF'],
  chatBubbleUser: '#3B82F6',
  chatBubbleAI: '#F1F5F9',
  hoverBackground: 'rgba(30, 58, 138, 0.1)',
  activeBackground: 'rgba(30, 58, 138, 0.15)',
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
  gradient: ['#1E3A8A', '#312E81'],
  cardGradient: ['rgba(30, 41, 59, 0.9)', 'rgba(30, 41, 59, 0.7)'],
  glassBackground: 'rgba(30, 41, 59, 0.7)',
  glassBorder: 'rgba(59, 130, 246, 0.3)',
  primaryGradient: ['#1E3A8A', '#3B82F6'],
  accentGradient: ['#A78BFA', '#8B5CF6'],
  heroGradient: ['#0F172A', '#1E3A8A', '#7C3AED'],
  suggestionGradient: ['#1E3A8A', '#7C3AED'],
  chatBubbleUser: '#3B82F6',
  chatBubbleAI: '#334155',
  hoverBackground: 'rgba(59, 130, 246, 0.1)',
  activeBackground: 'rgba(59, 130, 246, 0.2)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  h2: { fontSize: 28, fontWeight: '700', lineHeight: 36 },
  h3: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
  h4: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodyMedium: { fontSize: 16, fontWeight: '500', lineHeight: 24 },
  bodySemibold: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
  small: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  smallMedium: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  captionMedium: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const animations = {
  fast: 200,
  normal: 300,
  slow: 500,
  spring: {
    damping: 15,
    stiffness: 150,
  },
};

export const dimensions = {
  width,
  height,
  isSmallDevice: width < 375,
};

// Theme context helper
export const getTheme = (isDark) => isDark ? darkTheme : lightTheme;

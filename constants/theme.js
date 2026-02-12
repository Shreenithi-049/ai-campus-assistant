// Design System - Theme Colors and Typography
export const Colors = {
  primary: '#0A2540',
  accent: '#3B82F6',
  background: '#FFFFFF',
  lightGrey: '#F1F5F9',
  success: '#22C55E',
  alert: '#F97316',
  text: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  error: '#EF4444',
  white: '#FFFFFF',
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Inter',
    color: Colors.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: Colors.text,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: Colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Inter',
    color: Colors.text,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Inter',
    color: Colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Inter',
    color: Colors.textSecondary,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
};


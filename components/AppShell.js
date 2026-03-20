import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform,
  Dimensions, ScrollView, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { getTheme, spacing, typography, borderRadius, shadows } from '../constants/modernTheme';
import { sidebarState } from '../utils/layoutState';

const { width: SW } = Dimensions.get('window');
const IS_WEB = Platform.OS === 'web';
const IS_WIDE = IS_WEB && SW >= 768;

const NAV_ITEMS = [
  { name: 'Home',     label: 'Dashboard',    icon: 'home-outline',                activeIcon: 'home',                emoji: '🏠' },
  { name: 'Chat',     label: 'AI Assistant', icon: 'chatbubble-ellipses-outline', activeIcon: 'chatbubble-ellipses', emoji: '🤖' },
  { name: 'Map',      label: 'Campus Map',   icon: 'map-outline',                 activeIcon: 'map',                 emoji: '🗺️' },
  { name: 'Academic', label: 'Academic',     icon: 'book-outline',                activeIcon: 'book',                emoji: '📚' },
  { name: 'Events',   label: 'Events',       icon: 'calendar-outline',            activeIcon: 'calendar',            emoji: '📅' },
  { name: 'Profile',  label: 'Profile',      icon: 'person-outline',              activeIcon: 'person',              emoji: '👤' },
];

// ─── Web Sidebar ──────────────────────────────────────────────────────────────
export function WebSidebar({ state, navigation }) {
  const { isDarkMode, toggleDarkMode, userProfile, logout } = useAuth();
  const theme = getTheme(isDarkMode);
  const [collapsed, setCollapsedState] = useState(sidebarState.collapsed);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  React.useEffect(() => {
    return sidebarState.subscribe(setCollapsedState);
  }, []);

  const setCollapsed = (newVal) => {
    const val = typeof newVal === 'function' ? newVal(collapsed) : newVal;
    sidebarState.setCollapsed(val);
  };

  const sidebarW = collapsed ? 68 : 240;
  const activeIndex = state?.index ?? 0;

  const sidebarStyle = {
    width: sidebarW,
    minHeight: '100vh',
    backgroundColor: isDarkMode ? '#020617' : '#0F172A',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.22s ease',
    flexShrink: 0,
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'auto',
    zIndex: 100,
  };

  return (
    <div style={sidebarStyle}>
      {/* Logo */}
      <div style={{
        padding: `${spacing.lg}px ${collapsed ? spacing.sm : spacing.lg}px`,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        minHeight: 72, gap: spacing.sm,
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12,
              background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, flexShrink: 0,
            }}>🎓</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF', lineHeight: 1.2 }}>IntelliCamp</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>Student Portal</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div style={{
            width: 36, height: 36, borderRadius: 12,
            background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>🎓</div>
        )}
        <button onClick={() => setCollapsed(c => !c)} style={{
          background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8,
          color: '#94A3B8', cursor: 'pointer', width: 28, height: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, flexShrink: 0, transition: 'background 0.15s',
        }}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: `${spacing.md}px ${spacing.sm}px`, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map((item, index) => {
          const isActive = activeIndex === index;
          const isHovered = hoveredIndex === index;
          return (
            <div
              key={item.name}
              onClick={() => navigation.navigate(item.name)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              title={collapsed ? item.label : ''}
              style={{
                display: 'flex', alignItems: 'center',
                gap: spacing.sm,
                padding: `${spacing.sm + 2}px ${collapsed ? spacing.sm : spacing.md}px`,
                borderRadius: 12, cursor: 'pointer',
                transition: 'all 0.15s',
                background: isActive ? 'rgba(59,130,246,0.18)' : isHovered ? 'rgba(255,255,255,0.05)' : 'transparent',
                border: isActive ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1 }}>{item.emoji}</span>
              {!collapsed && (
                <span style={{
                  fontSize: 13, fontWeight: '500',
                  color: isActive ? '#60A5FA' : isHovered ? '#CBD5E1' : '#94A3B8',
                  whiteSpace: 'nowrap', transition: 'color 0.15s',
                }}>{item.label}</span>
              )}
              {isActive && !collapsed && (
                <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#3B82F6', flexShrink: 0 }} />
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom: dark mode + user + logout */}
      <div style={{ padding: spacing.md, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          style={{
            width: '100%', padding: `${spacing.sm}px`,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, color: '#94A3B8', cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: spacing.sm, fontSize: 13, fontWeight: '500',
            marginBottom: spacing.sm, transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          <span style={{ fontSize: 16 }}>{isDarkMode ? '☀️' : '🌙'}</span>
          {!collapsed && (isDarkMode ? 'Light Mode' : 'Dark Mode')}
        </button>

        {/* User info */}
        {!collapsed && userProfile && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: spacing.sm,
            padding: `${spacing.sm}px`, marginBottom: spacing.sm,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1E3A8A, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: '700', fontSize: 13, flexShrink: 0,
            }}>
              {(userProfile.fullName || 'S')[0].toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: '500', color: '#E2E8F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userProfile.fullName || 'Student'}
              </div>
              <div style={{ fontSize: 11, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userProfile.email}
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          style={{
            width: '100%', padding: `${spacing.sm}px`,
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 12, color: '#F87171', cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: spacing.sm, fontSize: 13, fontWeight: '500',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
        >
          <span>🚪</span>
          {!collapsed && 'Logout'}
        </button>
      </div>
    </div>
  );
}

// ─── Web Top Header ───────────────────────────────────────────────────────────
export function WebTopHeader({ title, subtitle }) {
  const { isDarkMode, toggleDarkMode, userProfile } = useAuth();
  const theme = getTheme(isDarkMode);

  return (
    <div style={{
      backgroundColor: theme.surface,
      borderBottom: `1px solid ${theme.border}`,
      padding: `${spacing.md}px ${spacing.xl}px`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: '700', color: theme.text, margin: 0, lineHeight: 1.3 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: theme.textSecondary, margin: 0 }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
        <button
          onClick={toggleDarkMode}
          style={{
            background: theme.backgroundSecondary,
            border: `1px solid ${theme.border}`,
            borderRadius: 9999, padding: '6px 14px',
            cursor: 'pointer', color: theme.textSecondary,
            fontSize: 16, display: 'flex', alignItems: 'center', gap: 6,
            transition: 'all 0.15s',
          }}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        <div style={{
          display: 'flex', alignItems: 'center', gap: spacing.sm,
          background: theme.backgroundSecondary,
          border: `1px solid ${theme.border}`,
          borderRadius: 9999, padding: '6px 14px 6px 8px',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, #1E3A8A, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: '700', fontSize: 12,
          }}>
            {(userProfile?.fullName || 'S')[0].toUpperCase()}
          </div>
          <span style={{ fontSize: 13, fontWeight: '500', color: theme.text }}>
            {userProfile?.fullName?.split(' ')[0] || 'Student'}
          </span>
          <span style={{
            background: '#3B82F620', color: '#3B82F6',
            borderRadius: 9999, padding: '2px 8px',
            fontSize: 11, fontWeight: '600',
          }}>Student</span>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Bottom Navigation ─────────────────────────────────────────────────
export function MobileBottomNav({ state, navigation }) {
  const { isDarkMode, toggleDarkMode, isEmailVerified } = useAuth();
  const theme = getTheme(isDarkMode);
  const RESTRICTED = ['Chat', 'Academic', 'Events'];

  return (
    <View style={[
      mobileStyles.container,
      {
        backgroundColor: theme.surface,
        borderTopColor: theme.border,
        ...(Platform.OS !== 'web' ? shadows.lg : {}),
      },
    ]}>
      {NAV_ITEMS.map((item, index) => {
        const isFocused = state?.index === index;
        const isRestricted = !isEmailVerified && RESTRICTED.includes(item.name);

        return (
          <TouchableOpacity
            key={item.name}
            style={mobileStyles.tab}
            onPress={() => {
              if (isRestricted) return;
              navigation.navigate(item.name);
            }}
            activeOpacity={0.7}
          >
            <View style={[
              mobileStyles.tabInner,
              isFocused && { backgroundColor: theme.activeBackground },
            ]}>
              <Ionicons
                name={isFocused ? item.activeIcon : item.icon}
                size={22}
                color={isFocused ? theme.primary : isRestricted ? theme.textTertiary : theme.textSecondary}
              />
              {isFocused && (
                <Text style={[mobileStyles.tabLabel, { color: theme.primary }]} numberOfLines={1}>
                  {item.label}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── AppShell — wraps the tab navigator content on web ───────────────────────
export function AppShell({ children, state, navigation, title, subtitle }) {
  const { isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);

  if (!IS_WEB) return children;

  // Wide web layout: sidebar + content
  if (IS_WIDE) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.background }}>
        <WebSidebar state={state} navigation={navigation} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          <WebTopHeader title={title} subtitle={subtitle} />
          <main style={{ flex: 1, overflowY: 'auto', backgroundColor: theme.background }}>
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Narrow web (mobile-width browser): just render children, bottom nav handled by navigator
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: theme.background }}>
      <main style={{ flex: 1, overflowY: 'auto' }}>{children}</main>
    </div>
  );
}

const mobileStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    gap: 4,
    maxWidth: 120,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});

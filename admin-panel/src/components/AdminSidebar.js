import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getTheme, typography, spacing, borderRadius } from '../constants/theme';

const NAV_ITEMS = [
  { path: '/',                label: 'Dashboard',      icon: '📊' },
  { path: '/events',          label: 'Events',          icon: '📅' },
  { path: '/announcements',   label: 'Announcements',   icon: '📢' },
  { path: '/faculty',         label: 'Faculty',         icon: '👨‍🏫' },
  { path: '/timetable',       label: 'Timetable',       icon: '📘' },
  { path: '/syllabus',        label: 'Syllabus',        icon: '📖' },
  { path: '/students',        label: 'Students',        icon: '👨‍🎓' },
  { path: '/registrations',   label: 'Registrations',   icon: '🧾' },
];

export default function AdminSidebar() {
  const { isDarkMode, admin, logout } = useAuth();
  const theme = getTheme(isDarkMode);
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? 68 : 240;

  const sidebarStyle = {
    width: sidebarWidth,
    minHeight: '100vh',
    background: theme.sidebarBg,
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.22s ease',
    flexShrink: 0,
    position: 'relative',
    zIndex: 10,
  };

  const logoAreaStyle = {
    padding: `${spacing.lg}px ${collapsed ? spacing.sm : spacing.lg}px`,
    borderBottom: `1px solid rgba(255,255,255,0.07)`,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: collapsed ? 'center' : 'space-between',
    minHeight: 72,
  };

  const navStyle = {
    flex: 1,
    padding: `${spacing.md}px ${spacing.sm}px`,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    overflowY: 'auto',
  };

  const bottomStyle = {
    padding: spacing.md,
    borderTop: `1px solid rgba(255,255,255,0.07)`,
  };

  return (
    <aside style={sidebarStyle}>
      {/* Logo + Collapse */}
      <div style={logoAreaStyle}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <div style={{
              width: 36, height: 36, borderRadius: borderRadius.lg,
              background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, flexShrink: 0,
            }}>
              🎓
            </div>
            <div>
              <div style={{ ...typography.bodySemibold, color: '#FFFFFF', lineHeight: 1.2 }}>
                IntelliCamp
              </div>
              <div style={{ ...typography.caption, color: '#64748B' }}>Admin Panel</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div style={{
            width: 36, height: 36, borderRadius: borderRadius.lg,
            background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>
            🎓
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: 'none', borderRadius: borderRadius.sm,
            color: '#94A3B8', cursor: 'pointer',
            width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, flexShrink: 0,
            transition: 'background 0.15s',
          }}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav style={navStyle}>
        {NAV_ITEMS.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <NavItem
              key={item.path}
              item={item}
              isActive={isActive}
              collapsed={collapsed}
              theme={theme}
              onClick={() => navigate(item.path)}
            />
          );
        })}
      </nav>

      {/* Admin info + logout */}
      <div style={bottomStyle}>
        {!collapsed && admin && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: spacing.sm,
            padding: `${spacing.sm}px ${spacing.sm}px`,
            marginBottom: spacing.sm,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1E3A8A, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: '700', fontSize: 14, flexShrink: 0,
            }}>
              {(admin.fullName || admin.email || 'A')[0].toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ ...typography.smallMedium, color: '#E2E8F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {admin.fullName || 'Admin'}
              </div>
              <div style={{ ...typography.caption, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {admin.email}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          style={{
            width: '100%', padding: `${spacing.sm}px`,
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: borderRadius.lg,
            color: '#F87171', cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: spacing.sm,
            ...typography.smallMedium,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
        >
          <span>🚪</span>
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
}

function NavItem({ item, isActive, collapsed, theme, onClick }) {
  const [hovered, setHovered] = useState(false);

  const style = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: `${spacing.sm + 2}px ${collapsed ? spacing.sm : spacing.md}px`,
    borderRadius: borderRadius.lg,
    cursor: 'pointer',
    transition: 'all 0.15s',
    background: isActive
      ? 'rgba(59, 130, 246, 0.18)'
      : hovered ? 'rgba(255,255,255,0.05)' : 'transparent',
    border: isActive ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
    justifyContent: collapsed ? 'center' : 'flex-start',
    position: 'relative',
  };

  const labelStyle = {
    ...typography.smallMedium,
    color: isActive ? '#60A5FA' : hovered ? '#CBD5E1' : '#94A3B8',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    transition: 'color 0.15s',
  };

  return (
    <div
      style={style}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={collapsed ? item.label : ''}
    >
      <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
      {!collapsed && <span style={labelStyle}>{item.label}</span>}
      {isActive && !collapsed && (
        <div style={{
          marginLeft: 'auto', width: 6, height: 6,
          borderRadius: '50%', background: '#3B82F6', flexShrink: 0,
        }} />
      )}
    </div>
  );
}

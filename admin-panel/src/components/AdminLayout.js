import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTheme } from '../constants/theme';
import AdminSidebar from './AdminSidebar';
import TopHeader from './TopHeader';

export default function AdminLayout({ children, title, subtitle }) {
  const { isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: theme.background }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopHeader title={title} subtitle={subtitle} />
        <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

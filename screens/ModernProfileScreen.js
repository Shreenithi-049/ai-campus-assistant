import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { lightTheme, darkTheme, spacing, typography, borderRadius, shadows } from '../constants/modernTheme';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

export default function ModernProfileScreen({ navigation }) {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
  });
  const { userProfile, logout, user, refreshUserProfile, isDarkMode, toggleDarkMode } = useAuth();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const handlePhotoUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const photoURL = event.target.result;
          try {
            await updateDoc(doc(db, 'students', user.uid), { photoURL });
            await refreshUserProfile();
          } catch (error) {
            console.error('Error uploading photo:', error);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const getUserInitials = () => {
    if (userProfile?.fullName) {
      return userProfile.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return 'ST';
  };

  const settingsOptions = [
    {
      id: 'notifications',
      title: 'Push Notifications',
      description: 'Receive notifications about events and updates',
      icon: 'notifications-outline',
    },
    {
      id: 'emailAlerts',
      title: 'Email Alerts',
      description: 'Get important updates via email',
      icon: 'mail-outline',
    },
  ];

  const menuItems = [
    { id: 1, title: 'Edit Profile', icon: 'person-outline', screen: 'EditProfile' },
    { id: 2, title: 'Security', icon: 'shield-checkmark-outline', screen: 'Security' },
    { id: 3, title: 'Help & Support', icon: 'help-circle-outline', screen: 'Help' },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={isDarkMode ? ['#0F172A', '#1E293B'] : ['#FFFFFF', '#F8FAFC']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.surface }, shadows.sm]}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
          <TouchableOpacity onPress={toggleDarkMode}>
            <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Card */}
          <Animated.View entering={FadeInDown.delay(100)}>
            <LinearGradient
              colors={isDarkMode ? ['#1E3A8A', '#7C3AED'] : ['#EEF2FF', '#F5F3FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.profileCard, shadows.lg]}
            >
              <View style={styles.avatarContainer}>
                {userProfile?.photoURL ? (
                  <Image source={{ uri: userProfile.photoURL }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                    <Text style={styles.avatarText}>{getUserInitials()}</Text>
                  </View>
                )}
                <TouchableOpacity style={styles.editAvatarButton} onPress={handlePhotoUpload}>
                  <Ionicons name="camera" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <Text style={[styles.profileName, { color: theme.textPrimary }]}>{userProfile?.fullName || 'Student'}</Text>
              <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>{userProfile?.email || 'student@university.edu'}</Text>
              <View style={styles.profileStats}>
                <View style={styles.statItem}>
                  <Text style={[styles.suggestionTitle, { color: theme.textPrimary }]}>{userProfile?.year || 'N/A'}</Text>
                  <Text style={[styles.suggestionTitle, { color: theme.textPrimary }]}>Year</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
                <View style={styles.statItem}>
                  <Text style={[styles.suggestionTitle, { color: theme.textPrimary }]}>{userProfile?.semester || 'N/A'}</Text>
                  <Text style={[styles.suggestionTitle, { color: theme.textPrimary }]}>Semester</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
                <View style={styles.statItem}>
                  <Text style={[styles.suggestionTitle, { color: theme.textPrimary }]}>{userProfile?.studentId || 'N/A'}</Text>
                  <Text style={[styles.suggestionTitle, { color: theme.textPrimary }]}>Student ID</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Settings Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Preferences</Text>
            {settingsOptions.map((option, index) => (
              <Animated.View
                key={option.id}
                entering={FadeInDown.delay(200 + index * 100)}
              >
                <View style={[styles.settingCard, { backgroundColor: theme.surface }, shadows.sm]}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: theme.primary + '20' }]}>
                      <Ionicons name={option.icon} size={24} color={theme.primary} />
                    </View>
                    <View style={styles.settingInfo}>
                      <Text style={[styles.settingTitle, { color: theme.text }]}>
                        {option.title}
                      </Text>
                      <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                        {option.description}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={settings[option.id]}
                    onValueChange={() => toggleSetting(option.id)}
                    trackColor={{ false: '#CBD5E1', true: theme.primary }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </Animated.View>
            ))}
          </View>

          {/* Menu Items */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>More Options</Text>
            {menuItems.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInDown.delay(600 + index * 100)}
              >
                <TouchableOpacity
                  style={[styles.menuCard, { backgroundColor: theme.surface }, shadows.sm]}
                  onPress={() => navigation.navigate(item.screen)}
                >
                  <View style={[styles.menuIcon, { backgroundColor: theme.primary + '20' }]}>
                    <Ionicons name={item.icon} size={24} color={theme.primary} />
                  </View>
                  <Text style={[styles.menuTitle, { color: theme.text }]}>
                    {item.title}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Logout Button */}
          <View style={{ marginVertical: spacing.md }}>
            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: '#EF4444' }]}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* App Version */}
          <Text style={[styles.versionText, { color: theme.textTertiary }]}>
            IntelliCamp v1.0.0
          </Text>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xxl + 20,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    ...typography.h3,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  profileCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    ...typography.h1,
    color: '#FFFFFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileName: {
    ...typography.h2,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  profileEmail: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.lg,
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.h4,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statDivider: {
    width: 1,
    height: 32,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    ...typography.bodyMedium,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  settingDesc: {
    ...typography.small,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuTitle: {
    ...typography.bodyMedium,
    fontWeight: '600',
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  logoutText: {
    ...typography.h4,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  versionText: {
    ...typography.caption,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});

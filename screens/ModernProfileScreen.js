import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image, TextInput, ActivityIndicator, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { lightTheme, darkTheme, spacing, typography, borderRadius, shadows } from '../constants/modernTheme';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { DEPARTMENT_MAP, YEARS } from '../constants/departments';

export default function ModernProfileScreen({ navigation }) {
  const [settings, setSettings] = useState({ notifications: true, emailAlerts: true });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const { userProfile, logout, user, refreshUserProfile, isDarkMode, toggleDarkMode } = useAuth();
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    if (userProfile && editMode) {
      setFormData({
        fullName: userProfile.fullName || '',
        year: userProfile.year || '',
        semester: userProfile.semester || '',
        dateOfBirth: userProfile.dateOfBirth || '',
        department: userProfile.department || '',
        phoneNumber: userProfile.phoneNumber || '',
        gender: userProfile.gender || '',
        bloodGroup: userProfile.bloodGroup || '',
        emergencyContact: userProfile.emergencyContact || '',
      });
    }
  }, [editMode]);

  const handleSave = async () => {
    if (!userProfile?._docId) return;
    if (!formData.fullName?.trim()) { Alert.alert('Error', 'Full name is required'); return; }
    setLoading(true);
    try {
      await updateDoc(doc(db, 'students', userProfile._docId), { ...formData, updatedAt: serverTimestamp() });
      await refreshUserProfile();
      setEditMode(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async () => {
    if (Platform.OS !== 'web') return;
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          await updateDoc(doc(db, 'students', userProfile._docId), { photoURL: ev.target.result });
          await refreshUserProfile();
        } catch (err) { console.error(err); }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const getUserInitials = () =>
    userProfile?.fullName ? userProfile.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'ST';

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to logout?')) logout();
    } else {
      Alert.alert('Logout', 'Are you sure?', [{ text: 'Cancel' }, { text: 'Logout', onPress: logout }]);
    }
  };

  const renderInput = (label, field, placeholder, keyboardType = 'default') => (
    <View style={styles.inputContainer} key={field}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <View style={[styles.inputBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <TextInput
          style={[styles.textInput, { color: theme.text }]}
          value={formData[field] || ''}
          onChangeText={(t) => setFormData(p => ({ ...p, [field]: t }))}
          placeholder={placeholder}
          placeholderTextColor={theme.textTertiary}
          keyboardType={keyboardType}
          editable={!loading}
        />
      </View>
    </View>
  );

  const renderSelect = (label, field, options) => (
    <View style={styles.inputContainer} key={field}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <View style={[styles.inputBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <select
          value={formData[field] || ''}
          onChange={(e) => setFormData(p => ({ ...p, [field]: e.target.value }))}
          disabled={loading}
          style={{ width: '100%', border: 'none', outline: 'none', backgroundColor: 'transparent', color: theme.text, fontSize: 16, padding: 4, cursor: 'pointer' }}
        >
          <option value="">Select {label}</option>
          {options.map(({ value, label: l }) => <option key={value} value={value}>{l}</option>)}
        </select>
      </View>
    </View>
  );

  const settingsOptions = [
    { id: 'notifications', title: 'Push Notifications', description: 'Receive notifications about events and updates', icon: 'notifications-outline' },
    { id: 'emailAlerts', title: 'Email Alerts', description: 'Get important updates via email', icon: 'mail-outline' },
  ];

  const menuItems = [
    { id: 1, title: 'Edit Profile', icon: 'person-outline', onPress: () => setEditMode(true) },
    { id: 2, title: 'Security', icon: 'shield-checkmark-outline', onPress: () => navigation.navigate('Security') },
    { id: 3, title: 'Help & Support', icon: 'help-circle-outline', onPress: () => navigation.navigate('Help') },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={isDarkMode ? ['#0F172A', '#1E293B'] : ['#FFFFFF', '#F8FAFC']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.surface }, shadows.sm]}>
          {editMode ? (
            <TouchableOpacity onPress={() => setEditMode(false)}>
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 24 }} />
          )}
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {editMode ? 'Edit Profile' : 'Profile'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={{ maxWidth: 800, width: '100%', alignSelf: 'center', paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {editMode ? (
            <>
              {renderInput('Full Name', 'fullName', 'Enter your full name')}
              {renderSelect('Department', 'department', Object.entries(DEPARTMENT_MAP).map(([v, l]) => ({ value: v, label: `${v} — ${l}` })))}
              {renderSelect('Year', 'year', YEARS.map(y => ({ value: y, label: y })))}
              {renderInput('Semester', 'semester', 'e.g., 6th Semester')}
              {renderInput('Date of Birth', 'dateOfBirth', 'DD/MM/YYYY')}
              {renderInput('Phone Number', 'phoneNumber', 'Enter your phone number', 'phone-pad')}
              {renderInput('Gender', 'gender', 'Male/Female/Other')}
              {renderInput('Blood Group', 'bloodGroup', 'e.g., O+')}
              {renderInput('Emergency Contact', 'emergencyContact', 'Emergency contact number', 'phone-pad')}
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }, shadows.md]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#FFFFFF" /> : (
                  <>
                    <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Profile Card */}
              <Animated.View entering={FadeInDown.delay(100)}>
                <LinearGradient
                  colors={['#1E3A8A', '#3B82F6']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
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
                  <Text style={styles.profileName}>{userProfile?.fullName || 'Student'}</Text>
                  <Text style={styles.profileEmail}>{userProfile?.email || 'student@university.edu'}</Text>
                  <View style={styles.profileStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{userProfile?.year || 'N/A'}</Text>
                      <Text style={styles.statLabel}>Year</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{userProfile?.semester || 'N/A'}</Text>
                      <Text style={styles.statLabel}>Semester</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{userProfile?.studentId || 'N/A'}</Text>
                      <Text style={styles.statLabel}>Student ID</Text>
                    </View>
                  </View>
                </LinearGradient>
              </Animated.View>

              {/* Preferences */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Preferences</Text>
                {settingsOptions.map((option, index) => (
                  <Animated.View key={option.id} entering={FadeInDown.delay(200 + index * 100)}>
                    <View style={[styles.settingCard, { backgroundColor: theme.surface }, shadows.sm]}>
                      <View style={styles.settingLeft}>
                        <View style={[styles.settingIcon, { backgroundColor: theme.primary + '20' }]}>
                          <Ionicons name={option.icon} size={24} color={theme.primary} />
                        </View>
                        <View style={styles.settingInfo}>
                          <Text style={[styles.settingTitle, { color: theme.text }]}>{option.title}</Text>
                          <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>{option.description}</Text>
                        </View>
                      </View>
                      <Switch
                        value={settings[option.id]}
                        onValueChange={() => setSettings(p => ({ ...p, [option.id]: !p[option.id] }))}
                        trackColor={{ false: '#CBD5E1', true: theme.primary }}
                        thumbColor="#FFFFFF"
                      />
                    </View>
                  </Animated.View>
                ))}
              </View>

              {/* More Options */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>More Options</Text>
                {menuItems.map((item, index) => (
                  <Animated.View key={item.id} entering={FadeInDown.delay(400 + index * 100)}>
                    <TouchableOpacity
                      style={[styles.menuCard, { backgroundColor: theme.surface }, shadows.sm]}
                      onPress={item.onPress}
                    >
                      <View style={[styles.menuIcon, { backgroundColor: theme.primary + '20' }]}>
                        <Ionicons name={item.icon} size={24} color={theme.primary} />
                      </View>
                      <Text style={[styles.menuTitle, { color: theme.text }]}>{item.title}</Text>
                      <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>

              {/* Logout */}
              <TouchableOpacity style={[styles.logoutButton, { backgroundColor: '#EF4444' }]} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>

              <Text style={[styles.versionText, { color: theme.textTertiary }]}>IntelliCamp v1.0.0</Text>
            </>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: spacing.xxl + 20, paddingBottom: spacing.md, paddingHorizontal: spacing.lg,
  },
  headerTitle: { ...typography.h3 },
  content: { flex: 1, padding: spacing.lg },
  profileCard: { borderRadius: borderRadius.xl, padding: spacing.xl, alignItems: 'center', marginBottom: spacing.xl },
  avatarContainer: { position: 'relative', marginBottom: spacing.md },
  avatar: { width: 96, height: 96, borderRadius: 48, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: 'rgba(255,255,255,0.3)' },
  avatarText: { ...typography.h1, color: '#FFFFFF' },
  editAvatarButton: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#3B82F6', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFFFFF' },
  profileName: { ...typography.h2, color: '#FFFFFF', marginBottom: spacing.xs },
  profileEmail: { ...typography.body, color: 'rgba(255,255,255,0.8)', marginBottom: spacing.lg },
  profileStats: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  statItem: { alignItems: 'center' },
  statValue: { ...typography.h4, color: '#FFFFFF', marginBottom: spacing.xs },
  statLabel: { ...typography.caption, color: 'rgba(255,255,255,0.7)' },
  statDivider: { width: 1, height: 32 },
  section: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.h3, marginBottom: spacing.md },
  settingCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.sm },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingIcon: { width: 48, height: 48, borderRadius: borderRadius.lg, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  settingInfo: { flex: 1 },
  settingTitle: { ...typography.bodyMedium, fontWeight: '600', marginBottom: spacing.xs },
  settingDesc: { ...typography.small },
  menuCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.sm },
  menuIcon: { width: 48, height: 48, borderRadius: borderRadius.lg, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  menuTitle: { ...typography.bodyMedium, fontWeight: '600', flex: 1 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: spacing.lg, borderRadius: borderRadius.lg, marginBottom: spacing.lg, gap: spacing.sm },
  logoutText: { ...typography.h4, color: '#FFFFFF', fontWeight: '600' },
  versionText: { ...typography.caption, textAlign: 'center', marginBottom: spacing.xl },
  inputContainer: { marginBottom: spacing.md },
  label: { ...typography.bodyMedium, marginBottom: spacing.sm, fontWeight: '600' },
  inputBox: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: borderRadius.lg, borderWidth: 1 },
  textInput: { ...typography.body, flex: 1, paddingVertical: 0 },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: spacing.lg, borderRadius: borderRadius.lg, marginTop: spacing.lg, marginBottom: spacing.xxl, gap: spacing.sm },
  saveButtonText: { ...typography.h4, color: '#FFFFFF', fontWeight: '600' },
});

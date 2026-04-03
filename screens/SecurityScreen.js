import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { sendVerificationEmail, sendPasswordReset, reloadUser } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { lightTheme, darkTheme, spacing, typography, borderRadius, shadows } from '../constants/modernTheme';

export default function SecurityScreen({ navigation }) {
  const { user, isDarkMode, toggleDarkMode } = useAuth();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [loading, setLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(user?.emailVerified || false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    setEmailVerified(user?.emailVerified || false);
  }, [user]);

  useEffect(() => {
    if (!emailVerified) {
      const interval = setInterval(async () => {
        try {
          const result = await reloadUser();
          if (result.emailVerified) {
            setEmailVerified(true);
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Error checking verification:', error);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [emailVerified]);

  const handleSendVerificationEmail = async () => {
    setLoading(true);
    try {
      await sendVerificationEmail();
      if (window.confirm) {
        window.alert('Verification email sent. Please check your inbox.');
      }
      setChecking(true);
    } catch (error) {
      console.error('Verification email error:', error);
      if (window.alert) {
        window.alert(error.message || 'Failed to send verification email');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!window.confirm('Send password reset email to ' + user?.email + '?')) {
      return;
    }
    setLoading(true);
    try {
      await sendPasswordReset(user?.email);
      if (window.alert) {
        window.alert('Password reset link sent to your email.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      if (window.alert) {
        window.alert('Failed to send password reset email');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={isDarkMode ? ['#0F172A', '#1E293B'] : ['#FFFFFF', '#F8FAFC']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.surface }, shadows.sm]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Security</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Email Verification */}
          <View style={[styles.section, { backgroundColor: theme.surface }, shadows.sm]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="mail" size={24} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Email Verification</Text>
            </View>
            <View style={styles.verificationStatus}>
              <Text style={[styles.statusLabel, { color: theme.textSecondary }]}>Status:</Text>
              <View style={[styles.statusBadge, { backgroundColor: emailVerified ? '#10B98120' : '#F59E0B20' }]}>
                <Ionicons 
                  name={emailVerified ? 'checkmark-circle' : 'alert-circle'} 
                  size={16} 
                  color={emailVerified ? '#10B981' : '#F59E0B'} 
                />
                <Text style={[styles.statusText, { color: emailVerified ? '#10B981' : '#F59E0B' }]}>
                  {emailVerified ? 'Verified ✅' : 'Not Verified ❌'}
                </Text>
              </View>
            </View>
            {!emailVerified && (
              <TouchableOpacity
                style={[styles.verifyButton, { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }]}
                onPress={handleSendVerificationEmail}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.verifyButtonText}>Send Verification Email</Text>
                )}
              </TouchableOpacity>
            )}
            {checking && !emailVerified && (
              <Text style={[styles.checkingText, { color: theme.textSecondary }]}>
                Checking verification status...
              </Text>
            )}
          </View>

          {/* Change Password */}
          <View style={[styles.section, { backgroundColor: theme.surface }, shadows.sm]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="lock-closed" size={24} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Change Password</Text>
            </View>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              For security reasons, password changes are done via email.
            </Text>
            <TouchableOpacity
              style={[styles.resetButton, { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }]}
              onPress={handlePasswordReset}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="mail-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.resetButtonText}>Send Password Reset Email</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
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
  section: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.h4,
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  statusLabel: {
    ...typography.body,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  statusText: {
    ...typography.smallMedium,
    fontWeight: '600',
  },
  verifyButton: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  verifyButtonText: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  checkingText: {
    ...typography.small,
    marginTop: spacing.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoText: {
    ...typography.body,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  resetButtonText: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

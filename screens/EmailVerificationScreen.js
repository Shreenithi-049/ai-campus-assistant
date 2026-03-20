import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme, spacing, typography, borderRadius } from '../constants/modernTheme';
import { useAuth } from '../contexts/AuthContext';

const RESEND_COOLDOWN = 60;
const POLL_INTERVAL  = 3000;

export default function EmailVerificationScreen() {
  const { user, logout, resendVerification, checkEmailVerified } = useAuth();
  const theme = lightTheme;

  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown]   = useState(0);

  // Auto-poll every 3 s — navigates automatically when verified
  useEffect(() => {
    const interval = setInterval(async () => {
      const verified = await checkEmailVerified();
      if (verified) clearInterval(interval);
    }, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [checkEmailVerified]);

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleResend = async () => {
    setResending(true);
    const result = await resendVerification();
    setResending(false);
    if (result.success) {
      setCooldown(RESEND_COOLDOWN);
      Alert.alert('Email Sent', 'Verification email sent. Check your inbox.');
    } else {
      Alert.alert('Error', result.error || 'Failed to send email. Try again.');
    }
  };

  const handleLogout = async () => {
    // Alert.alert is silent on Expo Web — use window.confirm as fallback
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to logout?');
      if (confirmed) await logout();
      return;
    }
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => { await logout(); } },
    ]);
  };

  return (
    <LinearGradient colors={['#EEF2FF', '#F5F3FF']} style={styles.container}>
      <View style={styles.iconWrap}>
        <LinearGradient colors={['#1E3A8A', '#3B82F6']} style={styles.iconGradient}>
          <Ionicons name="mail-unread-outline" size={56} color="#fff" />
        </LinearGradient>
      </View>

      <Text style={[styles.title, { color: theme.text }]}>Verify Your Email</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        We sent a verification link to:
      </Text>
      <Text style={[styles.email, { color: theme.primary }]}>{user?.email}</Text>

      <Text style={[styles.instruction, { color: theme.textSecondary }]}>
        Click the link in that email to unlock full access to IntelliCamp.
        This page will update automatically once verified.
      </Text>

      <View style={styles.autoCheck}>
        <ActivityIndicator size="small" color={theme.primary} />
        <Text style={[styles.autoCheckText, { color: theme.textSecondary }]}>
          Waiting for verification…
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.secondaryBtn,
            { borderColor: theme.primary, opacity: (resending || cooldown > 0) ? 0.5 : 1 },
          ]}
          onPress={handleResend}
          disabled={resending || cooldown > 0}
        >
          {resending
            ? <ActivityIndicator color={theme.primary} />
            : (
              <Text style={[styles.secondaryBtnText, { color: theme.primary }]}>
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Verification Email'}
              </Text>
            )
          }
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  iconWrap: {
    marginBottom: spacing.xl,
  },
  iconGradient: {
    width: 112,
    height: 112,
    borderRadius: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
  },
  email: {
    ...typography.bodyMedium,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  instruction: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 340,
    marginBottom: spacing.lg,
  },
  autoCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  autoCheckText: {
    ...typography.small,
  },
  actions: {
    width: '100%',
    maxWidth: 360,
    gap: spacing.md,
  },
  secondaryBtn: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    minHeight: 52,
  },
  secondaryBtnText: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  logoutText: {
    ...typography.bodyMedium,
    color: '#EF4444',
    fontWeight: '600',
  },
});

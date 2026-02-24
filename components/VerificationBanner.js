import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography, borderRadius } from '../constants/modernTheme';

export const VerificationBanner = ({ user, userProfile, onPress, theme }) => {
  const emailVerified = user?.emailVerified || false;
  const profileComplete = userProfile?.fullName && userProfile?.studentId && userProfile?.year && userProfile?.semester;

  if (emailVerified && profileComplete) {
    return null;
  }

  return (
    <TouchableOpacity 
      style={[styles.banner, { backgroundColor: '#F59E0B20', borderColor: '#F59E0B' }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="alert-circle" size={24} color="#F59E0B" />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>
          Action Required
        </Text>
        <Text style={[styles.message, { color: theme.textSecondary }]}>
          {!emailVerified && !profileComplete && 'Please verify your email and complete your profile'}
          {!emailVerified && profileComplete && 'Please verify your email address'}
          {emailVerified && !profileComplete && 'Please complete your profile information'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    gap: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F59E0B10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.bodyMedium,
    fontWeight: '600',
    marginBottom: 2,
  },
  message: {
    ...typography.small,
    lineHeight: 18,
  },
});

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const SkeletonPlaceholder = ({ width, height, borderRadius = 8, style }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#E1E9EE',
          opacity,
        },
        style,
      ]}
    />
  );
};

export const ProfileSkeleton = ({ theme }) => (
  <View style={styles.profileContainer}>
    <SkeletonPlaceholder width={96} height={96} borderRadius={48} style={styles.centerItem} />
    <SkeletonPlaceholder width={200} height={24} style={styles.spacingMd} />
    <SkeletonPlaceholder width={250} height={16} style={styles.spacingLg} />
    <View style={styles.row}>
      <SkeletonPlaceholder width={80} height={40} style={styles.spacingSm} />
      <SkeletonPlaceholder width={80} height={40} style={styles.spacingSm} />
      <SkeletonPlaceholder width={80} height={40} />
    </View>
  </View>
);

export const EventCardSkeleton = ({ theme }) => (
  <View style={[styles.card, { backgroundColor: theme.surface }]}>
    <SkeletonPlaceholder width={56} height={56} borderRadius={12} style={styles.spacingMd} />
    <SkeletonPlaceholder width="80%" height={20} style={styles.spacingSm} />
    <SkeletonPlaceholder width="60%" height={14} style={styles.spacingXs} />
    <SkeletonPlaceholder width="70%" height={14} style={styles.spacingXs} />
    <SkeletonPlaceholder width="50%" height={14} style={styles.spacingMd} />
    <SkeletonPlaceholder width="100%" height={48} borderRadius={12} />
  </View>
);

export const AcademicCardSkeleton = ({ theme }) => (
  <View style={[styles.card, { backgroundColor: theme.surface }]}>
    <SkeletonPlaceholder width="70%" height={20} style={styles.spacingMd} />
    <SkeletonPlaceholder width="90%" height={14} style={styles.spacingSm} />
    <SkeletonPlaceholder width="80%" height={14} style={styles.spacingSm} />
    <SkeletonPlaceholder width="85%" height={14} />
  </View>
);

export const FacultyCardSkeleton = ({ theme }) => (
  <View style={[styles.card, { backgroundColor: theme.surface }]}>
    <View style={styles.row}>
      <SkeletonPlaceholder width={56} height={56} borderRadius={28} style={styles.spacingSm} />
      <View style={{ flex: 1 }}>
        <SkeletonPlaceholder width={150} height={18} style={styles.spacingXs} />
        <SkeletonPlaceholder width={120} height={14} />
      </View>
    </View>
    <SkeletonPlaceholder width={200} height={14} style={styles.spacingXs} />
    <SkeletonPlaceholder width={100} height={14} style={styles.spacingXs} />
    <SkeletonPlaceholder width={150} height={14} />
  </View>
);

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    padding: 24,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerItem: {
    alignSelf: 'center',
  },
  spacingXs: {
    marginBottom: 6,
  },
  spacingSm: {
    marginBottom: 8,
    marginRight: 8,
  },
  spacingMd: {
    marginBottom: 12,
  },
  spacingLg: {
    marginBottom: 24,
  },
});

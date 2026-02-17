import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { lightTheme, darkTheme, spacing, typography, borderRadius, shadows } from '../constants/modernTheme';
import { useAuth } from '../contexts/AuthContext';

export default function ModernHomeScreen({ navigation }) {
  const { userProfile, isDarkMode, toggleDarkMode } = useAuth();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getUserName = () => {
    if (userProfile?.fullName) {
      return userProfile.fullName.split(' ')[0];
    }
    return 'Student';
  };

  const popularQueries = [
    'Where is the library?',
    'Show my exam schedule',
    'Faculty office hours',
    'Campus events today',
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={isDarkMode ? ['#0F172A', '##1E293B'] : ['#FFFFFF', '#F8FAFC']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.greeting, { color: theme.textSecondary }]}>
                {getGreeting()} 👋
              </Text>
              <Text style={[styles.userName, { color: theme.text }]}>{getUserName()}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={[styles.iconButton, { backgroundColor: theme.glassBackground }]}
                onPress={() => navigation.navigate('Notifications')}
              >
                <Ionicons name="notifications-outline" size={24} color={theme.text} />
                <View style={styles.badge} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.iconButton, { backgroundColor: theme.glassBackground }]}
                onPress={toggleDarkMode}
              >
                <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* AI Suggestion Card */}
          <Animated.View entering={FadeInDown.delay(100)}>
            <LinearGradient
              colors={theme.suggestionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.suggestionCard, shadows.lg]}
            >
              <View style={styles.suggestionHeader}>
                <Ionicons name="sparkles" size={24} color="#FCD34D" />
                <Text style={[styles.suggestionTitle, { color: theme.textPrimary }]}>AI Suggestion</Text>
              </View>
              <Text style={[styles.suggestionText, { color: theme.textPrimary }]}>
                You have a lecture in Building A, Room 301 in 30 minutes. Would you like directions?
              </Text>
              <TouchableOpacity style={styles.suggestionButton}>
                <Text style={styles.suggestionButtonText}>Get Directions</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>

          {/* About IntelliCamp */}
          <Animated.View entering={FadeInDown.delay(200)}>
            <View style={[styles.aboutCard, { backgroundColor: theme.cardBackground }, shadows.sm]}>
              <Text style={[styles.aboutTitle, { color: theme.text }]}>About IntelliCamp</Text>
              <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
                IntelliCamp is your AI-powered campus companion designed to simplify academic life, 
                provide instant campus assistance, and keep you updated with essential academic and campus information.
              </Text>
            </View>
          </Animated.View>

          {/* Popular Queries */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Popular Queries</Text>
            {popularQueries.map((query, index) => (
              <Animated.View 
                key={index}
                entering={FadeInDown.delay(300 + index * 100)}
              >
                <TouchableOpacity
                  style={[styles.queryCard, { backgroundColor: theme.surface }, shadows.sm]}
                  onPress={() => navigation.navigate('Chat', { query })}
                >
                  <Ionicons name="search-outline" size={20} color={theme.textSecondary} />
                  <Text style={[styles.queryText, { color: theme.text }]}>{query}</Text>
                  <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              </Animated.View>
            ))}
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
    paddingTop: spacing.xxl + 20,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    ...typography.body,
    marginBottom: spacing.xs,
  },
  userName: {
    ...typography.h2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  suggestionCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  suggestionTitle: {
    ...typography.h4,
    marginLeft: spacing.sm,
  },
  suggestionText: {
    ...typography.body,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  suggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  suggestionButtonText: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  aboutCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  aboutTitle: {
    ...typography.h4,
    marginBottom: spacing.sm,
  },
  aboutText: {
    ...typography.body,
    lineHeight: 22,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  queryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  queryText: {
    ...typography.body,
    flex: 1,
  },
});

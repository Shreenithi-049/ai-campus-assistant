import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { lightTheme, darkTheme, spacing, typography, borderRadius, shadows } from '../constants/modernTheme';
import { useAuth } from '../contexts/AuthContext';

export default function ModernAcademicScreen({ navigation }) {
  const { isDarkMode, toggleDarkMode } = useAuth();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [activeTab, setActiveTab] = useState('timetable');

  const tabs = [
    { id: 'timetable', label: 'Timetable', icon: 'calendar-outline' },
    { id: 'faculty', label: 'Faculty', icon: 'people-outline' },
    { id: 'syllabus', label: 'Syllabus', icon: 'book-outline' },
  ];

  const timetable = [
    { id: 1, subject: 'Data Structures', time: '9:00 AM - 10:30 AM', room: 'ENG-301', professor: 'Dr. Smith', color: '#3B82F6' },
    { id: 2, subject: 'Database Systems', time: '11:00 AM - 12:30 PM', room: 'ENG-205', professor: 'Dr. Johnson', color: '#10B981' },
    { id: 3, subject: 'Web Development', time: '2:00 PM - 3:30 PM', room: 'ENG-401', professor: 'Dr. Williams', color: '#8B5CF6' },
  ];

  const faculty = [
    { id: 1, name: 'Dr. Sarah Smith', department: 'Computer Science', email: 'sarah.smith@university.edu', office: 'ENG-501', hours: 'Mon-Wed 2-4 PM' },
    { id: 2, name: 'Dr. John Johnson', department: 'Computer Science', email: 'john.johnson@university.edu', office: 'ENG-502', hours: 'Tue-Thu 3-5 PM' },
    { id: 3, name: 'Dr. Emily Williams', department: 'Computer Science', email: 'emily.williams@university.edu', office: 'ENG-503', hours: 'Mon-Fri 1-3 PM' },
  ];

  const syllabus = [
    { id: 1, subject: 'Data Structures', progress: 75, topics: 12, completed: 9 },
    { id: 2, subject: 'Database Systems', progress: 60, topics: 10, completed: 6 },
    { id: 3, subject: 'Web Development', progress: 45, topics: 15, completed: 7 },
  ];

  const renderTimetable = () => (
    <View>
      {timetable.map((item, index) => (
        <Animated.View
          key={item.id}
          entering={SlideInRight.delay(index * 100)}
        >
          <View style={[styles.card, { backgroundColor: theme.surface }, shadows.md]}>
            <View style={[styles.colorBar, { backgroundColor: item.color }]} />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>{item.subject}</Text>
                <View style={[styles.badge, { backgroundColor: item.color + '20' }]}>
                  <Text style={[styles.badgeText, { color: item.color }]}>{item.room}</Text>
                </View>
              </View>
              <View style={styles.cardRow}>
                <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
                <Text style={[styles.cardText, { color: theme.textSecondary }]}>{item.time}</Text>
              </View>
              <View style={styles.cardRow}>
                <Ionicons name="person-outline" size={16} color={theme.textSecondary} />
                <Text style={[styles.cardText, { color: theme.textSecondary }]}>{item.professor}</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      ))}
    </View>
  );

  const renderFaculty = () => (
    <View>
      {faculty.map((item, index) => (
        <Animated.View
          key={item.id}
          entering={SlideInRight.delay(index * 100)}
        >
          <View style={[styles.card, { backgroundColor: theme.surface }, shadows.md]}>
            <View style={styles.cardContent}>
              <View style={styles.facultyHeader}>
                <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                  <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                </View>
                <View style={styles.facultyInfo}>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>{item.name}</Text>
                  <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
                    {item.department}
                  </Text>
                </View>
              </View>
              <View style={styles.facultyDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="mail-outline" size={16} color={theme.textSecondary} />
                  <Text style={[styles.detailText, { color: theme.textSecondary }]}>{item.email}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={16} color={theme.textSecondary} />
                  <Text style={[styles.detailText, { color: theme.textSecondary }]}>{item.office}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
                  <Text style={[styles.detailText, { color: theme.textSecondary }]}>{item.hours}</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.contactButton, { backgroundColor: theme.primary }]}>
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      ))}
    </View>
  );

  const renderSyllabus = () => (
    <View>
      {syllabus.map((item, index) => (
        <Animated.View
          key={item.id}
          entering={SlideInRight.delay(index * 100)}
        >
          <View style={[styles.card, { backgroundColor: theme.surface }, shadows.md]}>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{item.subject}</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                    {item.completed} of {item.topics} topics completed
                  </Text>
                  <Text style={[styles.progressPercent, { color: theme.primary }]}>
                    {item.progress}%
                  </Text>
                </View>
                <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { backgroundColor: theme.primary, width: `${item.progress}%` }
                    ]} 
                  />
                </View>
              </View>
              <TouchableOpacity style={[styles.viewButton, { borderColor: theme.primary }]}>
                <Text style={[styles.viewButtonText, { color: theme.primary }]}>View Details</Text>
                <Ionicons name="arrow-forward" size={16} color={theme.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      ))}
    </View>
  );

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
          <Text style={[styles.headerTitle, { color: theme.text }]}>Academic Info</Text>
          <TouchableOpacity onPress={toggleDarkMode}>
            <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={[styles.tabsContainer, { backgroundColor: theme.surface }]}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && { 
                  backgroundColor: theme.primary,
                  ...shadows.sm 
                }
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Ionicons 
                name={tab.icon} 
                size={20} 
                color={activeTab === tab.id ? '#FFFFFF' : theme.textSecondary} 
              />
              <Text style={[
                styles.tabText,
                { color: activeTab === tab.id ? '#FFFFFF' : theme.textSecondary }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeIn} key={activeTab}>
            {activeTab === 'timetable' && renderTimetable()}
            {activeTab === 'faculty' && renderFaculty()}
            {activeTab === 'syllabus' && renderSyllabus()}
          </Animated.View>
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
  tabsContainer: {
    flexDirection: 'row',
    padding: spacing.sm,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  tabText: {
    ...typography.smallMedium,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  card: {
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  colorBar: {
    height: 4,
  },
  cardContent: {
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.h4,
  },
  cardSubtitle: {
    ...typography.small,
  },
  badge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '600',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  cardText: {
    ...typography.body,
  },
  facultyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.h3,
    color: '#FFFFFF',
  },
  facultyInfo: {
    flex: 1,
  },
  facultyDetails: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    ...typography.small,
  },
  contactButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  contactButtonText: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  progressContainer: {
    marginVertical: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressText: {
    ...typography.small,
  },
  progressPercent: {
    ...typography.smallMedium,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    gap: spacing.xs,
  },
  viewButtonText: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
});

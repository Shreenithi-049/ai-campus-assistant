import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { lightTheme, darkTheme, spacing, typography, borderRadius, shadows } from '../constants/modernTheme';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToTimetable } from '../services/timetableService';
import { subscribeToFaculty } from '../services/facultyService';
import { subscribeToSyllabus } from '../services/syllabusService';
import { getStudentAttendance, calculateOverallAttendance } from '../services/attendanceService';

export default function ModernAcademicScreen({ navigation }) {
  const { isDarkMode, toggleDarkMode, user, userProfile } = useAuth();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [activeTab, setActiveTab] = useState('timetable');
  const [timetable, setTimetable] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [syllabus, setSyllabus] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [overallAttendance, setOverallAttendance] = useState(0);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  useEffect(() => {
    const unsubTimetable = subscribeToTimetable(
      userProfile?.department || 'Computer Science',
      userProfile?.year || '3rd Year',
      setTimetable,
      (error) => console.error('Timetable error:', error)
    );

    const unsubFaculty = subscribeToFaculty(
      setFaculty,
      (error) => console.error('Faculty error:', error)
    );

    const unsubSyllabus = subscribeToSyllabus(
      user?.uid,
      setSyllabus,
      (error) => console.error('Syllabus error:', error)
    );

    return () => {
      unsubTimetable();
      unsubFaculty();
      unsubSyllabus();
    };
  }, [user, userProfile]);

  useEffect(() => {
    if (activeTab === 'attendance' && user?.uid) {
      loadAttendance();
    }
  }, [activeTab, user]);

  const loadAttendance = async () => {
    setLoadingAttendance(true);
    const result = await getStudentAttendance(user.uid);
    if (result.success) {
      setAttendance(result.data);
      const attendanceObj = result.data.reduce((acc, item) => {
        acc[item.subject] = item.percentage;
        return acc;
      }, {});
      setOverallAttendance(calculateOverallAttendance(attendanceObj));
    }
    setLoadingAttendance(false);
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return '#10B981';
    if (percentage >= 65) return '#F59E0B';
    return '#EF4444';
  };

  const tabs = [
    { id: 'timetable', label: 'Timetable', icon: 'calendar-outline' },
    { id: 'faculty', label: 'Faculty', icon: 'people-outline' },
    { id: 'syllabus', label: 'Syllabus', icon: 'book-outline' },
    { id: 'attendance', label: 'Attendance', icon: 'checkmark-circle-outline' },
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

  const renderAttendance = () => {
    if (loadingAttendance) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading attendance...</Text>
        </View>
      );
    }

    if (attendance.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="calendar-outline" size={64} color={theme.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No attendance data available</Text>
        </View>
      );
    }

    return (
      <View>
        {/* Overall Attendance */}
        <Animated.View entering={SlideInRight}>
          <View style={[styles.card, { backgroundColor: theme.surface }, shadows.md]}>
            <View style={styles.cardContent}>
              <Text style={[styles.overallTitle, { color: theme.text }]}>Overall Attendance</Text>
              <View style={styles.overallContainer}>
                <Text style={[styles.overallPercent, { color: getAttendanceColor(overallAttendance) }]}>
                  {overallAttendance}%
                </Text>
                <View style={[styles.progressBar, styles.overallBar, { backgroundColor: theme.border }]}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { backgroundColor: getAttendanceColor(overallAttendance), width: `${overallAttendance}%` }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Subject-wise Attendance */}
        {attendance.map((item, index) => {
          const color = getAttendanceColor(item.percentage);
          return (
            <Animated.View
              key={item.subject}
              entering={SlideInRight.delay(index * 100)}
            >
              <View style={[styles.card, { backgroundColor: theme.surface }, shadows.md]}>
                <View style={[styles.colorBar, { backgroundColor: color }]} />
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>{item.subject}</Text>
                  <View style={styles.attendanceContainer}>
                    <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { backgroundColor: color, width: `${item.percentage}%` }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.attendancePercent, { color }]}>
                      {item.percentage}%
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          );
        })}
      </View>
    );
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
            {activeTab === 'attendance' && renderAttendance()}
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
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  loadingText: {
    ...typography.body,
    marginTop: spacing.md,
  },
  emptyText: {
    ...typography.body,
    marginTop: spacing.md,
  },
  overallTitle: {
    ...typography.h4,
    marginBottom: spacing.md,
  },
  overallContainer: {
    alignItems: 'center',
  },
  overallPercent: {
    ...typography.h1,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  overallBar: {
    width: '100%',
    height: 12,
  },
  attendanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  attendancePercent: {
    ...typography.h4,
    fontWeight: 'bold',
    minWidth: 50,
  },
});

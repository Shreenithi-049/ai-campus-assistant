import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Linking, Platform } from 'react-native';
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
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [activeTab, setActiveTab] = useState('timetable');
  const [timetable, setTimetable] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [syllabus, setSyllabus] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [overallAttendance, setOverallAttendance] = useState(0);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  useEffect(() => {
    const dept = userProfile?.department;
    const yr   = userProfile?.year;

    console.log('📚 Timetable fetch — Dept:', dept, '| Year:', yr);

    if (!dept || !yr) {
      console.warn('⚠️  Student profile missing department or year — skipping timetable fetch');
      return;
    }

    const unsubTimetable = subscribeToTimetable(
      dept,
      yr,
      (data) => {
        console.log('📅 Timetable data received:', data.length, 'entries');
        setTimetable(data);
      },
      (error) => console.error('Timetable error:', error)
    );

    const unsubFaculty = subscribeToFaculty(
      setFaculty,
      (error) => console.error('Faculty error:', error)
    );

    const unsubSyllabus = subscribeToSyllabus(
      userProfile,
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
    const result = await getStudentAttendance(userProfile);
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

  const renderTimetable = () => {
    if (!userProfile?.department || !userProfile?.year) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="person-circle-outline" size={64} color={theme.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Complete your profile to view timetable
          </Text>
          <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>
            Department and year are required
          </Text>
        </View>
      );
    }

    if (timetable.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="calendar-outline" size={64} color={theme.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No timetable available</Text>
          <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>
            {userProfile.department} • {userProfile.year}
          </Text>
        </View>
      );
    }

    // Group entries by day
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const byDay = DAYS.reduce((acc, d) => {
      const entries = timetable.filter(item => item.day === d);
      if (entries.length > 0) acc[d] = entries;
      return acc;
    }, {});

    return (
      <View>
        {Object.entries(byDay).map(([day, entries]) => (
          <View key={day}>
            <Text style={[styles.dayHeader, { color: theme.primary }]}>{day}</Text>
            {entries.map((item, index) => (
              <Animated.View key={item.id} entering={SlideInRight.delay(index * 80)}>
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
        ))}
      </View>
    );
  };

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
              <TouchableOpacity
                style={[styles.contactButton, { backgroundColor: theme.primary }]}
                onPress={() => setSelectedFaculty(item)}
              >
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      ))}
    </View>
  );

  const renderSyllabus = () => {
    if (!userProfile?.department || !userProfile?.year || !userProfile?.semester) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="book-outline" size={64} color={theme.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Complete your profile to view syllabus
          </Text>
          <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>
            Department, year and semester are required
          </Text>
        </View>
      );
    }

    if (syllabus.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="book-outline" size={64} color={theme.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No syllabus available</Text>
          <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>
            {userProfile.department} • {userProfile.year} • {userProfile.semester}
          </Text>
        </View>
      );
    }

    return (
      <View>
        {syllabus.map((item, index) => (
          <Animated.View key={item.id} entering={SlideInRight.delay(index * 100)}>
            <View style={[styles.card, { backgroundColor: theme.surface }, shadows.md]}>
              <View style={[styles.colorBar, { backgroundColor: item.color }]} />
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>{item.subject}</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                      {item.completedTopics} / {item.totalTopics} topics completed
                    </Text>
                    <Text style={[styles.progressPercent, { color: item.color }]}>
                      {item.progress}%
                    </Text>
                  </View>
                  <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                    <View
                      style={[styles.progressFill, { backgroundColor: item.color, width: `${item.progress}%` }]}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        ))}
      </View>
    );
  };

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
      {/* Faculty Contact Modal */}
      <Modal
        visible={!!selectedFaculty}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedFaculty(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedFaculty(null)}
        >
          <TouchableOpacity activeOpacity={1} style={[styles.modalCard, { backgroundColor: theme.surface }]}>
            <View style={[styles.modalAvatar, { backgroundColor: theme.primary }]}>
              <Text style={styles.avatarText}>{selectedFaculty?.name?.charAt(0)}</Text>
            </View>
            <Text style={[styles.modalName, { color: theme.text }]}>{selectedFaculty?.name}</Text>
            <Text style={[styles.modalDept, { color: theme.textSecondary }]}>{selectedFaculty?.department}</Text>

            <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />

            {selectedFaculty?.email ? (
              <TouchableOpacity
                style={styles.modalRow}
                onPress={() => Linking.openURL(`mailto:${selectedFaculty.email}`)}
              >
                <View style={[styles.modalIconBox, { backgroundColor: theme.primary + '20' }]}>
                  <Text style={styles.modalIcon}>✉️</Text>
                </View>
                <View style={styles.modalRowText}>
                  <Text style={[styles.modalLabel, { color: theme.textSecondary }]}>Email</Text>
                  <Text style={[styles.modalValue, { color: theme.primary }]}>{selectedFaculty.email}</Text>
                </View>
              </TouchableOpacity>
            ) : null}

            {selectedFaculty?.phone ? (
              <TouchableOpacity
                style={styles.modalRow}
                onPress={() => Linking.openURL(`tel:${selectedFaculty.phone}`)}
              >
                <View style={[styles.modalIconBox, { backgroundColor: '#10B98120' }]}>
                  <Text style={styles.modalIcon}>📞</Text>
                </View>
                <View style={styles.modalRowText}>
                  <Text style={[styles.modalLabel, { color: theme.textSecondary }]}>Phone</Text>
                  <Text style={[styles.modalValue, { color: '#10B981' }]}>{selectedFaculty.phone}</Text>
                </View>
              </TouchableOpacity>
            ) : null}

            {selectedFaculty?.office ? (
              <View style={styles.modalRow}>
                <View style={[styles.modalIconBox, { backgroundColor: '#F59E0B20' }]}>
                  <Text style={styles.modalIcon}>📍</Text>
                </View>
                <View style={styles.modalRowText}>
                  <Text style={[styles.modalLabel, { color: theme.textSecondary }]}>Office</Text>
                  <Text style={[styles.modalValue, { color: theme.text }]}>{selectedFaculty.office}</Text>
                </View>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.modalCloseBtn, { backgroundColor: theme.primary }]}
              onPress={() => setSelectedFaculty(null)}
            >
              <Text style={styles.modalCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
          <View style={{ width: 24 }} />
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
          contentContainerStyle={{ maxWidth: 1200, width: '100%', alignSelf: 'center', paddingBottom: 40 }}
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
  dayHeader: {
    ...typography.h4,
    fontWeight: '700',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    paddingLeft: spacing.xs,
  },
  loadingText: {
    ...typography.body,
    marginTop: spacing.md,
  },
  emptyText: {
    ...typography.body,
    marginTop: spacing.md,
  },
  emptySubText: {
    ...typography.small,
    marginTop: spacing.xs,
    opacity: 0.7,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.lg,
  },
  modalAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalName: {
    ...typography.h3,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  modalDept: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  modalDivider: {
    width: '100%',
    height: 1,
    marginBottom: spacing.md,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  modalIconBox: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 20,
  },
  modalRowText: {
    flex: 1,
  },
  modalLabel: {
    ...typography.caption,
    marginBottom: 2,
  },
  modalValue: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  modalCloseBtn: {
    marginTop: spacing.sm,
    width: '100%',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

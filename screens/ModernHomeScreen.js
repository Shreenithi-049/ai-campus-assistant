import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { lightTheme, darkTheme, spacing, typography, borderRadius, shadows } from '../constants/modernTheme';
import { useAuth } from '../contexts/AuthContext';
import { VerificationBanner } from '../components/VerificationBanner';
import { subscribeToTimetable } from '../services/timetableService';
import { subscribeToEvents } from '../services/eventsService';

// ── Map room/location keywords → campus map building names ───────────────────
const LOCATION_TO_BUILDING = {
  // Generic room types from timetable
  'classroom': 'CB-05',
  'lab': 'CSE / IT',
  'seminar hall': 'SK HALL',
  'seminar': 'SK HALL',
  // Specific room codes
  'ENG-301': 'CB-01', 'ENG-205': 'CB-02', 'ENG-401': 'CSE / IT',
  'ENG-501': 'ADMIN', 'ENG-502': 'ADMIN', 'ENG-503': 'ADMIN',
  'CB-01': 'CB-01', 'CB-02': 'CB-02', 'CB-03': 'CB-03',
  'CB-04': 'CB-04', 'CB-05': 'CB-05', 'CB-06': 'CB-06', 'CB-07': 'CB-07',
  'CSE': 'CSE / IT', 'IT': 'CSE / IT', 'MECH': 'MECH',
  'MBA': 'MBA', 'MCA': 'MCA',
  // Event locations
  'main auditorium': 'CONVENTION', 'auditorium': 'CONVENTION', 'convention': 'CONVENTION',
  'open ground': 'FOOTBALL', 'sports complex': 'FOOTBALL', 'football': 'FOOTBALL',
  'library': 'LIBRARY', 'canteen': 'FOOD COURT', 'food court': 'FOOD COURT',
  'sk hall': 'SK HALL', 'parking': 'PARKING',
  'admin': 'ADMIN', 'administrative': 'ADMIN',
};

function resolveBuilding(locationStr) {
  if (!locationStr) return null;
  const lower = locationStr.toLowerCase().trim();
  // Exact match first
  if (LOCATION_TO_BUILDING[lower]) return LOCATION_TO_BUILDING[lower];
  // Partial match
  for (const [key, building] of Object.entries(LOCATION_TO_BUILDING)) {
    if (lower.includes(key.toLowerCase())) return building;
  }
  return null;
}

// Parse "9:00 AM" or "08:45 AM" → minutes since midnight
function parseTime(timeStr) {
  if (!timeStr) return null;
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return null;
  let [, h, m, period] = match;
  h = parseInt(h); m = parseInt(m);
  if (period.toUpperCase() === 'PM' && h !== 12) h += 12;
  if (period.toUpperCase() === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

function getTodayName() {
  return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];
}
function getNowMins() {
  return new Date().getHours() * 60 + new Date().getMinutes();
}

export default function ModernHomeScreen({ navigation }) {
  const { userProfile, isDarkMode, toggleDarkMode, user } = useAuth();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [nextItem, setNextItem] = useState(null); // { label, building, minsUntil, type }

  // ── Load timetable + events, find next upcoming item ──────────────────────────────
  useEffect(() => {
    const dept = userProfile?.department || 'CSD';
    const year = userProfile?.year || 'III';
    const today = getTodayName();
    const nowMins = getNowMins();

    // Timetable
    const unsubTT = subscribeToTimetable(dept, year,
      (schedule) => {
        const candidates = [];
        const todayClasses = schedule.filter(
          c => c.day?.toLowerCase() === today.toLowerCase()
        );
        todayClasses.forEach(c => {
          // time field: "08:45 AM - 09:45 AM" — take start time
          const startStr = (c.time || '').split(' - ')[0].trim();
          const mins = parseTime(startStr);
          if (mins !== null && mins > nowMins) {
            // resolve building from room first, then subject
            const building = resolveBuilding(c.room) || resolveBuilding(c.subject) || 'CB-05';
            candidates.push({
              label: `${c.subject} (${c.room})`,
              building,
              minsUntil: mins - nowMins,
              type: 'class',
              icon: 'book-outline',
              room: c.room,
              professor: c.professor,
            });
          }
        });
        if (candidates.length) {
          candidates.sort((a, b) => a.minsUntil - b.minsUntil);
          setNextItem(candidates[0]);
        }
      },
      () => {}
    );

    // Events
    const unsubEv = subscribeToEvents(
      (events) => {
        const nowM = getNowMins();
        const evCandidates = [];
        events.forEach(ev => {
          const building = resolveBuilding(ev.location);
          if (!building) return;
          const mins = parseTime(ev.time);
          if (mins !== null && mins > nowM) {
            evCandidates.push({
              label: `${ev.title} at ${ev.location}`,
              building,
              minsUntil: mins - nowM,
              type: 'event',
              icon: 'calendar-outline',
            });
          }
        });
        // Only update if no class found yet
        setNextItem(prev => {
          if (prev?.type === 'class') return prev;
          if (!evCandidates.length) return prev;
          evCandidates.sort((a, b) => a.minsUntil - b.minsUntil);
          return evCandidates[0];
        });
      },
      () => {}
    );

    return () => { unsubTT(); unsubEv(); };
  }, [userProfile]);

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
    'What are the upcoming campus events?',
    'Who are the faculty in my department?',
    'What are the latest announcements?',
    'What is my class schedule?',
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={isDarkMode ? ['#0F172A', '#1E293B'] : ['#FFFFFF', '#F8FAFC']}
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
            </View>
          </View>
        </View>

        <ScrollView 
          style={[styles.content, { backgroundColor: theme.background }]}
          contentContainerStyle={{ backgroundColor: 'transparent', maxWidth: 1200, width: '100%', alignSelf: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          {/* Verification Banner */}
          <VerificationBanner 
            user={user}
            userProfile={userProfile}
            theme={theme}
            onPress={() => {
              if (!user?.emailVerified) {
                navigation.navigate('Profile', { screen: 'Security' });
              } else {
                navigation.navigate('Profile', { screen: 'EditProfile' });
              }
            }}
          />
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
              {nextItem ? (
                <>
                  <View style={styles.suggestionMeta}>
                    <Ionicons name={nextItem.icon} size={14} color={theme.textPrimary} style={{ opacity: 0.7 }} />
                    <Text style={[styles.suggestionMins, { color: theme.textPrimary }]}>
                      {nextItem.minsUntil < 60
                        ? `In ${nextItem.minsUntil} min`
                        : `In ${Math.floor(nextItem.minsUntil / 60)}h ${nextItem.minsUntil % 60}m`}
                    </Text>
                  </View>
                  <Text style={[styles.suggestionText, { color: theme.textPrimary }]}>
                    You have {nextItem.type === 'class' ? 'a class' : 'an event'} — {nextItem.label}
                    {nextItem.professor ? ` by ${nextItem.professor}` : ''}. Would you like directions?
                  </Text>
                  <TouchableOpacity
                    style={styles.suggestionButton}
                    onPress={() => navigation.navigate('Map', { destination: nextItem.building })}
                  >
                    <Text style={styles.suggestionButtonText}>Get Directions</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={[styles.suggestionText, { color: theme.textPrimary }]}>
                  No upcoming classes or events right now. Explore the campus map!
                </Text>
              )}
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
  suggestionMeta: {
    flexDirection: 'row', alignItems: 'center',
    gap: spacing.xs, marginBottom: spacing.xs,
  },
  suggestionMins: {
    fontSize: 12, fontWeight: '600', opacity: 0.75,
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

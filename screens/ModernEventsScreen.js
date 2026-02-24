import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { lightTheme, darkTheme, spacing, typography, borderRadius, shadows } from '../constants/modernTheme';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToEvents } from '../services/eventsService';
import { EventCardSkeleton } from '../components/SkeletonLoaders';

const EventCard = React.memo(({ event, theme, index }) => (
  <Animated.View entering={FadeInDown.delay(index * 100)}>
    <View style={[styles.eventCard, { backgroundColor: theme.surface }, shadows.md]}>
      <View style={[styles.eventColorBar, { backgroundColor: event.color }]} />
      
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <View style={[styles.eventIcon, { backgroundColor: event.color + '20' }]}>
            <Ionicons name={event.icon} size={24} color={event.color} />
          </View>
          {event.registered && (
            <View style={[styles.registeredBadge, { backgroundColor: '#10B981' }]}>
              <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
              <Text style={styles.registeredText}>Registered</Text>
            </View>
          )}
        </View>

        <Text style={[styles.eventTitle, { color: theme.text }]}>
          {event.title}
        </Text>

        <View style={styles.eventDetails}>
          <View style={styles.eventDetailRow}>
            <Ionicons name="calendar-outline" size={16} color={theme.textSecondary} />
            <Text style={[styles.eventDetailText, { color: theme.textSecondary }]}>
              {event.date}
            </Text>
          </View>
          <View style={styles.eventDetailRow}>
            <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
            <Text style={[styles.eventDetailText, { color: theme.textSecondary }]}>
              {event.time}
            </Text>
          </View>
          <View style={styles.eventDetailRow}>
            <Ionicons name="location-outline" size={16} color={theme.textSecondary} />
            <Text style={[styles.eventDetailText, { color: theme.textSecondary }]}>
              {event.location}
            </Text>
          </View>
          <View style={styles.eventDetailRow}>
            <Ionicons name="people-outline" size={16} color={theme.textSecondary} />
            <Text style={[styles.eventDetailText, { color: theme.textSecondary }]}>
              {event.attendees} attendees
            </Text>
          </View>
        </View>

        <View style={styles.eventActions}>
          {!event.registered ? (
            <TouchableOpacity 
              style={[styles.registerButton, { backgroundColor: theme.primary }, shadows.sm]}
            >
              <Text style={styles.registerButtonText}>Register Now</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.detailsButton, { borderColor: theme.primary }]}
            >
              <Text style={[styles.detailsButtonText, { color: theme.primary }]}>
                View Details
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.shareButton, { backgroundColor: theme.glassBackground }]}
          >
            <Ionicons name="share-social-outline" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Animated.View>
));

export default function ModernEventsScreen({ navigation }) {
  const { isDarkMode, toggleDarkMode } = useAuth();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToEvents(
      (eventsData) => {
        setEvents(eventsData);
        setLoading(false);
      },
      (error) => {
        console.error('Events listener error:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const filters = [
    { id: 'all', label: 'All Events' },
    { id: 'academic', label: 'Academic' },
    { id: 'cultural', label: 'Cultural' },
    { id: 'sports', label: 'Sports' },
  ];

  const filteredEvents = useMemo(() => 
    selectedFilter === 'all' 
      ? events 
      : events.filter(e => e.category === selectedFilter),
    [events, selectedFilter]
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
          <Text style={[styles.headerTitle, { color: theme.text }]}>Events</Text>
          <TouchableOpacity onPress={toggleDarkMode}>
            <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Notification Toggle */}
        <View style={[styles.notificationBar, { backgroundColor: theme.surface }]}>
          <View style={styles.notificationContent}>
            <Ionicons name="notifications" size={20} color={theme.text} />
            <Text style={[styles.notificationText, { color: theme.text }]}>
              Event Notifications
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#CBD5E1', true: theme.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                selectedFilter === filter.id 
                  ? { backgroundColor: theme.primary, ...shadows.sm }
                  : { backgroundColor: theme.surface }
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={[
                styles.filterText,
                { color: selectedFilter === filter.id ? '#FFFFFF' : theme.text }
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Events List */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            // Show skeleton loaders
            [1, 2, 3].map((i) => <EventCardSkeleton key={i} theme={theme} />)
          ) : (
            filteredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} theme={theme} index={index} />
            ))
          )}

          {!loading && filteredEvents.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color={theme.textTertiary} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No events found in this category
              </Text>
            </View>
          )}
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
  notificationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  notificationText: {
    ...typography.bodyMedium,
  },
  filtersContainer: {
    maxHeight: 60,
  },
  filtersContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
  },
  filterText: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  eventCard: {
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  eventColorBar: {
    height: 4,
  },
  eventContent: {
    padding: spacing.lg,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  eventIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  registeredText: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  eventTitle: {
    ...typography.h4,
    marginBottom: spacing.md,
  },
  eventDetails: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  eventDetailText: {
    ...typography.body,
  },
  eventActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  registerButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  registerButtonText: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  detailsButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
  },
  detailsButtonText: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  shareButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyText: {
    ...typography.body,
    marginTop: spacing.lg,
  },
});

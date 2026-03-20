import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { lightTheme, darkTheme, spacing, typography, borderRadius, shadows } from '../constants/modernTheme';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToEvents } from '../services/eventsService';
import { getUserRegistrations } from '../services/eventRegistrationService';
import { EventCardSkeleton } from '../components/SkeletonLoaders';

const EventCard = React.memo(({ event, theme, index, isRegistered, onRegister }) => (
  <Animated.View entering={FadeInDown.delay(index * 100)}>
    <View style={[styles.eventCard, { backgroundColor: theme.surface }, shadows.md]}>
      <View style={[styles.eventColorBar, { backgroundColor: event.color }]} />
      
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <View style={[styles.eventIcon, { backgroundColor: event.color + '20' }]}>
            <Ionicons name={event.icon} size={24} color={event.color} />
          </View>
          {isRegistered && (
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
          {!isRegistered ? (
            <TouchableOpacity 
              style={[
                styles.registerButton,
                { backgroundColor: event.registrationLink ? theme.primary : theme.textSecondary },
                shadows.sm
              ]}
              onPress={() => event.registrationLink && onRegister(event)}
              disabled={!event.registrationLink}
            >
              <Text style={styles.registerButtonText}>
                {event.registrationLink ? 'Register' : 'Coming Soon'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.registeredButtonDisabled, { backgroundColor: '#10B981' }]}
              disabled
            >
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={styles.registerButtonText}>Registered ✔</Text>
            </TouchableOpacity>
          )}

        </View>
      </View>
    </View>
  </Animated.View>
));

export default function ModernEventsScreen({ navigation }) {
  const { isDarkMode, toggleDarkMode, user } = useAuth();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState([]);

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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (user?.uid) {
        loadUserRegistrations();
      }
    });
    return unsubscribe;
  }, [navigation, user]);

  const loadUserRegistrations = async () => {
    try {
      const registrations = await getUserRegistrations(user.uid);
      const eventIds = registrations.map(reg => reg.eventId);
      setRegisteredEvents(eventIds);
    } catch (error) {
      console.error('Load registrations error:', error);
    }
  };

  const handleRegister = (event) => {
    if (!user?.uid) {
      Alert.alert('Error', 'Please login to register for events');
      return;
    }
    navigation.navigate('EventRegistration', { event });
  };

  const filters = [
    { id: 'all', label: 'All Events' },
    { id: 'academic', label: 'Academic' },
    { id: 'cultural', label: 'Cultural' },
    { id: 'sports', label: 'Sports' },
    { id: 'myEvents', label: 'My Events' },
  ];

  const filteredEvents = useMemo(() => {
    if (selectedFilter === 'all') return events;
    if (selectedFilter === 'myEvents') {
      return events.filter(e => registeredEvents.includes(e.id));
    }
    return events.filter(e => e.category === selectedFilter);
  }, [events, selectedFilter, registeredEvents]);

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
          contentContainerStyle={{ maxWidth: 1200, width: '100%', alignSelf: 'center', paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            // Show skeleton loaders
            [1, 2, 3].map((i) => <EventCardSkeleton key={i} theme={theme} />)
          ) : (
            filteredEvents.map((event, index) => (
              <EventCard 
                key={event.id} 
                event={event} 
                theme={theme} 
                index={index}
                isRegistered={registeredEvents.includes(event.id)}
                onRegister={handleRegister}
              />
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
  registeredButtonDisabled: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
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

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme, darkTheme, spacing, typography, borderRadius, shadows } from '../constants/modernTheme';
import { useAuth } from '../contexts/AuthContext';
import { registerForEvent } from '../services/eventRegistrationService';

export default function EventRegistrationScreen({ navigation, route }) {
  const { event } = route.params;
  const { isDarkMode, user } = useAuth();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [linkOpened, setLinkOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleProceedToRegistration = async () => {
    const link = event.registrationLink || 'https://dummy-link.com/register';
    try {
      await Linking.openURL(link);
      setLinkOpened(true);
    } catch (error) {
      Alert.alert('Error', 'Could not open registration link');
    }
  };

  const handleCompleteRegistration = async () => {
    if (!user?.uid) {
      Alert.alert('Error', 'Please login to register');
      return;
    }

    setLoading(true);
    try {
      const result = await registerForEvent(user.uid, event);
      
      if (result.success) {
        Alert.alert(
          'Registration Successful!',
          'You have been registered for this event.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else if (result.alreadyRegistered) {
        Alert.alert('Already Registered', 'You are already registered for this event.', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else if (result.error) {
        Alert.alert('Registration Failed', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={isDarkMode ? ['#0F172A', '#1E293B'] : ['#FFFFFF', '#F8FAFC']}
        style={styles.gradient}
      >
        <View style={[styles.header, { backgroundColor: theme.surface }, shadows.sm]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Event Registration</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.eventCard, { backgroundColor: theme.surface }, shadows.md]}>
            <View style={[styles.eventColorBar, { backgroundColor: event.color }]} />
            
            <View style={styles.eventContent}>
              <View style={[styles.eventIcon, { backgroundColor: event.color + '20' }]}>
                <Ionicons name={event.icon} size={32} color={event.color} />
              </View>

              <Text style={[styles.eventTitle, { color: theme.text }]}>{event.title}</Text>

              <View style={styles.eventDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
                  <Text style={[styles.detailText, { color: theme.textSecondary }]}>{event.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={20} color={theme.textSecondary} />
                  <Text style={[styles.detailText, { color: theme.textSecondary }]}>{event.time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={20} color={theme.textSecondary} />
                  <Text style={[styles.detailText, { color: theme.textSecondary }]}>{event.location}</Text>
                </View>
              </View>

              {event.description && (
                <View style={styles.descriptionContainer}>
                  <Text style={[styles.descriptionLabel, { color: theme.text }]}>Description</Text>
                  <Text style={[styles.descriptionText, { color: theme.textSecondary }]}>
                    {event.description}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.proceedButton, { backgroundColor: theme.primary }, shadows.md]}
            onPress={handleProceedToRegistration}
          >
            <Ionicons name="open-outline" size={20} color="#FFFFFF" />
            <Text style={styles.proceedButtonText}>Proceed to Registration</Text>
          </TouchableOpacity>

          {linkOpened && (
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: '#10B981' }, shadows.md]}
              onPress={handleCompleteRegistration}
              disabled={loading}
            >
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={styles.confirmButtonText}>
                {loading ? 'Saving...' : 'I Have Completed Registration'}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xxl + 20,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: { ...typography.h3 },
  content: { flex: 1, padding: spacing.lg },
  eventCard: { borderRadius: borderRadius.xl, overflow: 'hidden', marginBottom: spacing.lg },
  eventColorBar: { height: 4 },
  eventContent: { padding: spacing.lg },
  eventIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  eventTitle: { ...typography.h2, marginBottom: spacing.lg },
  eventDetails: { gap: spacing.md, marginBottom: spacing.lg },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  detailText: { ...typography.bodyLarge },
  descriptionContainer: { marginTop: spacing.md },
  descriptionLabel: { ...typography.h4, marginBottom: spacing.sm },
  descriptionText: { ...typography.body, lineHeight: 24 },
  proceedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  proceedButtonText: { ...typography.bodyLarge, color: '#FFFFFF', fontWeight: '600' },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  confirmButtonText: { ...typography.bodyLarge, color: '#FFFFFF', fontWeight: '600' },
});

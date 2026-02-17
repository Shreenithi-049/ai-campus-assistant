import React, { useState } from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme, darkTheme, spacing, typography, borderRadius, shadows } from '../constants/modernTheme';

export default function HelpScreen({ navigation }) {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;

  const sections = [
    {
      title: 'What is IntelliCamp?',
      icon: 'information-circle',
      content: 'IntelliCamp is your AI-powered campus companion designed to simplify academic life, provide instant campus assistance, and keep you updated with essential academic and campus information. It serves as your one-stop solution for all campus-related queries and activities.',
    },
    {
      title: 'How to Use Chat (Ask Assistant)',
      icon: 'chatbubble-ellipses',
      content: '1. Navigate to the "Ask Assistant" tab from the bottom navigation\n2. Type your question in the input field or select from quick suggestions\n3. Get instant AI-powered responses to your campus queries\n4. Use natural language - ask questions as you would to a friend\n5. The AI can help with directions, schedules, faculty info, and more',
    },
    {
      title: 'How to Use Academic Info',
      icon: 'book',
      content: '1. Tap on "Academic Info" from the bottom navigation\n2. View your timetable with class schedules and room numbers\n3. Browse the faculty directory for contact information\n4. Check syllabus progress and completed topics\n5. Access the calendar to manage academic events\n6. All information is personalized to your profile',
    },
    {
      title: 'How to Use Calendar',
      icon: 'calendar',
      content: '1. Go to Academic Info → Calendar tab\n2. View your monthly calendar with highlighted event dates\n3. Tap "Add Event" to create new academic events\n4. Fill in event details: title, description, date, and reminder time\n5. Set reminders to get notified before important events\n6. View all your upcoming events in the list below the calendar',
    },
    {
      title: 'Notifications',
      icon: 'notifications',
      content: 'Enable push notifications in your profile settings to receive:\n• Upcoming class reminders\n• Event notifications\n• Important campus announcements\n• Academic deadline alerts\n\nManage notification preferences from Profile → Push Notifications toggle',
    },
    {
      title: 'How to Update Profile',
      icon: 'person',
      content: '1. Go to the Profile tab from bottom navigation\n2. Tap "Edit Profile" from the menu\n3. Update your information:\n   • Full Name\n   • Student ID\n   • Year and Semester\n   • Date of Birth\n   • Department\n   • Phone Number\n   • Gender\n   • Blood Group\n   • Emergency Contact\n4. Tap "Save Changes" to update your profile\n5. Changes reflect immediately across the app',
    },
    {
      title: 'Security',
      icon: 'shield-checkmark',
      content: 'Your account is protected with:\n• Email verification for account security\n• Secure password authentication\n• 24-hour auto-logout for inactive sessions\n• Encrypted data transmission\n\nChange your password anytime from Profile → Security\nVerify your email to enable all features',
    },
    {
      title: 'Campus Map',
      icon: 'map',
      content: '1. Navigate to the Map tab\n2. View the interactive campus map with building markers\n3. Tap on any building marker to see details\n4. Use "Get Directions" for navigation assistance\n5. Ask the AI assistant for specific location queries',
    },
    {
      title: 'Events',
      icon: 'calendar-outline',
      content: '1. Go to the Events tab\n2. Filter events by category: All, Academic, Cultural, Sports\n3. View event details including date, time, and location\n4. Register for events directly from the app\n5. Enable event notifications to stay updated',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={isDark ? ['#0F172A', '#1E293B'] : ['#FFFFFF', '#F8FAFC']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.surface }, shadows.sm]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Help & Support</Text>
          <TouchableOpacity onPress={() => setIsDark(!isDark)}>
            <Ionicons name={isDark ? 'sunny' : 'moon'} size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={[styles.mainTitle, { color: theme.text }]}>IntelliCamp User Manual</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Everything you need to know about using IntelliCamp
          </Text>

          {sections.map((section, index) => (
            <View key={index} style={[styles.section, { backgroundColor: theme.surface }, shadows.sm]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
                  <Ionicons name={section.icon} size={24} color={theme.primary} />
                </View>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>{section.title}</Text>
              </View>
              <Text style={[styles.sectionText, { color: theme.textSecondary }]}>
                {section.content}
              </Text>
            </View>
          ))}

          <View style={[styles.footer, { backgroundColor: theme.surface }, shadows.sm]}>
            <Ionicons name="help-circle" size={32} color={theme.primary} />
            <Text style={[styles.footerTitle, { color: theme.text }]}>Need More Help?</Text>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              Contact your campus IT support or use the Ask Assistant feature for instant help.
            </Text>
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
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  mainTitle: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    marginBottom: spacing.xl,
  },
  section: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.h4,
    flex: 1,
  },
  sectionText: {
    ...typography.body,
    lineHeight: 24,
  },
  footer: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  footerTitle: {
    ...typography.h3,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  footerText: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 22,
  },
});

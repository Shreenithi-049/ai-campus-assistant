import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../components/Card";
import { Colors, Typography, Spacing, BorderRadius } from "../../constants/theme";

const HomeScreen = ({ navigation }) => {
  const menuItems = [
    {
      id: "chat",
      title: "AI Chatbot",
      description: "Get instant answers to your questions",
      icon: "💬",
      route: "Chat",
      color: Colors.accent,
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "View campus updates and announcements",
      icon: "🔔",
      route: "Notifications",
      color: Colors.alert,
    },
    {
      id: "profile",
      title: "Profile",
      description: "Manage your account settings",
      icon: "👤",
      route: "Profile",
      color: Colors.primary,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome!</Text>
          <Text style={styles.subtitle}>
            Your AI-powered campus assistant is ready to help
          </Text>
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <Card
              key={item.id}
              style={styles.menuCard}
              onPress={() => navigation.navigate(item.route)}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </Card>
          ))}
        </View>

        <View style={styles.quickInfo}>
          <Card style={styles.infoCard}>
            <Text style={styles.infoTitle}>Quick Tips</Text>
            <Text style={styles.infoText}>
              • Ask the AI chatbot about campus facilities, events, or academic
              information
            </Text>
            <Text style={styles.infoText}>
              • Check notifications regularly for important updates
            </Text>
            <Text style={styles.infoText}>
              • Keep your profile updated for better assistance
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  header: {
    marginBottom: Spacing.lg,
    paddingTop: Spacing.md,
  },
  greeting: {
    ...Typography.h1,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  menuGrid: {
    marginBottom: Spacing.lg,
  },
  menuCard: {
    marginBottom: Spacing.md,
    padding: Spacing.lg,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  icon: {
    fontSize: 28,
  },
  menuTitle: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  menuDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  quickInfo: {
    marginTop: Spacing.sm,
  },
  infoCard: {
    padding: Spacing.md,
  },
  infoTitle: {
    ...Typography.h3,
    marginBottom: Spacing.sm,
  },
  infoText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
});

export default HomeScreen;


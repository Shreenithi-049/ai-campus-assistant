import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { lightTheme, darkTheme, spacing, typography, borderRadius, shadows } from '../constants/modernTheme';
import { useAuth } from '../contexts/AuthContext';

export default function ModernMapScreen({ navigation }) {
  const { isDarkMode, toggleDarkMode } = useAuth();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const buildings = [
    { id: 1, name: 'Main Library', code: 'LIB', x: 30, y: 40, color: '#3B82F6', description: 'Central library with study rooms' },
    { id: 2, name: 'Engineering Block', code: 'ENG', x: 60, y: 30, color: '#10B981', description: 'Computer labs and lecture halls' },
    { id: 3, name: 'Science Building', code: 'SCI', x: 50, y: 60, color: '#8B5CF6', description: 'Research labs and classrooms' },
    { id: 4, name: 'Student Center', code: 'SC', x: 70, y: 50, color: '#F59E0B', description: 'Cafeteria and recreation' },
    { id: 5, name: 'Admin Block', code: 'ADM', x: 40, y: 70, color: '#EF4444', description: 'Administrative offices' },
  ];

  const handleMarkerPress = (building) => {
    setSelectedBuilding(building);
    setShowModal(true);
  };

  const handleGetDirections = () => {
    setShowModal(false);
    navigation.navigate('Chat', { 
      query: `How do I get to ${selectedBuilding?.name}?` 
    });
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
          <Text style={[styles.headerTitle, { color: theme.text }]}>Campus Map</Text>
          <TouchableOpacity onPress={toggleDarkMode}>
            <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Map Container */}
          <Animated.View 
            entering={FadeIn}
            style={[styles.mapContainer, { backgroundColor: theme.surface }, shadows.lg]}
          >
            <View style={styles.mapCanvas}>
              {/* Campus paths */}
              <View style={[styles.path, styles.pathHorizontal, { backgroundColor: theme.border }]} />
              <View style={[styles.path, styles.pathVertical, { backgroundColor: theme.border }]} />

              {/* Building markers */}
              {buildings.map((building, index) => (
                <Animated.View
                  key={building.id}
                  entering={FadeIn.delay(index * 100)}
                  style={[
                    styles.marker,
                    { 
                      left: `${building.x}%`, 
                      top: `${building.y}%`,
                    }
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.markerButton,
                      { backgroundColor: building.color },
                      shadows.md
                    ]}
                    onPress={() => handleMarkerPress(building)}
                  >
                    <Text style={styles.markerText}>{building.code}</Text>
                  </TouchableOpacity>
                  <View style={[styles.markerPin, { backgroundColor: building.color }]} />
                </Animated.View>
              ))}

              {/* Current location */}
              <View style={[styles.currentLocation, { left: '45%', top: '45%' }]}>
                <View style={[styles.currentDot, { backgroundColor: theme.primary }]}>
                  <View style={styles.currentPulse} />
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Buildings List */}
          <View style={styles.buildingsList}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Campus Buildings</Text>
            {buildings.map((building, index) => (
              <Animated.View
                key={building.id}
                entering={SlideInDown.delay(300 + index * 100)}
              >
                <TouchableOpacity
                  style={[styles.buildingCard, { backgroundColor: theme.surface }, shadows.sm]}
                  onPress={() => handleMarkerPress(building)}
                >
                  <View style={[styles.buildingIcon, { backgroundColor: building.color + '20' }]}>
                    <Ionicons name="business" size={24} color={building.color} />
                  </View>
                  <View style={styles.buildingInfo}>
                    <Text style={[styles.buildingName, { color: theme.text }]}>
                      {building.name}
                    </Text>
                    <Text style={[styles.buildingDesc, { color: theme.textSecondary }]}>
                      {building.description}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </ScrollView>

        {/* Building Info Modal */}
        <Modal
          visible={showModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <Animated.View 
              entering={SlideInDown}
              style={[styles.modalContent, { backgroundColor: theme.surface }]}
            >
              <View style={styles.modalHeader}>
                <View style={[
                  styles.modalIcon,
                  { backgroundColor: selectedBuilding?.color + '20' }
                ]}>
                  <Ionicons name="business" size={32} color={selectedBuilding?.color} />
                </View>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowModal(false)}
                >
                  <Ionicons name="close" size={24} color={theme.text} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {selectedBuilding?.name}
              </Text>
              <Text style={[styles.modalCode, { color: theme.textSecondary }]}>
                Building Code: {selectedBuilding?.code}
              </Text>
              <Text style={[styles.modalDesc, { color: theme.textSecondary }]}>
                {selectedBuilding?.description}
              </Text>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: theme.primary }, shadows.md]}
                  onPress={handleGetDirections}
                >
                  <Ionicons name="navigate" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Get Directions</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: theme.accent }, shadows.md]}
                  onPress={() => {
                    setShowModal(false);
                    navigation.navigate('Chat', { 
                      query: `Tell me about ${selectedBuilding?.name}` 
                    });
                  }}
                >
                  <Ionicons name="information-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Ask Assistant</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
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
  mapContainer: {
    height: 400,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  mapCanvas: {
    flex: 1,
    position: 'relative',
  },
  path: {
    position: 'absolute',
  },
  pathHorizontal: {
    width: '80%',
    height: 4,
    top: '50%',
    left: '10%',
  },
  pathVertical: {
    width: 4,
    height: '80%',
    left: '50%',
    top: '10%',
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerText: {
    ...typography.captionMedium,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  markerPin: {
    width: 4,
    height: 12,
    marginTop: -2,
  },
  currentLocation: {
    position: 'absolute',
  },
  currentDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentPulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  buildingsList: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  buildingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  buildingIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  buildingInfo: {
    flex: 1,
  },
  buildingName: {
    ...typography.bodyMedium,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  buildingDesc: {
    ...typography.small,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    padding: spacing.sm,
  },
  modalTitle: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  modalCode: {
    ...typography.body,
    marginBottom: spacing.sm,
  },
  modalDesc: {
    ...typography.body,
    marginBottom: spacing.xl,
  },
  modalActions: {
    gap: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  actionButtonText: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

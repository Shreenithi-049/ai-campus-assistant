import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { lightTheme, darkTheme, spacing, typography, borderRadius, shadows } from '../constants/modernTheme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const BottomNavigation = ({ state, descriptors, navigation, isDark = false }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const theme = isDark ? darkTheme : lightTheme;

  const tabs = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home', label: 'Home' },
    { name: 'Chat', icon: 'chatbubble-ellipses-outline', activeIcon: 'chatbubble-ellipses', label: 'Ask Assistant' },
    { name: 'Map', icon: 'map-outline', activeIcon: 'map', label: 'Campus Map' },
    { name: 'Academic', icon: 'book-outline', activeIcon: 'book', label: 'Academic Info' },
    { name: 'Events', icon: 'calendar-outline', activeIcon: 'calendar', label: 'Events' },
    { name: 'Profile', icon: 'person-outline', activeIcon: 'person', label: 'Profile' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }, shadows.lg]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const isHovered = hoveredIndex === index;
        const tab = tabs[index];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const animatedStyle = useAnimatedStyle(() => ({
          transform: [{ scale: withSpring(isHovered && Platform.OS === 'web' ? 1.1 : 1) }],
        }));

        return (
          <AnimatedTouchable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            onMouseEnter={() => Platform.OS === 'web' && setHoveredIndex(index)}
            onMouseLeave={() => Platform.OS === 'web' && setHoveredIndex(null)}
            style={[styles.tab, animatedStyle]}
          >
            <View style={[
              styles.tabContent,
              isFocused && { backgroundColor: theme.activeBackground },
              isHovered && !isFocused && { backgroundColor: theme.hoverBackground },
            ]}>
              <Ionicons
                name={isFocused ? tab.activeIcon : tab.icon}
                size={24}
                color={isFocused ? theme.primary : theme.textSecondary}
              />
              {(isFocused || isHovered) && (
                <Text style={[styles.label, { color: theme.primary }]}>
                  {tab.label}
                </Text>
              )}
            </View>
          </AnimatedTouchable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
    transition: 'all 0.2s ease',
  },
  label: {
    ...typography.captionMedium,
    fontWeight: '600',
  },
});

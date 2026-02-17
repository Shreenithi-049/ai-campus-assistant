import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { lightTheme, darkTheme, borderRadius, typography, shadows } from '../constants/modernTheme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const ModernButton = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  loading = false,
  disabled = false,
  isDark = false,
  style 
}) => {
  const scale = useSharedValue(1);
  const theme = isDark ? darkTheme : lightTheme;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const getButtonStyle = () => {
    const base = [styles.button, styles[size]];
    if (variant === 'primary') {
      return [...base, { backgroundColor: theme.primary }, shadows.md];
    } else if (variant === 'secondary') {
      return [...base, { backgroundColor: theme.accent }, shadows.md];
    } else if (variant === 'outline') {
      return [...base, { backgroundColor: 'transparent', borderWidth: 2, borderColor: theme.primary }];
    } else if (variant === 'glass') {
      return [...base, { backgroundColor: theme.glassBackground, borderWidth: 1, borderColor: theme.glassBorder }];
    }
    return base;
  };

  const getTextStyle = () => {
    if (variant === 'outline') {
      return { color: theme.primary };
    } else if (variant === 'glass') {
      return { color: theme.text };
    }
    return { color: '#FFFFFF' };
  };

  return (
    <AnimatedTouchable
      style={[getButtonStyle(), animatedStyle, disabled && styles.disabled, style]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'glass' ? theme.primary : '#FFFFFF'} />
      ) : (
        <Text style={[styles.text, getTextStyle()]}>{title}</Text>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  text: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

export const GlassCard = ({ children, style, intensity = 20, isDark = false }) => {
  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={intensity} tint={isDark ? 'dark' : 'light'} style={styles.blur}>
        {children}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  blur: {
    padding: 16,
  },
});

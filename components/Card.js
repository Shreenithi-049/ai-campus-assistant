import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors, BorderRadius, Shadows, Spacing } from "../constants/theme";

const Card = ({ children, style, onPress, disabled = false }) => {
  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[styles.card, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {children}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.card,
  },
});

export default Card;


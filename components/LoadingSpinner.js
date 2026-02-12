import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Colors } from "../constants/theme";

const LoadingSpinner = ({ size = "large", color = Colors.accent, style }) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingSpinner;


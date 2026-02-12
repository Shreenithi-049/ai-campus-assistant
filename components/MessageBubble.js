import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Typography, BorderRadius, Spacing } from "../constants/theme";

const MessageBubble = ({ message, isUser = false }) => {
  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          isUser ? styles.userText : styles.botText,
        ]}
      >
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: "80%",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginVertical: Spacing.xs,
  },
  userBubble: {
    backgroundColor: Colors.accent,
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: Colors.lightGrey,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    ...Typography.body,
    lineHeight: 20,
  },
  userText: {
    color: Colors.white,
  },
  botText: {
    color: Colors.text,
  },
});

export default MessageBubble;


import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { lightTheme, darkTheme, spacing, typography, borderRadius, shadows } from '../constants/modernTheme';
import { useAuth } from '../contexts/AuthContext';

export default function ModernChatScreen({ navigation, route }) {
  const { isDarkMode, toggleDarkMode } = useAuth();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I\'m your CampusAI assistant. How can I help you today?', isAI: true, timestamp: new Date() },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  const suggestionChips = [
    'Where is library?',
    'Exam schedule',
    'Faculty directory',
    'Campus events',
  ];

  const smartSuggestions = [
    'What are the library hours?',
    'Show me the campus map',
    'When is my next class?',
  ];

  useEffect(() => {
    if (route.params?.query) {
      handleSend(route.params.query);
    }
  }, [route.params?.query]);

  const handleSend = (text = inputText) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      isAI: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: 'I can help you with that! Let me find the information you need.',
        isAI: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const renderMessage = ({ item, index }) => {
    const isAI = item.isAI;
    return (
      <Animated.View
        entering={isAI ? FadeInLeft.delay(index * 100) : FadeInRight.delay(index * 100)}
        style={[styles.messageContainer, isAI ? styles.aiMessage : styles.userMessage]}
      >
        {isAI && (
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Ionicons name="sparkles" size={16} color="#FFFFFF" />
          </View>
        )}
        <View style={[
          styles.messageBubble,
          isAI 
            ? { backgroundColor: theme.surface } 
            : { backgroundColor: theme.primary },
          shadows.sm
        ]}>
          <Text style={[
            styles.messageText,
            { color: isAI ? theme.text : '#FFFFFF' }
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.timestamp,
            { color: isAI ? theme.textTertiary : 'rgba(255,255,255,0.7)' }
          ]}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {!isAI && (
          <View style={[styles.avatar, { backgroundColor: theme.accent }]}>
            <Ionicons name="person" size={16} color="#FFFFFF" />
          </View>
        )}
      </Animated.View>
    );
  };

  const TypingIndicator = () => (
    <Animated.View entering={FadeInLeft} style={styles.typingContainer}>
      <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
        <Ionicons name="sparkles" size={16} color="#FFFFFF" />
      </View>
      <View style={[styles.typingBubble, { backgroundColor: theme.surface }, shadows.sm]}>
        <View style={styles.typingDots}>
          <View style={[styles.dot, { backgroundColor: theme.textSecondary }]} />
          <View style={[styles.dot, { backgroundColor: theme.textSecondary }]} />
          <View style={[styles.dot, { backgroundColor: theme.textSecondary }]} />
        </View>
      </View>
    </Animated.View>
  );

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
          <View style={styles.headerCenter}>
            <View style={[styles.aiAvatar, { backgroundColor: theme.primary }]}>
              <Ionicons name="sparkles" size={20} color="#FFFFFF" />
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: theme.text }]}>CampusAI</Text>
              <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                Always here to help
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={toggleDarkMode}>
            <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        />

        {/* Suggestion Chips */}
        <View style={styles.suggestionsContainer}>
          <Text style={[styles.suggestionsTitle, { color: theme.textSecondary }]}>
            Quick suggestions:
          </Text>
          <View style={styles.chipsRow}>
            {suggestionChips.map((chip, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.chip, { backgroundColor: theme.surface }, shadows.sm]}
                onPress={() => handleSend(chip)}
              >
                <Text style={[styles.chipText, { color: theme.text }]}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Smart Suggestions Panel */}
        {messages.length > 2 && (
          <View style={[styles.smartSuggestions, { backgroundColor: theme.surface }]}>
            <View style={styles.smartHeader}>
              <Ionicons name="bulb" size={16} color={theme.accent} />
              <Text style={[styles.smartTitle, { color: theme.textSecondary }]}>
                You might also want to ask:
              </Text>
            </View>
            {smartSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.smartItem}
                onPress={() => handleSend(suggestion)}
              >
                <Text style={[styles.smartText, { color: theme.primary }]}>
                  {suggestion}
                </Text>
                <Ionicons name="arrow-forward" size={16} color={theme.primary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={[styles.inputContainer, { backgroundColor: theme.surface }, shadows.lg]}>
            <View style={[styles.inputWrapper, { backgroundColor: theme.glassBackground }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask me anything..."
                placeholderTextColor={theme.textTertiary}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { backgroundColor: inputText.trim() ? theme.primary : theme.border }
                ]}
                onPress={() => handleSend()}
                disabled={!inputText.trim()}
              >
                <Ionicons name="send" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: spacing.md,
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  headerTitle: {
    ...typography.h4,
  },
  headerSubtitle: {
    ...typography.caption,
  },
  messagesList: {
    padding: spacing.lg,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.sm,
  },
  messageText: {
    ...typography.body,
    marginBottom: spacing.xs,
  },
  timestamp: {
    ...typography.caption,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  typingBubble: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginLeft: spacing.sm,
  },
  typingDots: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  suggestionsContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  suggestionsTitle: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  chipText: {
    ...typography.small,
  },
  smartSuggestions: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  smartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  smartTitle: {
    ...typography.caption,
  },
  smartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  smartText: {
    ...typography.small,
  },
  inputContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    maxHeight: 100,
    paddingVertical: spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
});

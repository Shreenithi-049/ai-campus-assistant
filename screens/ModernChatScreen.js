import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { lightTheme, darkTheme, spacing, typography, borderRadius, shadows } from '../constants/modernTheme';
import { useAuth } from '../contexts/AuthContext';
import { buildAIContext } from '../services/aiContextService';
import { sendMessageToAI } from '../services/geminiService';
import { saveMessage, getUserChatHistory } from '../services/chatHistoryService';
import { auth } from '../services/firebaseConfig';

const MessageBubble = React.memo(({ item, theme }) => {
  const isAI = item.isAI;
  return (
    <Animated.View
      entering={isAI ? FadeInLeft : FadeInRight}
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
});

const TypingIndicator = React.memo(({ theme }) => (
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
));

export default function ModernChatScreen({ navigation, route }) {
  const { isDarkMode, toggleDarkMode, userProfile } = useAuth();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef(null);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Handle query from route params
  useEffect(() => {
    if (route.params?.query && !isLoading) {
      handleSend(route.params.query);
    }
  }, [route.params?.query, isLoading]);

  const loadChatHistory = async () => {
    try {
      const userId = auth.currentUser?.uid;
      console.log('🔍 DEBUG: Loading chat for userId:', userId);
      
      if (!userId) {
        console.log('❌ DEBUG: No userId found');
        setIsLoading(false);
        return;
      }

      console.log('📡 DEBUG: Fetching chat history from Firestore...');
      const history = await getUserChatHistory(userId);
      console.log('📜 DEBUG: Loaded messages count:', history.length);
      console.log('📜 DEBUG: Messages:', history);
      
      if (history.length === 0) {
        // Create and save welcome message
        console.log('💾 DEBUG: No history found, creating welcome message');
        const welcomeMsg = 'Hello! I\'m your CampusAI assistant. How can I help you today?';
        await saveMessage(userId, welcomeMsg, 'bot');
        console.log('✅ DEBUG: Welcome message saved');
        
        setMessages([{
          id: 'welcome',
          text: welcomeMsg,
          isAI: true,
          timestamp: new Date(),
        }]);
      } else {
        console.log('✅ DEBUG: Setting messages from history');
        setMessages(history);
      }
    } catch (error) {
      console.error('❌ DEBUG: Error loading chat history:', error);
      console.error('❌ DEBUG: Error details:', error.message);
      Alert.alert('Error', 'Failed to load chat history: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = useCallback(async (text = inputText) => {
    if (!text.trim() || isSending) return;

    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to send messages');
      return;
    }

    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      isAI: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setIsSending(true);

    try {
      // Save user message to Firestore
      console.log('💾 DEBUG: Saving user message:', text.trim());
      await saveMessage(userId, text.trim(), 'user');
      console.log('✅ DEBUG: User message saved');

      // Get AI response
      const context = await buildAIContext(userProfile);
      const result = await sendMessageToAI(text.trim(), context);

      const aiResponseText = result.success 
        ? result.response 
        : "Sorry, I'm having trouble connecting right now. Please try again.";

      const aiResponse = {
        id: Date.now() + 1,
        text: aiResponseText,
        isAI: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);

      // Save AI response to Firestore
      console.log('💾 DEBUG: Saving AI response');
      await saveMessage(userId, aiResponseText, 'bot');
      console.log('✅ DEBUG: AI response saved');
    } catch (error) {
      console.error('Chat error:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again.",
        isAI: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsTyping(false);
      setIsSending(false);
    }
  }, [inputText, isSending, userProfile]);

  const renderMessage = useCallback(({ item }) => (
    <MessageBubble item={item} theme={theme} />
  ), [theme]);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

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

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading chat history...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            ListFooterComponent={isTyping ? <TypingIndicator theme={theme} /> : null}
          />
        )}
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
                  { backgroundColor: (inputText.trim() && !isSending) ? theme.primary : theme.border }
                ]}
                onPress={() => handleSend()}
                disabled={!inputText.trim() || isSending}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    marginTop: spacing.md,
  },
});

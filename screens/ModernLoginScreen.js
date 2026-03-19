import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, Image, ActivityIndicator, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme, darkTheme, spacing, typography } from '../constants/modernTheme';
import { useAuth } from '../contexts/AuthContext';
import { validateCollegeEmail } from '../utils/validators';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isLargeScreen = width >= 768;

export default function ModernLoginScreen({ navigation }) {
  const [isDark, setIsDark] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = isDark ? darkTheme : lightTheme;
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    const emailValidation = validateCollegeEmail(email.trim());
    if (!emailValidation.isValid) {
      setError(emailValidation.error);
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(email.trim(), password);

    setLoading(false);

    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.splitContainer}>
        {/* Left Side - Hero Section */}
        {isWeb && isLargeScreen && (
          <View style={styles.heroSection}>
            <LinearGradient
              colors={['#1E3A8A', '#1E40AF', '#2563EB']}
              style={styles.heroGradient}
            >
              <View style={styles.heroOverlay}>
                <View style={styles.heroContent}>
                  <Ionicons name="school" size={80} color="#FFFFFF" style={styles.heroIcon} />
                  <Text style={styles.heroTitle}>Welcome to IntelliCamp</Text>
                  <Text style={styles.heroSubtitle}>Your Smart AI Campus Assistant</Text>
                  <View style={styles.heroFeatures}>
                    <View style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                      <Text style={styles.featureText}>AI-Powered Assistance</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                      <Text style={styles.featureText}>Campus Navigation</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                      <Text style={styles.featureText}>Academic Resources</Text>
                    </View>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Right Side - Form Section */}
        <View style={[styles.formSection, isWeb && isLargeScreen && styles.formSectionSplit]}>
          <LinearGradient
            colors={isDark ? ['#0F172A', '#1E293B'] : ['#EEF2FF', '#F5F3FF']}
            style={styles.gradient}
          >
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.content}
            >
              <View style={styles.contentWrapper}>
                <View style={styles.header}>
                  <View style={styles.logoContainer}>
                    <Image 
                      source={require('../assets/IntelliCamp_logo-removebg-preview.png')} 
                      style={styles.logoImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={[styles.title, { color: theme.text }]}>Welcome Back</Text>
                  <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Sign in to continue to IntelliCamp
                  </Text>
                </View>

                <View style={[styles.formCard, { backgroundColor: theme.surface }]}>
                  {error ? (
                    <View style={styles.errorContainer}>
                      <Ionicons name="alert-circle" size={20} color="#EF4444" />
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  ) : null}

                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: theme.text }]}>Email</Text>
                    <View style={[styles.input, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
                      <Ionicons name="mail-outline" size={20} color={theme.textSecondary} />
                      <TextInput
                        style={[styles.textInput, { color: theme.text }]}
                        placeholder="your.email@skcet.ac.in"
                        placeholderTextColor={theme.textTertiary}
                        value={email}
                        onChangeText={(text) => {
                          setEmail(text);
                          setError('');
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                      />
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: theme.text }]}>Password</Text>
                    <View style={[styles.input, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
                      <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} />
                      <TextInput
                        style={[styles.textInput, { color: theme.text }]}
                        placeholder="Enter your password"
                        placeholderTextColor={theme.textTertiary}
                        value={password}
                        onChangeText={(text) => {
                          setPassword(text);
                          setError('');
                        }}
                        secureTextEntry={!showPassword}
                        editable={!loading}
                      />
                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={loading}>
                        <Ionicons 
                          name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                          size={20} 
                          color={theme.textSecondary} 
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity 
                    style={[styles.button, { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }]}
                    onPress={handleLogin}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.buttonText}>Sign In</Text>
                    )}
                  </TouchableOpacity>

                  <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: theme.textSecondary }]}>
                      Don't have an account?{' '}
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')} disabled={loading}>
                      <Text style={[styles.linkText, { color: theme.primary }]}>Sign Up</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splitContainer: {
    flex: 1,
    flexDirection: isWeb && isLargeScreen ? 'row' : 'column',
  },
  heroSection: {
    flex: 1,
    minHeight: isWeb ? '100vh' : '100%',
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroOverlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 500,
  },
  heroIcon: {
    marginBottom: spacing.xl,
    opacity: 0.95,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 20,
    color: '#E0E7FF',
    textAlign: 'center',
    marginBottom: spacing.xxl,
    lineHeight: 28,
  },
  heroFeatures: {
    width: '100%',
    marginTop: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  featureText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  formSection: {
    flex: 1,
  },
  formSectionSplit: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 450,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing.lg,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
  },
  formCard: {
    borderRadius: 20,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  errorText: {
    ...typography.small,
    color: '#DC2626',
    flex: 1,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.smallMedium,
    marginBottom: spacing.sm,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    gap: spacing.sm,
  },
  textInput: {
    ...typography.body,
    flex: 1,
    paddingVertical: 0,
  },
  button: {
    padding: spacing.md + 2,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.lg,
    minHeight: 52,
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  footerText: {
    ...typography.body,
  },
  linkText: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
});

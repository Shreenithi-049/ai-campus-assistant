import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, ActivityIndicator, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme, darkTheme, spacing, typography } from '../constants/modernTheme';
import { validateCollegeEmail, validatePassword } from '../utils/validators';
import { registerStudent } from '../services/authService';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isLargeScreen = width >= 768;

export default function ModernSignupScreen({ navigation }) {
  const [isDark, setIsDark] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = isDark ? darkTheme : lightTheme;

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !studentId.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    const emailValidation = validateCollegeEmail(email.trim());
    if (!emailValidation.isValid) {
      setError(emailValidation.error);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError('Password must be at least 8 characters with uppercase, lowercase, number, and special character.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await registerStudent(email.trim(), password, {
        fullName: name.trim(),
        studentId: studentId.trim(),
      });
      
      navigation.replace('Login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
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
                  <Text style={styles.heroTitle}>Join IntelliCamp</Text>
                  <Text style={styles.heroSubtitle}>Start your smart campus journey today</Text>
                  <View style={styles.heroFeatures}>
                    <View style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                      <Text style={styles.featureText}>Instant AI Assistance</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                      <Text style={styles.featureText}>Campus Events & Updates</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                      <Text style={styles.featureText}>Academic Management</Text>
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
              style={styles.keyboardView}
            >
              <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.contentWrapper}>
                  <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                      Join IntelliCamp and start your smart campus journey
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
                      <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
                      <View style={[styles.input, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
                        <Ionicons name="person-outline" size={20} color={theme.textSecondary} />
                        <TextInput
                          style={[styles.textInput, { color: theme.text }]}
                          placeholder="Enter your full name"
                          placeholderTextColor={theme.textTertiary}
                          value={name}
                          onChangeText={setName}
                        />
                      </View>
                    </View>

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
                        />
                      </View>
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={[styles.label, { color: theme.text }]}>Student ID</Text>
                      <View style={[styles.input, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
                        <Ionicons name="card-outline" size={20} color={theme.textSecondary} />
                        <TextInput
                          style={[styles.textInput, { color: theme.text }]}
                          placeholder="Enter your student ID"
                          placeholderTextColor={theme.textTertiary}
                          value={studentId}
                          onChangeText={setStudentId}
                        />
                      </View>
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={[styles.label, { color: theme.text }]}>Password</Text>
                      <View style={[styles.input, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
                        <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} />
                        <TextInput
                          style={[styles.textInput, { color: theme.text }]}
                          placeholder="Create a strong password"
                          placeholderTextColor={theme.textTertiary}
                          value={password}
                          onChangeText={(text) => {
                            setPassword(text);
                            setError('');
                          }}
                          secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                          <Ionicons 
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                            size={20} 
                            color={theme.textSecondary} 
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={[styles.label, { color: theme.text }]}>Confirm Password</Text>
                      <View style={[styles.input, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
                        <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} />
                        <TextInput
                          style={[styles.textInput, { color: theme.text }]}
                          placeholder="Re-enter your password"
                          placeholderTextColor={theme.textTertiary}
                          value={confirmPassword}
                          onChangeText={(text) => {
                            setConfirmPassword(text);
                            setError('');
                          }}
                          secureTextEntry={!showConfirmPassword}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                          <Ionicons 
                            name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                            size={20} 
                            color={theme.textSecondary} 
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <TouchableOpacity 
                      style={[styles.button, { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }]}
                      onPress={handleSignup}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Text style={styles.buttonText}>Create Account</Text>
                      )}
                    </TouchableOpacity>
                  </View>

                  <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: theme.textSecondary }]}>
                      Already have an account?{' '}
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                      <Text style={[styles.linkText, { color: theme.primary }]}>Sign In</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: spacing.xxl + 20,
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 450,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
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
});

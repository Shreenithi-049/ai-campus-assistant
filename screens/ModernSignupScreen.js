import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme, darkTheme, spacing, typography } from '../constants/modernTheme';
import { validateCollegeEmail, validatePassword } from '../utils/validators';
import { registerStudent } from '../services/authService';

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
    // Validate all fields
    if (!name.trim() || !email.trim() || !studentId.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    // Validate college email domain
    const emailValidation = validateCollegeEmail(email.trim());
    if (!emailValidation.isValid) {
      setError(emailValidation.error);
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Validate password strength
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
      
      // Navigate to login on success
      navigation.replace('Login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
          </ScrollView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: spacing.xxl + 20,
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
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.md,
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
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.md,
    minHeight: 48,
    justifyContent: 'center',
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

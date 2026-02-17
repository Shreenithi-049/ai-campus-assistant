import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { lightTheme, darkTheme, spacing, typography, borderRadius, shadows } from '../constants/modernTheme';

export default function EditProfileScreen({ navigation }) {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    year: '',
    semester: '',
    dateOfBirth: '',
    department: '',
    phoneNumber: '',
    gender: '',
    bloodGroup: '',
    emergencyContact: '',
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.fullName || '',
        studentId: userProfile.studentId || '',
        year: userProfile.year || '',
        semester: userProfile.semester || '',
        dateOfBirth: userProfile.dateOfBirth || '',
        department: userProfile.department || '',
        phoneNumber: userProfile.phoneNumber || '',
        gender: userProfile.gender || '',
        bloodGroup: userProfile.bloodGroup || '',
        emergencyContact: userProfile.emergencyContact || '',
      });
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Error', 'Full name is required');
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'students', user.uid);
      await updateDoc(userRef, {
        ...formData,
        updatedAt: serverTimestamp(),
      });
      
      await refreshUserProfile();
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, field, placeholder, keyboardType = 'default') => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <View style={[styles.input, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
        <TextInput
          style={[styles.textInput, { color: theme.text }]}
          value={formData[field]}
          onChangeText={(text) => setFormData({ ...formData, [field]: text })}
          placeholder={placeholder}
          placeholderTextColor={theme.textTertiary}
          keyboardType={keyboardType}
          editable={!loading}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={isDark ? ['#0F172A', '#1E293B'] : ['#FFFFFF', '#F8FAFC']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.surface }, shadows.sm]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Edit Profile</Text>
          <TouchableOpacity onPress={() => setIsDark(!isDark)}>
            <Ionicons name={isDark ? 'sunny' : 'moon'} size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderInput('Full Name', 'fullName', 'Enter your full name')}
          {renderInput('Student ID', 'studentId', 'Enter your student ID')}
          {renderInput('Year', 'year', 'e.g., 3rd Year')}
          {renderInput('Semester', 'semester', 'e.g., 6th Semester')}
          {renderInput('Date of Birth', 'dateOfBirth', 'DD/MM/YYYY')}
          {renderInput('Department', 'department', 'e.g., Computer Science')}
          {renderInput('Phone Number', 'phoneNumber', 'Enter your phone number', 'phone-pad')}
          {renderInput('Gender', 'gender', 'Male/Female/Other')}
          {renderInput('Blood Group', 'bloodGroup', 'e.g., O+')}
          {renderInput('Emergency Contact', 'emergencyContact', 'Emergency contact number', 'phone-pad')}

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }, shadows.md]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
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
  headerTitle: {
    ...typography.h3,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
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
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  textInput: {
    ...typography.body,
    flex: 1,
    paddingVertical: 0,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
    gap: spacing.sm,
  },
  saveButtonText: {
    ...typography.h4,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

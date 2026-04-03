import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { lightTheme, darkTheme, spacing, typography, borderRadius, shadows } from '../constants/modernTheme';
import { DEPARTMENT_MAP, YEARS } from '../constants/departments';

export default function EditProfileScreen({ navigation }) {
  const { user, userProfile } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    year: '',
    semester: '',
    dateOfBirth: '',
    department: '',
    phoneNumber: '',
    gender: '',
    bloodGroup: '',
    emergencyContact: '',
  });

  const formInitialized = React.useRef(false);

  useEffect(() => {
    if (userProfile && !formInitialized.current) {
      formInitialized.current = true;
      setFormData({
        fullName: userProfile.fullName || '',
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
    if (!userProfile?._docId) {
      Alert.alert('Error', 'Profile not loaded yet. Please wait a moment and try again.');
      return;
    }
    if (!formData.fullName.trim()) {
      Alert.alert('Error', 'Full name is required');
      return;
    }
    setLoading(true);
    try {
      console.log('💾 Saving profile — docId:', userProfile._docId, 'uid:', user?.uid);
      await updateDoc(doc(db, 'students', userProfile._docId), {
        ...formData,
        updatedAt: serverTimestamp(),
      });
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Update error:', error.code, error.message);
      Alert.alert('Error', `Failed to update profile: ${error.message}`);
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

  const renderSelect = (label, field, options) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <View style={[styles.input, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
        {Platform.OS === 'web' ? (
          <select
            value={formData[field]}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            disabled={loading}
            style={{
              flex: 1, width: '100%', border: 'none', outline: 'none',
              backgroundColor: 'transparent', color: theme.text,
              fontSize: 16, padding: 4, cursor: 'pointer',
            }}
          >
            <option value="">Select {label}</option>
            {options.map(({ value, label: optLabel }) => (
              <option key={value} value={value}>{optLabel}</option>
            ))}
          </select>
        ) : (
          <Picker
            selectedValue={formData[field]}
            onValueChange={(val) => setFormData({ ...formData, [field]: val })}
            style={{ color: theme.text, flex: 1 }}
            enabled={!loading}
          >
            <Picker.Item label={`Select ${label}`} value="" />
            {options.map(({ value, label: optLabel }) => (
              <Picker.Item key={value} label={optLabel} value={value} />
            ))}
          </Picker>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={isDark ? ['#0F172A', '#1E293B'] : ['#FFFFFF', '#F8FAFC']}
        style={styles.gradient}
      >
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
          {renderSelect('Department', 'department', Object.entries(DEPARTMENT_MAP).map(([v, l]) => ({ value: v, label: `${v} — ${l}` })))}
          {renderSelect('Year', 'year', YEARS.map(y => ({ value: y, label: y })))}
          {renderInput('Semester', 'semester', 'e.g., 6th Semester')}
          {renderInput('Date of Birth', 'dateOfBirth', 'DD/MM/YYYY')}
          {renderInput('Phone Number', 'phoneNumber', 'Enter your phone number', 'phone-pad')}
          {renderInput('Gender', 'gender', 'Male/Female/Other')}
          {renderInput('Blood Group', 'bloodGroup', 'e.g., O+')}
          {renderInput('Emergency Contact', 'emergencyContact', 'Emergency contact number', 'phone-pad')}

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.primary, opacity: (loading || !userProfile?._docId) ? 0.7 : 1 }, shadows.md]}
            onPress={handleSave}
            disabled={loading || !userProfile?._docId}
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
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xxl + 20,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: { ...typography.h3 },
  content: { flex: 1, padding: spacing.lg },
  inputContainer: { marginBottom: spacing.md },
  label: { ...typography.smallMedium, marginBottom: spacing.sm },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  textInput: { ...typography.body, flex: 1, paddingVertical: 0 },
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
  saveButtonText: { ...typography.h4, color: '#FFFFFF', fontWeight: '600' },
});

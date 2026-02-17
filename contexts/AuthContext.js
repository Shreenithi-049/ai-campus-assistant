import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { subscribeToAuthChanges, getUserData, loginUser, logoutUser } from '../services/authService';

const AuthContext = createContext({});
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('darkMode').then(value => {
      if (value !== null) setIsDarkMode(value === 'true');
    });
  }, []);

  const toggleDarkMode = async () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    await AsyncStorage.setItem('darkMode', newValue.toString());
  };

  const logout = async () => {
    console.log('Logout function called');
    try {
      console.log('Calling logoutUser...');
      await logoutUser();
      console.log('Clearing AsyncStorage...');
      await AsyncStorage.clear();
      console.log('Setting user and profile to null...');
      setUser(null);
      setUserProfile(null);
      console.log('Logout successful');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  // Check session expiry
  useEffect(() => {
    const checkSession = async () => {
      try {
        const loginTimestamp = await AsyncStorage.getItem('loginTimestamp');
        if (loginTimestamp && user) {
          const currentTime = Date.now();
          const elapsed = currentTime - parseInt(loginTimestamp);
          
          if (elapsed > SESSION_DURATION) {
            Alert.alert(
              'Session Expired',
              'Your session has expired. Please login again.',
              [{ text: 'OK', onPress: logout }]
            );
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 60000);
    
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (authUser) => {
      setLoading(true);
      if (authUser) {
        setUser(authUser);
        try {
          const result = await getUserData(authUser.uid);
          if (result.success) {
            setUserProfile(result.data);
          } else {
            console.error('User profile not found in Firestore');
            setUserProfile(null);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const result = await loginUser(email, password);
      if (result.success) {
        await AsyncStorage.setItem('loginTimestamp', Date.now().toString());
      }
      return { success: true };
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error.code);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const refreshUserProfile = async () => {
    if (user) {
      try {
        const result = await getUserData(user.uid);
        if (result.success) {
          setUserProfile(result.data);
        }
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    isAuthenticated: !!user && !!userProfile,
    login,
    logout,
    refreshUserProfile,
    isDarkMode,
    toggleDarkMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const getAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return 'An error occurred. Please try again.';
  }
};

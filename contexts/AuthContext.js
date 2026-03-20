import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { reload } from 'firebase/auth';
import { doc, updateDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { auth, db, browserSessionPersistence, setPersistence } from '../services/firebaseConfig';
import {
  subscribeToAuthChanges,
  loginUser,
  logoutUser,
  sendVerificationEmail,
} from '../services/authService';
import { subscribeToUserProfile } from '../services/firestoreService';

const AuthContext = createContext({});
const SESSION_DURATION = 24 * 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser]               = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [isDarkMode, setIsDarkMode]   = useState(false);

  // Single source of truth: Firebase Auth token is the gate.
  // Firestore profile emailVerified is synced as a side-effect, not a gate.
  const isEmailVerified = user?.emailVerified === true;

  useEffect(() => {
    AsyncStorage.getItem('darkMode').then(value => {
      if (value !== null) setIsDarkMode(value === 'true');
    });
  }, []);

  const toggleDarkMode = async () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    await AsyncStorage.setItem('darkMode', next.toString());
  };

  const logout = async () => {
    try {
      // Immediately clear React state — critical for web where onAuthStateChanged
      // can be delayed due to IndexedDB persistence flushing
      setUser(null);
      setUserProfile(null);
      setLoading(false);

      await AsyncStorage.clear();

      // On web: switch to session persistence before signOut so the browser
      // does not restore the session from IndexedDB on next render cycle
      if (Platform.OS === 'web') {
        await setPersistence(auth, browserSessionPersistence);
      }

      await logoutUser();

      return { success: true };
    } catch (err) {
      console.error('Logout error:', err);
      // Restore loading=false so the app doesn't freeze on error
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Session expiry check
  useEffect(() => {
    if (!user) return;
    const checkSession = async () => {
      try {
        const ts = await AsyncStorage.getItem('loginTimestamp');
        if (ts && Date.now() - parseInt(ts) > SESSION_DURATION) {
          if (Platform.OS === 'web') {
            window.alert('Your session has expired. Please login again.');
            await logout();
          } else {
            Alert.alert(
              'Session Expired',
              'Your session has expired. Please login again.',
              [{ text: 'OK', onPress: logout }]
            );
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
      }
    };
    checkSession();
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, [user]);

  // Auth state listener + Firestore profile listener
  useEffect(() => {
    let profileUnsub = () => {};

    const authUnsub = subscribeToAuthChanges(async (authUser) => {
      console.log('🔐 Auth state changed:', authUser ? `User: ${authUser.email}` : 'User: null');
      profileUnsub();

      if (authUser) {
        setLoading(true);

        // Sync emailVerified to Firestore using uid-based query
        if (authUser.emailVerified) {
          getDocs(query(collection(db, 'students'), where('uid', '==', authUser.uid)))
            .then((snap) => {
              if (!snap.empty) {
                updateDoc(doc(db, 'students', snap.docs[0].id), {
                  emailVerified: true,
                  updatedAt: serverTimestamp(),
                }).catch(console.error);
              }
            })
            .catch(console.error);
        }

        setUser(authUser);

        profileUnsub = subscribeToUserProfile(
          authUser.uid,
          (result) => {
            setUserProfile(result.success ? result.data : null);
            setLoading(false);
          },
          (err) => {
            console.error('Profile listener error:', err);
            setUserProfile(null);
            setLoading(false);
          }
        );
      } else {
        // Do NOT setLoading(true) here — logout already cleared state immediately
        setUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      profileUnsub();
      authUnsub();
    };
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const result = await loginUser(email, password);
      if (result.success) {
        await AsyncStorage.setItem('loginTimestamp', Date.now().toString());
      }
      return { success: true };
    } catch (err) {
      const msg = getAuthErrorMessage(err.code);
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const resendVerification = async () => {
    try {
      await sendVerificationEmail();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const checkEmailVerified = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;
    try {
      await reload(currentUser);
      const refreshed = auth.currentUser;
      if (refreshed?.emailVerified) {
        setUser(refreshed);
        // Update the correct doc using _docId stored in userProfile
        if (userProfile?._docId) {
          updateDoc(doc(db, 'students', userProfile._docId), {
            emailVerified: true,
            updatedAt: serverTimestamp(),
          }).catch(console.error);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('checkEmailVerified error:', err);
      return false;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    isAuthenticated: !!user,
    isEmailVerified,
    login,
    logout,
    resendVerification,
    checkEmailVerified,
    refreshUserProfile: () => {},
    isDarkMode,
    toggleDarkMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const getAuthErrorMessage = (code) => {
  switch (code) {
    case 'auth/invalid-email':           return 'Invalid email address format.';
    case 'auth/user-disabled':           return 'This account has been disabled.';
    case 'auth/user-not-found':          return 'No account found with this email.';
    case 'auth/wrong-password':          return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':      return 'Invalid email or password.';
    case 'auth/too-many-requests':       return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':  return 'Network error. Please check your connection.';
    default:                             return 'An error occurred. Please try again.';
  }
};

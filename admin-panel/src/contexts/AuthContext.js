import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('adminDarkMode') === 'true'
  );

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      localStorage.setItem('adminDarkMode', String(!prev));
      return !prev;
    });
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, 'students', user.uid));
        if (snap.exists() && snap.data().role === 'admin') {
          setAdmin({ uid: user.uid, email: user.email, ...snap.data() });
        } else {
          await signOut(auth);
          setAdmin(null);
        }
      } else {
        setAdmin(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, 'students', cred.user.uid));
    if (!snap.exists() || snap.data().role !== 'admin') {
      await signOut(auth);
      throw new Error('Access denied. Admin accounts only.');
    }
    return cred;
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isDarkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

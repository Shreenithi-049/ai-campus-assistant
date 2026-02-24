import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  reload
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { validateCollegeEmail, validatePassword } from '../utils/validators';

/**
 * Register new student with college email
 * Creates auth user and stores data in Firestore
 * Automatically sends verification email
 */
export const registerStudent = async (email, password, additionalData = {}) => {
  // Validate email domain
  const emailValidation = validateCollegeEmail(email);
  if (!emailValidation.isValid) {
    throw new Error(emailValidation.error);
  }

  // Validate password strength
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.error);
  }

  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send verification email automatically
    try {
      await sendEmailVerification(user);
    } catch (verifyError) {
      console.error('Failed to send verification email:', verifyError);
    }

    // Store additional data in Firestore
    await setDoc(doc(db, 'students', user.uid), {
      email: user.email,
      role: 'student',
      emailVerified: false,
      createdAt: serverTimestamp(),
      ...additionalData,
    });

    return { success: true, user };
  } catch (error) {
    throw error;
  }
};

/**
 * Login existing user
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    throw error;
  }
};

/**
 * Logout current user
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

/**
 * Get current user data from Firestore
 */
export const getUserData = async (uid) => {
  try {
    const docRef = doc(db, 'students', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: 'User data not found' };
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Listen to auth state changes
 */
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Send email verification to current user
 */
export const sendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }
    if (user.emailVerified) {
      return { success: false, error: 'Email already verified' };
    }
    await sendEmailVerification(user);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

/**
 * Send password reset email
 */
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

/**
 * Reload current user to get latest email verification status
 */
export const reloadUser = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }
    await reload(user);
    return { success: true, emailVerified: user.emailVerified };
  } catch (error) {
    throw error;
  }
};

/**
 * Check if profile is complete
 */
export const isProfileComplete = (profile) => {
  if (!profile) return false;
  const requiredFields = ['fullName', 'studentId', 'year', 'semester'];
  return requiredFields.every(field => profile[field] && profile[field].trim() !== '');
};

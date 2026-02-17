import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { validateCollegeEmail, validatePassword } from '../utils/validators';

/**
 * Register new student with college email
 * Creates auth user and stores data in Firestore
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

    // Store additional data in Firestore
    await setDoc(doc(db, 'students', user.uid), {
      email: user.email,
      role: 'student',
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

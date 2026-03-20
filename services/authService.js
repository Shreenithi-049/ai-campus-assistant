import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  reload
} from 'firebase/auth';
import { doc, updateDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { validateCollegeEmail, validatePassword } from '../utils/validators';

/**
 * Signup: only allowed if admin has pre-created a student record with this email.
 * Finds the existing doc, creates Firebase Auth user, then links uid to that doc.
 */
export const registerStudent = async (email, password, additionalData = {}) => {
  const emailValidation = validateCollegeEmail(email);
  if (!emailValidation.isValid) throw new Error(emailValidation.error);

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) throw new Error(passwordValidation.error);

  // Step 1: Check if admin has pre-created a record for this email
  const q = query(collection(db, 'students'), where('email', '==', email));
  const snap = await getDocs(q);

  if (snap.empty) {
    throw new Error('You are not registered in the system. Please contact your admin.');
  }

  const existingDoc = snap.docs[0];

  if (existingDoc.data().isRegistered) {
    throw new Error('An account already exists for this email. Please login instead.');
  }

  // Step 2: Create Firebase Auth user
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  try {
    await sendEmailVerification(user);
  } catch (e) {
    console.error('Verification email failed:', e);
  }

  // Step 3: Update the EXISTING admin-created doc — do NOT create a new one
  await updateDoc(doc(db, 'students', existingDoc.id), {
    uid: user.uid,
    fullName: additionalData.fullName || '',
    emailVerified: false,
    isRegistered: true,
    registeredAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { success: true, user, docId: existingDoc.id };
};

/** Login existing user */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    throw error;
  }
};

/** Logout current user */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

/** Listen to auth state changes */
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/** Send email verification to current user */
export const sendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
    if (user.emailVerified) return { success: false, error: 'Email already verified' };
    await sendEmailVerification(user);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

/** Send password reset email */
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

/** Reload current user to get latest email verification status */
export const reloadUser = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
    await reload(user);
    return { success: true, emailVerified: user.emailVerified };
  } catch (error) {
    throw error;
  }
};

/** Check if profile is complete */
export const isProfileComplete = (profile) => {
  if (!profile) return false;
  const requiredFields = ['fullName', 'studentId', 'year', 'department'];
  return requiredFields.every(field => profile[field] && profile[field].trim() !== '');
};

import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { sampleSyllabus } from '../data/sampleData';

const USE_FIRESTORE = process.env.EXPO_PUBLIC_USE_FIRESTORE === 'true';

export const subscribeToSyllabus = (studentId, onSuccess, onError) => {
  if (!USE_FIRESTORE) {
    // Development mode: Return sample data
    setTimeout(() => onSuccess(sampleSyllabus), 100);
    return () => {}; // No-op unsubscribe
  }

  // Production mode: Real-time Firestore listener
  const syllabusRef = doc(db, 'students', studentId, 'syllabus', 'current');

  const unsubscribe = onSnapshot(
    syllabusRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onSuccess(data.subjects || []);
      } else {
        onSuccess([]);
      }
    },
    (error) => {
      console.error('Syllabus listener error:', error);
      onError(error);
    }
  );

  return unsubscribe;
};

export const getSyllabus = async (studentId) => {
  if (!USE_FIRESTORE) {
    return sampleSyllabus;
  }

  const syllabusRef = doc(db, 'students', studentId, 'syllabus', 'current');
  const snapshot = await getDoc(syllabusRef);
  return snapshot.exists() ? snapshot.data().subjects || [] : [];
};

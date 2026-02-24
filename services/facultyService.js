import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { sampleFaculty } from '../data/sampleData';

const USE_FIRESTORE = process.env.EXPO_PUBLIC_USE_FIRESTORE === 'true';

export const subscribeToFaculty = (onSuccess, onError) => {
  if (!USE_FIRESTORE) {
    // Development mode: Return sample data
    setTimeout(() => onSuccess(sampleFaculty), 100);
    return () => {}; // No-op unsubscribe
  }

  // Production mode: Real-time Firestore listener
  const facultyRef = collection(db, 'faculty');
  const q = query(facultyRef, orderBy('name', 'asc'));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const faculty = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      onSuccess(faculty);
    },
    (error) => {
      console.error('Faculty listener error:', error);
      onError(error);
    }
  );

  return unsubscribe;
};

export const getFaculty = async () => {
  if (!USE_FIRESTORE) {
    return sampleFaculty;
  }

  const facultyRef = collection(db, 'faculty');
  const snapshot = await getDocs(facultyRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

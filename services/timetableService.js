import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { sampleTimetable } from '../data/sampleData';

const USE_FIRESTORE = process.env.EXPO_PUBLIC_USE_FIRESTORE === 'true';

export const subscribeToTimetable = (department, year, onSuccess, onError) => {
  if (!USE_FIRESTORE) {
    // Development mode: Return sample data
    setTimeout(() => onSuccess(sampleTimetable), 100);
    return () => {}; // No-op unsubscribe
  }

  // Production mode: Real-time Firestore listener
  // Path: /timetables/{department}/{year}
  const timetableRef = doc(db, 'timetables', department, 'years', year);

  const unsubscribe = onSnapshot(
    timetableRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onSuccess(data.schedule || []);
      } else {
        onSuccess([]);
      }
    },
    (error) => {
      console.error('Timetable listener error:', error);
      onError(error);
    }
  );

  return unsubscribe;
};

export const getTimetable = async (department, year) => {
  if (!USE_FIRESTORE) {
    return sampleTimetable;
  }

  const timetableRef = doc(db, 'timetables', department, 'years', year);
  const snapshot = await getDoc(timetableRef);
  return snapshot.exists() ? snapshot.data().schedule || [] : [];
};

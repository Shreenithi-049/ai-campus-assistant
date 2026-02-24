import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { sampleEvents } from '../data/sampleData';

const USE_FIRESTORE = process.env.EXPO_PUBLIC_USE_FIRESTORE === 'true';

export const subscribeToEvents = (onSuccess, onError) => {
  if (!USE_FIRESTORE) {
    // Development mode: Return sample data
    setTimeout(() => onSuccess(sampleEvents), 100);
    return () => {}; // No-op unsubscribe
  }

  // Production mode: Real-time Firestore listener
  const eventsRef = collection(db, 'events');
  const q = query(eventsRef, orderBy('date', 'desc'));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      onSuccess(events);
    },
    (error) => {
      console.error('Events listener error:', error);
      onError(error);
    }
  );

  return unsubscribe;
};

export const getEvents = async () => {
  if (!USE_FIRESTORE) {
    return sampleEvents;
  }
  
  // For one-time fetch in production
  const eventsRef = collection(db, 'events');
  const snapshot = await getDocs(eventsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { sampleAnnouncements } from '../data/sampleData';

const USE_FIRESTORE = process.env.EXPO_PUBLIC_USE_FIRESTORE === 'true';

export const subscribeToAnnouncements = (onSuccess, onError) => {
  if (!USE_FIRESTORE) {
    // Development mode: Return sample data
    setTimeout(() => onSuccess(sampleAnnouncements), 100);
    return () => {}; // No-op unsubscribe
  }

  // Production mode: Real-time Firestore listener
  const announcementsRef = collection(db, 'announcements');
  const q = query(announcementsRef, orderBy('date', 'desc'), limit(10));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const announcements = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      onSuccess(announcements);
    },
    (error) => {
      console.error('Announcements listener error:', error);
      onError(error);
    }
  );

  return unsubscribe;
};

export const getAnnouncements = async () => {
  if (!USE_FIRESTORE) {
    return sampleAnnouncements;
  }

  const announcementsRef = collection(db, 'announcements');
  const q = query(announcementsRef, orderBy('date', 'desc'), limit(10));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

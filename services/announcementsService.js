import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { sampleAnnouncements } from '../data/sampleData';

const USE_FIRESTORE = process.env.EXPO_PUBLIC_USE_FIRESTORE === 'true';

// Real-time listener — latest 20, ordered by createdAt Timestamp
export const subscribeToAnnouncements = (onSuccess, onError) => {
  if (!USE_FIRESTORE) {
    setTimeout(() => onSuccess(sampleAnnouncements), 100);
    return () => {};
  }

  const q = query(
    collection(db, 'announcements'),
    orderBy('createdAt', 'desc'),
    limit(20)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const announcements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      onSuccess(announcements);
    },
    (error) => {
      console.error('Announcements listener error:', error.code, error.message);
      onError(error);
    }
  );
};

import { collection, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { sampleEvents } from '../data/sampleData';

const USE_FIRESTORE = process.env.EXPO_PUBLIC_USE_FIRESTORE === 'true';

// Maps admin category values → display color + Ionicons icon name
const CATEGORY_DEFAULTS = {
  academic: { color: '#3B82F6', icon: 'school-outline' },
  cultural:  { color: '#8B5CF6', icon: 'musical-notes-outline' },
  sports:    { color: '#10B981', icon: 'football-outline' },
  other:     { color: '#F59E0B', icon: 'calendar-outline' },
};

// Normalize a raw Firestore event doc so the UI always has color + icon
const normalize = (doc) => {
  const data = doc.data ? doc.data() : doc; // works for both snapshot docs and plain objects
  const defaults = CATEGORY_DEFAULTS[data.category] || CATEGORY_DEFAULTS.other;
  return {
    id: doc.id ?? data.id,
    ...data,
    color: data.color || defaults.color,
    icon:  data.icon  || defaults.icon,
    attendees: data.attendees ?? 0,
  };
};

// Real-time listener — filters published events client-side to avoid composite index requirement
export const subscribeToEvents = (onSuccess, onError) => {
  if (!USE_FIRESTORE) {
    setTimeout(() => onSuccess(sampleEvents), 100);
    return () => {};
  }

  const q = query(
    collection(db, 'events'),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    async (snapshot) => {
      const regSnap = await getDocs(collection(db, 'eventRegistrations'));
      const countMap = {};
      regSnap.docs.forEach(d => {
        const { eventId } = d.data();
        if (eventId) countMap[eventId] = (countMap[eventId] || 0) + 1;
      });

      const all = snapshot.docs.map(doc => {
        const normalized = normalize(doc);
        return { ...normalized, attendees: countMap[doc.id] || 0 };
      });
      onSuccess(all.filter(e => e.status === 'published'));
    },
    (error) => {
      console.error('Events listener error:', error.code, error.message);
      onError(error);
    }
  );
};

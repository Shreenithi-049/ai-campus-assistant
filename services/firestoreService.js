import { db } from './firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

// Real-time listener for user profile
export const subscribeToUserProfile = (uid, onUpdate, onError) => {
  if (!uid) return () => {};
  
  const userRef = doc(db, 'students', uid);
  
  const unsubscribe = onSnapshot(
    userRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate({ success: true, data: snapshot.data() });
      } else {
        onUpdate({ success: false, data: null });
      }
    },
    (error) => {
      console.error('Profile listener error:', error);
      if (onError) onError(error);
    }
  );
  
  return unsubscribe;
};

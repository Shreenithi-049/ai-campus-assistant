import { db, auth } from './firebaseConfig';
import { collection, query, where, onSnapshot, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Real-time listener for user profile — queries by uid field since doc ID is studentId.
// Falls back to email match for accounts created before uid-linking was implemented,
// and auto-backfills the uid field so future queries work correctly.
export const subscribeToUserProfile = (uid, onUpdate, onError) => {
  if (!uid) return () => {};

  const q = query(collection(db, 'students'), where('uid', '==', uid));

  return onSnapshot(
    q,
    async (snapshot) => {
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        onUpdate({ success: true, data: { ...docSnap.data(), _docId: docSnap.id } });
        return;
      }

      // uid field missing — fall back to email lookup and backfill uid
      const email = auth.currentUser?.email;
      if (!email) {
        onUpdate({ success: false, data: null });
        return;
      }

      try {
        const emailSnap = await getDocs(query(collection(db, 'students'), where('email', '==', email)));
        if (emailSnap.empty) {
          onUpdate({ success: false, data: null });
          return;
        }

        const docSnap = emailSnap.docs[0];
        // Backfill uid so uid-based queries work from now on
        updateDoc(doc(db, 'students', docSnap.id), {
          uid,
          updatedAt: serverTimestamp(),
        }).catch(console.error);

        onUpdate({ success: true, data: { ...docSnap.data(), uid, _docId: docSnap.id } });
      } catch (err) {
        console.error('Profile email fallback error:', err);
        onUpdate({ success: false, data: null });
      }
    },
    (error) => {
      console.error('Profile listener error:', error);
      if (onError) onError(error);
    }
  );
};

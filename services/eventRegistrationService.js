import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const registerForEvent = async (userId, event) => {
  try {
    const registrationsRef = collection(db, 'eventRegistrations');
    const q = query(
      registrationsRef,
      where('userId', '==', userId),
      where('eventId', '==', event.id)
    );
    
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return { alreadyRegistered: true };
    }
    
    await addDoc(registrationsRef, {
      userId,
      eventId: event.id,
      eventTitle: event.title,
      registeredAt: serverTimestamp(),
      status: 'registered'
    });

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: error.message };
  }
};

export const checkIfRegistered = async (userId, eventId) => {
  try {
    const registrationsRef = collection(db, 'eventRegistrations');
    const q = query(
      registrationsRef,
      where('userId', '==', userId),
      where('eventId', '==', eventId)
    );
    
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Check registration error:', error);
    return false;
  }
};

export const getUserRegistrations = async (userId) => {
  try {
    const registrationsRef = collection(db, 'eventRegistrations');
    const q = query(registrationsRef, where('userId', '==', userId));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Get registrations error:', error);
    return [];
  }
};

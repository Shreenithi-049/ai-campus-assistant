import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, getDoc, query, orderBy, serverTimestamp, where, limit
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const COL = 'events';

export const getEvents = async () => {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);

  const regSnap = await getDocs(collection(db, 'eventRegistrations'));
  const countMap = {};
  regSnap.docs.forEach(d => {
    const { eventId } = d.data();
    if (eventId) countMap[eventId] = (countMap[eventId] || 0) + 1;
  });

  return snap.docs.map(d => ({ id: d.id, ...d.data(), attendees: countMap[d.id] || 0 }));
};

export const getEvent = async (id) => {
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const createEvent = async (data) => {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    attendees: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateEvent = async (id, data) => {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
};

export const deleteEvent = async (id) => {
  await deleteDoc(doc(db, COL, id));
};

export const getRecentEvents = async (count = 5) => {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'), limit(count));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

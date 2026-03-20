import {
  collection, doc, getDoc, getDocs,
  query, orderBy, where, limit
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export const getStudents = async () => {
  const snap = await getDocs(collection(db, 'students'));
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
};

export const getStudent = async (uid) => {
  const snap = await getDoc(doc(db, 'students', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const getStudentCount = async () => {
  const snap = await getDocs(collection(db, 'students'));
  return snap.size;
};

export const getEventRegistrations = async () => {
  const q = query(collection(db, 'eventRegistrations'), orderBy('registeredAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getRegistrationsByEvent = async (eventId) => {
  const q = query(
    collection(db, 'eventRegistrations'),
    where('eventId', '==', eventId)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getRecentRegistrations = async (count = 5) => {
  const q = query(
    collection(db, 'eventRegistrations'),
    orderBy('registeredAt', 'desc'),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getDashboardStats = async () => {
  const [students, events, registrations, announcements] = await Promise.all([
    getDocs(collection(db, 'students')),
    getDocs(collection(db, 'events')),
    getDocs(collection(db, 'eventRegistrations')),
    getDocs(collection(db, 'announcements')),
  ]);
  return {
    students: students.size,
    events: events.size,
    registrations: registrations.size,
    announcements: announcements.size,
  };
};

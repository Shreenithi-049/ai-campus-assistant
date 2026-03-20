import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Path: timetables/{department}/years/{year}
export const getTimetable = async (department, year) => {
  const ref = doc(db, 'timetables', department, 'years', year);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().schedule || [] : [];
};

export const saveTimetable = async (department, year, schedule) => {
  const ref = doc(db, 'timetables', department, 'years', year);
  await setDoc(ref, { schedule, updatedAt: serverTimestamp() }, { merge: true });
};

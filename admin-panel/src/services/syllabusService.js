import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Path: syllabus/{department}/{year}/{semester}
export const getSyllabus = async (department, year, semester) => {
  const ref = doc(db, 'syllabus', department, year, semester);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().subjects || [] : [];
};

export const saveSyllabus = async (department, year, semester, subjects) => {
  const ref = doc(db, 'syllabus', department, year, semester);
  await setDoc(ref, { subjects, updatedAt: serverTimestamp() }, { merge: true });
};

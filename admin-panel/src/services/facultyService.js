import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, query, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const COL = 'faculty';

export const getFaculty = async () => {
  const q = query(collection(db, COL), orderBy('name', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const createFaculty = async (data) => {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateFaculty = async (id, data) => {
  await updateDoc(doc(db, COL, id), data);
};

export const deleteFaculty = async (id) => {
  await deleteDoc(doc(db, COL, id));
};

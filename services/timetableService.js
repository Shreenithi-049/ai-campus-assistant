import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { sampleTimetable } from '../data/sampleData';

const USE_FIRESTORE = process.env.EXPO_PUBLIC_USE_FIRESTORE === 'true';

const SUBJECT_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899'];
const colorForSubject = (subject) => {
  let hash = 0;
  for (let i = 0; i < subject.length; i++) hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  return SUBJECT_COLORS[Math.abs(hash) % SUBJECT_COLORS.length];
};

// Uses exact department/year values from admin-created student profile
export const subscribeToTimetable = (department, year, onSuccess, onError) => {
  if (!USE_FIRESTORE) {
    setTimeout(() => onSuccess(sampleTimetable), 100);
    return () => {};
  }

  const ref = doc(db, 'timetables', department, 'years', year);
  console.log(`📚 Timetable path: timetables/${department}/years/${year}`);

  return onSnapshot(
    ref,
    (snapshot) => {
      if (!snapshot.exists()) {
        console.warn(`⚠️  No timetable found at timetables/${department}/years/${year}`);
        onSuccess([]);
        return;
      }
      const schedule = (snapshot.data().schedule || []).map((item, index) => ({
        ...item,
        id: item.id || `${item.subject}-${index}`,
        color: item.color || colorForSubject(item.subject),
      }));
      console.log(`✅ Timetable loaded: ${schedule.length} entries`);
      onSuccess(schedule);
    },
    (error) => {
      console.error('Timetable listener error:', error.code, error.message);
      onError(error);
    }
  );
};

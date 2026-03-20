import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';

const getSyllabusColor = (progress) => {
  if (progress >= 75) return '#10B981';
  if (progress >= 50) return '#F59E0B';
  return '#EF4444';
};

// Subscribes to centralized syllabus doc for the student's dept/year/semester
export const subscribeToSyllabus = (userProfile, onSuccess, onError) => {
  const { department, year, semester } = userProfile || {};

  if (!department || !year || !semester) {
    onSuccess([]);
    return () => {};
  }

  const ref = doc(db, 'syllabus', department, year, semester);
  console.log(`📖 Syllabus path: syllabus/${department}/${year}/${semester}`);

  return onSnapshot(
    ref,
    (snapshot) => {
      if (!snapshot.exists()) {
        console.warn('⚠️  No syllabus found at path');
        onSuccess([]);
        return;
      }
      const subjects = (snapshot.data().subjects || []).map((sub) => {
        const progress = sub.totalTopics > 0
          ? Math.round((sub.completedTopics / sub.totalTopics) * 100)
          : 0;
        return {
          id: sub.subject,
          subject: sub.subject,
          totalTopics: sub.totalTopics,
          completedTopics: sub.completedTopics,
          progress,
          color: getSyllabusColor(progress),
        };
      });
      onSuccess(subjects);
    },
    (error) => {
      console.error('Syllabus listener error:', error);
      onError(error);
    }
  );
};

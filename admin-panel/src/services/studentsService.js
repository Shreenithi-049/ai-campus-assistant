import { collection, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';

const COLLECTION = 'students';

/**
 * Get all students from Firestore
 */
export const getAllStudents = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort client-side — avoids requiring a Firestore composite index
    return students.sort((a, b) => {
      const tA = a.createdAt?.toMillis?.() ?? 0;
      const tB = b.createdAt?.toMillis?.() ?? 0;
      return tB - tA;
    });
  } catch (error) {
    console.error('Error fetching students:', error.code, error.message);
    throw error;
  }
};

/**
 * Get single student by ID
 */
export const getStudentById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching student:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time students updates
 */
export const subscribeToStudents = (callback, onError) => {
  return onSnapshot(
    collection(db, COLLECTION),
    (snapshot) => {
      const students = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(students);
    },
    (error) => {
      console.error('Students subscription error:', error);
      if (onError) onError(error);
    }
  );
};

/**
 * Calculate average attendance from attendance object
 */
export const calculateAverageAttendance = (attendance) => {
  if (!attendance || typeof attendance !== 'object') return 0;
  const values = Object.values(attendance).filter(v => typeof v === 'number');
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / values.length);
};

/**
 * Get attendance status based on average
 */
export const getAttendanceStatus = (average) => {
  if (average >= 75) return { label: 'Good', color: '#10B981', bg: '#10B98118' };
  if (average >= 65) return { label: 'Warning', color: '#F59E0B', bg: '#F59E0B18' };
  return { label: 'At Risk', color: '#EF4444', bg: '#EF444418' };
};

/**
 * Calculate dashboard statistics
 */
export const calculateStudentStats = (students) => {
  const stats = {
    total: students.length,
    good: 0,
    warning: 0,
    atRisk: 0,
  };

  students.forEach(student => {
    const avg = calculateAverageAttendance(student.attendance);
    if (avg >= 75) stats.good++;
    else if (avg >= 65) stats.warning++;
    else stats.atRisk++;
  });

  return stats;
};

/**
 * Filter students by search query and filters
 */
export const filterStudents = (students, searchQuery, filters) => {
  let filtered = [...students];

  // Search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(s =>
      s.fullName?.toLowerCase().includes(query) ||
      s.studentId?.toLowerCase().includes(query) ||
      s.email?.toLowerCase().includes(query)
    );
  }

  // Department filter
  if (filters.department && filters.department !== 'all') {
    filtered = filtered.filter(s => s.department === filters.department);
  }

  // Status filter
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(s => {
      const avg = calculateAverageAttendance(s.attendance);
      const status = getAttendanceStatus(avg);
      return status.label.toLowerCase() === filters.status.toLowerCase();
    });
  }

  // Year filter
  if (filters.year && filters.year !== 'all') {
    filtered = filtered.filter(s => s.year === filters.year);
  }

  return filtered;
};

/**
 * Sort students by attendance
 */
export const sortStudentsByAttendance = (students, order = 'desc') => {
  return [...students].sort((a, b) => {
    const avgA = calculateAverageAttendance(a.attendance);
    const avgB = calculateAverageAttendance(b.attendance);
    return order === 'desc' ? avgB - avgA : avgA - avgB;
  });
};

/**
 * Get unique departments from students
 */
export const getUniqueDepartments = (students) => {
  const departments = students
    .map(s => s.department)
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i);
  return departments.sort();
};

/**
 * Get unique years from students
 */
export const getUniqueYears = (students) => {
  const years = students
    .map(s => s.year)
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i);
  return years.sort();
};

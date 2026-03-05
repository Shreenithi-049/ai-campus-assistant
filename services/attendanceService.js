import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const getStudentAttendance = async (userId) => {
  try {
    const studentDoc = await getDoc(doc(db, 'students', userId));
    
    if (!studentDoc.exists()) {
      return { success: false, data: [] };
    }

    const attendanceData = studentDoc.data().attendance || {};
    
    const attendanceList = Object.entries(attendanceData).map(([subject, percentage]) => ({
      subject,
      percentage: Number(percentage)
    }));

    return { success: true, data: attendanceList };
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return { success: false, data: [], error: error.message };
  }
};

export const calculateOverallAttendance = (attendanceObject) => {
  const values = Object.values(attendanceObject);
  if (values.length === 0) return 0;
  
  const sum = values.reduce((acc, val) => acc + Number(val), 0);
  return Math.round(sum / values.length);
};

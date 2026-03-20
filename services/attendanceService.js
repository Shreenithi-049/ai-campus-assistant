export const getStudentAttendance = (userProfile) => {
  try {
    const attendanceData = userProfile?.attendance || {};

    const attendanceList = Object.entries(attendanceData).map(([subject, percentage]) => ({
      subject,
      percentage: Number(percentage),
    }));

    return { success: true, data: attendanceList };
  } catch (error) {
    console.error('Error reading attendance:', error);
    return { success: false, data: [], error: error.message };
  }
};

export const calculateOverallAttendance = (attendanceObject) => {
  const values = Object.values(attendanceObject);
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + Number(val), 0);
  return Math.round(sum / values.length);
};

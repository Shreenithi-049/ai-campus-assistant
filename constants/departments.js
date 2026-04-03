export const DEPARTMENT_MAP = {
  CSD:  'Computer Science & Design',
  CSE:  'Computer Science & Engineering',
  ECE:  'Electronics & Communication',
  EEE:  'Electrical & Electronics',
  MECH: 'Mechanical Engineering',
  CIVIL:'Civil Engineering',
  IT:   'Information Technology',
};

export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export const getDepartmentLabel = (code) => DEPARTMENT_MAP[code] || code;

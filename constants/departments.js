export const DEPARTMENT_MAP = {
  CSD:  'Computer Science & Design',
  CSE:  'Computer Science & Engineering',
  ECE:  'Electronics & Communication',
  EEE:  'Electrical & Electronics',
  MECH: 'Mechanical Engineering',
  CIVIL:'Civil Engineering',
  IT:   'Information Technology',
};

// Returns full label for a department code, falls back to the code itself
export const getDepartmentLabel = (code) => DEPARTMENT_MAP[code] || code;

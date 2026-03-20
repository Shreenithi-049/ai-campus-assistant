// Department codes are used as Firestore path keys and stored in student docs.
// Labels are display-only in the UI.
export const DEPARTMENT_MAP = {
  CSD:  'Computer Science & Design',
  CSE:  'Computer Science & Engineering',
  ECE:  'Electronics & Communication',
  EEE:  'Electrical & Electronics',
  MECH: 'Mechanical Engineering',
  CIVIL:'Civil Engineering',
  IT:   'Information Technology',
};

// [{ value: 'CSD', label: 'CSD — Computer Science & Design' }, ...]
export const DEPARTMENT_OPTIONS = Object.entries(DEPARTMENT_MAP).map(([code, label]) => ({
  value: code,
  label: `${code} — ${label}`,
}));

export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

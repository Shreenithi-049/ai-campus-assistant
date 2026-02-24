// Sample data for development mode
// This will be replaced with real-time Firestore data in production

export const sampleEvents = [
  {
    id: 'evt1',
    title: 'Tech Symposium 2024',
    category: 'academic',
    date: 'March 15, 2024',
    time: '10:00 AM',
    location: 'Main Auditorium',
    attendees: 250,
    registered: true,
    color: '#3B82F6',
    icon: 'school-outline',
    description: 'Annual technical symposium featuring workshops and competitions',
  },
  {
    id: 'evt2',
    title: 'Cultural Fest',
    category: 'cultural',
    date: 'March 20, 2024',
    time: '2:00 PM',
    location: 'Open Ground',
    attendees: 500,
    registered: false,
    color: '#8B5CF6',
    icon: 'musical-notes-outline',
    description: 'Celebrate diversity with music, dance, and art',
  },
  {
    id: 'evt3',
    title: 'Sports Day',
    category: 'sports',
    date: 'March 25, 2024',
    time: '8:00 AM',
    location: 'Sports Complex',
    attendees: 300,
    registered: false,
    color: '#10B981',
    icon: 'football-outline',
    description: 'Inter-department sports competition',
  },
];

export const sampleTimetable = [
  {
    id: 'tt1',
    subject: 'Data Structures',
    time: '9:00 AM - 10:30 AM',
    room: 'ENG-301',
    professor: 'Dr. Smith',
    color: '#3B82F6',
    day: 'Monday',
  },
  {
    id: 'tt2',
    subject: 'Database Systems',
    time: '11:00 AM - 12:30 PM',
    room: 'ENG-205',
    professor: 'Dr. Johnson',
    color: '#10B981',
    day: 'Monday',
  },
  {
    id: 'tt3',
    subject: 'Web Development',
    time: '2:00 PM - 3:30 PM',
    room: 'ENG-401',
    professor: 'Dr. Williams',
    color: '#8B5CF6',
    day: 'Monday',
  },
];

export const sampleFaculty = [
  {
    id: 'fac1',
    name: 'Dr. Sarah Smith',
    department: 'Computer Science',
    email: 'sarah.smith@skcet.ac.in',
    office: 'ENG-501',
    hours: 'Mon-Wed 2-4 PM',
    phone: '+91 9876543210',
  },
  {
    id: 'fac2',
    name: 'Dr. John Johnson',
    department: 'Computer Science',
    email: 'john.johnson@skcet.ac.in',
    office: 'ENG-502',
    hours: 'Tue-Thu 3-5 PM',
    phone: '+91 9876543211',
  },
  {
    id: 'fac3',
    name: 'Dr. Emily Williams',
    department: 'Computer Science',
    email: 'emily.williams@skcet.ac.in',
    office: 'ENG-503',
    hours: 'Mon-Fri 1-3 PM',
    phone: '+91 9876543212',
  },
];

export const sampleSyllabus = [
  {
    id: 'syl1',
    subject: 'Data Structures',
    progress: 75,
    topics: 12,
    completed: 9,
  },
  {
    id: 'syl2',
    subject: 'Database Systems',
    progress: 60,
    topics: 10,
    completed: 6,
  },
  {
    id: 'syl3',
    subject: 'Web Development',
    progress: 45,
    topics: 15,
    completed: 7,
  },
];

export const sampleAnnouncements = [
  {
    id: 'ann1',
    title: 'Library Hours Extended',
    message: 'Library will remain open until 10 PM during exam week',
    date: '2024-03-10',
    priority: 'high',
  },
  {
    id: 'ann2',
    title: 'Semester Registration',
    message: 'Registration for next semester opens on March 20',
    date: '2024-03-08',
    priority: 'medium',
  },
];

import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const fetchEvents = async () => {
  const snap = await getDocs(query(collection(db, 'events'), orderBy('createdAt', 'desc')));
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(e => e.status === 'published');
};

const fetchFaculty = async () => {
  const snap = await getDocs(query(collection(db, 'faculty'), orderBy('name', 'asc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

const fetchAnnouncements = async () => {
  const snap = await getDocs(query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(5)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

const fetchTimetable = async (department, year) => {
  try {
    const ref = doc(db, 'timetables', department, 'years', year);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data().schedule || []) : [];
  } catch {
    return [];
  }
};

export const buildAIContext = async (userProfile) => {
  try {
    const dept = userProfile?.department || 'Computer Science';
    const year = userProfile?.year || '3rd Year';

    const [events, timetable, faculty, announcements] = await Promise.all([
      fetchEvents(),
      fetchTimetable(dept, year),
      fetchFaculty(),
      fetchAnnouncements(),
    ]);

    return {
      student: {
        name: userProfile?.fullName || 'Student',
        department: dept,
        year,
        semester: userProfile?.semester || '6th Semester',
      },
      events: events.map(e => ({ title: e.title, date: e.date, time: e.time, location: e.location, category: e.category, description: e.description })),
      timetable: timetable.map(t => ({ subject: t.subject, time: t.time, room: t.room, professor: t.professor, day: t.day })),
      faculty: faculty.map(f => ({ name: f.name, department: f.department, email: f.email, office: f.office, phone: f.phone })),
      announcements: announcements.map(a => ({ title: a.title, message: a.message || a.content, date: a.date })),
    };
  } catch (error) {
    console.error('Error building AI context:', error);
    return null;
  }
};


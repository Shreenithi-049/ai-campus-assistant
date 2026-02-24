import { getEvents } from './eventsService';
import { getTimetable } from './timetableService';
import { getFaculty } from './facultyService';
import { sampleAnnouncements } from '../data/sampleData';

/**
 * Build AI context from real-time data sources
 * This ensures AI responses use latest data from admin updates
 */
export const buildAIContext = async (userProfile) => {
  try {
    const [events, timetable, faculty] = await Promise.all([
      getEvents(),
      getTimetable(
        userProfile?.department || 'Computer Science',
        userProfile?.year || '3rd Year'
      ),
      getFaculty(),
    ]);

    return {
      student: {
        name: userProfile?.fullName || 'Student',
        department: userProfile?.department || 'Computer Science',
        year: userProfile?.year || '3rd Year',
        semester: userProfile?.semester || '6th Semester',
      },
      events: events.map(e => ({
        title: e.title,
        date: e.date,
        time: e.time,
        location: e.location,
        category: e.category,
      })),
      timetable: timetable.map(t => ({
        subject: t.subject,
        time: t.time,
        room: t.room,
        professor: t.professor,
      })),
      faculty: faculty.map(f => ({
        name: f.name,
        department: f.department,
        email: f.email,
        office: f.office,
      })),
      announcements: sampleAnnouncements,
    };
  } catch (error) {
    console.error('Error building AI context:', error);
    return null;
  }
};

/**
 * Generate AI prompt with context
 */
export const generateAIPrompt = (userQuery, context) => {
  if (!context) return userQuery;

  return `
You are CampusAI, an intelligent assistant for SKCET students.

Student Info:
- Name: ${context.student.name}
- Department: ${context.student.department}
- Year: ${context.student.year}

Upcoming Events (${context.events.length}):
${context.events.slice(0, 3).map(e => `- ${e.title} on ${e.date} at ${e.location}`).join('\n')}

Today's Classes:
${context.timetable.slice(0, 3).map(t => `- ${t.subject} at ${t.time} in ${t.room}`).join('\n')}

Available Faculty:
${context.faculty.slice(0, 3).map(f => `- ${f.name} (${f.department}) - ${f.email}`).join('\n')}

User Query: ${userQuery}

Provide a helpful, concise response based on the context above.
`;
};

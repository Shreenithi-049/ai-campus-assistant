require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Groq AI Backend Running' });
});

app.post('/ask', async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const prompt = buildPrompt(message, context);

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1024
    });

    const reply = completion.choices[0]?.message?.content;

    if (!reply) {
      throw new Error('No response from AI');
    }

    res.json({ reply });
  } catch (error) {
    console.error('Groq API error:', error.message);
    res.status(500).json({
      error: 'Failed to generate response',
      message: error.message
    });
  }
});

function buildPrompt(message, context) {
  if (!context) return message;

  const eventsBlock = context.events?.length > 0
    ? `UPCOMING EVENTS (${context.events.length} total):\n${context.events.map(e =>
        `• ${e.title} | ${e.date} ${e.time ? 'at ' + e.time : ''} | ${e.location || 'TBD'}${e.category ? ' [' + e.category + ']' : ''}${e.description ? ' - ' + e.description : ''}`
      ).join('\n')}`
    : 'UPCOMING EVENTS: None currently scheduled.';

  const timetableBlock = context.timetable?.length > 0
    ? `CLASS SCHEDULE:\n${context.timetable.map(t =>
        `• ${t.day ? t.day + ': ' : ''}${t.subject} | ${t.time} | Room: ${t.room} | ${t.professor}`
      ).join('\n')}`
    : 'CLASS SCHEDULE: Not available.';

  const facultyBlock = context.faculty?.length > 0
    ? `FACULTY DIRECTORY:\n${context.faculty.map(f =>
        `• ${f.name} (${f.department}) | Email: ${f.email} | Office: ${f.office}${f.phone ? ' | Phone: ' + f.phone : ''}`
      ).join('\n')}`
    : 'FACULTY: Not available.';

  const announcementsBlock = context.announcements?.length > 0
    ? `RECENT ANNOUNCEMENTS:\n${context.announcements.map(a =>
        `• ${a.title}: ${a.message || a.content || ''}`
      ).join('\n')}`
    : '';

  return `You are IntelliCamp AI, the official smart assistant for SKCET (Sri Krishna College of Engineering and Technology) students.

STUDENT PROFILE:
- Name: ${context.student?.name}
- Department: ${context.student?.department}
- Year: ${context.student?.year}
- Semester: ${context.student?.semester}

${eventsBlock}

${timetableBlock}

${facultyBlock}

${announcementsBlock}

STUDENT QUESTION: ${message}

RULES:
1. Answer ONLY using the data provided above. Do NOT make up events, faculty, schedules, or locations.
2. If the answer is in the data, give it directly and clearly.
3. If the data doesn't contain the answer, say: "I don't have that information right now. Please check with your department or the admin portal."
4. Never suggest generic web searches or external resources.
5. Be conversational, friendly, and concise (under 150 words unless listing multiple items).
6. For event questions, always mention the date, time, and location.
7. For faculty questions, always include email and office.
8. Use bullet points for lists.

ANSWER:`;
}

app.listen(PORT, () => {
  console.log(`🚀 Groq AI Backend running on http://localhost:${PORT}`);
});

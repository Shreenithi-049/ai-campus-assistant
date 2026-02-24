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

  return `You are CampusAI, an intelligent assistant for SKCET (Sri Krishna College of Engineering and Technology) students.

Student Information:
- Name: ${context.student?.name || 'Student'}
- Department: ${context.student?.department || 'Computer Science'}
- Year: ${context.student?.year || '3rd Year'}
- Semester: ${context.student?.semester || '6th Semester'}

${context.events && context.events.length > 0 ? `
Upcoming Campus Events:
${context.events.slice(0, 5).map(e => `- ${e.title} on ${e.date} at ${e.time} (${e.location})`).join('\n')}
` : ''}

${context.timetable && context.timetable.length > 0 ? `
Today's Class Schedule:
${context.timetable.slice(0, 5).map(t => `- ${t.subject} at ${t.time} in ${t.room} (${t.professor})`).join('\n')}
` : ''}

${context.faculty && context.faculty.length > 0 ? `
Faculty Directory:
${context.faculty.slice(0, 5).map(f => `- ${f.name} (${f.department}) - ${f.email}, Office: ${f.office}`).join('\n')}
` : ''}

${context.announcements && context.announcements.length > 0 ? `
Recent Announcements:
${context.announcements.slice(0, 3).map(a => `- ${a.title}: ${a.message}`).join('\n')}
` : ''}

Student Query: ${message}

Instructions:
- Provide helpful, accurate, and concise responses
- Use the context above to answer questions about events, classes, faculty, etc.
- If asked about specific information not in the context, politely say you don't have that information
- Be friendly and professional
- Keep responses under 200 words unless more detail is needed
- Format responses clearly with line breaks where appropriate

Response:`;
}

app.listen(PORT, () => {
  console.log(`🚀 Groq AI Backend running on http://localhost:${PORT}`);
});

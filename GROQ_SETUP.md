# 🚀 Groq AI Setup Guide

## Quick Start

### 1. Get Groq API Key (FREE)

1. Go to https://console.groq.com/
2. Sign up / Login
3. Go to API Keys section
4. Create new API key
5. Copy the key

### 2. Configure Backend

```bash
cd backend
```

Edit `.env` file:
```
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Backend

```bash
npm start
```

You should see:
```
🚀 Groq AI Backend running on http://localhost:5000
```

### 5. Start Frontend

In another terminal:
```bash
cd ..
npx expo start
```

### 6. Test Chat

Open the app and go to Chat screen. Ask:
- "What is my next class?"
- "Tell me about upcoming events"
- "Who is Dr. Smith?"

## API Endpoints

### Health Check
```
GET http://localhost:5000/health
Response: { "status": "ok", "message": "Groq AI Backend Running" }
```

### Chat
```
POST http://localhost:5000/ask
Body: {
  "message": "What is my next class?",
  "context": { student, events, timetable, faculty }
}
Response: { "reply": "Your next class is..." }
```

## Groq Free Tier

- **Model**: LLaMA 3 8B (8192 tokens)
- **Requests**: 14,400 per day
- **Rate Limit**: 30 requests per minute
- **Cost**: FREE

## Troubleshooting

### Backend not starting
```bash
cd backend
rm -rf node_modules
npm install
npm start
```

### "API key invalid"
- Check `.env` file has correct key
- Restart backend after changing `.env`

### "Connection refused"
- Make sure backend is running on port 5000
- Check firewall settings

## Architecture

```
Frontend (Expo) → http://localhost:5000/ask → Groq API
                                            ↓
                                    LLaMA 3 8B Model
                                            ↓
                                    AI Response
```

## Benefits vs Gemini

✅ **Free**: No billing required
✅ **Fast**: Faster response times
✅ **Reliable**: Better model availability
✅ **Simple**: Easy OpenAI SDK integration
✅ **Generous**: 14,400 requests/day

---

**Status**: ✅ Ready to Use

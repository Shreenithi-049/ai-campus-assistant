# 🤖 Gemini AI Integration - Production Guide

## Overview

The Chat screen now uses **Google Gemini 1.5 Flash** for intelligent, context-aware responses.

---

## ✅ What's Implemented

### Frontend (React Native)
- ✅ Removed all quick suggestions UI
- ✅ Real Gemini API integration via Cloud Function
- ✅ Context building from service layer (events, timetable, faculty)
- ✅ Loading states and error handling
- ✅ Performance optimizations (React.memo, useCallback)
- ✅ Disabled send button while processing
- ✅ Typing indicator during API call

### Backend (Firebase Cloud Function)
- ✅ Gemini 1.5 Flash model
- ✅ Secure API key in environment variables
- ✅ CORS enabled for frontend
- ✅ Context-aware prompt building
- ✅ Error handling and logging
- ✅ Proper response formatting

---

## 🚀 Setup Instructions

### Step 1: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the API key

### Step 2: Setup Firebase Functions

```bash
cd ai-campus-assistant

# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Functions (if not done)
firebase init functions
# Select: Use existing project
# Language: JavaScript
# ESLint: No
# Install dependencies: Yes

# Install dependencies
cd functions
npm install

# Set Gemini API key
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"
```

### Step 3: Deploy Cloud Function

```bash
# Deploy function
firebase deploy --only functions

# After deployment, you'll get a URL like:
# https://us-central1-your-project.cloudfunctions.net/geminiChat
```

### Step 4: Update Frontend Environment

Edit `.env`:
```bash
EXPO_PUBLIC_GEMINI_API_URL=https://us-central1-your-project.cloudfunctions.net/geminiChat
```

### Step 5: Test

```bash
# Restart Expo
npx expo start --clear

# Open app and test chat
```

---

## 🧪 Testing

### Test Queries

**Timetable Questions:**
- "What is my next class?"
- "Show me today's schedule"
- "When do I have Database Systems?"

**Event Questions:**
- "Are there any upcoming events?"
- "Tell me about the Tech Symposium"
- "What events are happening this week?"

**Faculty Questions:**
- "Who teaches Data Structures?"
- "What is Dr. Smith's email?"
- "Show me faculty office hours"

**General Questions:**
- "Where is the library?"
- "How do I register for events?"
- "Tell me about SKCET"

---

## 📊 How It Works

### 1. User Sends Message

```javascript
handleSend("What is my next class?")
```

### 2. Build Context

```javascript
const context = await buildAIContext(userProfile);
// Returns: { student, events, timetable, faculty, announcements }
```

### 3. Call Cloud Function

```javascript
const result = await sendMessageToAI(message, context);
```

### 4. Cloud Function Processes

```javascript
// Build prompt with context
const prompt = buildPrompt(message, context);

// Call Gemini API
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const result = await model.generateContent(prompt);

// Return response
return { response: result.response.text() };
```

### 5. Display Response

```javascript
setMessages(prev => [...prev, {
  id: Date.now(),
  text: result.response,
  isAI: true,
  timestamp: new Date()
}]);
```

---

## 🔐 Security

### API Key Protection
- ✅ API key stored in Firebase Functions config
- ✅ Never exposed to frontend
- ✅ Environment variable only

### CORS Configuration
```javascript
res.set('Access-Control-Allow-Origin', '*');
```

For production, restrict to your domain:
```javascript
res.set('Access-Control-Allow-Origin', 'https://yourdomain.com');
```

---

## 🎯 Context Structure

```javascript
{
  student: {
    name: "John Doe",
    department: "Computer Science",
    year: "3rd Year",
    semester: "6th Semester"
  },
  events: [
    { title, date, time, location, category }
  ],
  timetable: [
    { subject, time, room, professor }
  ],
  faculty: [
    { name, department, email, office }
  ],
  announcements: [
    { title, message, date, priority }
  ]
}
```

---

## ⚡ Performance Optimizations

### React.memo
```javascript
const MessageBubble = React.memo(({ item, theme }) => { ... });
const TypingIndicator = React.memo(({ theme }) => { ... });
```

### useCallback
```javascript
const handleSend = useCallback(async (text) => { ... }, [inputText, isSending, userProfile]);
const renderMessage = useCallback(({ item }) => { ... }, [theme]);
const keyExtractor = useCallback((item) => item.id.toString(), []);
```

### Disabled State
```javascript
disabled={!inputText.trim() || isSending}
```

---

## 🐛 Error Handling

### Network Errors
```javascript
catch (error) {
  return {
    success: false,
    error: error.message
  };
}
```

### Fallback Message
```
"Sorry, I'm having trouble connecting right now. Please try again."
```

### Backend Errors
```javascript
res.status(500).json({ 
  error: 'Failed to generate response',
  message: error.message 
});
```

---

## 📈 Monitoring

### View Logs
```bash
# Real-time logs
firebase functions:log

# Specific function
firebase functions:log --only geminiChat
```

### Firebase Console
- Go to Firebase Console → Functions
- View invocations, errors, execution time
- Monitor usage and costs

---

## 💰 Cost Estimation

### Gemini API (Free Tier)
- 15 requests per minute
- 1,500 requests per day
- Free for development

### Firebase Functions (Free Tier)
- 2M invocations/month
- 400K GB-seconds/month
- 200K CPU-seconds/month

**Estimated Cost:** $0 for development, ~$5-10/month for production with moderate usage

---

## 🔄 Development vs Production

### Development Mode
```bash
EXPO_PUBLIC_USE_FIRESTORE=false
# Uses sample data for context
```

### Production Mode
```bash
EXPO_PUBLIC_USE_FIRESTORE=true
# Uses real-time Firestore data
# AI responses reflect admin updates instantly
```

---

## 🚨 Troubleshooting

### "Sorry, I'm having trouble connecting"

**Check:**
1. Cloud Function deployed: `firebase functions:list`
2. API URL correct in `.env`
3. Gemini API key set: `firebase functions:config:get`
4. Network connection working
5. Check logs: `firebase functions:log`

### "Empty response from AI"

**Check:**
1. Gemini API key valid
2. API quota not exceeded
3. Backend logs for errors

### "CORS error"

**Fix:**
```javascript
// In functions/index.js
res.set('Access-Control-Allow-Origin', '*');
```

---

## 📝 Files Modified

```
screens/ModernChatScreen.js       ← Updated with Gemini integration
services/geminiService.js         ← New: API service
services/aiContextService.js      ← Existing: Context builder
functions/index.js                ← New: Cloud Function
functions/package.json            ← New: Dependencies
.env.example                      ← Updated: Added GEMINI_API_URL
```

---

## ✅ Checklist

### Setup
- [ ] Get Gemini API key
- [ ] Install Firebase CLI
- [ ] Initialize Firebase Functions
- [ ] Set API key in Functions config
- [ ] Deploy Cloud Function
- [ ] Update `.env` with function URL
- [ ] Restart Expo

### Testing
- [ ] Test timetable questions
- [ ] Test event questions
- [ ] Test faculty questions
- [ ] Test error handling
- [ ] Test loading states
- [ ] Verify context is passed correctly

### Production
- [ ] Restrict CORS to your domain
- [ ] Monitor usage and costs
- [ ] Set up error alerts
- [ ] Enable Firestore for real-time data

---

## 🎉 Expected Behavior

**User:** "What is my next class?"

**AI:** "Based on your schedule, your next class is Database Systems at 11:00 AM - 12:30 PM in room ENG-205 with Dr. Johnson."

**User:** "Are there any upcoming events?"

**AI:** "Yes! Here are the upcoming events:
- Tech Symposium 2024 on March 15, 2024 at 10:00 AM in Main Auditorium
- Cultural Fest on March 20, 2024 at 2:00 PM at Open Ground
- Sports Day on March 25, 2024 at 8:00 AM at Sports Complex"

---

**Status:** ✅ Production Ready - Gemini AI Integrated

# 🚀 Quick Start: Scalable Architecture

## Current Status

✅ **Service Layer:** Complete  
✅ **Sample Data:** Ready for development  
✅ **Environment Switching:** Configured  
✅ **Screens Updated:** Events, Academic  
✅ **Security Rules:** Admin-ready  

---

## 🔧 Development Mode (Current)

### 1. Environment Setup

Your `.env` should have:
```bash
EXPO_PUBLIC_USE_FIRESTORE=false
```

### 2. How It Works

- All screens use **service layer** (`services/*.js`)
- Services return **sample data** from `data/sampleData.js`
- No Firestore calls made
- Fast development without backend setup

### 3. Adding New Data

Edit `data/sampleData.js`:
```javascript
export const sampleEvents = [
  { id: 'evt1', title: 'New Event', ... },
  // Add more events
];
```

---

## 🌐 Production Mode (Future)

### 1. Switch Environment

Update `.env`:
```bash
EXPO_PUBLIC_USE_FIRESTORE=true
```

### 2. Setup Firestore Collections

Create these collections in Firebase Console:

```
/events
/timetables/{department}/years/{year}
/faculty
/announcements
/students/{uid}/syllabus/current
```

### 3. Deploy Security Rules

Use `firestore.rules.admin` when admin dashboard is ready:
```bash
firebase deploy --only firestore:rules
```

### 4. Test Real-time

- Open student app
- Update data in Firebase Console
- App updates instantly ✨

---

## 📱 Using Services in Screens

### Events Example

```javascript
import { subscribeToEvents } from '../services/eventsService';

useEffect(() => {
  const unsubscribe = subscribeToEvents(
    (events) => setEvents(events),
    (error) => console.error(error)
  );
  return unsubscribe; // Cleanup
}, []);
```

### Timetable Example

```javascript
import { subscribeToTimetable } from '../services/timetableService';

useEffect(() => {
  const unsubscribe = subscribeToTimetable(
    'Computer Science',
    '3rd Year',
    (timetable) => setTimetable(timetable),
    (error) => console.error(error)
  );
  return unsubscribe;
}, []);
```

---

## 🤖 AI Context

### Use in Chat Screen

```javascript
import { buildAIContext, generateAIPrompt } from '../services/aiContextService';

const handleSend = async (userQuery) => {
  const context = await buildAIContext(userProfile);
  const prompt = generateAIPrompt(userQuery, context);
  
  // Send prompt to AI API
  // AI now has latest events, timetable, faculty data
};
```

---

## 🎯 Service Layer API

### Events Service
```javascript
subscribeToEvents(onSuccess, onError) // Real-time
getEvents() // One-time fetch
```

### Timetable Service
```javascript
subscribeToTimetable(department, year, onSuccess, onError)
getTimetable(department, year)
```

### Faculty Service
```javascript
subscribeToFaculty(onSuccess, onError)
getFaculty()
```

### Syllabus Service
```javascript
subscribeToSyllabus(studentId, onSuccess, onError)
getSyllabus(studentId)
```

### Announcements Service
```javascript
subscribeToAnnouncements(onSuccess, onError)
getAnnouncements()
```

---

## 🔐 Admin Dashboard (Future)

### Adding Admin Role

In Firestore, update student document:
```javascript
{
  email: "admin@skcet.ac.in",
  fullName: "Admin User",
  role: "admin", // Add this field
  ...
}
```

### Admin Operations

```javascript
// Add event
await addDoc(collection(db, 'events'), {
  title: 'New Event',
  date: '2024-03-20',
  category: 'academic',
  ...
});

// Update timetable
await setDoc(doc(db, 'timetables', 'CS', 'years', '3rd'), {
  schedule: [...]
});

// Students see changes instantly!
```

---

## ✅ Testing Checklist

### Development Mode
- [ ] Set `USE_FIRESTORE=false`
- [ ] Run app: `npx expo start`
- [ ] Events screen shows sample data
- [ ] Academic screen shows sample data
- [ ] No Firestore errors in console

### Production Mode
- [ ] Set `USE_FIRESTORE=true`
- [ ] Create Firestore collections
- [ ] Add sample production data
- [ ] Run app
- [ ] Data loads from Firestore
- [ ] Update data in console → app updates

---

## 🐛 Troubleshooting

### "Events not loading"
- Check `USE_FIRESTORE` value in `.env`
- Restart Expo: `npx expo start --clear`

### "Firestore permission denied"
- Deploy security rules: `firebase deploy --only firestore:rules`
- Check user is authenticated

### "Sample data not showing"
- Verify `USE_FIRESTORE=false`
- Check `data/sampleData.js` exists

---

## 📚 Files Reference

```
services/
├── eventsService.js          ← Events data
├── timetableService.js       ← Timetable data
├── facultyService.js         ← Faculty data
├── syllabusService.js        ← Syllabus data
├── announcementsService.js   ← Announcements
└── aiContextService.js       ← AI context builder

data/
└── sampleData.js             ← All sample data

firestore.rules.admin         ← Production rules with admin
.env.example                  ← Environment template
SCALABLE_ARCHITECTURE.md      ← Full documentation
```

---

**Next Steps:**
1. Continue development with sample data
2. Build more features
3. When ready, switch to production mode
4. Build admin dashboard later

**No code rewrites needed! 🎉**

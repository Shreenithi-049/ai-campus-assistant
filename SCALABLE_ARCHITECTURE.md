# 🏗️ Scalable Data Architecture

## Overview

This document describes the **production-ready data architecture** designed to support both development (sample data) and production (real-time Firestore) modes without code rewrites.

---

## 🎯 Architecture Goals

✅ **Development Mode:** Use sample data for rapid development  
✅ **Production Mode:** Real-time Firestore with admin dashboard support  
✅ **Zero UI Changes:** Switch modes via environment variable only  
✅ **Real-time Sync:** Student dashboard reflects admin updates instantly  
✅ **AI Context:** AI uses latest data from service layer  
✅ **Scalable:** Ready for future admin dashboard  

---

## 📁 Service Layer Structure

```
services/
├── eventsService.js          # Events data abstraction
├── timetableService.js       # Timetable data abstraction
├── facultyService.js         # Faculty data abstraction
├── syllabusService.js        # Syllabus data abstraction
├── announcementsService.js   # Announcements data abstraction
├── authService.js            # Authentication (existing)
└── firestoreService.js       # User profile only (existing)

data/
└── sampleData.js             # All sample data for development
```

---

## 🔄 Environment-Based Switching

### Configuration

Add to `.env`:
```bash
# Development mode (uses sample data)
EXPO_PUBLIC_USE_FIRESTORE=false

# Production mode (uses real-time Firestore)
EXPO_PUBLIC_USE_FIRESTORE=true
```

### How It Works

Each service checks the environment variable:

```javascript
const USE_FIRESTORE = process.env.EXPO_PUBLIC_USE_FIRESTORE === 'true';

export const subscribeToEvents = (onSuccess, onError) => {
  if (!USE_FIRESTORE) {
    // Development: Return sample data
    setTimeout(() => onSuccess(sampleEvents), 100);
    return () => {}; // No-op unsubscribe
  }

  // Production: Real-time Firestore listener
  const eventsRef = collection(db, 'events');
  const q = query(eventsRef, orderBy('date', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    onSuccess(events);
  }, onError);
};
```

---

## 🗄️ Firestore Collection Structure

### Production Schema

```
/students/{studentId}
  - email, fullName, studentId, department, year, etc.
  
  /syllabus/current
    - subjects: [{ subject, progress, topics, completed }]

/events/{eventId}
  - title, category, date, time, location, attendees, color, icon, description

/timetables/{department}/years/{year}
  - schedule: [{ subject, time, room, professor, color, day }]

/faculty/{facultyId}
  - name, department, email, office, hours, phone

/announcements/{announcementId}
  - title, message, date, priority
```

### Why This Structure?

- **Scalable:** Each collection can grow independently
- **Admin-Friendly:** Admin dashboard writes to same collections
- **Real-time Ready:** Students listen with `onSnapshot()`
- **Secure:** Firestore rules control read/write access

---

## 🔐 Firestore Security Rules (Future)

Update `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             get(/databases/$(database)/documents/students/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Students collection
    match /students/{studentId} {
      allow read: if request.auth != null && request.auth.uid == studentId;
      allow update: if request.auth != null && request.auth.uid == studentId;
      allow create, delete: if isAdmin();
      
      match /syllabus/{document=**} {
        allow read: if request.auth != null && request.auth.uid == studentId;
        allow write: if isAdmin();
      }
    }
    
    // Events - Students read, Admin write
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    
    // Timetables - Students read, Admin write
    match /timetables/{document=**} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    
    // Faculty - Students read, Admin write
    match /faculty/{facultyId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    
    // Announcements - Students read, Admin write
    match /announcements/{announcementId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
  }
}
```

---

## 📱 Screen Integration

### Before (Hardcoded Data)

```javascript
// ❌ BAD: Hardcoded in screen
const events = [
  { id: 1, title: 'Event 1', ... },
  { id: 2, title: 'Event 2', ... },
];
```

### After (Service Layer)

```javascript
// ✅ GOOD: Use service layer
import { subscribeToEvents } from '../services/eventsService';

useEffect(() => {
  const unsubscribe = subscribeToEvents(
    (events) => setEvents(events),
    (error) => console.error(error)
  );
  return unsubscribe;
}, []);
```

---

## 🤖 AI Context Integration

### Chat Screen Should Use Service Layer

```javascript
import { getEvents } from '../services/eventsService';
import { getTimetable } from '../services/timetableService';
import { getFaculty } from '../services/facultyService';

const buildAIContext = async () => {
  const events = await getEvents();
  const timetable = await getTimetable(department, year);
  const faculty = await getFaculty();
  
  return {
    events,
    timetable,
    faculty,
    // AI now uses real-time data
  };
};
```

---

## 🚀 Future Admin Dashboard

### Admin Can:

1. **Add/Edit/Delete Events**
   ```javascript
   await addDoc(collection(db, 'events'), eventData);
   await updateDoc(doc(db, 'events', eventId), updates);
   await deleteDoc(doc(db, 'events', eventId));
   ```

2. **Update Timetables**
   ```javascript
   await setDoc(doc(db, 'timetables', dept, 'years', year), { schedule });
   ```

3. **Manage Faculty**
   ```javascript
   await addDoc(collection(db, 'faculty'), facultyData);
   ```

4. **Post Announcements**
   ```javascript
   await addDoc(collection(db, 'announcements'), announcement);
   ```

### Student Dashboard Automatically Updates

Because students use `onSnapshot()` listeners, changes appear **instantly** without refresh.

---

## ✅ Migration Checklist

### Phase 1: Development (Current)
- [x] Create service layer abstraction
- [x] Move sample data to `data/sampleData.js`
- [x] Update screens to use services
- [x] Test with `USE_FIRESTORE=false`

### Phase 2: Production Setup
- [ ] Set `EXPO_PUBLIC_USE_FIRESTORE=true` in `.env`
- [ ] Create Firestore collections manually
- [ ] Add sample production data
- [ ] Update security rules with admin role
- [ ] Test real-time listeners

### Phase 3: Admin Dashboard (Future)
- [ ] Build admin web interface
- [ ] Implement CRUD operations
- [ ] Add admin role to specific users
- [ ] Deploy security rules
- [ ] Test end-to-end flow

---

## 🧪 Testing

### Development Mode
```bash
# .env
EXPO_PUBLIC_USE_FIRESTORE=false

# Run app - uses sample data
npx expo start
```

### Production Mode
```bash
# .env
EXPO_PUBLIC_USE_FIRESTORE=true

# Run app - uses Firestore
npx expo start
```

### Verify Real-time Sync
1. Open student app
2. Open Firebase Console
3. Update an event in Firestore
4. Student app updates **instantly**

---

## 📊 Benefits

| Feature | Before | After |
|---------|--------|-------|
| Data Source | Hardcoded | Service Layer |
| Mode Switch | Rewrite Code | Environment Variable |
| Real-time | No | Yes (Production) |
| Admin Ready | No | Yes |
| AI Context | Static | Dynamic |
| Scalability | Low | High |

---

## 🎓 Best Practices

1. **Never import sample data directly in screens**
2. **Always use service layer functions**
3. **Clean up listeners in useEffect return**
4. **Handle errors in onError callbacks**
5. **Use environment variables for config**
6. **Document Firestore schema changes**

---

## 📞 Support

For questions about this architecture:
- Review service files in `/services`
- Check sample data in `/data/sampleData.js`
- Test with both environment modes

---

**Status:** ✅ Architecture Complete - Ready for Development & Production

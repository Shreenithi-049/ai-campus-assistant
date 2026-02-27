# 📱 IntelliCamp - AI-Powered Campus Assistant
## Complete Project Documentation

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technologies Used](#technologies-used)
4. [Features Implemented](#features-implemented)
5. [Setup Instructions](#setup-instructions)
6. [Project Structure](#project-structure)
7. [Database Schema](#database-schema)
8. [Security Implementation](#security-implementation)
9. [API Documentation](#api-documentation)
10. [Testing Guide](#testing-guide)
11. [Deployment Guide](#deployment-guide)
12. [Future Enhancements](#future-enhancements)

---

## 1. Project Overview

### Problem Statement
Students at SKCET face challenges in accessing campus information, navigating facilities, tracking events, and managing academic schedules. Information is scattered across multiple platforms, leading to inefficiency and missed opportunities.

### Solution
IntelliCamp is a unified mobile and web application that provides:
- AI-powered chatbot for instant query resolution
- Real-time event management
- Interactive campus navigation
- Centralized academic information
- Personalized student dashboard
- Secure authentication with email verification

### Target Users
- SKCET Students (Primary)
- Faculty Members (Future)
- Campus Administrators (Future)

---

## 2. System Architecture

### Architecture Pattern: Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 PRESENTATION LAYER                       │
│  React Native (Expo) - Cross-platform UI                │
│  • 12 Screens                                            │
│  • Global Dark Mode                                      │
│  • Real-time Updates                                     │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                 APPLICATION LAYER                        │
│  Service Layer Abstraction                              │
│  • eventsService.js                                      │
│  • timetableService.js                                   │
│  • facultyService.js                                     │
│  • authService.js                                        │
│  • aiContextService.js                                   │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER                            │
│  • Firebase Authentication                               │
│  • Firestore Database                                    │
│  • Groq AI Backend (Express)                             │
│  • Sample Data (Development)                             │
└─────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

**1. Service Layer Abstraction**
- Decouples data source from UI
- Environment-based switching (development/production)
- Easy to add new data sources

**2. Microservices Approach**
- Separate backend for AI (Groq)
- Firebase for auth and data
- Independent scaling

**3. Real-time Synchronization**
- Firestore `onSnapshot()` listeners
- Instant UI updates
- No manual refresh needed

---

## 3. Technologies Used

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.81.5 | Cross-platform development |
| Expo | ~54.0.33 | Development framework |
| React Navigation | 7.x | Navigation management |
| React Native Reanimated | 4.0.0 | Animations |
| Expo Linear Gradient | 14.0.1 | UI gradients |
| Expo Vector Icons | 14.0.4 | Icons |
| AsyncStorage | 2.1.0 | Local storage |

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Express.js | 4.18.2 | API server |
| Groq AI | Latest | AI chatbot (LLaMA 3.3 70B) |
| OpenAI SDK | 4.20.1 | Groq integration |
| Firebase Auth | 12.9.0 | User authentication |
| Firestore | 12.9.0 | NoSQL database |
| CORS | 2.8.5 | Cross-origin requests |
| dotenv | 16.3.1 | Environment variables |

---

## 4. Features Implemented

### ✅ Authentication & Security
- **Email/Password Authentication**
  - Firebase Authentication
  - Email domain restriction (@skcet.ac.in only)
  - Password validation (8+ chars, uppercase, lowercase, number, special)
  
- **Email Verification**
  - Auto-send on signup
  - Real-time status checking
  - Verification banner

- **Security Features**
  - 24-hour session timeout
  - Email-based password reset
  - Firestore security rules
  - Environment variables for secrets

### ✅ User Interface (12 Screens)

1. **Splash Screen**
   - Animated logo
   - Auto-navigation

2. **Login Screen**
   - Email/password input
   - Domain validation
   - Error handling

3. **Signup Screen**
   - User registration
   - Profile creation
   - Email verification

4. **Home Screen**
   - Personalized greeting
   - AI suggestions
   - Quick access cards
   - Verification banner

5. **Chat Screen**
   - AI assistant (Groq-powered)
   - Context-aware responses
   - Message history
   - Loading states

6. **Map Screen**
   - Interactive campus map
   - 5 building markers
   - Building information
   - Navigation assistance

7. **Events Screen**
   - Real-time event listings
   - Category filters (All, Academic, Cultural, Sports)
   - Registration status
   - Event details

8. **Academic Screen**
   - **Timetable Tab**: Class schedules
   - **Faculty Tab**: Directory with contacts
   - **Syllabus Tab**: Progress tracking

9. **Profile Screen**
   - User information
   - Photo upload
   - Statistics
   - Settings menu

10. **Edit Profile Screen**
    - 10+ editable fields
    - Real-time Firestore updates
    - Validation

11. **Security Screen**
    - Email verification status
    - Send verification email
    - Password reset

12. **Help Screen**
    - User manual
    - Feature explanations
    - FAQs

### ✅ Global Dark Mode
- Persistent theme (AsyncStorage)
- Toggle from any screen
- Centralized theme management
- Light and dark color schemes

### ✅ Service Layer Architecture

**Purpose**: Abstract data sources for scalability

**Services**:
```javascript
// Environment-based switching
const USE_FIRESTORE = process.env.EXPO_PUBLIC_USE_FIRESTORE === 'true';

if (!USE_FIRESTORE) {
  // Development: Sample data
  return sampleData;
}

// Production: Real-time Firestore
return onSnapshot(collection, callback);
```

**Implemented Services**:
- `eventsService.js` - Event management
- `timetableService.js` - Class schedules
- `facultyService.js` - Faculty directory
- `syllabusService.js` - Course progress
- `announcementsService.js` - Campus announcements
- `aiContextService.js` - AI context builder
- `authService.js` - Authentication
- `firestoreService.js` - User profiles

### ✅ AI Integration (Groq)

**Model**: LLaMA 3.3 70B Versatile

**Features**:
- Context-aware responses
- Campus-specific knowledge
- Student profile integration
- Event/timetable/faculty data in context
- Error handling

**Backend API**:
```javascript
POST /ask
Request: { message, context }
Response: { reply }
```

**Free Tier**:
- 14,400 requests/day
- 30 requests/minute
- No billing required

### ✅ Real-time Data Synchronization
- Firestore `onSnapshot()` listeners
- Automatic UI updates
- Memory leak prevention
- Proper cleanup

### ✅ Performance Optimizations
- `React.memo()` for components
- `useCallback()` for functions
- `useMemo()` for computed values
- Skeleton loaders
- Optimized FlatList rendering

---

## 5. Setup Instructions

### Prerequisites
- Node.js >= 18.x
- npm or yarn
- Expo CLI
- Firebase account
- Groq account (free)

### Installation Steps

**1. Clone Repository**
```bash
git clone <repository-url>
cd ai-campus-assistant
```

**2. Install Dependencies**
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

**3. Setup Environment Variables**

Create `.env` in root:
```bash
cp .env.example .env
```

Edit `.env`:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_USE_FIRESTORE=false
```

Create `backend/.env`:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
PORT=5000
GROQ_API_KEY=your_groq_api_key
```

**4. Get API Keys**

**Firebase** (Free):
1. Go to https://console.firebase.google.com/
2. Create project
3. Enable Authentication (Email/Password)
4. Create Firestore database
5. Copy config to `.env`

**Groq** (Free):
1. Go to https://console.groq.com/
2. Sign up / Login
3. Create API key
4. Copy to `backend/.env`

**5. Start Application**

Terminal 1 (Backend):
```bash
cd backend
npm start
```

Terminal 2 (Frontend):
```bash
npx expo start
```

Press `w` for web, `a` for Android, `i` for iOS

---

## 6. Project Structure

```
ai-campus-assistant/
├── assets/                          # Images
│   └── IntelliCamp_logo.png
├── backend/                         # AI Backend
│   ├── server.js                    # Express + Groq
│   ├── package.json
│   ├── .env                         # API keys (not in Git)
│   └── .env.example                 # Template
├── components/                      # Reusable UI
│   ├── BottomNavigation.js
│   ├── GlassCard.js
│   ├── ModernButton.js
│   ├── ModernInput.js
│   ├── ProtectedRoute.js
│   ├── SkeletonLoaders.js
│   └── VerificationBanner.js
├── constants/
│   └── modernTheme.js               # Theme system
├── contexts/
│   └── AuthContext.js               # Global state
├── data/
│   └── sampleData.js                # Development data
├── screens/                         # 12 Screens
│   ├── SplashScreen.js
│   ├── ModernLoginScreen.js
│   ├── ModernSignupScreen.js
│   ├── ModernHomeScreen.js
│   ├── ModernChatScreen.js
│   ├── ModernMapScreen.js
│   ├── ModernEventsScreen.js
│   ├── ModernAcademicScreen.js
│   ├── ModernProfileScreen.js
│   ├── EditProfileScreen.js
│   ├── SecurityScreen.js
│   └── HelpScreen.js
├── services/                        # Service layer
│   ├── authService.js
│   ├── firestoreService.js
│   ├── eventsService.js
│   ├── eventRegistrationService.js  # NEW: Event registration
│   ├── timetableService.js
│   ├── facultyService.js
│   ├── syllabusService.js
│   ├── announcementsService.js
│   ├── aiContextService.js
│   └── geminiService.js             # AI API calls
├── utils/
│   └── validators.js
├── CampusAI.js                      # Main navigator
├── index.js                         # Entry point
├── .env                             # Secrets (not in Git)
├── .env.example                     # Template
├── .gitignore
├── app.json
├── package.json
├── README.md
└── DOCUMENTATION.md                 # This file
```

---

## 7. Database Schema

### Firestore Collections

**students** (User Profiles)
```javascript
{
  uid: "firebase_uid",
  email: "student@skcet.ac.in",
  fullName: "John Doe",
  studentId: "CS2024001",
  role: "student",
  year: "3rd Year",
  semester: "6th Semester",
  department: "Computer Science",
  dateOfBirth: "2003-05-15",
  phoneNumber: "+91 9876543210",
  gender: "Male",
  bloodGroup: "O+",
  emergencyContact: "+91 9876543211",
  photoURL: "data:image/jpeg;base64,...",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**events** (Campus Events)
```javascript
{
  id: "evt1",
  title: "Tech Symposium 2024",
  category: "academic",
  date: "March 15, 2024",
  time: "10:00 AM",
  location: "Main Auditorium",
  attendees: 250,
  color: "#3B82F6",
  icon: "school-outline",
  description: "Event description",
  registrationLink: "https://example.com/register", // Optional
  createdBy: "admin",
  createdAt: Timestamp
}
```

**eventRegistrations** (Event Registrations - NEW)
```javascript
{
  id: "auto-generated-id",
  userId: "firebase_uid",
  eventId: "evt1",
  eventTitle: "Tech Symposium 2024",
  registeredAt: Timestamp,
  status: "registered"
}
```

**timetables/{department}/years/{year}**
```javascript
{
  schedule: [
    {
      subject: "Data Structures",
      time: "9:00 AM - 10:30 AM",
      room: "ENG-301",
      professor: "Dr. Smith",
      color: "#3B82F6",
      day: "Monday"
    }
  ]
}
```

**faculty** (Faculty Directory)
```javascript
{
  name: "Dr. Sarah Smith",
  department: "Computer Science",
  email: "sarah.smith@skcet.ac.in",
  office: "ENG-501",
  hours: "Mon-Wed 2-4 PM",
  phone: "+91 9876543210"
}
```

**announcements** (Campus Announcements)
```javascript
{
  title: "Library Hours Extended",
  message: "Library open until 10 PM",
  date: "2024-03-10",
  priority: "high"
}
```

---

## 8. Security Implementation

### Authentication Security
- ✅ Email domain validation (@skcet.ac.in)
- ✅ Password strength requirements
- ✅ Email verification mandatory
- ✅ 24-hour session timeout
- ✅ Secure password reset

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Students can only access own data
    match /students/{userId} {
      allow read, update: if request.auth.uid == userId;
      allow create: if request.auth != null && 
                      request.resource.data.email.matches('.*@skcet\\.ac\\.in$');
    }
    
    // Events: Read-only for students
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow write: if false; // Admin only (future)
    }
    
    // Event Registrations: NEW
    match /eventRegistrations/{docId} {
      allow read, create: if request.auth != null
                          && request.auth.uid == request.resource.data.userId;
      allow update, delete: if false;
    }
    
    // Faculty: Read-only
    match /faculty/{facultyId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

### API Security
- ✅ CORS enabled
- ✅ API keys in environment variables
- ✅ No credentials in code
- ✅ Backend validation
- ✅ Error messages don't expose sensitive data

### Data Privacy
- ✅ HTTPS encryption
- ✅ Firestore encryption at rest
- ✅ No PII in logs
- ✅ Secure session management

---

## 9. API Documentation

### Backend API (Groq)

**Base URL**: `http://localhost:5000`

#### Health Check
```
GET /health

Response:
{
  "status": "ok",
  "message": "Groq AI Backend Running"
}
```

#### Chat Endpoint
```
POST /ask

Request:
{
  "message": "What is my next class?",
  "context": {
    "student": {
      "name": "John Doe",
      "department": "Computer Science",
      "year": "3rd Year"
    },
    "events": [...],
    "timetable": [...],
    "faculty": [...]
  }
}

Response:
{
  "reply": "Your next class is Database Systems at 11:00 AM..."
}

Error Response:
{
  "error": "Failed to generate response",
  "message": "Error details"
}
```

### Firebase Authentication API

Used via Firebase SDK:
- `signInWithEmailAndPassword()`
- `createUserWithEmailAndPassword()`
- `sendEmailVerification()`
- `sendPasswordResetEmail()`
- `signOut()`

### Firestore API

Used via Firebase SDK:
- `onSnapshot()` - Real-time listeners
- `getDoc()` - One-time fetch
- `updateDoc()` - Update document
- `setDoc()` - Create/overwrite document

---

## 10. Testing Guide

### Create Test User

**1. Firebase Console → Authentication**
```
Email: test@skcet.ac.in
Password: Test@123
```

**2. Firestore → students collection**
```javascript
Document ID: [user's UID]
{
  email: "test@skcet.ac.in",
  fullName: "Test User",
  studentId: "CS2024001",
  role: "student",
  year: "3rd Year",
  semester: "6th Semester",
  department: "Computer Science"
}
```

### Test Scenarios

**Authentication**:
- [ ] Signup with @skcet.ac.in email
- [ ] Signup with invalid email (should fail)
- [ ] Login with correct credentials
- [ ] Login with wrong password (should fail)
- [ ] Email verification flow
- [ ] Password reset flow
- [ ] Session timeout (24 hours)

**UI/UX**:
- [ ] All 12 screens accessible
- [ ] Dark mode toggle works
- [ ] Theme persists after restart
- [ ] Navigation smooth
- [ ] Animations working

**AI Chat**:
- [ ] Send message
- [ ] Receive AI response
- [ ] Context-aware answers
- [ ] Error handling
- [ ] Loading states

**Real-time Updates**:
- [ ] Update event in Firestore
- [ ] UI updates automatically
- [ ] No manual refresh needed

**Profile Management**:
- [ ] Upload photo
- [ ] Edit profile fields
- [ ] Changes save to Firestore
- [ ] Validation works

---

## 11. Deployment Guide

### Development (Current)
```
Frontend: http://localhost:8081 (Expo)
Backend: http://localhost:5000 (Express)
Database: Firebase (Development)
```

### Production Deployment

**Frontend (Expo)**:
```bash
# Build for production
eas build --platform android
eas build --platform ios

# Web deployment
npx expo export:web
# Deploy to Vercel/Netlify
```

**Backend (Express)**:

Option 1: Render.com (Free)
```bash
1. Push to GitHub
2. Connect to Render
3. Add environment variables
4. Deploy
```

Option 2: Railway.app
```bash
1. Push to GitHub
2. Connect to Railway
3. Add GROQ_API_KEY
4. Deploy
```

**Database (Firebase)**:
- Already cloud-hosted
- Auto-scales
- No deployment needed

**Environment Variables**:
```
Production .env:
- EXPO_PUBLIC_USE_FIRESTORE=true
- EXPO_PUBLIC_FIREBASE_* (production keys)
- GROQ_API_KEY (production key)
```

---

## 12. Future Enhancements

### Priority 1: Admin Dashboard
- Add/Edit/Delete events
- Set event registration links
- Update timetables
- Manage faculty
- Post announcements
- View analytics
- View event registrations by event
- Export registration data

### Priority 2: Role-Based Access
- Student role (read-only)
- Faculty role (limited write)
- Admin role (full access)
- Super admin (system settings)

### Priority 3: Push Notifications
- Event reminders
- Class changes
- Announcements
- AI responses

### Priority 4: Advanced AI
- Voice input/output
- Image recognition
- Personalized recommendations
- Multi-language support

### Priority 5: Social Features
- Student forums
- Study groups
- Event RSVPs
- Campus feed

### Priority 6: Integrations
- ERP system
- Library management
- Attendance tracking
- Exam results

---

## 📊 Project Statistics

- **Total Screens**: 12
- **Service Files**: 8
- **Components**: 7
- **Lines of Code**: ~5,000+
- **Dependencies**: 15 (frontend) + 4 (backend)
- **Development Time**: 6 weeks
- **Status**: Production Ready 🟢

---

## 🎯 Key Achievements

1. ✅ Fully functional mobile and web app
2. ✅ AI integration with Groq (free tier)
3. ✅ Real-time Firestore synchronization
4. ✅ Scalable service layer architecture
5. ✅ Production-ready security
6. ✅ Clean, maintainable codebase
7. ✅ Comprehensive documentation

---

## 🚀 Quick Commands

```bash
# Start development
npm start                    # Frontend
cd backend && npm start      # Backend

# Install dependencies
npm install                  # Root
cd backend && npm install    # Backend

# Build for production
eas build --platform android
eas build --platform ios

# Deploy backend
git push heroku main         # Heroku
# or use Render/Railway dashboard
```

---

## 📞 Support

**Institution**: SKCET  
**Email Domain**: @skcet.ac.in  
**Version**: 1.0.0  
**Status**: 🟢 Production Ready

---

**Made with ❤️ for SKCET Students**

*Last Updated: January 2025*

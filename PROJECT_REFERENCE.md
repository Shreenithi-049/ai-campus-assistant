# IntelliCamp — Project Reference

> AI-Powered Campus Assistant for SKCET Students  
> Version: 1.0.0 | Status: Production Ready

---

## 1. What This Project Is

IntelliCamp is a **React Native (Expo)** mobile + web app exclusively for SKCET students. It combines Firebase authentication, real-time Firestore data, and a Groq AI backend to give students a smart campus companion.

**Only `@skcet.ac.in` emails can register or login.**

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React Native 0.81.5 + Expo ~54.0.33 |
| Navigation | React Navigation 7.x (Stack + Bottom Tabs) |
| Auth & DB | Firebase 12.9.0 (Auth + Firestore) |
| AI Backend | Express.js + Groq API (llama-3.3-70b-versatile) |
| Animations | React Native Reanimated ~4.1.1 |
| UI Effects | expo-blur, expo-linear-gradient |
| Icons | @expo/vector-icons (Ionicons) |
| Storage | AsyncStorage (dark mode + session) |

---

## 3. Project Structure

```
ai-campus-assistant/
├── index.js                    # App entry point (registerRootComponent)
├── CampusAI.js                 # Root navigator (Stack + Tab setup)
├── app.json                    # Expo config (name, icons, bundle IDs)
├── package.json                # Dependencies
├── firestore.rules             # Firestore security rules
├── .env                        # Firebase + feature flags (never commit)
│
├── assets/
│   └── IntelliCamp_logo-removebg-preview.png
│
├── constants/
│   └── modernTheme.js          # lightTheme, darkTheme, spacing, typography, shadows
│
├── contexts/
│   └── AuthContext.js          # Global auth state, dark mode, session timeout
│
├── utils/
│   └── validators.js           # validateCollegeEmail, validatePassword, getAuthErrorMessage
│
├── data/
│   └── sampleData.js           # Dev-mode fallback data (events, timetable, faculty, etc.)
│
├── components/
│   ├── BottomNavigation.js     # Custom animated tab bar
│   ├── GlassCard.js            # BlurView glassmorphism card
│   ├── ModernButton.js         # Animated button (primary/secondary/outline/glass)
│   ├── ModernInput.js          # Styled text input with icon + error
│   ├── ProtectedRoute.js       # Redirects unauthenticated users to Login
│   ├── SkeletonLoaders.js      # Loading placeholders (Profile, Event, Academic, Faculty)
│   └── VerificationBanner.js  # Banner shown when email/profile is incomplete
│
├── services/
│   ├── firebaseConfig.js       # Firebase init (auth, db) from env vars
│   ├── authService.js          # register, login, logout, verify email, reset password
│   ├── firestoreService.js     # Real-time user profile listener (onSnapshot)
│   ├── eventsService.js        # Events (Firestore or sample data)
│   ├── timetableService.js     # Timetable by dept/year
│   ├── facultyService.js       # Faculty directory
│   ├── syllabusService.js      # Syllabus progress per student
│   ├── attendanceService.js    # Attendance from student doc
│   ├── announcementsService.js # Campus announcements
│   ├── eventRegistrationService.js  # Register/check/get event registrations
│   ├── chatHistoryService.js   # Save/load/clear chat messages in Firestore
│   ├── geminiService.js        # HTTP call to backend /ask endpoint
│   └── aiContextService.js     # Builds AI context object + prompt from live data
│
├── screens/
│   ├── SplashScreen.js         # Animated logo → auto-navigates to Login after 4s
│   ├── ModernLoginScreen.js    # Email/password login with domain validation
│   ├── ModernSignupScreen.js   # Registration (name, email, studentId, password)
│   ├── ModernHomeScreen.js     # Dashboard: greeting, AI suggestion, popular queries
│   ├── ModernChatScreen.js     # AI chat with history persistence in Firestore
│   ├── ModernMapScreen.js      # Interactive campus map (5 buildings, modal details)
│   ├── ModernEventsScreen.js   # Events list with filters + registration
│   ├── ModernAcademicScreen.js # Timetable / Faculty / Syllabus / Attendance tabs
│   ├── ModernProfileScreen.js  # Profile card, settings, menu, logout
│   ├── EditProfileScreen.js    # Edit all profile fields → saves to Firestore
│   ├── SecurityScreen.js       # Email verification + password reset via email
│   ├── HelpScreen.js           # User manual (9 sections)
│   └── EventRegistrationScreen.js  # Open external link + confirm registration
│
└── backend/
    ├── server.js               # Express server: GET /health, POST /ask (Groq)
    ├── package.json
    ├── .env                    # GROQ_API_KEY
    └── .env.example
```

---

## 4. Navigation Flow

```
App Start
  └── AuthProvider (wraps everything)
        └── NavigationContainer
              └── AuthNavigator (Stack)
                    │
                    ├── [Not Authenticated]
                    │     ├── Splash → (4s) → Login
                    │     ├── Login
                    │     └── Signup → Login
                    │
                    └── [Authenticated]
                          ├── MainApp (Bottom Tabs)
                          │     ├── Home
                          │     ├── Chat (Ask Assistant)
                          │     ├── Map
                          │     ├── Academic
                          │     ├── Events
                          │     └── Profile
                          ├── EditProfile
                          ├── Security
                          ├── Help
                          └── EventRegistration
```

---

## 5. Authentication System

**File:** `services/authService.js` + `contexts/AuthContext.js`

### How it works:
1. User registers → `createUserWithEmailAndPassword` → Firestore doc created in `students/{uid}` → verification email sent automatically
2. User logs in → `signInWithEmailAndPassword` → `loginTimestamp` saved to AsyncStorage
3. `AuthContext` listens to `onAuthStateChanged` → on auth user, starts real-time Firestore listener for profile
4. Session check runs every 60 seconds → if 24 hours elapsed → auto-logout with alert
5. Dark mode preference stored in AsyncStorage, loaded on app start

### Email Validation:
```
Regex: /^[a-zA-Z0-9._%+-]+@skcet\.ac\.in$/
Only @skcet.ac.in emails are accepted
```

### Password Requirements:
- Minimum 8 characters
- At least 1 uppercase, 1 lowercase, 1 number, 1 special character (`@$!%*?&`)

### AuthContext provides:
```javascript
{
  user,           // Firebase Auth user object
  userProfile,    // Firestore student document data
  loading,        // Boolean
  isAuthenticated, // !!user && !!userProfile
  login(email, password),
  logout(),
  refreshUserProfile(),  // no-op (real-time listener handles it)
  isDarkMode,
  toggleDarkMode,
}
```

---

## 6. Firestore Database Schema

### `students/{uid}`
```javascript
{
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
  photoURL: "data:image/jpeg;base64,...",  // base64 string
  attendance: { "Data Structures": 85, "DBMS": 72 },  // subject: percentage
  emailVerified: false,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### `events/{eventId}`
```javascript
{
  title: "Tech Symposium 2024",
  category: "academic",  // academic | cultural | sports
  date: "March 15, 2024",
  time: "10:00 AM",
  location: "Main Auditorium",
  attendees: 250,
  color: "#3B82F6",
  icon: "school-outline",
  description: "...",
  registrationLink: "https://...",  // optional
  createdBy: "admin",
  createdAt: Timestamp
}
```

### `eventRegistrations/{docId}`
```javascript
{
  userId: "firebase_uid",
  eventId: "evt1",
  eventTitle: "Tech Symposium 2024",
  registeredAt: Timestamp,
  status: "registered"
}
```

### `timetables/{department}/years/{year}`
```javascript
{
  schedule: [
    { subject: "Data Structures", time: "9:00 AM - 10:30 AM", room: "ENG-301", professor: "Dr. Smith", color: "#3B82F6", day: "Monday" }
  ]
}
```

### `faculty/{facultyId}`
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

### `chatHistory/{docId}`
```javascript
{
  userId: "firebase_uid",
  message: "Where is the library?",
  sender: "user",  // "user" | "bot"
  timestamp: Timestamp
}
```

### `announcements/{docId}`
```javascript
{
  title: "Library Hours Extended",
  message: "Library open until 10 PM",
  date: "2024-03-10",
  priority: "high"  // high | medium | low
}
```

### `students/{uid}/syllabus/current`
```javascript
{
  subjects: [
    { id: "syl1", subject: "Data Structures", progress: 75, topics: 12, completed: 9 }
  ]
}
```

---

## 7. Firestore Security Rules

```javascript
// students: own data only, email must be @skcet.ac.in on create
// events: read-only for authenticated users
// faculty: read-only for authenticated users
// eventRegistrations: create/read own registrations only, no update/delete
// chatHistory: create/read own messages only, no update/delete
// everything else: denied
```

Key rule: `request.resource.data.email.matches('.*@skcet\\.ac\\.in$')` enforced at DB level too.

---

## 8. AI System

### Flow:
```
User types message
  → ModernChatScreen.handleSend()
  → saveMessage(userId, text, 'user')  [Firestore]
  → buildAIContext(userProfile)         [fetches events, timetable, faculty]
  → sendMessageToAI(text, context)      [POST http://localhost:5000/ask]
  → backend buildPrompt() → Groq API (llama-3.3-70b-versatile)
  → response displayed + saveMessage(userId, reply, 'bot')  [Firestore]
```

### Backend (`backend/server.js`):
- `GET /health` → `{ status: 'ok', message: 'Groq AI Backend Running' }`
- `POST /ask` → `{ message, context }` → `{ reply }`
- Uses OpenAI SDK pointed at Groq's base URL: `https://api.groq.com/openai/v1`
- Model: `llama-3.3-70b-versatile`, temp: 0.7, max_tokens: 1024

### Context sent to AI includes:
- Student name, department, year, semester
- Up to 5 upcoming events
- Up to 5 timetable entries
- Up to 5 faculty members
- Up to 3 announcements

### Chat History:
- Persisted in Firestore `chatHistory` collection
- Loaded on screen mount via `getUserChatHistory(userId)`
- Welcome message auto-created and saved on first visit
- `clearUserChatHistory(userId)` available but not exposed in UI yet

---

## 9. Dev Mode vs Production Mode

Controlled by `.env` variable:
```
EXPO_PUBLIC_USE_FIRESTORE=true   # Production: use real Firestore
EXPO_PUBLIC_USE_FIRESTORE=false  # Development: use sampleData.js
```

Services that respect this flag:
- `eventsService.js`
- `timetableService.js`
- `facultyService.js`
- `syllabusService.js`
- `announcementsService.js`

Services that **always** use Firestore (no flag):
- `authService.js`
- `firestoreService.js` (user profile)
- `chatHistoryService.js`
- `eventRegistrationService.js`
- `attendanceService.js`

---

## 10. Theme System

**File:** `constants/modernTheme.js`

Two themes: `lightTheme` and `darkTheme`. Both export the same keys.

Key colors (light):
- `primary`: `#1E3A8A` (dark blue)
- `primaryLight`: `#3B82F6`
- `accent`: `#8B5CF6` (purple)
- `background`: `#FFFFFF`
- `surface`: `#FFFFFF`
- `text`: `#1E293B`

Key colors (dark):
- `primary`: `#3B82F6`
- `background`: `#0F172A`
- `surface`: `#1E293B`
- `text`: `#F1F5F9`

Also exports: `spacing`, `borderRadius`, `typography`, `shadows`, `animations`, `dimensions`, `getTheme(isDark)`

Dark mode is toggled via `toggleDarkMode()` from `useAuth()` and persisted in AsyncStorage.

---

## 11. Screens Summary

| Screen | File | Purpose |
|---|---|---|
| Splash | `SplashScreen.js` | Animated logo, auto-navigates to Login after 4s |
| Login | `ModernLoginScreen.js` | Email/password login, domain validation, split layout on web |
| Signup | `ModernSignupScreen.js` | Register with name, email, studentId, password |
| Home | `ModernHomeScreen.js` | Greeting, AI suggestion card, popular query shortcuts |
| Chat | `ModernChatScreen.js` | AI chat with Firestore-persisted history, typing indicator |
| Map | `ModernMapScreen.js` | 5 building markers on canvas map, modal with directions |
| Events | `ModernEventsScreen.js` | Filter by category, register for events, skeleton loading |
| Academic | `ModernAcademicScreen.js` | 4 tabs: Timetable, Faculty, Syllabus, Attendance |
| Profile | `ModernProfileScreen.js` | Photo upload, stats, settings toggles, menu, logout |
| Edit Profile | `EditProfileScreen.js` | Edit 10 profile fields, saves to Firestore |
| Security | `SecurityScreen.js` | Email verification status + send reset password email |
| Help | `HelpScreen.js` | 9-section user manual |
| Event Registration | `EventRegistrationScreen.js` | Open external link + confirm registration in Firestore |

---

## 12. Components Summary

| Component | Purpose |
|---|---|
| `BottomNavigation` | Custom tab bar with spring animations, hover on web, active label |
| `GlassCard` | BlurView wrapper with rounded corners |
| `ModernButton` | 4 variants (primary/secondary/outline/glass), 3 sizes, loading state, spring press |
| `ModernInput` | Label + icon + focus border + password toggle + error message |
| `ProtectedRoute` | Shows spinner or redirects to Login if not authenticated |
| `SkeletonLoaders` | 4 skeleton types: Profile, EventCard, AcademicCard, FacultyCard |
| `VerificationBanner` | Warning banner if email unverified or profile incomplete |

---

## 13. Environment Variables

### Frontend (`.env` in root):
```
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_USE_FIRESTORE=true
```

### Backend (`backend/.env`):
```
GROQ_API_KEY=
PORT=5000
```

---

## 14. Running the Project

```bash
# Frontend
npm install
npx expo start
# Press w (web), a (Android), i (iOS)

# Backend (separate terminal)
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

---

## 15. Test User Setup

1. Firebase Console → Authentication → Add user:
   - Email: `test@skcet.ac.in`
   - Password: `Test@123`

2. Firestore → `students` collection → New document with ID = user's UID:
```javascript
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

---

## 16. Key Implementation Details

### Photo Upload (Profile Screen):
- Web only: uses `document.createElement('input')` file picker
- Reads file as base64 DataURL
- Saves directly to `students/{uid}.photoURL` in Firestore
- No Firebase Storage used — base64 stored in Firestore document

### Event Registration Flow:
1. User taps "Register" on event card → navigates to `EventRegistrationScreen`
2. "Proceed to Registration" opens external `registrationLink` URL via `Linking.openURL`
3. After link opens, "I Have Completed Registration" button appears
4. Tapping it calls `registerForEvent()` → creates doc in `eventRegistrations`
5. Duplicate check: queries existing registrations before creating new one

### Session Timeout:
- `loginTimestamp` saved to AsyncStorage on login
- Checked every 60 seconds in `AuthContext`
- If > 24 hours → Alert shown → logout called

### Real-time Profile Updates:
- `subscribeToUserProfile()` uses Firestore `onSnapshot`
- Any change to `students/{uid}` doc is instantly reflected in the app
- `refreshUserProfile()` is a no-op kept for API compatibility

### Attendance Data:
- Stored as a map inside the student document: `attendance: { "Subject": percentage }`
- `attendanceService.js` reads this and converts to array format
- Color coding: ≥75% green, ≥65% yellow, <65% red

---

## 17. Production Build

```bash
# Android
eas build --platform android

# iOS
eas build --platform ios

# Web
npx expo export:web
# Deploy to Vercel/Netlify

# Backend deployment options:
# - Render.com (free tier)
# - Railway.app
# - Heroku
```

---

## 18. Known Limitations / Future Work

- Photo upload is web-only (uses DOM API) — needs `expo-image-picker` for mobile
- `SecurityScreen` uses `window.confirm/alert` — web-only, needs `Alert` for mobile
- `ModernProfileScreen` logout uses `window.confirm` — web-only
- No admin dashboard yet (events/timetable/faculty must be added directly in Firestore)
- Push notifications not implemented (toggle exists in UI but no actual notification logic)
- Chat history clear button exists in service but not exposed in UI
- `ProtectedRoute` component exists but navigation is handled by `AuthNavigator` in `CampusAI.js` — `ProtectedRoute` is unused
- `@google/generative-ai` and `openai` packages both in dependencies — only `openai` (for Groq) is actually used

---

*Last updated: 2025 | Made for SKCET Students*

---

## 19. Admin Panel

Location: `admin-panel/` — a standalone React (CRA) web app.

### Running the Admin Panel
```bash
cd admin-panel
cp .env.example .env        # fill in same Firebase credentials as student app
npm install                 # already done
npm start                   # runs on http://localhost:3000
```

### Admin User Setup
In Firestore → `students/{uid}` → set `role: "admin"`. That's it. The panel blocks anyone without this role.

### Structure
```
admin-panel/src/
├── constants/theme.js          # Exact mirror of modernTheme.js for web CSS
├── contexts/AuthContext.js     # Admin-only auth (checks role === 'admin')
├── services/
│   ├── firebaseConfig.js       # Same Firebase project, REACT_APP_ env vars
│   ├── eventsService.js        # CRUD for events collection
│   ├── announcementsService.js # CRUD for announcements collection
│   ├── facultyService.js       # CRUD for faculty collection
│   ├── timetableService.js     # Read/write timetables/{dept}/years/{year}
│   └── adminService.js         # getStudents, getEventRegistrations, getDashboardStats
├── components/
│   ├── ModernButton.js         # Web version: 6 variants, hover/press animations
│   ├── ModernInput.js          # Web version: text/email/password/textarea/select
│   ├── GlassCard.js            # backdrop-filter blur card
│   ├── AdminSidebar.js         # Collapsible sidebar with nav + logout
│   ├── TopHeader.js            # Sticky header with dark mode toggle + admin badge
│   ├── AdminLayout.js          # Sidebar + Header + main content wrapper
│   ├── StatCard.js             # Hover-animated metric card
│   ├── DataTable.js            # Sortable table with skeleton loading + empty state
│   ├── ConfirmModal.js         # Delete confirmation modal
│   └── Toast.js                # Auto-dismiss notification (success/error/warning/info)
└── pages/
    ├── LoginPage.js            # Split hero + form layout, admin-only validation
    ├── DashboardPage.js        # 4 stat cards + recent events + recent registrations
    ├── EventsPage.js           # Full CRUD: create/edit/delete events with all fields
    ├── AnnouncementsPage.js    # Full CRUD for announcements with priority
    ├── FacultyPage.js          # Full CRUD for faculty directory
    ├── TimetablePage.js        # Dept/year selector, day tabs, add/edit/remove classes
    ├── StudentsPage.js         # Read-only: search, filter by dept/year, view profile modal
    └── RegistrationsPage.js    # View all registrations, per-event breakdown with progress bars
```

### Key Design Decisions
- Uses `REACT_APP_` env prefix (CRA standard) instead of `EXPO_PUBLIC_`
- Same Firebase project — admin panel writes directly to the same Firestore collections the student app reads
- Dark mode persisted in `localStorage` (not AsyncStorage)
- Sidebar collapses to icon-only mode (68px) for more screen space
- All modals use `animation: slideUp` matching the app's feel
- `DataTable` shows skeleton loaders (4 animated rows) while fetching

# 📱 IntelliCamp - AI-Powered Campus Assistant

**Version:** 1.0.0  
**Platform:** React Native (Expo) + Web  
**Institution:** SKCET (Sri Krishna College of Engineering and Technology)

---

## 🎯 Project Overview

IntelliCamp is a production-ready mobile and web application designed exclusively for SKCET students. It provides campus information, AI assistance, navigation, academic schedules, and event management - all with a modern, beautiful UI.

---

## ✨ Key Features

### 🔐 Authentication
- **Email Restriction:** Only @skcet.ac.in emails allowed
- **Secure Login/Signup:** Firebase Authentication
- **Session Management:** 24-hour auto-logout with AsyncStorage
- **Password Validation:** Strong password requirements

### 🏠 Home Dashboard
- **Dynamic Greeting:** Time-based (Morning/Afternoon/Evening)
- **AI Suggestions:** Contextual recommendations
- **About Section:** App information
- **Popular Queries:** Quick access to common questions

### 💬 AI Chat Assistant
- **Real-time Chat:** Message bubbles with typing indicators
- **Suggestion Chips:** Quick query options
- **Smart Suggestions:** Context-aware recommendations

### 🗺️ Interactive Campus Map
- **5 Building Markers:** Library, Engineering, Science, Student Center, Admin
- **Building Info Modals:** Details and descriptions
- **Get Directions:** Integration with AI assistant
- **Visual Paths:** Campus walkways displayed

### 📅 Events Management
- **Category Filters:** All, Academic, Cultural, Sports
- **Event Cards:** Date, time, location, attendees
- **Registration Status:** Track registered events
- **Notifications Toggle:** Enable/disable event alerts

### 📚 Academic Information
- **Timetable:** Class schedule with rooms and professors
- **Faculty Directory:** Contact info and office hours
- **Syllabus Tracker:** Progress bars for each subject

### 👤 User Profile
- **Profile Photo Upload:** Upload and save profile pictures
- **Editable Profile:** 10+ fields (name, ID, year, semester, DOB, etc.)
- **Security Settings:** Change password, email verification
- **Help & Support:** Comprehensive user manual
- **Preferences:** Notifications and email alerts

### 🌓 Global Dark Mode
- **Persistent Theme:** Saved to AsyncStorage
- **App-wide Sync:** Toggle in any screen, reflects everywhere
- **Beautiful Themes:** Light and dark color schemes

### 🎨 Modern UI/UX
- **Glassmorphism Design:** Blur effects and transparency
- **Smooth Animations:** React Native Reanimated
- **Theme System:** Centralized color tokens
- **Responsive Layout:** Works on mobile and web
- **6-Tab Navigation:** Home, Ask Assistant, Campus Map, Academic Info, Events, Profile

---

## 🛠️ Tech Stack

### Frontend
- **React Native:** 0.81.5
- **Expo:** ~54.0.33
- **React Navigation:** 7.x (Stack + Bottom Tabs)
- **React Native Reanimated:** Animations
- **Expo Linear Gradient:** Gradient backgrounds
- **Expo Vector Icons:** Icon library

### Backend
- **Firebase Authentication:** User auth
- **Firestore:** User data storage
- **AsyncStorage:** Local storage for sessions and theme

### State Management
- **React Context API:** AuthContext for global state

---

## 📁 Project Structure

```
ai-campus-assistant/
├── assets/                          # Images
├── components/                      # Reusable components
│   ├── BottomNavigation.js         # 6-tab navigation
│   ├── GlassCard.js                # Glassmorphism card
│   ├── ModernButton.js             # Styled button
│   ├── ModernInput.js              # Styled input
│   └── ProtectedRoute.js           # Auth protection
├── constants/
│   └── modernTheme.js              # Theme system (light/dark)
├── contexts/
│   └── AuthContext.js              # Auth + dark mode state
├── screens/
│   ├── SplashScreen.js             # App splash
│   ├── ModernLoginScreen.js        # Login
│   ├── ModernSignupScreen.js       # Signup
│   ├── ModernHomeScreen.js         # Dashboard
│   ├── ModernChatScreen.js         # AI chat
│   ├── ModernMapScreen.js          # Campus map
│   ├── ModernEventsScreen.js       # Events
│   ├── ModernAcademicScreen.js     # Academic info
│   ├── ModernProfileScreen.js      # User profile
│   ├── EditProfileScreen.js        # Edit profile
│   ├── SecurityScreen.js           # Security settings
│   └── HelpScreen.js               # Help manual
├── services/
│   ├── firebaseConfig.js           # Firebase setup
│   └── authService.js              # Auth functions
├── utils/
│   └── validators.js               # Email/password validation
├── CampusAI.js                     # Main navigator
├── index.js                        # App entry
├── .env                            # Environment variables
├── .env.example                    # Env template
├── app.json                        # Expo config
├── package.json                    # Dependencies
├── PROJECT_DOCUMENTATION.md        # Detailed docs
└── README.md                       # Quick start guide
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js >= 18.x
- npm or yarn
- Expo CLI
- Firebase account

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-campus-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Firebase**
   - Create a Firebase project
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Copy Firebase config

4. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Firebase credentials:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Start the app**
   ```bash
   npx expo start
   ```
   - Press `w` for web
   - Press `a` for Android
   - Press `i` for iOS

---

## 🔐 Firestore Schema

### Collection: `students`

```javascript
{
  uid: "user_firebase_uid",
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

---

## 🔒 Security Features

- ✅ Email domain restriction (@skcet.ac.in)
- ✅ Password strength validation (8+ chars, uppercase, lowercase, number, special)
- ✅ Protected routes with auth checks
- ✅ 24-hour session timeout
- ✅ Firestore security rules
- ✅ Environment variables for secrets
- ✅ No credentials in code
- ✅ Re-authentication for password changes

---

## 🎨 Theme System

### Light Theme
- Background: White/Light Gray
- Text: Dark Gray/Black
- Primary: Blue (#3B82F6)
- Surface: White cards

### Dark Theme
- Background: Dark Blue/Navy
- Text: White/Light Gray
- Primary: Blue (#3B82F6)
- Surface: Dark cards

### Theme Tokens
```javascript
{
  background, backgroundSecondary,
  surface, text, textPrimary, textSecondary, textTertiary,
  primary, accent, border,
  glassBackground, cardBackground, suggestionGradient,
  hoverBackground, activeBackground
}
```

---

## 📱 Screens Overview

### 1. Splash Screen
- Animated logo with rotation
- Auto-navigates after 4 seconds

### 2. Login Screen
- Email/password inputs
- Email domain validation
- Error handling
- Link to signup

### 3. Signup Screen
- Full name, email, student ID, password
- Password confirmation
- Validation and error display

### 4. Home Screen
- Dynamic greeting with user's name
- AI suggestion card
- About IntelliCamp section
- Popular queries list
- Dark mode toggle

### 5. Chat Screen
- AI assistant interface
- Message bubbles (user/AI)
- Typing indicator
- Suggestion chips
- Smart suggestions panel

### 6. Campus Map
- Interactive map with 5 buildings
- Building markers with colors
- Info modals with details
- Get directions button
- Ask assistant integration

### 7. Events Screen
- Notification toggle
- Category filters (All, Academic, Cultural, Sports)
- Event cards with details
- Registration status badges
- Register/View details buttons

### 8. Academic Screen
- 3 tabs: Timetable, Faculty, Syllabus
- Timetable: Class schedule with rooms
- Faculty: Directory with contact info
- Syllabus: Progress tracking

### 9. Profile Screen
- Profile photo (upload/display)
- User stats (Year, Semester, ID)
- Preferences toggles
- Menu: Edit Profile, Security, Help
- Logout button
- Dark mode toggle

### 10. Edit Profile Screen
- 10+ editable fields
- Save to Firestore
- Loading states
- Success feedback

### 11. Security Screen
- Email verification status
- Send verification email
- Change password with re-auth
- Password visibility toggles

### 12. Help Screen
- 9 comprehensive sections
- Feature explanations
- Usage instructions

---

## 🧪 Testing

### Create Test User

1. **Firebase Console → Authentication**
   - Add user manually
   - Email: `test@skcet.ac.in`
   - Password: `Test@123`

2. **Firestore → students collection**
   - Add document with user's UID
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

3. **Test the app**
   - Login with test credentials
   - Verify home screen shows "Good Morning, Test 👋"
   - Test all features

---

## 🎯 Production Features Implemented

1. ✅ **Theme Consistency:** Centralized color tokens, no hardcoded colors
2. ✅ **UI Cleanup:** Removed unused sections, fixed text colors
3. ✅ **Enhanced Navigation:** 6 tabs with hover effects and animations
4. ✅ **Auto-Logout:** 24-hour session timeout with alerts
5. ✅ **New Screens:** EditProfile, Security, Help
6. ✅ **Profile Cleanup:** Removed unused settings
7. ✅ **Logout Fix:** Working logout with web compatibility
8. ✅ **Dark Mode Removed from Login:** Cleaner login screen
9. ✅ **Profile Photo Upload:** Upload and save to Firestore
10. ✅ **Global Dark Mode:** Persistent across all screens

---

## 📦 Dependencies

```json
{
  "expo": "~54.0.33",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "@react-navigation/native": "^7.0.13",
  "@react-navigation/native-stack": "^7.1.10",
  "@react-navigation/bottom-tabs": "^7.2.2",
  "firebase": "^12.9.0",
  "expo-linear-gradient": "~14.0.1",
  "@expo/vector-icons": "^14.0.4",
  "react-native-reanimated": "~4.0.0",
  "@react-native-async-storage/async-storage": "^2.1.0"
}
```

---

## 🚀 Build & Deploy

### Development
```bash
npx expo start
```

### Production Build
```bash
# Android
eas build --platform android

# iOS
eas build --platform ios

# Web
npx expo export:web
```

---

## 📞 Support

- **Institution:** SKCET
- **Email Domain:** @skcet.ac.in
- **Version:** 1.0.0
- **Status:** 🟢 Production Ready

---

## 📄 License

Private - All rights reserved

---

**Made with ❤️ for SKCET Students**

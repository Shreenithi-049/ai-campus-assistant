# 📱 IntelliCamp - AI-Powered Campus Assistant

> Smart Campus Assistant for SKCET Students

[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0.33-black.svg)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.9.0-orange.svg)](https://firebase.google.com/)

---

## 🎯 Overview

IntelliCamp is a production-ready mobile and web application designed exclusively for **SKCET (Sri Krishna College of Engineering and Technology)** students. Access campus information, navigate the campus, check academic schedules, interact with an AI assistant, and manage your profile - all in one beautiful app.

### ✨ Key Features

- 🔐 **Secure Authentication** - Only @skcet.ac.in emails allowed
- 🏠 **Smart Home Dashboard** - Personalized greeting and AI suggestions
- 💬 **AI Chat Assistant** - Get instant answers to campus queries
- 🗺️ **Interactive Campus Map** - Navigate 5 buildings with ease
- 📅 **Events & Activities** - Stay updated with campus events
- 📚 **Academic Info** - Timetable, faculty directory, syllabus tracker
- 👤 **User Profile** - Upload photo, edit profile, security settings
- 🌓 **Global Dark Mode** - Persistent theme across all screens
- ⏱️ **Auto-Logout** - 24-hour session timeout for security

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.x
- npm or yarn
- Expo CLI
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-campus-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   # Copy template files
   cp .env.example .env
   cp backend/.env.example backend/.env
   
   # Edit .env with your Firebase credentials
   # Edit backend/.env with your Groq API key
   ```
   
   **IMPORTANT**: Never commit `.env` files to Git!

4. **Start the app**
   ```bash
   npx expo start
   ```
   - Press `w` for web
   - Press `a` for Android
   - Press `i` for iOS

---

## 📖 Documentation

For complete documentation, see **[DOCUMENTATION.md](DOCUMENTATION.md)**

### Quick Links
- [Project Structure](DOCUMENTATION.md#project-structure)
- [Features](DOCUMENTATION.md#key-features)
- [Firestore Schema](DOCUMENTATION.md#firestore-schema)
- [Testing Guide](DOCUMENTATION.md#testing)
- [Security](DOCUMENTATION.md#security-features)

---

## 🔐 Email Restriction

**Important:** Only users with **@skcet.ac.in** email addresses can signup and login.

### Valid Email Examples
- ✅ `student@skcet.ac.in`
- ✅ `john.doe@skcet.ac.in`
- ✅ `faculty123@skcet.ac.in`

### Invalid Email Examples
- ❌ `student@gmail.com`
- ❌ `user@yahoo.com`
- ❌ `test@skcet.com`

---

## 🛠️ Tech Stack

- **Frontend:** React Native (Expo)
- **Navigation:** React Navigation 7.x
- **Backend:** Firebase (Auth + Firestore)
- **UI:** Custom components with glassmorphism design
- **Animations:** React Native Reanimated
- **Icons:** Expo Vector Icons
- **Storage:** AsyncStorage

---

## 📁 Project Structure

```
ai-campus-assistant/
├── assets/                    # Images and static files
├── components/                # Reusable UI components
├── constants/                 # Theme and constants
├── contexts/                  # React Context (Auth + Dark Mode)
├── screens/                   # App screens (12 screens)
├── services/                  # Firebase services
├── utils/                     # Utility functions
├── CampusAI.js               # Main app navigator
├── index.js                  # App entry point
├── DOCUMENTATION.md          # Complete documentation
└── README.md                 # This file
```

---

## 🧪 Testing

### Create Test User

1. **Firebase Console → Authentication**
   - Email: `test@skcet.ac.in`
   - Password: `Test@123`

2. **Firestore → students collection**
   ```javascript
   Document ID: [user's UID]
   {
     email: "test@skcet.ac.in",
     fullName: "Test User",
     studentId: "CS2024001",
     role: "student",
     year: "3rd Year",
     semester: "6th Semester"
   }
   ```

3. **Test the app**
   - Login with test credentials
   - Verify home screen shows "Good Morning, Test 👋"
   - Test all features

---

## 🔒 Security Features

- ✅ Email domain restriction (@skcet.ac.in)
- ✅ Password strength validation
- ✅ Protected routes with auth checks
- ✅ 24-hour session timeout
- ✅ Firestore security rules
- ✅ Environment variables for secrets
- ✅ No credentials in code

---

## 📱 Screens

1. **Splash Screen** - Animated logo and branding
2. **Login Screen** - Email/password authentication
3. **Signup Screen** - New user registration
4. **Home Screen** - Dashboard with AI suggestions
5. **Chat Screen** - AI assistant interface
6. **Map Screen** - Interactive campus map
7. **Events Screen** - Campus events listing
8. **Academic Screen** - Timetable, faculty, syllabus
9. **Profile Screen** - User information and settings
10. **Edit Profile Screen** - Edit user details
11. **Security Screen** - Password change, email verification
12. **Help Screen** - User manual

---

## 🎨 Design System

- **Theme:** Light and Dark mode support (persistent)
- **Colors:** Blue gradient theme (#3B82F6 primary)
- **Typography:** System fonts with defined hierarchy
- **Spacing:** 8pt grid system
- **Effects:** Glassmorphism with blur effects
- **Animations:** Smooth spring-based transitions

---

## 📦 Build & Deploy

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

## 🤝 Contributing

This is a private project for SKCET. For issues or suggestions, contact the development team.

---

## 📄 License

Private - All rights reserved

---

## 📞 Support

- **Institution:** SKCET
- **Email Domain:** @skcet.ac.in
- **Version:** 1.0.0

---

## ✅ Status

- ✅ Authentication system complete
- ✅ Email domain restriction active
- ✅ Modern UI implemented
- ✅ All 12 screens functional
- ✅ Firebase integration done
- ✅ Global dark mode working
- ✅ Profile photo upload working
- ✅ Auto-logout implemented
- ✅ Production-ready

**Status:** 🟢 Ready for Production

---

**Made with ❤️ for SKCET Students**

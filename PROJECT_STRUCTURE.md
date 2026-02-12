# AI Campus Assistant - Project Structure

## Folder Structure

```
ai-campus-assistant/
├── App.js                          # Main app entry with navigation & auth state
├── index.js                        # Expo entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
│
├── constants/
│   └── theme.js                    # Design system (colors, typography, spacing)
│
├── services/
│   ├── firebaseConfig.js           # Firebase initialization (Auth + Firestore)
│   ├── authService.js              # Authentication functions
│   ├── chatService.js              # Chat intent detection & FAQ fetching
│   └── notificationService.js      # Notification fetching from Firestore
│
├── components/
│   ├── Button.js                   # Reusable button component
│   ├── Input.js                    # Reusable input component with validation
│   ├── Card.js                     # Reusable card component
│   ├── LoadingSpinner.js           # Loading indicator component
│   └── MessageBubble.js            # Chat message bubble component
│
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.js          # Email/password login
│   │   └── SignupScreen.js         # User registration
│   │
│   ├── home/
│   │   └── HomeScreen.js           # Main dashboard with menu cards
│   │
│   ├── chat/
│   │   └── ChatScreen.js           # AI chatbot with intent detection
│   │
│   ├── notifications/
│   │   └── NotificationsScreen.js  # Notifications list from Firestore
│   │
│   └── profile/
│       └── ProfileScreen.js        # User profile & logout
│
└── assets/                         # Images, icons, etc.
```

## Key Features Implemented

### 1. Authentication
- ✅ Email/Password authentication with Firebase
- ✅ Sign up with validation
- ✅ Sign in with error handling
- ✅ Auth state management
- ✅ Protected routes

### 2. Home Dashboard
- ✅ Card-based layout
- ✅ Quick access to main features
- ✅ Modern UI with icons
- ✅ Quick tips section

### 3. AI Chatbot
- ✅ Chat UI with message bubbles
- ✅ User input with send button
- ✅ Intent detection using keyword matching
- ✅ FAQ fetching from Firestore
- ✅ Loading states
- ✅ Default response for unmatched queries

### 4. Notifications
- ✅ Fetch from Firestore "notifications" collection
- ✅ Pull-to-refresh
- ✅ Empty state handling
- ✅ Date formatting (relative time)
- ✅ Type-based styling (info, alert, success)

### 5. Profile
- ✅ Display user information
- ✅ Logout functionality with confirmation
- ✅ Account details
- ✅ App information

## Architecture Highlights

### Design System
- Centralized theme in `constants/theme.js`
- Consistent colors, typography, spacing
- Reusable components following design system

### Services Layer
- Separation of concerns
- Firebase config isolated
- Service functions for auth, chat, notifications
- Proper error handling

### Component Architecture
- Reusable UI components
- Props-based customization
- Consistent styling

### Navigation
- React Navigation with native stack
- Auth state-based routing
- Protected routes
- Proper header configuration

### Intent Detection Logic
- Tokenization of user queries
- Keyword matching against FAQ documents
- Score-based matching (30% threshold)
- Fallback to default response

## Firestore Collections

### `faqs`
- Stores FAQ documents with keywords for matching
- Fields: question, answer, keywords[], category, createdAt, updatedAt, active

### `notifications`
- Stores campus notifications
- Fields: title, message, type, createdAt, read, priority, expiresAt

See `FIRESTORE_SCHEMA.md` for detailed schema documentation.

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Firebase**
   - Firebase config is already set in `services/firebaseConfig.js`
   - Create Firestore collections: `faqs` and `notifications`
   - Add sample data (see `FIRESTORE_SCHEMA.md`)

3. **Run the App**
   ```bash
   npm start
   ```

## Dependencies

- `expo` - Expo framework
- `react-native` - React Native core
- `@react-navigation/native` - Navigation library
- `@react-navigation/native-stack` - Stack navigator
- `firebase` - Firebase SDK (Auth + Firestore)
- `react-native-safe-area-context` - Safe area handling
- `react-native-screens` - Native screen components
- `react-native-gesture-handler` - Gesture handling

## Code Quality

- ✅ Functional components with hooks
- ✅ Proper async/await usage
- ✅ Error handling throughout
- ✅ Loading states
- ✅ Input validation
- ✅ TypeScript-ready structure (can be migrated)
- ✅ Modular and scalable architecture


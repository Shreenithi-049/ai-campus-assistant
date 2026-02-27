# Event Registration System - Architecture Diagram

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     INTELLICAMP - EVENT REGISTRATION             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ModernEventsScreen.js                                          │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Filters: [All] [Academic] [Cultural] [Sports] [My Events] │
│  │                                                          │    │
│  │  Event Card 1                                           │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │ 📚 Tech Symposium 2024                           │  │    │
│  │  │ 📅 March 15, 2024  ⏰ 10:00 AM                  │  │    │
│  │  │ 📍 Main Auditorium                               │  │    │
│  │  │                                                   │  │    │
│  │  │ [Register] or [✓ Registered]                    │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │                                                          │    │
│  │  Event Card 2 ...                                       │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        SERVICE LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  eventRegistrationService.js                                    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                                                          │    │
│  │  registerForEvent(userId, event)                        │    │
│  │  ├─ Check if already registered                         │    │
│  │  ├─ Create registration document                        │    │
│  │  └─ Return success/error                                │    │
│  │                                                          │    │
│  │  checkIfRegistered(userId, eventId)                     │    │
│  │  ├─ Query Firestore                                     │    │
│  │  └─ Return boolean                                      │    │
│  │                                                          │    │
│  │  getUserRegistrations(userId)                           │    │
│  │  ├─ Query all user registrations                        │    │
│  │  └─ Return array                                        │    │
│  │                                                          │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      FIREBASE FIRESTORE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Collection: events                                             │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Document: evt1                                          │    │
│  │ {                                                       │    │
│  │   title: "Tech Symposium 2024"                         │    │
│  │   category: "academic"                                  │    │
│  │   date: "March 15, 2024"                               │    │
│  │   registrationLink: "https://..."                      │    │
│  │   ...                                                   │    │
│  │ }                                                       │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Collection: eventRegistrations ⭐ NEW                          │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Document: auto-id-1                                     │    │
│  │ {                                                       │    │
│  │   userId: "abc123"                                      │    │
│  │   eventId: "evt1"                                       │    │
│  │   eventTitle: "Tech Symposium 2024"                    │    │
│  │   registeredAt: Timestamp                               │    │
│  │   status: "registered"                                  │    │
│  │ }                                                       │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Registration Flow Diagram

```
USER ACTION                    SYSTEM RESPONSE
─────────────────────────────────────────────────────────────

1. User clicks "Register"
                              ↓
                         Set loading state
                         Button: "Registering..."
                              ↓
2. Call registerForEvent()
                              ↓
                    Query: Check if registered
                              ↓
                    ┌─────────┴─────────┐
                    │                   │
              Already Registered?    Not Registered
                    │                   │
                    ↓                   ↓
            Return {alreadyRegistered}  Create document
                    │                   │
                    ↓                   ↓
            Show alert:          Return {success}
            "Already Registered"        │
                                       ↓
                                Show alert:
                                "Successfully registered"
                                       ↓
                                Update UI state
                                       ↓
                                Button: "✓ Registered"
                                (Green, disabled)
                                       ↓
                                Open registration link
                                (if available)
```

---

## 🎯 Data Flow Diagram

```
┌──────────────┐
│   Student    │
│   Login      │
└──────┬───────┘
       │
       ↓
┌──────────────────────────────┐
│  Load User Registrations     │
│  getUserRegistrations(uid)   │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│  Store in State:             │
│  registeredEvents = [        │
│    "evt1", "evt2", "evt3"    │
│  ]                           │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│  Render Events Screen        │
│  - Show all events           │
│  - Mark registered events    │
│  - Enable/disable buttons    │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│  User Clicks Filter          │
│  - All Events                │
│  - Academic                  │
│  - Cultural                  │
│  - Sports                    │
│  - My Events ⭐              │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│  Filter Events Locally       │
│  if (filter === 'myEvents')  │
│    show registeredEvents     │
└──────────────────────────────┘
```

---

## 🔐 Security Flow

```
┌─────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                       │
└─────────────────────────────────────────────────────────┘

Layer 1: Authentication
┌────────────────────────────────────────┐
│ User must be logged in                 │
│ ✓ Firebase Authentication             │
│ ✓ @skcet.ac.in email verified         │
└────────────────────────────────────────┘
                ↓
Layer 2: Client-Side Validation
┌────────────────────────────────────────┐
│ Check if user is authenticated         │
│ if (!user?.uid) → Show error          │
└────────────────────────────────────────┘
                ↓
Layer 3: Service Layer
┌────────────────────────────────────────┐
│ registerForEvent(userId, event)        │
│ ✓ Check duplicate registration        │
│ ✓ Validate event exists                │
└────────────────────────────────────────┘
                ↓
Layer 4: Firestore Security Rules
┌────────────────────────────────────────┐
│ allow create: if                       │
│   request.auth != null &&              │
│   request.auth.uid == userId           │
│                                        │
│ ✓ Verify authenticated                │
│ ✓ Verify userId matches auth          │
│ ✓ Prevent tampering                   │
└────────────────────────────────────────┘
                ↓
Layer 5: Database
┌────────────────────────────────────────┐
│ Store registration                     │
│ ✓ Encrypted at rest                   │
│ ✓ Backed up automatically              │
└────────────────────────────────────────┘
```

---

## 📊 State Management

```
┌─────────────────────────────────────────────────────────┐
│              ModernEventsScreen State                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  events: []                                             │
│  ├─ Loaded from eventsService                           │
│  └─ Real-time Firestore listener                        │
│                                                          │
│  registeredEvents: []                                   │
│  ├─ Array of event IDs                                  │
│  ├─ Loaded on mount                                     │
│  └─ Updated after registration                          │
│                                                          │
│  selectedFilter: 'all'                                  │
│  ├─ 'all' | 'academic' | 'cultural' |                  │
│  │   'sports' | 'myEvents'                             │
│  └─ Controls which events display                       │
│                                                          │
│  loadingRegistration: false                             │
│  ├─ true during API call                                │
│  └─ Disables button during registration                 │
│                                                          │
│  loading: true                                          │
│  └─ Shows skeleton loaders                              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 UI State Transitions

```
INITIAL STATE
┌────────────────────┐
│   [Register]       │  ← Blue button
│   (Enabled)        │
└────────────────────┘
         │
         │ User clicks
         ↓
LOADING STATE
┌────────────────────┐
│ [Registering...]   │  ← Blue button
│   (Disabled)       │
└────────────────────┘
         │
         │ API success
         ↓
REGISTERED STATE
┌────────────────────┐
│ [✓ Registered]     │  ← Green button
│   (Disabled)       │
└────────────────────┘
         │
         │ Persists forever
         ↓
PERSISTENT STATE
┌────────────────────┐
│ [✓ Registered]     │  ← Even after restart
│   (Disabled)       │
└────────────────────┘
```

---

## 🔄 Filter Logic Flow

```
User selects filter
       │
       ↓
┌──────────────────┐
│ selectedFilter   │
│ = 'myEvents'     │
└────────┬─────────┘
         │
         ↓
┌─────────────────────────────────┐
│ filteredEvents = events.filter( │
│   e => registeredEvents         │
│         .includes(e.id)         │
│ )                               │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ Display only registered events  │
│ All show "✓ Registered" button │
└─────────────────────────────────┘
```

---

## 🚀 Future Admin Dashboard Integration

```
┌─────────────────────────────────────────────────────────┐
│                  ADMIN DASHBOARD (Future)                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  View Registrations by Event                            │
│  ┌────────────────────────────────────────────────┐    │
│  │ Event: Tech Symposium 2024                     │    │
│  │                                                 │    │
│  │ Total Registrations: 45                        │    │
│  │                                                 │    │
│  │ Registered Users:                              │    │
│  │ 1. John Doe (john@skcet.ac.in)                │    │
│  │ 2. Jane Smith (jane@skcet.ac.in)              │    │
│  │ ...                                            │    │
│  │                                                 │    │
│  │ [Export to CSV] [Send Notification]           │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Query Used:                                            │
│  query(eventRegistrations,                              │
│        where('eventId', '==', 'evt1'))                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Complete System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    INTELLICAMP                           │
│              Event Registration System                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ✅ Student Interface                                   │
│     ├─ View all events                                  │
│     ├─ Register for events                              │
│     ├─ View registered events                           │
│     └─ Filter by category                               │
│                                                          │
│  ✅ Backend Services                                    │
│     ├─ eventRegistrationService.js                      │
│     ├─ Duplicate prevention                             │
│     └─ Error handling                                   │
│                                                          │
│  ✅ Database                                            │
│     ├─ events collection                                │
│     ├─ eventRegistrations collection                    │
│     └─ Security rules                                   │
│                                                          │
│  🔜 Future: Admin Dashboard                             │
│     ├─ View registrations                               │
│     ├─ Manage events                                    │
│     └─ Analytics                                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

**Status:** ✅ COMPLETE & PRODUCTION READY
